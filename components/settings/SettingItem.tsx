import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';

interface SettingItemProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  showArrow?: boolean;
  rightElement?: ReactNode;
  onPress?: () => void;
}

export default function SettingItem({
  icon,
  title,
  subtitle,
  showArrow = false,
  rightElement,
  onPress,
}: SettingItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.leftContainer}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.rightContainer}>
        {rightElement}
        {showArrow && <ChevronRight size={20} color={Colors.text.secondary} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: Layout.spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text.primary,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});