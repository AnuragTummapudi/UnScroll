import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface MascotTipProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
}

export default function MascotTip({ message, type = 'info' }: MascotTipProps) {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  
  // Get background color based on type
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.success.light;
      case 'warning':
        return Colors.warning.light;
      case 'info':
      default:
        return Colors.primary.light;
    }
  };
  
  // Get text color based on type
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return Colors.success.dark;
      case 'warning':
        return Colors.warning.dark;
      case 'info':
      default:
        return Colors.primary.dark;
    }
  };
  
  // Get mascot image based on type
  const getMascotImage = () => {
    switch (type) {
      case 'success':
        return 'https://images.pexels.com/photos/7473052/pexels-photo-7473052.jpeg?auto=compress&cs=tinysrgb&w=200';
      case 'warning':
        return 'https://images.pexels.com/photos/7473047/pexels-photo-7473047.jpeg?auto=compress&cs=tinysrgb&w=200';
      case 'info':
      default:
        return 'https://images.pexels.com/photos/7473084/pexels-photo-7473084.jpeg?auto=compress&cs=tinysrgb&w=200';
    }
  };
  
  useEffect(() => {
    // Animate entrance
    translateY.value = withSequence(
      withSpring(0, { damping: 12 }),
      withDelay(
        4000, // Display for 4 seconds
        withSpring(20, { damping: 12 })
      )
    );
    
    opacity.value = withSequence(
      withSpring(1),
      withDelay(
        4000, // Display for 4 seconds
        withSpring(0)
      )
    );
  }, [message]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: getBackgroundColor() },
        animatedStyle
      ]}
    >
      <Image 
        source={{ uri: getMascotImage() }}
        style={styles.mascotImage} 
      />
      <Text style={[styles.message, { color: getTextColor() }]}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.l,
    marginVertical: Layout.spacing.m,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.large,
  },
  mascotImage: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.round,
    marginRight: Layout.spacing.m,
  },
  message: {
    flex: 1,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
});