import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps, 
  ViewStyle, 
  TextStyle,
  View
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  title, 
  variant = 'solid', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  style, 
  textStyle, 
  ...props 
}: ButtonProps) {
  const theme = useTheme();
  
  // Base button styles
  const buttonStyles: ViewStyle = {
    backgroundColor: 
      variant === 'solid' 
        ? theme.colors.primary 
        : variant === 'outline'
          ? 'transparent'
          : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: variant === 'outline' ? theme.colors.primary : undefined,
    paddingVertical: 
      size === 'sm' ? 8 : 
      size === 'md' ? 12 : 16,
    paddingHorizontal: 
      size === 'sm' ? 12 : 
      size === 'md' ? 16 : 24,
  };
  
  // Text styles
  const textStyles: TextStyle = {
    color: 
      variant === 'solid' 
        ? '#fff' 
        : theme.colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 
      size === 'sm' ? 14 : 
      size === 'md' ? 16 : 18,
  };
  
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles, style]}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconLeft}>{icon}</View>
        )}
        <Text style={[styles.text, textStyles, textStyle]}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});