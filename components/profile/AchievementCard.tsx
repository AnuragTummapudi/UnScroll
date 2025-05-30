import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Zap, Sun } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 to 1
  icon: string;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const getAchievementIcon = () => {
    switch (achievement.icon) {
      case 'award':
        return <Award size={24} color={Colors.primary.main} />;
      case 'zap':
        return <Zap size={24} color={Colors.secondary.main} />;
      case 'sun':
        return <Sun size={24} color={Colors.warning.main} />;
      default:
        return <Award size={24} color={Colors.primary.main} />;
    }
  };
  
  const getIconColor = () => {
    switch (achievement.icon) {
      case 'award':
        return Colors.primary.main;
      case 'zap':
        return Colors.secondary.main;
      case 'sun':
        return Colors.warning.main;
      default:
        return Colors.primary.main;
    }
  };
  
  const isCompleted = achievement.progress >= 1;
  
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${getIconColor()}20` }]}>
        {getAchievementIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${achievement.progress * 100}%`,
                  backgroundColor: getIconColor(),
                }
              ]} 
            />
          </View>
          
          <Text style={styles.progressText}>
            {isCompleted ? 'Completed' : `${Math.round(achievement.progress * 100)}%`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.m,
  },
  contentContainer: {
    flex: 1,
  },
  textContainer: {
    marginBottom: Layout.spacing.s,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.neutral.lighter,
    borderRadius: Layout.borderRadius.small,
    overflow: 'hidden',
    marginRight: Layout.spacing.s,
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.small,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.text.secondary,
    width: 70,
    textAlign: 'right',
  },
});