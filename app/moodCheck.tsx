import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
// Replace Lucide icons with Expo vector icons
import { MaterialCommunityIcons, Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MOODS = [
  { label: 'Happy', icon: <Feather name="smile" size={32} color="#22d3ee" />, value: 'happy', color: '#22d3ee' },
  { label: 'Neutral', icon: <Feather name="meh" size={32} color="#fbbf24" />, value: 'neutral', color: '#fbbf24' },
  { label: 'Sad', icon: <Feather name="frown" size={32} color="#f87171" />, value: 'sad', color: '#f87171' },
];

export default function MoodCheckScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(null);
  const [history, setHistory] = useState<{ date: string; mood: string }[]>([]);

  // Load mood history from localStorage on mount
  useEffect(() => {
    try {
      const stored = globalThis?.localStorage?.getItem?.('moodHistory');
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  // Save mood history to localStorage on change
  useEffect(() => {
    try {
      globalThis?.localStorage?.setItem?.('moodHistory', JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleSubmit = () => {
    if (!mood) return;
    const today = new Date().toLocaleDateString();
    // Remove previous entry for today if exists
    const filtered = history.filter(entry => entry.date !== today);
    const newHistory = [{ date: today, mood }, ...filtered];
    setHistory(newHistory);
    setMood(null);
  };

  // Calculate stats
  const moodCounts = history.reduce(
    (acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Feather name="arrow-left" size={24} color={theme.colors.text.primary} />
        <Text style={[styles.backText, { color: theme.colors.text.primary }]}>Back</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Mood Check</Text>
        <GlassCard style={styles.card}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>
            How are you feeling today?
          </Text>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[
                  styles.moodButton,
                  mood === m.value && { backgroundColor: m.color + '33' },
                ]}
                onPress={() => setMood(m.value)}
                activeOpacity={0.8}
              >
                {m.icon}
                <Text style={[styles.moodLabel, { color: theme.colors.text.primary }]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title="Save Mood"
            onPress={handleSubmit}
            disabled={!mood}
            style={{
              marginTop: 16,
              backgroundColor: mood ? theme.colors.primary : theme.colors.background.elevation,
            }}
          />
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Mood Stats</Text>
        <GlassCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            {MOODS.map((m) => (
              <View key={m.value} style={styles.statItem}>
                {m.icon}
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {moodCounts[m.value] || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                  {m.label}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.historyHeader}>
            <MaterialCommunityIcons name="chart-bar" size={20} color={theme.colors.primary} />
            <Text style={[styles.historyTitle, { color: theme.colors.text.primary }]}>Recent Entries</Text>
          </View>
          {history.length === 0 ? (
            <Text style={[styles.noHistory, { color: theme.colors.text.tertiary }]}>
              No mood entries yet.
            </Text>
          ) : (
            history.slice(0, 7).map((entry, idx) => (
              <View
                key={idx}
                style={[
                  styles.historyItem,
                  { alignItems: 'center', minHeight: 28 }
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.historyDate,
                      { color: theme.colors.text.secondary }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {entry.date}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text
                    style={[
                      styles.historyMood,
                      {
                        color:
                          MOODS.find(m => m.value === entry.mood)?.color ||
                          theme.colors.text.primary,
                        textAlign: 'right',
                      }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {MOODS.find(m => m.value === entry.mood)?.label}
                  </Text>
                </View>
              </View>
            ))
          )}
        </GlassCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 50,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 4,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 32,
    padding: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  moodButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(30,41,59,0.2)',
    width: 90,
  },
  moodLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  statsCard: {
    padding: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginTop: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  historyTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  noHistory: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
  },
  historyDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  historyMood: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
