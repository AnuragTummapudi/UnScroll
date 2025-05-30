import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Bell, Clock, UserMinus2, ShieldCheck, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import SettingItem from '@/components/settings/SettingItem';
import TimeSelector from '@/components/settings/TimeSelector';

export default function SettingsScreen() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [timeTaxEnabled, setTimeTaxEnabled] = useState(true);

  const handleAppLimits = () => {
    // TODO: Navigate to app limits screen
  };

  const handleDowntime = () => {
    // TODO: Navigate to downtime settings
  };

  const handleReminderFrequency = () => {
    // TODO: Navigate to reminder settings
  };

  const handleBlockedApps = () => {
    // TODO: Navigate to blocked apps settings
  };

  const handleAutoStartSchedule = () => {
    // TODO: Navigate to auto-start settings
  };

  const handleTaxRate = () => {
    // TODO: Navigate to tax rate settings
  };

  const handleSyncSettings = () => {
    // TODO: Implement settings sync
  };

  const handlePrivacySettings = () => {
    // TODO: Navigate to privacy settings
  };

  const handleAbout = () => {
    // TODO: Show about dialog
  };

  const handleResetSettings = () => {
    if (showResetConfirm) {
      // TODO: Implement settings reset
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
    }
  };
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(5); // Hours
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Settings</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Limits</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingHeader}>
              <Text style={styles.settingTitle}>Daily Screen Time Limit</Text>
              <Text style={styles.settingValue}>{dailyLimit} hours</Text>
            </View>
            
            <TimeSelector
              value={dailyLimit}
              onValueChange={setDailyLimit}
              min={1}
              max={12}
              step={0.5}
            />
          </View>
          
          <SettingItem
            icon={<Clock size={24} color={Colors.primary.main} />}
            title="App-specific Limits"
            subtitle="Set limits for individual apps"
            showArrow
            onPress={handleAppLimits}
          />
          
          <SettingItem
            icon={<UserMinus2 size={24} color={Colors.secondary.main} />}
            title="Downtime"
            subtitle="Schedule time away from the screen"
            showArrow
            onPress={handleDowntime}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingItem
            icon={<Bell size={24} color={Colors.warning.main} />}
            title="Notifications"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.neutral.light, true: Colors.primary.light }}
                thumbColor={notificationsEnabled ? Colors.primary.main : Colors.neutral.white}
              />
            }
          />
          
          <SettingItem
            icon={<Zap size={24} color={Colors.accent.main} />}
            title="Reminder Frequency"
            subtitle="When you approach your limits"
            showArrow
            onPress={handleReminderFrequency}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus Mode</Text>
          
          <SettingItem
            icon={<ShieldCheck size={24} color={Colors.secondary.main} />}
            title="Focus Mode"
            subtitle="Block distracting apps during focus time"
            rightElement={
              <Switch
                value={focusModeEnabled}
                onValueChange={setFocusModeEnabled}
                trackColor={{ false: Colors.neutral.light, true: Colors.secondary.light }}
                thumbColor={focusModeEnabled ? Colors.secondary.main : Colors.neutral.white}
              />
            }
          />
          
          <SettingItem
            title="Apps to block"
            subtitle="Select apps to block during focus mode"
            showArrow
            onPress={handleBlockedApps}
          />
          
          <SettingItem
            title="Auto-start schedule"
            subtitle="Automatically enable focus mode"
            showArrow
            onPress={handleAutoStartSchedule}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Tax System</Text>
          
          <SettingItem
            title="Enable Time Tax"
            subtitle="Add friction to excessive app usage"
            rightElement={
              <Switch
                value={timeTaxEnabled}
                onValueChange={setTimeTaxEnabled}
                trackColor={{ false: Colors.neutral.light, true: Colors.error.light }}
                thumbColor={Colors.error.main}
              />
            }
          />
          
          <SettingItem
            title="Tax Rate"
            subtitle="How much delay to add for overuse"
            showArrow
            onPress={handleTaxRate}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <SettingItem
            title="Sync Settings"
            subtitle="Sync your settings across devices"
            showArrow
            onPress={handleSyncSettings}
          />
          
          <SettingItem
            title="Privacy Settings"
            subtitle="Manage your data and privacy"
            showArrow
            onPress={handlePrivacySettings}
          />
          
          <SettingItem
            title="About UnScroll"
            subtitle="Version 1.0.0"
            showArrow
            onPress={handleAbout}
          />
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleResetSettings}>
            <Text style={[styles.resetText, showResetConfirm && styles.resetConfirmText]}>
              {showResetConfirm ? 'Tap again to confirm reset' : 'Reset All Settings'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resetConfirmText: {
    color: Colors.error.dark,
    fontFamily: 'Inter-Bold',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.l,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  section: {
    marginTop: Layout.spacing.xl,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.m,
  },
  settingCard: {
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
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  settingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  settingValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary.main,
  },
  footer: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
    marginBottom: 100, // Space for tab bar
  },
  resetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.error.main,
  },
});