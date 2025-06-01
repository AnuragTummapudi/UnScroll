import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const theme = useTheme();
  const { updateUser } = useContext(AppContext);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Animation for smooth transition
  const [fadeAnim] = useState(new Animated.Value(1));

  // Dummy sign in logic
  const handleSignIn = () => {
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    // Simulate sign in
    updateUser({ username, displayName: username, email: `${username}@example.com` });
    // Smooth fade out before navigating
    setError('');
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/');
    });
  };

  return (
    <LinearGradient
      colors={[theme.colors.primaryDark, theme.colors.background.primary]}
      style={styles.gradient}
    >
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
            />
            <Text style={[styles.title, { color: theme.colors.primary }]}>UnScroll</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              Mindful Digital Living
            </Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={theme.colors.text.tertiary}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.text.tertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text> : null}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              style={{ marginTop: 16, backgroundColor: theme.colors.primary }}
            />
          </View>
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity>
              <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  form: {
    backgroundColor: 'rgba(30,41,59,0.7)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(51,65,85,0.7)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#F1F5F9',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  error: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 4,
  },
});
