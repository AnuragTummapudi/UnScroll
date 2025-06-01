import { User, Friend, DailyStats, WeeklyStats } from '@/types';

export const mockUser: User = {
  id: 'user1',
  username: 'mindful_user',
  displayName: 'Alex Parker',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
  joinDate: '2024-05-01T00:00:00.000Z',
};

export const mockFriends: Friend[] = [
  {
    id: 'friend1',
    username: 'digital_detox',
    displayName: 'Sam Wilson',
    avatar: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentStreak: 14,
    weeklyFocusMinutes: 320,
  },
  {
    id: 'friend2',
    username: 'zen_coder',
    displayName: 'Jamie Lee',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentStreak: 7,
    weeklyFocusMinutes: 290,
  },
  {
    id: 'friend3',
    username: 'focus_master',
    displayName: 'Taylor Kim',
    avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentStreak: 21,
    weeklyFocusMinutes: 420,
  },
  {
    id: 'friend4',
    username: 'mindful_dev',
    displayName: 'Jordan Smith',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentStreak: 3,
    weeklyFocusMinutes: 185,
  },
  {
    id: 'friend5',
    username: 'calm_coder',
    displayName: 'Riley Johnson',
    avatar: 'https://images.pexels.com/photos/1844547/pexels-photo-1844547.jpeg?auto=compress&cs=tinysrgb&w=400',
    currentStreak: 8,
    weeklyFocusMinutes: 275,
  },
];

export const mockWeeklyStats: WeeklyStats = {
  focusMinutes: 280,
  activeDays: 5,
  moodAverage: 7.8,
  sessionsCompleted: 12,
};

export const mockDailyStats: DailyStats[] = Array(7)
  .fill(null)
  .map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    
    // Generate random stats with higher values for more recent days
    const focusMinutes = Math.floor(Math.random() * 60) + 10 + (index * 5);
    const active = Math.random() > 0.3 || index > 4; // More likely to be active on recent days
    const mood = active ? Math.floor(Math.random() * 3) + 7 : Math.floor(Math.random() * 3) + 4;
    const sessions = active ? Math.floor(Math.random() * 3) + 1 : 0;
    
    return {
      date: date.toISOString(),
      focusMinutes,
      active,
      mood,
      sessions,
    };
  });