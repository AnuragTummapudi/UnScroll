import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Pulse animation for the badge
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Subtle rotation animation
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    
    if (streak > 0) {
      pulseAnimation.start();
      rotateAnimation.start();
    }
    
    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, [streak]);
  
  // Handle press to show tooltip
  const handlePress = () => {
    router.push({
      pathname: '/(modals)/streak-milestone',
      params: { milestone: streak },
    });
  };
  
  // Rotate interpolation for the flame icon
  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg'],
  });
  
  if (streak === 0) {
    return null;
  }
  
  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.glass.background,
          borderColor: theme.colors.glass.border,
        }
      ]}>
        <Animated.Text 
          style={[
            styles.emoji,
            {
              transform: [
                { scale: scaleAnim },
                { rotate },
              ],
            },
          ]}
        >
          🔥
        </Animated.Text>
        <Text style={[styles.count, { color: theme.colors.accent }]}>
          {streak}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 20,
    marginRight: 4,
  },
  count: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
      default: 'System',
    }),
    fontSize: 16,
  },
});