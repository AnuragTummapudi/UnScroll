import { Tabs } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { BarChart2, Clock, Settings, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';

// Define the tab bar theme colors
const ACTIVE_COLOR = '#3E64FF';
const INACTIVE_COLOR = '#9E9E9E';
const TAB_BAR_BG = 'rgba(255, 255, 255, 0.95)';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarLabelStyle: styles.tabLabel,
        tabBarBackground: Platform.OS !== 'web' ? () => (
          <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
        ) : undefined,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: 'Focus',
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    backgroundColor: TAB_BAR_BG,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});