import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { AppContext } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Clock, Pause, Play, RotateCcw, Check, Brain, Pencil } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function FocusScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { completeActivity } = useContext(AppContext);
  const params = useLocalSearchParams();
  // Set mode from params only on mount, then control via state
  const [mode, setMode] = useState<'focus' | 'breathing'>(
    params.mode === 'breathing' ? 'breathing' : 'focus'
  );

  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Focus timer settings
  const [focusMinutes, setFocusMinutes] = useState(25);
  // Breathing timer settings
  const [inhaleTime, setInhaleTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(6);

  // Edit modal state
  const [showEdit, setShowEdit] = useState(false);
  const [editTab, setEditTab] = useState<'focus' | 'breathing'>(mode); // sync with current mode
  const [editFocusMinutes, setEditFocusMinutes] = useState(focusMinutes.toString());
  const [editInhale, setEditInhale] = useState(inhaleTime.toString());
  const [editExhale, setEditExhale] = useState(exhaleTime.toString());

  // Focus timer
  const [timeLeft, setTimeLeft] = useState(mode === 'focus' ? focusMinutes * 60 : inhaleTime + exhaleTime);
  const totalTime = mode === 'focus' ? focusMinutes * 60 : inhaleTime + exhaleTime;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Breathing animation
  const breathAnim = useRef(new Animated.Value(1)).current;
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer completion
  const handleComplete = () => {
    setIsRunning(false);
    setCompleted(true);
    completeActivity(mode);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Timer effect for focus mode
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    let interval: ReturnType<typeof setInterval> | null = null;
    if (mode === 'focus' && isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval!);
            handleComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isPaused, timeLeft, mode]);

  // Breathing animation logic
  useEffect(() => {
    if (mode !== 'breathing' || !isRunning || isPaused) return;
    let isMounted = true;

    const runBreathCycle = () => {
      if (!isMounted) return;
      setBreathPhase('inhale');
      Animated.timing(breathAnim, {
        toValue: 1.2,
        duration: inhaleTime * 1000,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted) return;
        setBreathPhase('exhale');
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: exhaleTime * 1000,
          useNativeDriver: true,
        }).start(() => {
          if (!isMounted) return;
          runBreathCycle();
        });
      });
    };

    runBreathCycle();

    return () => {
      isMounted = false;
      breathAnim.stopAnimation();
    };
    // eslint-disable-next-line
  }, [isRunning, isPaused, inhaleTime, exhaleTime, mode]);

  // Start timer
  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setCompleted(false);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Resume timer
  const resumeTimer = () => {
    setIsPaused(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCompleted(false);
    setTimeLeft(mode === 'focus' ? focusMinutes * 60 : inhaleTime + exhaleTime);
    setBreathPhase('inhale');
    breathAnim.setValue(1);
  };

  // Calculate progress percentage (focus mode)
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Save edited times
  const saveEdit = () => {
    if (editTab === 'focus') {
      const mins = parseInt(editFocusMinutes, 10);
      if (isNaN(mins) || mins < 1) {
        Alert.alert('Invalid Input', 'Please enter a valid number of minutes.');
        return;
      }
      setFocusMinutes(mins);
      if (mode === 'focus') setTimeLeft(mins * 60);
    } else {
      const inh = parseInt(editInhale, 10);
      const exh = parseInt(editExhale, 10);
      if (isNaN(inh) || isNaN(exh) || inh < 1 || exh < 1) {
        Alert.alert('Invalid Input', 'Please enter valid times (seconds).');
        return;
      }
      setInhaleTime(inh);
      setExhaleTime(exh);
      if (mode === 'breathing') setTimeLeft(inh + exh);
    }
    setShowEdit(false);
    resetTimer();
  };

  // Update editTab when mode changes (for better UX)
  useEffect(() => {
    setEditTab(mode);
  }, [mode]);

  // Handle mode change and highlight
  const handleModeChange = (newMode: 'focus' | 'breathing') => {
    if (mode !== newMode) {
      setMode(newMode);
      resetTimer();
    }
  };

  // Heading and instruction text
  const heading = mode === 'focus' ? 'Focus Timer' : 'Breathing Exercise';
  const instructionText =
    mode === 'focus'
      ? `Find a quiet place and focus on one task for the entire session.`
      : `Breathe in for ${inhaleTime}s, then exhale for ${exhaleTime}s.`;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          mode === 'focus' ? theme.colors.primaryDark : theme.colors.secondaryDark,
          theme.colors.background.primary
        ]}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} // Increased bottom padding for nav bar
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {heading}
          </Text>

          {/* Timer UI */}
          {mode === 'focus' ? (
            <View style={styles.timerContainer}>
              <AnimatedCircularProgress
                size={280}
                width={15}
                fill={progress}
                tintColor={theme.colors.primary}
                backgroundColor={theme.colors.glass.background}
                rotation={0}
                lineCap="round"
              >
                {() => (
                  <View style={styles.timerContent}>
                    {!completed ? (
                      <>
                        <Text style={[styles.timerText, { color: theme.colors.text.primary }]}>
                          {formatTime(timeLeft)}
                        </Text>
                        <Text style={[styles.timerLabel, { color: theme.colors.text.secondary }]}>
                          {isRunning && !isPaused
                            ? 'In progress...'
                            : isPaused
                              ? 'Paused'
                              : 'Ready?'}
                        </Text>
                      </>
                    ) : (
                      <>
                        <View style={styles.completedIcon}>
                          <Check size={48} color={theme.colors.success} />
                        </View>
                        <Text style={[styles.completedText, { color: theme.colors.text.primary }]}>
                          Great job!
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>
          ) : (
            <View style={styles.breathingContainer}>
              <Animated.View
                style={[
                  styles.breathingCircle,
                  {
                    backgroundColor: '#fff', // White circle for high contrast
                    opacity: 0.8,
                    transform: [{ scale: breathAnim }]
                  }
                ]}
              />
              <View style={styles.breathingTextContainer}>
                <Text style={[styles.breathingText, { color: '#1E293B' /* dark gray */ }]}>
                  {breathPhase === 'inhale' ? 'Inhale' : 'Exhale'}
                </Text>
              </View>
            </View>
          )}

          {/* Controls */}
          <GlassCard style={styles.controlsCard}>
            <Text style={[styles.instructionText, { color: theme.colors.text.secondary }]}>
              {instructionText}
            </Text>
            <View style={styles.controlsContainer}>
              {!isRunning && !completed && (
                <Button
                  icon={<Play size={24} color="#fff" />}
                  title="Start"
                  onPress={startTimer}
                  style={{ backgroundColor: mode === 'focus' ? theme.colors.primary : theme.colors.secondary }}
                />
              )}
              {isRunning && !isPaused && (
                <Button
                  icon={<Pause size={24} color="#fff" />}
                  title="Pause"
                  onPress={pauseTimer}
                  style={{ backgroundColor: theme.colors.warningDark }}
                />
              )}
              {isPaused && (
                <View style={styles.pausedControls}>
                  <Button
                    icon={<Play size={24} color="#fff" />}
                    title="Resume"
                    onPress={resumeTimer}
                    style={{ flex: 1, backgroundColor: theme.colors.successDark, marginRight: 12 }}
                  />
                  <Button
                    icon={<RotateCcw size={24} color="#fff" />}
                    title="Reset"
                    onPress={resetTimer}
                    style={{ flex: 1, backgroundColor: theme.colors.error }}
                  />
                </View>
              )}
              {completed && (
                <Button
                  icon={<RotateCcw size={24} color="#fff" />}
                  title="Start Again"
                  onPress={resetTimer}
                  style={{ backgroundColor: mode === 'focus' ? theme.colors.primary : theme.colors.secondary }}
                />
              )}
            </View>
          </GlassCard>

          {/* Mode Selector & Edit */}
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'focus' && styles.activeMode,
                { borderColor: mode === 'focus' ? theme.colors.primary : theme.colors.secondary }
              ]}
              onPress={() => handleModeChange('focus')}
            >
              <Clock
                size={24}
                color={mode === 'focus' ? theme.colors.primary : theme.colors.text.secondary}
              />
              <Text
                style={[
                  styles.modeText,
                  { color: mode === 'focus' ? theme.colors.primary : theme.colors.text.secondary }
                ]}
              >
                Focus
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'breathing' && styles.activeMode,
                { borderColor: mode === 'breathing' ? theme.colors.secondary : theme.colors.secondary }
              ]}
              onPress={() => handleModeChange('breathing')}
            >
              <Brain
                size={24}
                color={mode === 'breathing' ? theme.colors.secondary : theme.colors.text.secondary}
              />
              <Text
                style={[
                  styles.modeText,
                  { color: mode === 'breathing' ? theme.colors.secondary : theme.colors.text.secondary }
                ]}
              >
                Breathing
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                { borderColor: theme.colors.accent, flexDirection: 'row', alignItems: 'center' }
              ]}
              onPress={() => setShowEdit(true)}
            >
              <Pencil size={24} color={theme.colors.accent} />
              <Text style={[styles.modeText, { color: theme.colors.accent }]}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Edit Modal */}
          {showEdit && (
            <View style={styles.editModal}>
              <View style={[styles.editCard, { backgroundColor: theme.colors.background.secondary }]}>
                <View style={styles.editTabRow}>
                  <TouchableOpacity
                    style={[
                      styles.editTab,
                      editTab === 'focus' && { backgroundColor: theme.colors.primary, borderRadius: 8 }
                    ]}
                    onPress={() => setEditTab('focus')}
                  >
                    <Text style={[
                      styles.editTabText,
                      { color: editTab === 'focus' ? '#fff' : theme.colors.text.primary }
                    ]}>Focus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.editTab,
                      editTab === 'breathing' && { backgroundColor: theme.colors.secondary, borderRadius: 8 }
                    ]}
                    onPress={() => setEditTab('breathing')}
                  >
                    <Text style={[
                      styles.editTabText,
                      { color: editTab === 'breathing' ? '#fff' : theme.colors.text.primary }
                    ]}>Breathing</Text>
                  </TouchableOpacity>
                </View>
                {editTab === 'focus' ? (
                  <View style={styles.editRow}>
                    <Text style={[styles.editLabel, { color: theme.colors.text.secondary }]}>Minutes:</Text>
                    <TextInput
                      style={[styles.editInput, { color: theme.colors.text.primary, borderColor: theme.colors.primary }]}
                      keyboardType="numeric"
                      value={editFocusMinutes}
                      onChangeText={setEditFocusMinutes}
                    />
                  </View>
                ) : (
                  <>
                    <View style={styles.editRow}>
                      <Text style={[styles.editLabel, { color: theme.colors.text.secondary }]}>Inhale (s):</Text>
                      <TextInput
                        style={[styles.editInput, { color: theme.colors.text.primary, borderColor: theme.colors.primary }]}
                        keyboardType="numeric"
                        value={editInhale}
                        onChangeText={setEditInhale}
                      />
                    </View>
                    <View style={styles.editRow}>
                      <Text style={[styles.editLabel, { color: theme.colors.text.secondary }]}>Exhale (s):</Text>
                      <TextInput
                        style={[styles.editInput, { color: theme.colors.text.primary, borderColor: theme.colors.secondary }]}
                        keyboardType="numeric"
                        value={editExhale}
                        onChangeText={setEditExhale}
                      />
                    </View>
                  </>
                )}
                <View style={styles.editButtons}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => setShowEdit(false)}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Save"
                    onPress={saveEdit}
                    style={{ flex: 1, backgroundColor: theme.colors.primary }}
                  />
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60, // Move up from 60 to 32
    paddingBottom: 20, // Move up from 80 to 32
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
  },
  timerLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 8,
  },
  completedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  completedText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  controlsCard: {
    padding: 20,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  controlsContainer: {
    alignItems: 'center',
  },
  pausedControls: {
    flexDirection: 'row',
    width: '100%',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeMode: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    marginBottom: 24,
  },
  breathingCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  breathingTextContainer: {
    position: 'absolute',
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    textAlign: 'center',
  },
  editModal: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  editCard: {
    width: 300,
    borderRadius: 16,
    padding: 24,
    alignItems: 'stretch',
  },
  editTabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'rgba(30,41,59,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  editTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editTabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  editLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: 80,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 8,
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
});