const ADJECTIVES = [
  'Quiet', 'Bright', 'Swift', 'Calm', 'Brave', 'Keen', 'Wise', 'Bold',
  'Patient', 'Steady', 'Noble', 'Clever', 'Focused', 'Active', 'Mindful'
];

const NOUNS = [
  'Falcon', 'Cheetah', 'Eagle', 'Owl', 'Lion', 'Gazelle', 'Leopard',
  'Ibex', 'Hawk', 'Robin', 'Wolf', 'Badger', 'Puma', 'Otter', 'Raven'
];

export function generateGuestNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

export function generateInternalEmail(uniqueId: string): string {
  return `account-${uniqueId}@internal.matric.invalid`;
}
