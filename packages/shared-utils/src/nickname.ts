// Comprehensive Marvel (MCU) & DC Comic Universe Character Nicknames
// Including both main stars and secondary/side characters

export const MARVEL_MAINSTREAM = [
  'IronMan', 'CaptainAmerica', 'Thor', 'Hulk', 'BlackWidow', 'Hawkeye',
  'SpiderMan', 'DoctorStrange', 'BlackPanther', 'ScarletWitch', 'CaptainMarvel',
  'AntMan', 'Wasp', 'StarLord', 'Gamora', 'Groot', 'RocketRaccoon',
  'Wolverine', 'Deadpool', 'Daredevil', 'Loki', 'WinterSoldier', 'Falcon',
  'Vision', 'ShangChi', 'MoonKnight', 'SheHulk', 'WarMachine', 'NickFury',
  'Thanos', 'DoctorDoom', 'Magneto', 'ProfessorX', 'SilverSurfer', 'GhostRider',
  'Blade', 'Punisher', 'Cyclops', 'JeanGrey', 'Storm', 'Rogue', 'Gambit',
  'Nightcrawler', 'Beast', 'Cable'
];

export const MARVEL_SECONDARY = [
  'Wong', 'HappyHogan', 'NedLeeds', 'Korg', 'Miek', 'DarcyLewis', 'JimmyWoo',
  'Luis', 'CassieLang', 'Mantis', 'Nebula', 'Kraglin', 'Yondu', 'Okoye',
  'Shuri', 'MBaku', 'Nakia', 'Ayo', 'Mobius', 'Sylvie', 'HunterB15', 'Casey',
  'AgathaHarkness', 'MonicaRambeau', 'EverettRoss', 'TrevorSlattery',
  'RedGuardian', 'YelenaBelova', 'KateBishop', 'Echo', 'AmericaChavez',
  'Clea', 'Cosmo', 'HowardTheDuck', 'FrogMan', 'Madisynn', 'Patriot',
  'Ironheart', 'Valkyrie', 'Heimdall', 'LadySif', 'PeggyCarter', 'MariaHill',
  'PhilCoulson', 'DumDumDugan', 'Jarvis'
];

export const DC_MAINSTREAM = [
  'Batman', 'Superman', 'WonderWoman', 'Flash', 'Aquaman', 'GreenLantern',
  'Cyborg', 'MartianManhunter', 'Nightwing', 'Robin', 'Batgirl', 'Supergirl',
  'GreenArrow', 'Shazam', 'BlackAdam', 'Joker', 'HarleyQuinn', 'Catwoman',
  'PoisonIvy', 'LexLuthor', 'Deathstroke', 'Constantine', 'RedHood',
  'BlueBeetle', 'Peacemaker', 'Hawkman', 'DoctorFate', 'Zatanna', 'BlackCanary'
];

export const DC_SECONDARY = [
  'AlfredPennyworth', 'CommissionerGordon', 'LuciusFox', 'LoisLane',
  'JimmyOlsen', 'PerryWhite', 'MarthaKent', 'SteveTrevor', 'EttaCandy',
  'Mera', 'Vulko', 'KingShark', 'PolkaDotMan', 'RatcatcherTwo', 'Vigilante',
  'Judomaster', 'Harcourt', 'Economos', 'AmandaWaller', 'IrisWest',
  'CiscoRamon', 'KillerFrost', 'BoosterGold', 'Deadman', 'Etrigan',
  'Huntress', 'ReneeMontoya', 'Katana', 'RickFlag', 'Bloodsport', 'Weasel',
  'CaptainBoomerang', 'BronzeTiger', 'Wildcat', 'MisterTerrific', 'Stargirl'
];

export const ALL_SUPERHEROES = [
  ...MARVEL_MAINSTREAM,
  ...MARVEL_SECONDARY,
  ...DC_MAINSTREAM,
  ...DC_SECONDARY,
];

const ADJECTIVES = [
  'Quiet', 'Bright', 'Swift', 'Calm', 'Brave', 'Keen', 'Wise', 'Bold',
  'Patient', 'Steady', 'Noble', 'Clever', 'Focused', 'Active', 'Mindful'
];

const NOUNS = [
  'Falcon', 'Cheetah', 'Eagle', 'Owl', 'Lion', 'Gazelle', 'Leopard',
  'Ibex', 'Hawk', 'Robin', 'Wolf', 'Badger', 'Puma', 'Otter', 'Raven'
];

/**
 * Generates a random superhero nickname from Marvel MCU and DC Comic Universe,
 * including main stars and memorable secondary / side characters.
 */
export function generateSuperheroNickname(): string {
  const character = ALL_SUPERHEROES[Math.floor(Math.random() * ALL_SUPERHEROES.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${character}${num}`;
}

/**
 * Standard guest nickname generator.
 */
export function generateGuestNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

export function generateInternalEmail(uniqueId: string): string {
  return `account-${uniqueId}@internal.matric.invalid`;
}
