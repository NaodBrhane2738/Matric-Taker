/**
 * Ethiopian Calendar Converter
 * 
 * The Ethiopian calendar has 13 months:
 * - Months 1-12 have 30 days each (Meskerem to Nehase)
 * - Month 13 (Pagume) has 5 days, or 6 days in an Ethiopian leap year.
 * An Ethiopian year is a leap year if (year % 4 === 3).
 * Conversion is computed via Julian Day Number (JDN).
 */

export interface EthiopianDate {
  year: number;
  month: number; // 1 - 13
  day: number;   // 1 - 30 (or 1-6 for Pagume)
  monthNameEn: string;
  monthNameAm: string;
}

export const ETHIOPIAN_EPOCH = 1724221;

export const ETHIOPIAN_MONTHS = [
  { id: 1, en: 'Meskerem', am: 'መስከረም' },
  { id: 2, en: 'Tikimt', am: 'ጥቅምት' },
  { id: 3, en: 'Hidar', am: 'ኅዳር' },
  { id: 4, en: 'Tahsas', am: 'ታኅሣሥ' },
  { id: 5, en: 'Tir', am: 'ጥር' },
  { id: 6, en: 'Yakatit', am: 'የካቲት' },
  { id: 7, en: 'Magabit', am: 'መጋቢት' },
  { id: 8, en: 'Miyazya', am: 'ሚያዝያ' },
  { id: 9, en: 'Ginbot', am: 'ግንቦት' },
  { id: 10, en: 'Sene', am: 'ሰኔ' },
  { id: 11, en: 'Hamle', am: 'ሐምሌ' },
  { id: 12, en: 'Nehase', am: 'ነሐሴ' },
  { id: 13, en: 'Pagume', am: 'ጳጉሜ' },
] as const;

export function isEthiopianLeapYear(year: number): boolean {
  return (year % 4) === 3;
}

export function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);

  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);

  return { year, month, day };
}

export function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = (jdn - ETHIOPIAN_EPOCH) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  const year = 4 * Math.floor((jdn - ETHIOPIAN_EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  const monthMeta = ETHIOPIAN_MONTHS[month - 1] || ETHIOPIAN_MONTHS[0];

  return {
    year: year + 1,
    month,
    day,
    monthNameEn: monthMeta.en,
    monthNameAm: monthMeta.am,
  };
}

export function ethiopianToJDN(year: number, month: number, day: number): number {
  return ETHIOPIAN_EPOCH + 365 * (year - 1) + Math.floor(year / 4) + 30 * (month - 1) + day - 1;
}

export function toEthiopian(gregorianDate: Date): EthiopianDate {
  const jdn = gregorianToJDN(
    gregorianDate.getFullYear(),
    gregorianDate.getMonth() + 1,
    gregorianDate.getDate()
  );
  return jdnToEthiopian(jdn);
}

export function toGregorian(ethYear: number, ethMonth: number, ethDay: number): Date {
  const jdn = ethiopianToJDN(ethYear, ethMonth, ethDay);
  const { year, month, day } = jdnToGregorian(jdn);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatEthiopianDate(eth: EthiopianDate, lang: 'en' | 'am' = 'en'): string {
  if (lang === 'am') {
    return `${eth.monthNameAm} ${eth.day}፣ ${eth.year} ዓ.ም`;
  }
  return `${eth.monthNameEn} ${eth.day}, ${eth.year} E.C.`;
}
