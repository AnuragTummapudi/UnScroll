import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Layout from '@/constants/Layout';
import MascotTip from '@/components/common/MascotTip';
import FocusTask from '@/components/focus/FocusTask';
import FocusCircle from '@/components/focus/FocusCircle';

const POMODORO_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds

type FocusMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function FocusScreen() {
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isActive, setIsActive] = useState(false);
  const [currentMode, setCurrentMode] = useState<FocusMode>('pomodoro');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  const [newTaskText, setNewTaskText] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Complete project report', completed: false },
    { id: '2', title: 'Respond to emails', completed: false },
    { id: '3', title: 'Plan tomorrow\'s meetings', completed: false },
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      if (currentMode === 'pomodoro') {
        setCompletedPomodoros(completedPomodoros + 1);
        
        // After 4 pomodoros, take a long break
        if ((completedPomodoros + 1) % 4 === 0) {
          setCurrentMode('longBreak');
          setTimeLeft(LONG_BREAK);
        } else {
          setCurrentMode('shortBreak');
          setTimeLeft(SHORT_BREAK);
        }
      } else {
        // Break is over, back to pomodoro
        setCurrentMode('pomodoro');
        setTimeLeft(POMODORO_TIME);
      }
      
      setIsActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, currentMode, completedPomodoros]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getTimerTitle = () => {
    switch (currentMode) {
      case 'pomodoro':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
    }
  };
  
  const getProgress = () => {
    switch (currentMode) {
      case 'pomodoro':
        return 1 - timeLeft / POMODORO_TIME;
      case 'shortBreak':
        return 1 - timeLeft / SHORT_BREAK;
      case 'longBreak':
        return 1 - timeLeft / LONG_BREAK;
    }
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    if (isActive) {
      // Show confirmation dialog before resetting active timer
      if (!window.confirm('Timer is still running. Are you sure you want to reset?')) {
        return;
      }
    }
    setIsActive(false);
    switch (currentMode) {
      case 'pomodoro':
        setTimeLeft(POMODORO_TIME);
        break;
      case 'shortBreak':
        setTimeLeft(SHORT_BREAK);
        break;
      case 'longBreak':
        setTimeLeft(LONG_BREAK);
        break;
    }
  };
  
  const addNewTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: (tasks.length + 1).toString(),
          title: newTaskText.trim(),
          completed: false
        }
      ]);
      setNewTaskText('');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Focus Mode</Text>
      
      <MascotTip 
        message={isActive 
          ? "You're doing great! Stay focused." 
          : "Ready to start a focused work session?"}
        type="info"
      />
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerTitle}>{getTimerTitle()}</Text>
        
        <FocusCircle
          progress={getProgress()}
          time={formatTime(timeLeft)}
          isActive={isActive}
          mode={currentMode}
        />
        
        <View style={styles.sessionInfo}>
          <Text style={styles.sessionText}>
            Session: {completedPomodoros + 1} / 4
          </Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.resetButton]} 
            onPress={resetTimer}
          >
            <RotateCcw size={24} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.controlButton, styles.mainButton]} 
            onPress={toggleTimer}
          >
            {isActive ? (
              <Pause size={28} color={Colors.neutral.white} />
            ) : (
              <Play size={28} color={Colors.neutral.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.modeSelectionContainer}>
        <TouchableOpacity 
          style={[
            styles.modeButton, 
            currentMode === 'pomodoro' && styles.activeModeButton
          ]}
          onPress={() => {
            setCurrentMode('pomodoro');
            setTimeLeft(POMODORO_TIME);
            setIsActive(false);
          }}
        >
          <Text style={[
            styles.modeButtonText, 
            currentMode === 'pomodoro' && styles.activeModeText
          ]}>
            Pomodoro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.modeButton, 
            currentMode === 'shortBreak' && styles.activeModeButton
          ]}
          onPress={() => {
            setCurrentMode('shortBreak');
            setTimeLeft(SHORT_BREAK);
            setIsActive(false);
          }}
        >
          <Text style={[
            styles.modeButtonText, 
            currentMode === 'shortBreak' && styles.activeModeText
          ]}>
            Short Break
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.modeButton, 
            currentMode === 'longBreak' && styles.activeModeButton
          ]}
          onPress={() => {
            setCurrentMode('longBreak');
            setTimeLeft(LONG_BREAK);
            setIsActive(false);
          }}
        >
          <Text style={[
            styles.modeButtonText, 
            currentMode === 'longBreak' && styles.activeModeText
          ]}>
            Long Break
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tasksContainer}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>Focus Tasks</Text>
          <TouchableOpacity 
            style={styles.addTaskButton}
            onPress={addNewTask}
          >
            <Text style={styles.addTaskButtonText}>+ Add Task</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.taskInput}
          value={newTaskText}
          onChangeText={setNewTaskText}
          placeholder="Enter new task"
          placeholderTextColor={Colors.text.secondary}
          onSubmitEditing={addNewTask}
        />
        
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FocusTask
              task={item}
              onToggleComplete={() => toggleTaskCompletion(item.id)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.tasksList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  addTaskButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.medium,
  },
  addTaskButtonText: {
    color: Colors.neutral.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  taskInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    color: Colors.text.primary,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.l,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginTop: Layout.spacing.l,
    marginBottom: Layout.spacing.m,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: Layout.spacing.l,
  },
  timerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.m,
  },
  sessionInfo: {
    marginTop: Layout.spacing.m,
  },
  sessionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.secondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.xl,
  },
  controlButton: {
    borderRadius: Layout.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.background.secondary,
    marginRight: Layout.spacing.l,
  },
  mainButton: {
    width: 72,
    height: 72,
    backgroundColor: Colors.primary.main,
  },
  modeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.xl,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.xs,
  },
  modeButton: {
    flex: 1,
    paddingVertical: Layout.spacing.s,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.medium,
  },
  activeModeButton: {
    backgroundColor: Colors.neutral.white,
  },
  modeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeModeText: {
    color: Colors.primary.main,
  },
  tasksContainer: {
    flex: 1,
    marginTop: Layout.spacing.xl,
    marginBottom: 70, // Space for tab bar
  },
  tasksTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.m,
  },
  tasksList: {
    flex: 1,
  },
});