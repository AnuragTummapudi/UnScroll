import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface StatsProps {
  weeklyAvg: string;
  weeklyChange: string;
  monthlyAvg: string;
  monthlyChange: string;
}

interface StatsCardProps {
  stats: StatsProps;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const isWeeklyPositive = !stats.weeklyChange.includes('-');
  const isMonthlyPositive = !stats.monthlyChange.includes('-');
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Weekly Average</Text>
          <Text style={styles.statValue}>{stats.weeklyAvg}</Text>
          <View style={styles.changeContainer}>
            {isWeeklyPositive ? (
              <TrendingUp size={16} color={Colors.error.main} />
            ) : (
              <TrendingDown size={16} color={Colors.success.main} />
            )}
            <Text 
              style={[
                styles.changeText, 
                { 
                  color: isWeeklyPositive ? Colors.error.main : Colors.success.main 
                }
              ]}
            >
              {stats.weeklyChange}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Monthly Average</Text>
          <Text style={styles.statValue}>{stats.monthlyAvg}</Text>
          <View style={styles.changeContainer}>
            {isMonthlyPositive ? (
              <TrendingUp size={16} color={Colors.error.main} />
            ) : (
              <TrendingDown size={16} color={Colors.success.main} />
            )}
            <Text 
              style={[
                styles.changeText, 
                { 
                  color: isMonthlyPositive ? Colors.error.main : Colors.success.main 
                }
              ]}
            >
              {stats.monthlyChange}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.neutral.lighter,
  },
});