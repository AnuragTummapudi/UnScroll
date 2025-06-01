import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppContext } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { LineChart } from 'react-native-chart-kit';
import { mockDailyStats, mockWeeklyStats } from '@/utils/mockData';
import { Calendar, Clock, Smile, ArrowRight, Meh, Frown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState as useReactState } from 'react';

export default function StatsScreen() {
  const theme = useTheme();
  const { streakData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('day');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // --- Mood Data Integration ---
  // Try to get mood history from localStorage or global context if available
  const [moodHistory, setMoodHistory] = useReactState<{ date: string; mood: string }[]>([]);
  const [todayMood, setTodayMood] = useReactState<string | null>(null);

  useEffect(() => {
    // Try to get from localStorage (if available in your app)
    let moodData: { date: string; mood: string }[] = [];
    try {
      const stored = globalThis?.localStorage?.getItem?.('moodHistory');
      if (stored) moodData = JSON.parse(stored);
    } catch {}
    setMoodHistory(moodData);

    // Find today's mood
    const todayStr = new Date().toLocaleDateString();
    const todayEntry = moodData.find(entry => entry.date === todayStr);
    setTodayMood(todayEntry?.mood ?? null);
  }, [activeTab]);

  // Helper for mood label and icon
  const MOODS = [
    { label: 'Happy', value: 'happy', icon: <Smile size={32} color="#22d3ee" />, color: '#22d3ee' },
    { label: 'Neutral', value: 'neutral', icon: <Meh size={32} color="#fbbf24" />, color: '#fbbf24' },
    { label: 'Sad', value: 'sad', icon: <Frown size={32} color="#f87171" />, color: '#f87171' },
  ];
  const moodObj = MOODS.find(m => m.value === todayMood);

  // Get screen width for chart
  const screenWidth = Dimensions.get('window').width - 32;
  
  // Change tab with animation
  const changeTab = (tab: string) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab);
      
      // Prepare slide direction
      if (tab === 'day') slideAnim.setValue(-50);
      else if (tab === 'week') slideAnim.setValue(0);
      else slideAnim.setValue(50);
      
      // Fade in with slide
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };
  
  // Format data for chart
  const chartData = {
    labels: mockDailyStats.map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        data: mockDailyStats.map(stat => stat.focusMinutes),
        color: () => theme.colors.primary,
        strokeWidth: 2,
      },
    ],
  };
  
  // Helper for day names
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Get current day stats
  const today = new Date().toISOString().split('T')[0];
  const todayStats = mockDailyStats.find(stat => 
    new Date(stat.date).toISOString().split('T')[0] === today
  ) || mockDailyStats[mockDailyStats.length - 1];
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Statistics</Text>
        
        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'day' && { backgroundColor: theme.colors.glass.background },
            ]}
            onPress={() => changeTab('day')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'day' ? theme.colors.primary : theme.colors.text.secondary },
              ]}
            >
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'week' && { backgroundColor: theme.colors.glass.background },
            ]}
            onPress={() => changeTab('week')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'week' ? theme.colors.primary : theme.colors.text.secondary },
              ]}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'streak' && { backgroundColor: theme.colors.glass.background },
            ]}
            onPress={() => changeTab('streak')}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === 'streak' ? theme.colors.primary : theme.colors.text.secondary },
              ]}
            >
              Streak
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Tab Content */}
        <Animated.View
          style={[
            styles.tabContent,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Today's Stats */}
          {activeTab === 'day' && (
            <>
              <GlassCard style={styles.todayCard}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                  Today's Progress
                </Text>
                <View style={styles.dailyStats}>
                  <View style={styles.statColumn}>
                    <View style={styles.statItem}>
                      <Clock size={20} color={theme.colors.primary} style={styles.statIcon} />
                      <View>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                          {todayStats.focusMinutes} min
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                          Focus Time
                        </Text>
                      </View>
                    </View>
                    <View style={styles.statItem}>
                      <Calendar size={20} color={theme.colors.secondary} style={styles.statIcon} />
                      <View>
                        <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                          {todayStats.sessions}
                        </Text>
                        <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                          Sessions
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.moodContainer}>
                    <Text style={[styles.moodLabel, { color: theme.colors.text.secondary }]}>
                      Today's Mood
                    </Text>
                    <View style={styles.moodValue}>
                      {moodObj ? moodObj.icon : <Smile size={32} color={theme.colors.text.tertiary} />}
                      <Text style={[
                        styles.moodText,
                        { color: moodObj ? moodObj.color : theme.colors.text.tertiary }
                      ]}>
                        {moodObj ? moodObj.label : 'No entry'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.moodDetailsButton}
                      onPress={() => router.push('/moodCheck')}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.moodDetailsText, { color: theme.colors.primary }]}>
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassCard>
              
              <GlassCard style={styles.streakSnapshot}>
                <View style={styles.streakHeader}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                    Streak Snapshot
                  </Text>
                  <View style={styles.fireContainer}>
                    <Text style={[styles.streakCount, { color: theme.colors.accent }]}>
                      🔥 {streakData.currentStreak}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.streakSubtitle, { color: theme.colors.text.secondary }]}>
                  {streakData.currentStreak > 0 
                    ? `You're on a ${streakData.currentStreak}-day streak! Keep going!`
                    : 'Complete an activity today to start your streak!'}
                </Text>
                <TouchableOpacity 
                  style={styles.streakButton}
                  onPress={() => changeTab('streak')}
                >
                  <Text style={[styles.streakButtonText, { color: theme.colors.primary }]}>
                    View Details
                  </Text>
                  <ArrowRight size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </GlassCard>
            </>
          )}
          
          {/* Weekly Stats */}
          {activeTab === 'week' && (
            <>
              <GlassCard style={styles.chartCard}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                  Weekly Focus Time
                </Text>
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: 'transparent',
                    backgroundGradientTo: 'transparent',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: theme.colors.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </GlassCard>
              
              <GlassCard style={styles.weeklyStatsCard}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                  Weekly Summary
                </Text>
                <View style={styles.weeklySummary}>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
                      {mockWeeklyStats.focusMinutes}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>
                      Minutes Focused
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
                      {mockWeeklyStats.activeDays}/7
                    </Text>
                    <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>
                      Active Days
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
                      {mockWeeklyStats.sessionsCompleted}
                    </Text>
                    <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>
                      Sessions
                    </Text>
                  </View>
                </View>
              </GlassCard>
              
              <GlassCard style={styles.dailyBreakdownCard}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                  Daily Breakdown
                </Text>
                {mockDailyStats.map((stat, index) => (
                  <View key={index} style={styles.dayRow}>
                    <Text style={[styles.dayName, { color: theme.colors.text.primary }]}>
                      {getDayName(stat.date)}
                    </Text>
                    <View style={styles.dayBar}>
                      <View 
                        style={[
                          styles.dayProgress, 
                          { 
                            width: `${Math.min(100, (stat.focusMinutes / 60) * 100)}%`,
                            backgroundColor: stat.active ? theme.colors.primary : theme.colors.text.tertiary 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.dayValue, { color: theme.colors.text.secondary }]}>
                      {stat.focusMinutes}m
                    </Text>
                  </View>
                ))}
              </GlassCard>
            </>
          )}
          
          {/* Streak Stats */}
          {activeTab === 'streak' && (
            <>
              <GlassCard style={styles.streakCard}>
                <View style={styles.streakHeader}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                    Current Streak
                  </Text>
                  <View style={styles.fireContainer}>
                    <Text style={[styles.streakCount, { color: theme.colors.accent }]}>
                      🔥 {streakData.currentStreak}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.streakInfo, { color: theme.colors.text.secondary }]}>
                  Your longest streak: {streakData.longestStreak} days
                </Text>
                
                <View style={styles.streakBarContainer}>
                  <View style={styles.streakBarLabel}>
                    <Text style={[styles.streakBarText, { color: theme.colors.text.secondary }]}>
                      0
                    </Text>
                    <Text style={[styles.streakBarText, { color: theme.colors.text.secondary }]}>
                      30 days
                    </Text>
                  </View>
                  <View style={[styles.streakBar, { backgroundColor: theme.colors.background.elevation }]}>
                    <View 
                      style={[
                        styles.streakProgress, 
                        { 
                          width: `${Math.min(100, (streakData.currentStreak / 30) * 100)}%`,
                          backgroundColor: theme.colors.accent 
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <Text style={[styles.milestoneTitle, { color: theme.colors.text.primary }]}>
                  Milestones Achieved
                </Text>
                <View style={styles.milestones}>
                  <View style={[
                    styles.milestone, 
                    { 
                      backgroundColor: streakData.milestones.includes(3) 
                        ? 'rgba(249, 115, 22, 0.2)' 
                        : theme.colors.background.elevation,
                      borderColor: streakData.milestones.includes(3) 
                        ? theme.colors.accent 
                        : 'transparent',
                    }
                  ]}>
                    <Text style={[
                      styles.milestoneText, 
                      { color: streakData.milestones.includes(3) 
                        ? theme.colors.accent 
                        : theme.colors.text.tertiary 
                      }
                    ]}>
                      3 Days
                    </Text>
                  </View>
                  <View style={[
                    styles.milestone, 
                    { 
                      backgroundColor: streakData.milestones.includes(7) 
                        ? 'rgba(249, 115, 22, 0.2)' 
                        : theme.colors.background.elevation,
                      borderColor: streakData.milestones.includes(7) 
                        ? theme.colors.accent 
                        : 'transparent',
                    }
                  ]}>
                    <Text style={[
                      styles.milestoneText, 
                      { color: streakData.milestones.includes(7) 
                        ? theme.colors.accent 
                        : theme.colors.text.tertiary 
                      }
                    ]}>
                      7 Days
                    </Text>
                  </View>
                  <View style={[
                    styles.milestone, 
                    { 
                      backgroundColor: streakData.milestones.includes(14) 
                        ? 'rgba(249, 115, 22, 0.2)' 
                        : theme.colors.background.elevation,
                      borderColor: streakData.milestones.includes(14) 
                        ? theme.colors.accent 
                        : 'transparent',
                    }
                  ]}>
                    <Text style={[
                      styles.milestoneText, 
                      { color: streakData.milestones.includes(14) 
                        ? theme.colors.accent 
                        : theme.colors.text.tertiary 
                      }
                    ]}>
                      14 Days
                    </Text>
                  </View>
                  <View style={[
                    styles.milestone, 
                    { 
                      backgroundColor: streakData.milestones.includes(30) 
                        ? 'rgba(249, 115, 22, 0.2)' 
                        : theme.colors.background.elevation,
                      borderColor: streakData.milestones.includes(30) 
                        ? theme.colors.accent 
                        : 'transparent',
                    }
                  ]}>
                    <Text style={[
                      styles.milestoneText, 
                      { color: streakData.milestones.includes(30) 
                        ? theme.colors.accent 
                        : theme.colors.text.tertiary 
                      }
                    ]}>
                      30 Days
                    </Text>
                  </View>
                </View>
              </GlassCard>
              
              <GlassCard style={styles.historyCard}>
                <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
                  Activity History
                </Text>
                <View style={styles.calendarGrid}>
                  {streakData.history.slice(0, 7).map((day, index) => (
                    <View key={index} style={styles.calendarDay}>
                      <Text style={[styles.calendarDate, { color: theme.colors.text.secondary }]}>
                        {new Date(day.date).getDate()}
                      </Text>
                      <View 
                        style={[
                          styles.calendarDot, 
                          { 
                            backgroundColor: day.active 
                              ? theme.colors.accent 
                              : theme.colors.background.elevation 
                          }
                        ]} 
                      />
                    </View>
                  ))}
                </View>
              </GlassCard>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  tabContent: {
    flex: 1,
  },
  todayCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  dailyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    flex: 1,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIcon: {
    marginRight: 12,
  },
  statValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  moodContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(148, 163, 184, 0.3)',
    paddingLeft: 20,
    flex: 1,
  },
  moodLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  moodValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginLeft: 8,
  },
  moodDetailsButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
  moodDetailsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  streakSnapshot: {
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fireContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakCount: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  streakSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  streakButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 8,
  },
  chartCard: {
    marginBottom: 16,
  },
  chart: {
    marginLeft: -15,
    borderRadius: 16,
  },
  weeklyStatsCard: {
    marginBottom: 16,
  },
  weeklySummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  dailyBreakdownCard: {
    marginBottom: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    width: 40,
  },
  dayBar: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  dayProgress: {
    height: '100%',
    borderRadius: 6,
  },
  dayValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  streakCard: {
    marginBottom: 16,
  },
  streakInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 20,
  },
  streakBarContainer: {
    marginBottom: 20,
  },
  streakBarLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  streakBarText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  streakBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  streakProgress: {
    height: '100%',
    borderRadius: 6,
  },
  milestoneTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 12,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  milestone: {
    width: '48%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  milestoneText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  historyCard: {
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calendarDay: {
    alignItems: 'center',
  },
  calendarDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  calendarDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});