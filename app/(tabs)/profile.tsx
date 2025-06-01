import { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { AppContext } from '@/context/AppContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { Feather, MaterialCommunityIcons, FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, streakData, updateUser, toggleDarkMode, logout, isDarkMode } = useContext(AppContext);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  
  // Format join date
  const formattedJoinDate = new Date(user.joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };
  
  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  // Save changes
  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
  };

  // Update field
  const handleChange = (field: string, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  // Example toggle states (replace with real settings as needed)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [helpEnabled, setHelpEnabled] = useState(false);

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Profile</Text>
          {!isEditing && (
            <TouchableOpacity onPress={handleEdit}>
              <Feather name="settings" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Profile Card */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user.avatar }} 
                style={styles.avatar} 
              />
              {isEditing && (
                <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.primary }]}>
                  <Feather name="camera" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            
            {isEditing ? (
              <View style={styles.editForm}>
                <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
                  Display Name
                </Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.displayName}
                  onChangeText={(text) => handleChange('displayName', text)}
                />
                
                <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
                  Username
                </Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.username}
                  onChangeText={(text) => handleChange('username', text)}
                />
                
                <Text style={[styles.inputLabel, { color: theme.colors.text.secondary }]}>
                  Email
                </Text>
                <TextInput
                  style={styles.input}
                  value={editedUser.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                />
                
                <View style={styles.editButtons}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={handleCancel}
                    style={{ flex: 1, marginRight: 8 }}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    style={{ flex: 1, backgroundColor: theme.colors.primary }}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.profileInfo}>
                <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
                  {user.displayName}
                </Text>
                <Text style={[styles.username, { color: theme.colors.text.secondary }]}>
                  @{user.username}
                </Text>
                <Text style={[styles.joinDate, { color: theme.colors.text.tertiary }]}>
                  Member since {formattedJoinDate}
                </Text>
              </View>
            )}
          </View>
          
          {!isEditing && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {streakData.currentStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                  Current Streak
                </Text>
              </View>
              <View style={[
                styles.statDivider, 
                { backgroundColor: theme.colors.divider }
              ]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {streakData.longestStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                  Longest Streak
                </Text>
              </View>
              <View style={[
                styles.statDivider, 
                { backgroundColor: theme.colors.divider }
              ]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
                  {streakData.history.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
                  Total Active Days
                </Text>
              </View>
            </View>
          )}
        </GlassCard>
        
        {/* Settings */}
        {!isEditing && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Settings
            </Text>
            <GlassCard style={styles.settingsCard}>
              {/* Notifications Toggle */}
              <View style={styles.settingItem}>
                <Feather name="bell" size={20} color={theme.colors.text.primary} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
                    Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                    Manage your notification preferences
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: theme.colors.background.elevation, true: theme.colors.primary }}
                  thumbColor={notificationsEnabled ? theme.colors.primary : theme.colors.text.tertiary}
                  ios_backgroundColor={theme.colors.background.elevation}
                  style={styles.settingSwitch}
                />
              </View>
              {/* Dark Mode Toggle */}
              <View style={styles.settingItem}>
                <Feather name="moon" size={20} color={theme.colors.text.primary} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
                    Dark Mode
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                    Toggle dark mode on/off
                  </Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: theme.colors.background.elevation, true: theme.colors.primary }}
                  thumbColor={isDarkMode ? theme.colors.primary : theme.colors.text.tertiary}
                  ios_backgroundColor={theme.colors.background.elevation}
                  style={styles.settingSwitch}
                />
              </View>
              {/* Privacy Toggle */}
              <View style={styles.settingItem}>
                <Feather name="shield" size={20} color={theme.colors.text.primary} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
                    Privacy
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                    Manage your privacy settings
                  </Text>
                </View>
                <Switch
                  value={privacyEnabled}
                  onValueChange={setPrivacyEnabled}
                  trackColor={{ false: theme.colors.background.elevation, true: theme.colors.primary }}
                  thumbColor={privacyEnabled ? theme.colors.primary : theme.colors.text.tertiary}
                  ios_backgroundColor={theme.colors.background.elevation}
                  style={styles.settingSwitch}
                />
              </View>
              {/* Help Toggle */}
              <View style={styles.settingItem}>
                <Feather name="help-circle" size={20} color={theme.colors.text.primary} style={styles.settingIcon} />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
                    Help & Support
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                    Get assistance and send feedback
                  </Text>
                </View>
                <Switch
                  value={helpEnabled}
                  onValueChange={setHelpEnabled}
                  trackColor={{ false: theme.colors.background.elevation, true: theme.colors.primary }}
                  thumbColor={helpEnabled ? theme.colors.primary : theme.colors.text.tertiary}
                  ios_backgroundColor={theme.colors.background.elevation}
                  style={styles.settingSwitch}
                />
              </View>
            </GlassCard>
            <TouchableOpacity 
              style={[styles.logoutButton, { borderColor: theme.colors.error }]}
              onPress={() => router.replace('/signin')}
            >
              <Feather name="log-out" size={20} color={theme.colors.error} style={styles.logoutIcon} />
              <Text style={[styles.logoutText, { color: theme.colors.error }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  displayName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  username: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  joinDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  editForm: {
    flex: 1,
    marginLeft: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#F1F5F9',
    fontFamily: 'Inter-Regular',
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 16,
  },
  settingsCard: {
    marginBottom: 24,
    paddingVertical: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.08)',
    minHeight: 64,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  settingSwitch: {
    marginLeft: 8,
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});