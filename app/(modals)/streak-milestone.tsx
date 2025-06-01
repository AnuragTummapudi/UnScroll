import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import { X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StreakMilestoneModal() {
  const theme = useTheme();
  const params = useLocalSearchParams();
  const milestone = Number(params.milestone || 0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Confetti animation logic would go here in a real app
  
  useEffect(() => {
    // Start the entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Start the looped rotation animation separately
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  // Close the modal
  const handleClose = () => {
    // Animate out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };
  
  // Get appropriate celebration text based on milestone
  const getCelebrationText = () => {
    switch (milestone) {
      case 3:
        return "You're building a great habit!";
      case 7:
        return "A full week! You're on fire!";
      case 14:
        return "Two weeks strong! Impressive discipline!";
      case 30:
        return "A month of mindfulness! You're a digital wellness master!";
      default:
        return "Incredible achievement!";
    }
  };
  
  // Rotate interpolation for the flame icon
  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-10deg', '0deg', '10deg'],
  });
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(79, 70, 229, 0.6)', 'rgba(139, 92, 246, 0.6)']}
        style={StyleSheet.absoluteFill}
      />
      
      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={handleClose}
      >
        <X size={24} color={theme.colors.text.primary} />
      </TouchableOpacity>
      
      <Animated.View 
        style={[
          styles.card,
          { 
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Animated.Text 
          style={[
            styles.emoji,
            { transform: [{ rotate }] },
          ]}
        >
          🔥
        </Animated.Text>
        
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          {milestone}-Day Streak!
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {getCelebrationText()}
        </Text>
        
        <View style={[styles.statsCard, { backgroundColor: theme.colors.background.secondary }]}>
          <Text style={[styles.statsTitle, { color: theme.colors.text.primary }]}>
            Your Progress
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {milestone}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Days
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.accent }]}>
                {milestone * 25}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Minutes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.secondary }]}>
                {milestone * 20}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                Improvement
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleClose}
        >
          <Text style={styles.continueText}>Continue My Journey</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 350,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
      default: 'System',
    }),
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  statsCard: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'System',
    }),
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-bold',
      default: 'System',
    }),
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
    fontSize: 12,
  },
  continueButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif-medium',
      default: 'System',
    }),
    fontSize: 16,
    color: '#fff',
  },
});