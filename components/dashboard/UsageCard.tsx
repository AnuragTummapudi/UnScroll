import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Instagram, Twitter, Youtube } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface UsageCardProps {
  appName: string;
  usageTime: string;
  iconName: 'instagram' | 'twitter' | 'youtube';
  percentage: number; // 0 to 1
  color: string;
}

export default function UsageCard({ appName, usageTime, iconName, percentage, color }: UsageCardProps) {
  const getAppIcon = () => {
    switch (iconName) {
      case 'instagram':
        return <Instagram size={24} color={color} />;
      case 'twitter':
        return <Twitter size={24} color={color} />;
      case 'youtube':
        return <Youtube size={24} color={color} />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {getAppIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.usageTime}>{usageTime}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${percentage * 100}%`,
                  backgroundColor: color,
                }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.m,
  },
  contentContainer: {
    flex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  appName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  usageTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  progressContainer: {
    height: 8,
  },
  progressBackground: {
    height: '100%',
    backgroundColor: Colors.neutral.lighter,
    borderRadius: Layout.borderRadius.small,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Layout.borderRadius.small,
  },
});