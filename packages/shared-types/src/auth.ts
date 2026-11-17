export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  role: UserRole;
  isGuest: boolean;
  contactEmail?: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface UserPreferences {
  userId: string;
  language: 'en' | 'am';
  calendarPreference: 'gregorian' | 'ethiopian';
  theme: 'light' | 'dark' | 'system';
  sidebarPinned: string[];
  sidebarHidden: string[];
  sidebarOrder: string[];
  dailyStudyGoalMinutes: number;
}
