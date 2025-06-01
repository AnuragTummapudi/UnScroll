declare module 'expo-blur/build/BlurView' {
  import { ComponentProps } from 'react';
  import { ViewStyle } from 'react-native';
  import { Component } from 'react';

  export interface BlurViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    style?: ViewStyle;
  }

  const BlurView: React.ComponentType<BlurViewProps>;
  export default BlurView;
}

declare module 'expo-blur' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';

  export interface BlurViewProps {
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    style?: ViewStyle;
  }

  export const BlurView: ComponentType<BlurViewProps>;
}
