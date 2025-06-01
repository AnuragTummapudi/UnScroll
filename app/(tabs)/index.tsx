import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { AppContext } from '@/context/AppContext';
import { StreakBadge } from '@/components/streak/StreakBadge';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Clock, Brain, Smile, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();
  const { user, streakData, focusSessions } = useContext(AppContext);
  const [titleOpacity] = useState(new Animated.Value(1));
  const [contentOpacity] = useState(new Animated.Value(0));
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIntroDone(true); // Let touch events through
      });
    }, 1500);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const todaysSessions = focusSessions.filter((session) => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    return (
      sessionDate.getDate() === today.getDate() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getFullYear() === today.getFullYear()
    );
  });

  const todaysMinutes = todaysSessions.reduce((total, session) => total + session.duration, 0);

  return (
    <View style={styles.container}>
      {/* Intro animation */}
      {!introDone && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.background.primary, theme.colors.background.secondary]}
            style={StyleSheet.absoluteFill}
          />
          <Text style={[styles.titleText, { color: theme.colors.primary }]}>UnScroll</Text>
          <Text style={[styles.subtitleText, { color: theme.colors.text.secondary }]}>
            Mindful Digital Living
          </Text>
        </Animated.View>
      )}

      {/* Main Content */}
      <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.date, { color: theme.colors.text.secondary }]}>{today}</Text>
              <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
                Hi, {user.displayName.split(' ')[0]}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/(modals)/streak-milestone',
                  params: { milestone: streakData.currentStreak },
                })
              }
              activeOpacity={0.8}
            >
              <StreakBadge streak={streakData.currentStreak} />
            </TouchableOpacity>
          </View>

          {/* Today's Progress */}
          <GlassCard style={styles.todayCard}>
            <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>Today's Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Clock size={24} color={theme.colors.primary} />
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{todaysMinutes}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>minutes</Text>
              </View>
              <View style={styles.statItem}>
                <Brain size={24} color={theme.colors.secondary} />
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {todaysSessions.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={24} color={theme.colors.accent} />
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {streakData.currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>day streak</Text>
              </View>
            </View>
          </GlassCard>

          {/* Quick Actions */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.primaryDark }]}
              onPress={() => router.push('/focus?mode=focus')}
              activeOpacity={0.8}
            >
              <Clock size={24} color="#fff" />
              <Text style={styles.actionText}>Focus Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.secondaryDark }]}
              onPress={() => router.push('/focus?mode=breathing')}
              activeOpacity={0.8}
            >
              <Brain size={24} color="#fff" />
              <Text style={styles.actionText}>Breathing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.accentDark }]}
              onPress={() => router.push('/moodCheck')}
              activeOpacity={0.8}
            >
              <Smile size={24} color="#fff" />
              <Text style={styles.actionText}>Mood Check</Text>
            </TouchableOpacity>
          </View>

          {/* Friend Activity */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Friend Activity</Text>
          <GlassCard style={styles.friendsCard}>
            <View style={styles.friendItem}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.friendAvatar}
              />
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, { color: theme.colors.text.primary }]}>Sam Wilson</Text>
                <Text style={[styles.friendActivity, { color: theme.colors.text.secondary }]}>
                  Completed a 25 min focus session
                </Text>
              </View>
            </View>
            <View style={styles.friendItem}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.friendAvatar}
              />
              <View style={styles.friendInfo}>
                <Text style={[styles.friendName, { color: theme.colors.text.primary }]}>Jamie Lee</Text>
                <Text style={[styles.friendActivity, { color: theme.colors.text.secondary }]}>
                  Reached a 7-day streak! 🔥
                </Text>
              </View>
            </View>
            <Button
              title="View Leaderboard"
              variant="outline"
              onPress={() => router.push('/friends')}
              style={{ marginTop: 8 }}
            />
          </GlassCard>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Inter-Bold',
    fontSize: 40,
    marginBottom: 8,
  },
  subtitleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
  },
  contentContainer: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  todayCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    width: '31%',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  friendsCard: {
    marginBottom: 16,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  friendInfo: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  friendActivity: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});
