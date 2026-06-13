---
title: "Rogue"
description: "Hack The Box challenge write-up for Rogue."
date: "2026-06-11"
type: "writeup"
branch: "HTB"
subBranch: "Challenges"
category: "Challenges"
tags: ["htb", "challenge", "forensics"]
difficulty: "medium"
featured: false
---

# Challenge Scenario

SecCorp has reached us about a recent cyber security incident. They are
confident that a malicious entity has managed to access a shared folder that
stores confidential files. Our threat intel informed us about an active dark
web forum where disgruntled employees offer to give access to their employer's
internal network for a financial reward. In this forum, one of SecCorp's
employees offers to provide access to a low-privileged domain-joined user for
10K in cryptocurrency. Your task is to find out how they managed to gain access
to the folder and what corporate secrets did they steal.

---

## Material

+ PCAP file: `capture.pcap`

---

## Initial Analysis

Analyzing the PCAP file, first I examined the **Protocol Hierarchy**. What
caught my eye was the presence of the `SMB2` protocol and an abundance of
`FTP` packets.

![alt text](image-1.png)

Since the challenge mentions access to a shared folder, I immediately headed
to investigate **FTP streams**. Using the filter to isolate only FTP streams,
here are some insights:

![alt text](image-2.png)

The session reveals a successful login followed by an **unencrypted file
upload**. Specifically, the client issues the `STOR` command to upload a file
named **`3858793632.zip`**.

My objective now was to extract the zip file and view its contents.

---

## Deeper Analysis

Using the **Export Objects** function in Wireshark — specifically exporting
objects present in the `FTP-DATA` protocol — I was able to retrieve the file.

![alt text](image-3.png)

However, upon opening, the file appeared to be **corrupted**.

![alt text](image-4.png)

I then investigated the `FTP-DATA` stream further. Although the `Info` column
repeatedly references **`3858793632.zip`**, these entries represent individual
**TCP segments** of the file transfer rather than multiple file uploads.

My approach was to filter for the stream with the **longest length**, export
the packet content, rename it with a `.zip` extension, and attempt to unpack
it again.

![alt text](image-5.png)

![alt text](image-6.png)

![alt text](image-7.png)

The extraction was successful. Inside, there was one file: **`3858793632.pmd`**

The `.pmd` file is actually a **minidump crash report file**, so I renamed it
with a `.dmp` extension.

![alt text](image-8.png)

After experimenting with the file, I uploaded it to **VirusTotal** to gather
more information.

![alt text](image-9.png)

The result gave me a clearer picture of the file's purpose. After researching
`minidump` files in relation to `LSASS`, I found that this technique is
classified under **MITRE ATT&CK** as **OS Credential Dumping**
[T1003.001](https://attack.mitre.org/techniques/T1003/001/).

`LSASS` (**Local Security Authority Subsystem Service**) handles all
credentials and security policies for the OS. Every time a user logs in,
`LSASS` validates the password and retains that information in memory —
including `Kerberos` ticket data, `LSA` secrets, and cached domain credentials.

By pulling `LSASS` memory, an attacker can extract:

+ **Plaintext passwords**
+ **NTLM hashes**
+ **Kerberos keys**
+ Other authentication secrets

In this case, I used `pypykatz` to analyze the dump locally.

![alt text](image-10.png)

---

### Extracting LSASS Credentials

Using `pypykatz` with the `lsa` function alongside the minidump file, I
extracted the credentials present inside the dump:
```bash
pypykatz lsa minidump dump.dmp > output.txt
```

The output revealed credentials including **username**, **domain**,
**NT hash**, **AES keys**, and **SID**.

![alt text](image-11.png)

---

### SMB Stream Decryption

Based on
[this article](https://medium.com/maverislabs/decrypting-smb3-traffic-with-just-a-pcap-absolutely-maybe-712ed23ff6a2),
`SMB3` encrypted traffic can be decrypted using the `SessionID` and
`SessionKey` values present in captured packets. To derive the **Random
Session Key**, I used the
[SMB3-Decryption](https://github.com/iamdonu/SMB3-Decryption) script.

The script requires the following parameters:

![alt text](image-12.png)

From the `LSASS` dump, I already had:

+ **Username:** `athomson`
+ **Domain:** `CORP`
+ **NT Hash:** `88d84bad705f61fcdea0d771301c3a7d`

The remaining values — **NTProofStr** and **Encrypted Session Key** — are
present inside the `PCAP` file.

Using the filter `ntlmssp` in Wireshark, I located the packet labeled
`Session Setup Request, NTLMSSP_AUTH, User: CORP\athomson`.

![alt text](image-13.png)

From this packet I extracted:

+ **NTProofStr:** `d047ccdffaeafb22f222e15e719a34d4`
+ **Encrypted Session Key:** `032c9ca4f6908be613b240062936e2d2`

![alt text](image-14.png)

![alt text](image-15.png)

Additionally, I retrieved the **SMB2 Session ID**, required because `SMB2`
encryption is session-specific:

![alt text](image-16.png)

With all parameters ready, I ran the decryption script:
```bash
python3 randomSessionKeyNTLM.py \
  -u athomson \
  -d CORP \
  -n 88d84bad705f61fcdea0d771301c3a7d \
  -p d047ccdffaeafb22f222e15e719a34d4 \
  -k 032c9ca4f6908be613b240062936e2d2
```

![alt text](image-17.png)

**Random Session Key:** `9ae0af5c19ba0de2ddbe70881d4263ac`

With the **Session Key** and **Session ID** ready, I entered them into
Wireshark to decrypt the `SMB3` stream:

![alt text](image-18.png)

After decryption, a previously hidden file appeared under
**Export Objects → SMB** — a `PDF` file.

![alt text](image-19.png)

After exporting and opening the `PDF`, the flag was revealed on **page 3**:

![alt text](image-20.png)

---

## Final Flag

`HTB{n0th1ng_c4n_st4y_un3ncrypt3d_f0r3v3r}`