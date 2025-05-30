import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import Colors from '@/constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface FocusCircleProps {
  progress: number;
  time: string;
  isActive: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
}

export default function FocusCircle({
  progress,
  time,
  isActive,
  mode,
}: FocusCircleProps) {
  const size = 250;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progressValue = useSharedValue(0);
  
  // Get color based on mode
  const getColor = () => {
    switch (mode) {
      case 'pomodoro':
        return Colors.primary.main;
      case 'shortBreak':
        return Colors.secondary.main;
      case 'longBreak':
        return Colors.accent.main;
    }
  };
  
  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 1000 });
  }, [progress]);
  
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - (circumference * progressValue.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={Colors.neutral.lighter}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={getColor()}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transformOrigin: 'center' }}
        />
      </Svg>
      
      <View style={styles.timeContainer}>
        <Text style={[
          styles.timeText,
          { color: isActive ? getColor() : Colors.text.primary }
        ]}>
          {time}
        </Text>
        <Text style={styles.statusText}>
          {isActive ? 'Running' : 'Paused'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
  },
});