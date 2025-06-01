import { createContext, useState, useEffect } from 'react';
import { mockUser, mockFriends } from '@/utils/mockData';
import { User, Friend, StreakData, FocusSession } from '@/types';
import { router } from 'expo-router';

interface AppContextType {
  user: User;
  friends: Friend[];
  streakData: StreakData;
  focusSessions: FocusSession[];
  isDarkMode: boolean;
  updateUser: (data: Partial<User>) => void;
  updateStreak: (data: Partial<StreakData>) => void;
  addFocusSession: (session: FocusSession) => void;
  toggleDarkMode: () => void;
  checkAndUpdateStreak: () => void;
  completeActivity: (type: string) => void;
  logout: () => void;
}

const defaultContext: AppContextType = {
  user: mockUser,
  friends: mockFriends,
  streakData: {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    milestones: [],
    history: [],
  },
  focusSessions: [],
  isDarkMode: true,
  updateUser: () => {},
  updateStreak: () => {},
  addFocusSession: () => {},
  toggleDarkMode: () => {},
  checkAndUpdateStreak: () => {},
  completeActivity: () => {},
  logout: () => {},
};

export const AppContext = createContext<AppContextType>(defaultContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(mockUser);
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date().toISOString(),
    milestones: [3, 7],
    history: Array(5).fill(true).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return { date: date.toISOString(), active: true };
    }),
  });
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [isDarkMode, setDarkMode] = useState<boolean>(true);

  // Update user data
  const updateUser = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  // Update streak data
  const updateStreak = (data: Partial<StreakData>) => {
    setStreakData((prev) => ({ ...prev, ...data }));
  };

  // Add a new focus session
  const addFocusSession = (session: FocusSession) => {
    setFocusSessions((prev) => [...prev, session]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Check and update streak based on date
  const checkAndUpdateStreak = () => {
    if (!streakData.lastActiveDate) {
      // First time user, start streak at 1
      updateStreak({
        currentStreak: 1,
        lastActiveDate: new Date().toISOString(),
        history: [{ date: new Date().toISOString(), active: true }],
      });
      return;
    }

    const lastActive = new Date(streakData.lastActiveDate);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Reset day hours to compare just the dates
    lastActive.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    // If already active today, do nothing
    if (lastActive.getTime() === today.getTime()) {
      return;
    }

    // If active yesterday, increment streak
    if (lastActive.getTime() === yesterday.getTime()) {
      const newStreak = streakData.currentStreak + 1;
      const newLongestStreak = Math.max(newStreak, streakData.longestStreak);
      
      // Check if hit a milestone
      const milestones = [3, 7, 14, 30, 60, 90];
      const newMilestone = milestones.find(m => 
        !streakData.milestones.includes(m) && newStreak >= m
      );
      
      const newMilestones = newMilestone 
        ? [...streakData.milestones, newMilestone]
        : streakData.milestones;
      
      updateStreak({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today.toISOString(),
        milestones: newMilestones,
        history: [
          { date: today.toISOString(), active: true },
          ...streakData.history,
        ],
      });
      
      return;
    }

    // More than 1 day gap, reset streak
    updateStreak({
      currentStreak: 1,
      lastActiveDate: today.toISOString(),
      history: [
        { date: today.toISOString(), active: true },
        ...streakData.history,
      ],
    });
  };

  // Complete an activity (focus, breathing, mood check-in)
  const completeActivity = (type: string) => {
    checkAndUpdateStreak();
    
    // If it's a focus session, add it to the history
    if (type === 'focus') {
      addFocusSession({
        id: `focus-${Date.now()}`,
        date: new Date().toISOString(),
        duration: 25, // 25 minutes
        type: 'focus',
      });
    }
  };

  // Logout function
  const logout = () => {
    setUser({ ...mockUser, id: '', username: '', displayName: '', email: '', avatar: '', joinDate: '' });
    setFocusSessions([]);
    // Optionally reset other state if needed
    // router.replace('/auth');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        friends,
        streakData,
        focusSessions,
        isDarkMode,
        updateUser,
        updateStreak,
        addFocusSession,
        toggleDarkMode,
        checkAndUpdateStreak,
        completeActivity,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};