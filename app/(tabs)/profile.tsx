import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Award, ChevronRight, Edit2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import AchievementCard from '@/components/profile/AchievementCard';
import StatsCard from '@/components/profile/StatsCard';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('Alex Johnson');
  const [userEmail, setUserEmail] = useState('alex.johnson@example.com');

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // TODO: Save profile changes to backend
  };

  const handleViewAllAchievements = () => {
    // TODO: Navigate to achievements screen
  };

  const handleGoalPress = () => {
    // TODO: Navigate to goals screen
  };

  const handleHistoryPress = () => {
    // TODO: Navigate to history screen
  };

  const handleExportPress = () => {
    // TODO: Implement data export
  };
  const streakData = {
    current: 5,
    longest: 14,
  };
  
  const achievements = [
    {
      id: '1',
      title: 'Digital Detoxer',
      description: 'Reduced screen time for 7 consecutive days',
      progress: 1, // Completed
      icon: 'award',
    },
    {
      id: '2',
      title: 'Focus Master',
      description: 'Completed 10 focus sessions',
      progress: 0.7, // 70% complete
      icon: 'zap',
    },
    {
      id: '3',
      title: 'Early Bird',
      description: 'Avoided screens in the morning for 5 days',
      progress: 0.4, // 40% complete
      icon: 'sun',
    }
  ];
  
  const stats = {
    weeklyAvg: '3.2h',
    weeklyChange: '-15%',
    monthlyAvg: '3.5h',
    monthlyChange: '-22%',
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.profileImage}
            />
            <TouchableOpacity 
              style={styles.editButton}
              onPress={isEditing ? handleSaveProfile : handleEditProfile}
            >
              <Edit2 size={16} color={Colors.neutral.white} />
            </TouchableOpacity>
          </View>
          
          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={userName}
                onChangeText={setUserName}
                placeholder="Name"
              />
              <TextInput
                style={styles.editInput}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </>
          )}
          
          <View style={styles.streakContainer}>
            <View style={styles.streakInfoContainer}>
              <Text style={styles.streakValue}>{streakData.current}</Text>
              <Text style={styles.streakLabel}>Current Streak</Text>
            </View>
            
            <View style={styles.streakDivider} />
            
            <View style={styles.streakInfoContainer}>
              <Text style={styles.streakValue}>{streakData.longest}</Text>
              <Text style={styles.streakLabel}>Longest Streak</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stats Overview</Text>
          </View>
          
          <StatsCard stats={stats} />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={handleViewAllAchievements}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
            />
          ))}
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity style={styles.menuItem} onPress={handleGoalPress}>
            <Award size={20} color={Colors.primary.main} />
            <Text style={styles.menuItemText}>My Goals</Text>
            <ChevronRight size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHistoryPress}>
            <Award size={20} color={Colors.primary.main} />
            <Text style={styles.menuItemText}>Screen Time History</Text>
            <ChevronRight size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleExportPress}>
            <Award size={20} color={Colors.primary.main} />
            <Text style={styles.menuItemText}>Export Data</Text>
            <ChevronRight size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  editContainer: {
    width: '100%',
    paddingHorizontal: Layout.spacing.xl,
  },
  editInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
    marginVertical: Layout.spacing.s,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
  },
  profileContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: Layout.borderRadius.round,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.main,
    width: 32,
    height: 32,
    borderRadius: Layout.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral.white,
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
    marginTop: Layout.spacing.m,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  streakContainer: {
    flexDirection: 'row',
    marginTop: Layout.spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    width: '100%',
  },
  streakInfoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  streakValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.primary.main,
  },
  streakLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.xs,
  },
  streakDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.neutral.light,
  },
  section: {
    marginTop: Layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary.main,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.lighter,
  },
  menuItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Layout.spacing.m,
  },
});