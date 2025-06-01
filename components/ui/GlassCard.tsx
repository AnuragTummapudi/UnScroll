import React from 'react';
import { View, StyleSheet, ViewProps, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { Platform } from 'react-native';

interface GlassCardProps extends ViewProps {
  style?: ViewStyle;
  children: React.ReactNode;
  intensity?: number;
}

export function GlassCard({ style, children, intensity = 20, ...props }: GlassCardProps) {
  const theme = useTheme();
  
  // On web, we can't use BlurView, so we use a regular View
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }
  
  // On native, we can use BlurView for the glassmorphism effect
  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.colors.glass.border },
        style,
      ]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
});