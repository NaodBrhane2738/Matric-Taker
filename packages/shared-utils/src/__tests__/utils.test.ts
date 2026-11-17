import { describe, it, expect } from 'vitest';
import {
  toEthiopian,
  toGregorian,
  formatEthiopianDate,
  isEthiopianLeapYear,
} from '../ethiopian-calendar';
import {
  calculatePerformanceDimensions,
  canMarkMastered,
  identifyWeakChapters,
} from '../mastery';
import { generateSmartStudySchedule, calculateNextRevisionDate } from '../scheduler';
import { generateGuestNickname, generateInternalEmail } from '../nickname';
import type { StudentChapterProgress } from '@matric/shared-types';

describe('Ethiopian Calendar Conversion', () => {
  it('converts Ethiopian New Year (Meskerem 1, 2017 E.C.) to Gregorian', () => {
    // 2017 Meskerem 1 is September 11, 2024
    const greg = toGregorian(2017, 1, 1);
    expect(greg.getUTCFullYear()).toBe(2024);
    expect(greg.getUTCMonth() + 1).toBe(9);
    expect(greg.getUTCDate()).toBe(11);
  });

  it('correctly identifies Ethiopian leap years (year % 4 === 3)', () => {
    expect(isEthiopianLeapYear(2015)).toBe(true); // 2015 % 4 = 3
    expect(isEthiopianLeapYear(2016)).toBe(false);
    expect(isEthiopianLeapYear(2017)).toBe(false);
    expect(isEthiopianLeapYear(2018)).toBe(false);
    expect(isEthiopianLeapYear(2019)).toBe(true); // 2019 % 4 = 3
  });

  it('formats dates in English and Amharic', () => {
    const eth = {
      year: 2017,
      month: 1,
      day: 1,
      monthNameEn: 'Meskerem',
      monthNameAm: 'መስከረም',
    };
    expect(formatEthiopianDate(eth, 'en')).toBe('Meskerem 1, 2017 E.C.');
    expect(formatEthiopianDate(eth, 'am')).toBe('መስከረም 1፣ 2017 ዓ.ም');
  });
});

describe('Mastery & Performance Dimensions', () => {
  it('rejects checkbox-only mastery without assessment evidence', () => {
    expect(canMarkMastered('studied', undefined, 0)).toBe(false);
    expect(canMarkMastered('studied', 70, 1)).toBe(false); // below 75%
    expect(canMarkMastered('studied', 85, 1)).toBe(true);  // meets 75% threshold
  });

  it('keeps Coverage, Knowledge Mastery, and Exam Readiness as independent metrics', () => {
    const records: StudentChapterProgress[] = [
      {
        id: '1',
        userId: 'u1',
        chapterId: 'c1',
        status: 'studied', // studied but not mastered
        revisionCount: 1,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        userId: 'u1',
        chapterId: 'c2',
        status: 'mastered', // studied AND mastered
        assessmentScoreAverage: 90,
        revisionCount: 2,
        createdAt: '',
        updatedAt: '',
      },
    ];

    const metrics = calculatePerformanceDimensions(10, records, 5);
    // 2 out of 10 studied = 20% coverage
    expect(metrics.curriculumCoveragePercentage).toBe(20);
    // 1 out of 10 mastered = 10% mastery
    expect(metrics.knowledgeMasteryPercentage).toBe(10);
    // Readiness is composite
    expect(metrics.examinationReadinessPercentage).not.toBe(metrics.curriculumCoveragePercentage);
    expect(metrics.examinationReadinessPercentage).not.toBe(metrics.knowledgeMasteryPercentage);
  });

  it('identifies weak chapters based on low score or difficulty', () => {
    const records: StudentChapterProgress[] = [
      {
        id: '1',
        userId: 'u1',
        chapterId: 'c1',
        status: 'studied',
        assessmentScoreAverage: 45, // low score
        revisionCount: 1,
        createdAt: '',
        updatedAt: '',
      },
      {
        id: '2',
        userId: 'u1',
        chapterId: 'c2',
        status: 'needs_revision',
        revisionCount: 0,
        createdAt: '',
        updatedAt: '',
      },
    ];

    const weak = identifyWeakChapters(records);
    expect(weak.length).toBe(2);
    expect(weak[0].severity).toBe('high');
  });
});

describe('Smart Study Scheduler', () => {
  it('generates non-overlapping sessions prioritizing uncovered chapters and weak chapters', () => {
    const schedule = generateSmartStudySchedule({
      examinationDate: '2027-06-01T00:00:00Z',
      availableDays: ['MO', 'WE', 'FR'],
      dailyTargetMinutes: 90,
      weeklyTargetMinutes: 270,
      preferredStartHour: 16,
      preferredEndHour: 18,
      uncoveredChapters: ['c1', 'c2'],
      weakChapters: ['c3'],
      overdueRevisionChapters: ['c4'],
    }, 4);

    expect(schedule.length).toBe(4);
    expect(schedule[0].chapterId).toBe('c1');
    expect(schedule[0].durationMinutes).toBe(90);
    expect(schedule[0].startTime).toBe('16:00');
  });

  it('calculates spaced revision intervals dynamically', () => {
    const rev1 = calculateNextRevisionDate(0);
    const rev2 = calculateNextRevisionDate(1);
    const rev3 = calculateNextRevisionDate(2);

    expect(rev2.getTime()).toBeGreaterThan(rev1.getTime());
    expect(rev3.getTime()).toBeGreaterThan(rev2.getTime());
  });
});

describe('Guest Nickname & Email Generation', () => {
  it('generates readable guest nickname and valid .invalid internal email', () => {
    const nick = generateGuestNickname();
    expect(nick).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{2}$/);

    const email = generateInternalEmail('guest-1234');
    expect(email).toBe('account-guest-1234@internal.matric.invalid');
  });
});
