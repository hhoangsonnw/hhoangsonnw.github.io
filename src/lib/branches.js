export const contentBranches = [
  {
    id: 'htb',
    name: 'HTB',
    directory: 'HTB',
    slug: 'htb',
    route: '/htb',
    description: 'Hack The Box machines, Sherlocks, challenges, and lab notes.',
    subBranches: [
      {
        id: 'htb-sherlocks',
        name: 'Sherlocks',
        directory: 'Sherlocks',
        slug: 'sherlocks',
        route: '/htb/sherlocks',
        description: 'HTB Sherlocks investigations, blue-team cases, and forensic challenge write-ups.',
      },
      {
        id: 'htb-challenges',
        name: 'Challenges',
        directory: 'Challenges',
        slug: 'challenges',
        route: '/htb/challenges',
        description: 'HTB challenge write-ups across web, crypto, pwn, reversing, forensics, and misc.',
      },
    ],
  },
  {
    id: 'cyberdefenders',
    name: 'CyberDefenders',
    directory: 'CyberDefenders',
    slug: 'cyberdefenders',
    route: '/cyberdefenders',
    description: 'CyberDefenders incident response, forensics, malware, and blue-team investigations.',
  },
  {
    id: 'ctf-competitions',
    name: 'CTF competitions',
    directory: 'CTF competitions',
    slug: 'ctf-competitions',
    route: '/ctf-competitions',
    description: 'Competition write-ups from jeopardy CTFs, attack-defense events, and timed challenges.',
  },
];

export function normalizeBranchInput(value = '') {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getBranchBySlug(slug) {
  return contentBranches.find((branch) => branch.slug === slug);
}

export function getBranchByDirectory(directory) {
  return contentBranches.find((branch) => branch.directory === directory);
}

export function getSubBranchBySlug(branchSlug, subBranchSlug) {
  return getBranchBySlug(branchSlug)?.subBranches?.find((subBranch) => subBranch.slug === subBranchSlug);
}

export function getSubBranchByDirectory(branch, directory) {
  return branch?.subBranches?.find((subBranch) => subBranch.directory === directory);
}

export function getSubBranchByInput(branch, value = '') {
  const normalized = normalizeBranchInput(value);
  return branch?.subBranches?.find(
    (subBranch) =>
      normalizeBranchInput(subBranch.id) === normalized ||
      normalizeBranchInput(subBranch.name) === normalized ||
      normalizeBranchInput(subBranch.directory) === normalized ||
      normalizeBranchInput(subBranch.slug) === normalized,
  );
}

export function getBranchByInput(value) {
  const normalized = normalizeBranchInput(value);
  return contentBranches.find(
    (branch) =>
      normalizeBranchInput(branch.id) === normalized ||
      normalizeBranchInput(branch.name) === normalized ||
      normalizeBranchInput(branch.directory) === normalized ||
      normalizeBranchInput(branch.slug) === normalized,
  );
}

export function getContentTargetByInput(branchValue = 'CyberDefenders', subBranchValue = '') {
  let branchInput = String(branchValue || '').trim();
  let subBranchInput = String(subBranchValue || '').trim();

  if (!subBranchInput && branchInput.includes('/')) {
    const [branchPart, subBranchPart] = branchInput.split('/').map((part) => part.trim());
    branchInput = branchPart;
    subBranchInput = subBranchPart;
  }

  const branch = getBranchByInput(branchInput);
  if (branch) {
    if (!subBranchInput) return { branch, subBranch: undefined };

    const subBranch = getSubBranchByInput(branch, subBranchInput);
    return subBranch ? { branch, subBranch } : null;
  }

  if (!subBranchInput) {
    for (const parentBranch of contentBranches) {
      const subBranch = getSubBranchByInput(parentBranch, branchInput);
      if (subBranch) return { branch: parentBranch, subBranch };
    }
  }

  return null;
}

export function getBranchRoutes() {
  return contentBranches.flatMap((branch) => [branch.route, ...(branch.subBranches?.map((subBranch) => subBranch.route) ?? [])]);
}
