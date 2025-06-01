import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CustomTextInputProps extends TextInputProps {
  containerStyle?: ViewStyle;
}

export function TextInput({ style, containerStyle, ...props }: CustomTextInputProps) {
  const theme = useTheme();
  
  return (
    <RNTextInput
      style={[
        styles.input,
        { 
          color: theme.colors.text.primary,
          backgroundColor: theme.colors.background.elevation,
          borderColor: theme.colors.border,
        },
        style,
      ]}
      placeholderTextColor={theme.colors.text.tertiary}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});