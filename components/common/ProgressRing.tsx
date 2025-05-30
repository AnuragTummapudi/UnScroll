import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import Colors from '@/constants/Colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  textStyle?: object;
  color?: string;
  backgroundColor?: string;
}

export default function ProgressRing({
  progress,
  size,
  strokeWidth,
  textStyle,
  color = Colors.primary.main,
  backgroundColor = Colors.neutral.lighter,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progressValue = useSharedValue(0);
  
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
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={backgroundColor}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transformOrigin: 'center' }}
        />
      </Svg>
    </View>
  );
}