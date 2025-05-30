import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface TimeSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export default function TimeSelector({
  value,
  onValueChange,
  min,
  max,
  step = 1,
}: TimeSelectorProps) {
  const trackWidth = 300;
  const thumbSize = 24;
  
  const calculatePosition = (val: number) => {
    return ((val - min) / (max - min)) * (trackWidth - thumbSize);
  };
  
  const translateX = useSharedValue(calculatePosition(value));
  
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      let newX = e.translationX + translateX.value;
      // Constrain to the track
      newX = Math.max(0, Math.min(newX, trackWidth - thumbSize));
      translateX.value = newX;
      
      // Calculate the new value
      const newValue = min + (newX / (trackWidth - thumbSize)) * (max - min);
      // Round to the nearest step
      const steppedValue = Math.round(newValue / step) * step;
      onValueChange(steppedValue);
    })
    .onEnd(() => {
      // Spring animation when releasing
      translateX.value = withSpring(calculatePosition(value));
    });
  
  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  
  const activeTrackStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value + thumbSize / 2,
    };
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.activeTrack, activeTrackStyle]} />
      </View>
      
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: Colors.neutral.lighter,
    borderRadius: 3,
  },
  activeTrack: {
    height: 6,
    backgroundColor: Colors.primary.main,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary.main,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});