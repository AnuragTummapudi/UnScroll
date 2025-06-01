export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string;
  joinDate: string;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  currentStreak: number;
  weeklyFocusMinutes: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  milestones: number[];
  history: Array<{ date: string; active: boolean }>;
}

export interface FocusSession {
  id: string;
  date: string;
  duration: number; // minutes
  type: 'focus' | 'breathing' | 'meditation';
}

export interface WeeklyStats {
  focusMinutes: number;
  activeDays: number;
  moodAverage: number;
  sessionsCompleted: number;
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  active: boolean;
  mood?: number;
  sessions: number;
}