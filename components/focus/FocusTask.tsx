import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface FocusTaskProps {
  task: Task;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export default function FocusTask({ task, onToggleComplete, onDelete }: FocusTaskProps) {
  const checkScale = useSharedValue(task.completed ? 1 : 0);
  const textOpacity = useSharedValue(task.completed ? 0.5 : 1);
  
  const checkAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkScale.value }],
      opacity: checkScale.value,
    };
  });
  
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      textDecorationLine: textOpacity.value < 1 ? 'line-through' as const : 'none' as const,
    };
  });
  
  const handleToggle = () => {
    checkScale.value = withTiming(task.completed ? 0 : 1, { duration: 200 });
    textOpacity.value = withTiming(task.completed ? 1 : 0.5, { duration: 200 });
    onToggleComplete();
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <TouchableOpacity 
        style={[
          styles.checkbox,
          task.completed && styles.checkboxCompleted
        ]}
        onPress={handleToggle}
      >
        <Animated.View style={checkAnimatedStyle}>
          <Check size={16} color={Colors.neutral.white} />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.Text style={[styles.taskTitle, textAnimatedStyle]}>
        {task.title}
      </Animated.Text>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={16} color={Colors.error.main} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginLeft: Layout.spacing.m,
    opacity: 0.7,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: Colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: Layout.borderRadius.small,
    borderWidth: 2,
    borderColor: Colors.primary.main,
    marginRight: Layout.spacing.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary.main,
  },
  taskTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
});