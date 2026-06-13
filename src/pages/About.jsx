import { Cloud, ExternalLink, Facebook, Github, Linkedin, Quote, Search, ShieldCheck, TerminalSquare, UserCheck } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import Seo from '../components/Seo.jsx';

const projects = [
  {
    name: 'C2Detector',
    href: 'https://github.com/hhoangsonnw/C2Detector',
    label: 'hhoangsonnw/C2Detector',
    description:
      'a compact DFIR triage tool for .pcap and .pcapng files. It extracts HTTP/TLS metadata, detects C2 patterns, and writes a Markdown report plus CSV artifacts.',
  },
  {
    name: 'NTFS-Analyzer',
    href: 'https://github.com/hhoangsonnw/NTFS-Analyzer',
    label: 'hhoangsonnw/NTFS-Analyzer',
    description:
      'a small, dependency-free Python toolkit for inspecting NTFS artifacts. It parses $MFT and $LogFile metadata, exports large tables when you need them, and includes an interactive MFT lookup mode for fast targeted analysis.',
  },
];

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hoang-son-bui-81417b317/',
    icon: Linkedin,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/hoang.son.298560/',
    icon: Facebook,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/hhoangsonnw',
    icon: Github,
  },
];

const aboutNotes = [
  {
    label: 'PROFILE',
    text: 'I am a sophomore ICT student at Hanoi University of Science and Technology, focused on Digital Forensics, Cybersecurity, and hands-on security investigation.',
  },
  {
    label: 'CURRENT PATH',
    text: 'My current learning path is expanding toward cloud security, especially Azure fundamentals, IAM, cloud logging, security monitoring, and secure cloud architecture.',
  },
  {
    label: 'BLOG PURPOSE',
    text: 'I use this blog to document my CTF writeups, forensic analysis, technical notes, and progress as I grow from DFIR practice into modern cloud security.',
  },
];

const focusAreas = [
  { label: 'DFIR', icon: Search },
  { label: 'Cybersecurity', icon: ShieldCheck },
  { label: 'Cloud Security', icon: Cloud },
  { label: 'Azure', icon: UserCheck },
  { label: 'IAM', icon: UserCheck },
  { label: 'CTF Writeups', icon: TerminalSquare },
];

export default function About() {
  return (
    <PageTransition className="about-page px-4 sm:px-6 lg:px-8">
      <Seo
        title="About Me"
        description="Compact personal profile for Hoang Son Bui, including profile, about, projects, and social links."
      />

      <section className="about-card terminal-panel" aria-labelledby="about-page-title">
        <header className="about-profile">
          <img className="about-avatar" src={`${import.meta.env.BASE_URL}profilepic.png`} alt="Hoang Son Bui avatar" />
          <div className="about-profile-copy">
            <h1 id="about-page-title" className="vault-title about-name">
              Hoang Son Bui
            </h1>
            <div className="about-profile-blob about-dob">
              <span className="vault-stat-label">Date of birth</span>
              <span>30-04-2006</span>
            </div>
            <p className="about-profile-blob about-mini-bio">"And I always find, yeah, I always find something wrong."</p>
          </div>
        </header>

        <section className="about-compact-section about-me-card about-dossier-card" aria-labelledby="about-me-heading">
          <div className="about-section-head about-dossier-head">
            <h2 id="about-me-heading" className="vault-title">
              About Me
            </h2>
          </div>
          <div className="about-dossier-body">
            <div className="about-dossier-left">
              <div className="about-terminal-intro" aria-label="Profile terminal summary">
                <div className="about-terminal-prompt">&gt;_</div>
                <p>
                  Forensics enthusiast.
                  <br />
                  Solution Engineer wannabe
                </p>
                <div className="about-terminal-status">
                  STATUS: LEARNING
                  <span aria-hidden="true" />
                </div>
              </div>

              <div className="about-focus-grid" aria-label="Focus areas">
                {focusAreas.map((item) => {
                  const Icon = item.icon;

                  return (
                    <span key={item.label} className="about-focus-chip">
                      <Icon size={17} aria-hidden="true" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="about-intel-panel" aria-label="About me profile logs">
              {aboutNotes.map((note) => (
                <article key={note.label} className="about-intel-note">
                  <span>{note.label}</span>
                  <p>{note.text}</p>
                </article>
              ))}
            </div>
          </div>

          <p className="about-evidence-note">
            <Quote size={18} aria-hidden="true" />
            It takes 20 years to build a reputation and a few minutes of cyber-incident to ruin it.
            <span aria-hidden="true">&gt;_</span>
          </p>
        </section>

        <section className="about-compact-section about-projects-card" aria-labelledby="projects-heading">
          <div className="about-section-head">
            <h2 id="projects-heading" className="vault-title">
              Personal Projects
            </h2>
          </div>
          <div className="about-project-list">
            {projects.map((project) => (
              <a
                key={project.name}
                className="about-project"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.name} on GitHub`}
              >
                <div className="about-project-title">
                  <h3>{project.name}</h3>
                  <span className="about-project-open">
                    Open
                    <ExternalLink size={13} aria-hidden="true" />
                  </span>
                </div>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="about-social-card" aria-labelledby="socials-heading">
          <div className="about-section-head">
            <h2 id="socials-heading" className="vault-title">
              Socials
            </h2>
          </div>
          <div className="about-social-icons">
            {socials.map((item) => {
              const Icon = item.icon;

              return (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  <Icon size={24} aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </section>
      </section>
    </PageTransition>
  );
}
