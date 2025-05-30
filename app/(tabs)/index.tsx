import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { Bell, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import UsageCard from '@/components/dashboard/UsageCard';
import ProgressRing from '@/components/common/ProgressRing';
import MascotTip from '@/components/common/MascotTip';

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWeeklyDetails, setShowWeeklyDetails] = useState(false);
  
  const handleNotificationPress = () => {
    // TODO: Implement notifications view
    setShowNotifications(!showNotifications);
  };

  const handleWeeklyDetailsPress = () => {
    // TODO: Navigate to weekly details screen
    setShowWeeklyDetails(!showWeeklyDetails);
  };

  const handleSeeAllApps = () => {
    // TODO: Navigate to all apps screen
  };

  const handleAppPress = (appName: string) => {
    // TODO: Navigate to app details screen
    console.log(`Opening details for ${appName}`);
  };
  const [screenTime, setScreenTime] = useState(3.2); // Hours
  const [dailyLimit, setDailyLimit] = useState(5); // Hours
  
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2.8, 3.5, 4.2, 3.1, 3.8, 2.5, 3.2],
        color: () => Colors.primary.main,
        strokeWidth: 2
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: Colors.background.primary,
    backgroundGradientTo: Colors.background.primary,
    decimalPlaces: 1,
    color: () => Colors.primary.main,
    labelColor: () => Colors.text.secondary,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary.light
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, User</Text>
            <Text style={styles.subGreeting}>Let's mindfully use our screen today</Text>
          </View>
          <TouchableOpacity 
            style={[styles.notificationButton, showNotifications && styles.activeButton]}
            onPress={handleNotificationPress}
          >
            <Bell size={24} color={showNotifications ? Colors.primary.main : Colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <MascotTip
          message="You've used your phone 15% less than yesterday. Great job!"
          type="success"
        />
        
        <View style={styles.summaryContainer}>
          <View style={styles.progressContainer}>
            <ProgressRing
              progress={screenTime / dailyLimit}
              size={120}
              strokeWidth={12}
              textStyle={styles.progressText}
            />
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressTitle}>Today</Text>
              <Text style={styles.progressValue}>{screenTime}h</Text>
              <Text style={styles.progressSubtitle}>of {dailyLimit}h limit</Text>
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Pickups</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.chartContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly Overview</Text>
            <TouchableOpacity onPress={handleWeeklyDetailsPress}>
              <Text style={[styles.seeAllText, showWeeklyDetails && styles.activeText]}>See Details</Text>
            </TouchableOpacity>
          </View>
          <LineChart
            data={chartData}
            width={Layout.window.width - 40}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        
        <View style={styles.appsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Apps Today</Text>
            <TouchableOpacity style={styles.seeAllButton} onPress={handleSeeAllApps}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={() => handleAppPress('Instagram')}>
            <UsageCard 
              appName="Instagram" 
              usageTime="1h 24m" 
              iconName="instagram"
              percentage={0.85}
              color="#E1306C"
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleAppPress('Twitter')}>
            <UsageCard 
              appName="Twitter" 
              usageTime="45m" 
              iconName="twitter"
              percentage={0.45}
              color="#1DA1F2"
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleAppPress('YouTube')}>
            <UsageCard 
              appName="YouTube" 
              usageTime="32m" 
              iconName="youtube"
              percentage={0.30}
              color="#FF0000"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  activeButton: {
    backgroundColor: Colors.primary.light,
  },
  activeText: {
    color: Colors.primary.dark,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.l,
    paddingTop: Layout.spacing.l,
    paddingBottom: Layout.spacing.m,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  subGreeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.round,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    marginHorizontal: Layout.spacing.l,
    marginTop: Layout.spacing.l,
    padding: Layout.spacing.l,
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.large,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.l,
  },
  progressTextContainer: {
    marginLeft: Layout.spacing.l,
  },
  progressTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  progressText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  progressValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.text.primary,
    marginVertical: 4,
  },
  progressSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.lighter,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.neutral.lighter,
  },
  chartContainer: {
    marginHorizontal: Layout.spacing.l,
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
  chart: {
    marginVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.large,
  },
  appsContainer: {
    marginHorizontal: Layout.spacing.l,
    marginTop: Layout.spacing.xl,
    marginBottom: 100, // Extra padding at bottom for tab bar
  },
});