// import React, { useContext, useState, useRef } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated } from 'react-native';
// import { useTheme } from '@/hooks/useTheme';
// import { AppContext } from '@/context/AppContext';
// import { GlassCard } from '@/components/ui/GlassCard';
// import { Search, Users, Trophy, ChevronRight, Flame } from 'lucide-react-native';
// import { TextInput } from '@/components/ui/TextInput';

// export default function FriendsScreen() {
//   const theme = useTheme();
//   const { friends } = useContext(AppContext);
//   const [searchText, setSearchText] = useState('');
//   const [activeTab, setActiveTab] = useState('leaderboard');
//   const fadeAnim = useRef(new Animated.Value(1)).current;
//   const slideAnim = useRef(new Animated.Value(0)).current;
  
//   // Sort friends by streak for leaderboard
//   const leaderboardFriends = [...friends].sort((a, b) => b.weeklyFocusMinutes - a.weeklyFocusMinutes);
  
//   // Filter friends for search
//   const filteredFriends = friends.filter(friend => 
//     friend.displayName.toLowerCase().includes(searchText.toLowerCase()) ||
//     friend.username.toLowerCase().includes(searchText.toLowerCase())
//   );
  
//   // Change tab with animation
//   const changeTab = (tab) => {
//     // Fade out
//     Animated.timing(fadeAnim, {
//       toValue: 0,
//       duration: 150,
//       useNativeDriver: true,
//     }).start(() => {
//       setActiveTab(tab);
      
//       // Prepare slide direction
//       if (tab === 'leaderboard') slideAnim.setValue(-50);
//       else slideAnim.setValue(50);
      
//       // Fade in with slide
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.spring(slideAnim, {
//           toValue: 0,
//           friction: 8,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     });
//   };
  
//   // Function to get medal emoji for top 3
//   const getMedal = (index) => {
//     switch (index) {
//       case 0: return '🥇';
//       case 1: return '🥈';
//       case 2: return '🥉';
//       default: return '';
//     }
//   };
  
//   return (
//     <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={[styles.title, { color: theme.colors.text.primary }]}>Friends</Text>
        
//         {/* Search Bar */}
//         <View style={styles.searchContainer}>
//           <Search size={20} color={theme.colors.text.secondary} style={styles.searchIcon} />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search friends..."
//             placeholderTextColor={theme.colors.text.tertiary}
//             value={searchText}
//             onChangeText={setSearchText}
//           />
//         </View>
        
//         {/* Tab Selector */}
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === 'leaderboard' && { backgroundColor: theme.colors.glass.background },
//             ]}
//             onPress={() => changeTab('leaderboard')}
//           >
//             <Trophy 
//               size={20} 
//               color={activeTab === 'leaderboard' ? theme.colors.primary : theme.colors.text.secondary} 
//               style={styles.tabIcon}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: activeTab === 'leaderboard' ? theme.colors.primary : theme.colors.text.secondary },
//               ]}
//             >
//               Leaderboard
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.tab,
//               activeTab === 'friends' && { backgroundColor: theme.colors.glass.background },
//             ]}
//             onPress={() => changeTab('friends')}
//           >
//             <Users 
//               size={20} 
//               color={activeTab === 'friends' ? theme.colors.primary : theme.colors.text.secondary} 
//               style={styles.tabIcon}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 { color: activeTab === 'friends' ? theme.colors.primary : theme.colors.text.secondary },
//               ]}
//             >
//               All Friends
//             </Text>
//           </TouchableOpacity>
//         </View>
        
//         {/* Tab Content */}
//         <Animated.View
//           style={[
//             styles.tabContent,
//             {
//               opacity: fadeAnim,
//               transform: [{ translateX: slideAnim }],
//             },
//           ]}
//         >
//           {/* Leaderboard */}
//           {activeTab === 'leaderboard' && (
//             <>
//               <GlassCard style={styles.leaderboardCard}>
//                 <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
//                   Weekly Leaderboard
//                 </Text>
//                 <Text style={[styles.leaderboardSubtitle, { color: theme.colors.text.secondary }]}>
//                   Based on focus minutes this week
//                 </Text>
                
//                 {/* Top 3 */}
//                 <View style={styles.topThreeContainer}>
//                   {leaderboardFriends.slice(0, 3).map((friend, index) => (
//                     <View key={friend.id} style={[
//                       styles.topThreeItem,
//                       index === 1 && { marginTop: 20 },
//                       index === 2 && { marginTop: 20 },
//                     ]}>
//                       <View style={[
//                         styles.medalPosition,
//                         { 
//                           backgroundColor: index === 0 
//                             ? theme.colors.accent 
//                             : index === 1 
//                               ? theme.colors.secondary 
//                               : theme.colors.primary 
//                         }
//                       ]}>
//                         <Text style={styles.medalText}>{getMedal(index)}</Text>
//                       </View>
//                       <Image source={{ uri: friend.avatar }} style={styles.topThreeAvatar} />
//                       <Text style={[styles.topThreeName, { color: theme.colors.text.primary }]}>
//                         {friend.displayName}
//                       </Text>
//                       <Text style={[styles.topThreeValue, { color: theme.colors.text.secondary }]}>
//                         {friend.weeklyFocusMinutes} min
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
                
//                 {/* Rest of Leaderboard */}
//                 <View style={styles.restLeaderboard}>
//                   {leaderboardFriends.slice(3).map((friend, index) => (
//                     <View key={friend.id} style={styles.leaderboardItem}>
//                       <Text style={[styles.leaderboardRank, { color: theme.colors.text.tertiary }]}>
//                         {index + 4}
//                       </Text>
//                       <Image source={{ uri: friend.avatar }} style={styles.leaderboardAvatar} />
//                       <View style={styles.leaderboardInfo}>
//                         <Text style={[styles.leaderboardName, { color: theme.colors.text.primary }]}>
//                           {friend.displayName}
//                         </Text>
//                         <View style={styles.streakContainer}>
//                           <Flame size={14} color={theme.colors.accent} />
//                           <Text style={[styles.streakText, { color: theme.colors.text.secondary }]}>
//                             {friend.currentStreak} day streak
//                           </Text>
//                         </View>
//                       </View>
//                       <Text style={[styles.leaderboardValue, { color: theme.colors.primary }]}>
//                         {friend.weeklyFocusMinutes} min
//                       </Text>
//                     </View>
//                   ))}
//                 </View>
//               </GlassCard>
//             </>
//           )}
          
//           {/* Friends List */}
//           {activeTab === 'friends' && (
//             <>
//               <GlassCard style={styles.friendsCard}>
//                 <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
//                   My Friends
//                 </Text>
                
//                 {filteredFriends.length > 0 ? (
//                   filteredFriends.map(friend => (
//                     <TouchableOpacity key={friend.id} style={styles.friendItem}>
//                       <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
//                       <View style={styles.friendInfo}>
//                         <Text style={[styles.friendName, { color: theme.colors.text.primary }]}>
//                           {friend.displayName}
//                         </Text>
//                         <Text style={[styles.friendUsername, { color: theme.colors.text.secondary }]}>
//                           @{friend.username}
//                         </Text>
//                       </View>
//                       <View style={styles.friendStreak}>
//                         <Flame size={16} color={theme.colors.accent} />
//                         <Text style={[styles.friendStreakText, { color: theme.colors.text.secondary }]}>
//                           {friend.currentStreak}
//                         </Text>
//                       </View>
//                       <ChevronRight size={20} color={theme.colors.text.tertiary} />
//                     </TouchableOpacity>
//                   ))
//                 ) : (
//                   <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
//                     No friends found matching "{searchText}"
//                   </Text>
//                 )}
//               </GlassCard>
              
//               <GlassCard style={styles.addFriendsCard}>
//                 <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
//                   Add Friends
//                 </Text>
//                 <Text style={[styles.addFriendsText, { color: theme.colors.text.secondary }]}>
//                   Connect with friends to compare stats and keep each other motivated!
//                 </Text>
//                 <TouchableOpacity 
//                   style={[styles.addFriendButton, { backgroundColor: theme.colors.primary }]}
//                 >
//                   <Text style={styles.addFriendButtonText}>Find Friends</Text>
//                 </TouchableOpacity>
//               </GlassCard>
//             </>
//           )}
//         </Animated.View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontFamily: 'Inter-Bold',
//     fontSize: 28,
//     marginBottom: 24,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(30, 41, 59, 0.5)',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },
//   searchIcon: {
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     height: 48,
//     color: '#F1F5F9',
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 24,
//     backgroundColor: 'rgba(30, 41, 59, 0.5)',
//     borderRadius: 12,
//     padding: 4,
//   },
//   tab: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   tabIcon: {
//     marginRight: 8,
//   },
//   tabText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//   },
//   tabContent: {
//     flex: 1,
//   },
//   leaderboardCard: {
//     marginBottom: 16,
//   },
//   cardTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   leaderboardSubtitle: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     marginBottom: 24,
//   },
//   topThreeContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 24,
//   },
//   topThreeItem: {
//     alignItems: 'center',
//     position: 'relative',
//   },
//   medalPosition: {
//     position: 'absolute',
//     top: -10,
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 1,
//   },
//   medalText: {
//     fontSize: 16,
//   },
//   topThreeAvatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   topThreeName: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   topThreeValue: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//   },
//   restLeaderboard: {
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(148, 163, 184, 0.2)',
//     paddingTop: 16,
//   },
//   leaderboardItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   leaderboardRank: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     width: 30,
//   },
//   leaderboardAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 12,
//   },
//   leaderboardInfo: {
//     flex: 1,
//   },
//   leaderboardName: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   streakContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   streakText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   leaderboardValue: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//   },
//   friendsCard: {
//     marginBottom: 16,
//   },
//   friendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(148, 163, 184, 0.2)',
//   },
//   friendAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   friendInfo: {
//     flex: 1,
//   },
//   friendName: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   friendUsername: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//   },
//   friendStreak: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 12,
//     backgroundColor: 'rgba(249, 115, 22, 0.1)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   friendStreakText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     marginLeft: 4,
//   },
//   emptyText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   addFriendsCard: {
//     marginBottom: 16,
//   },
//   addFriendsText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   addFriendButton: {
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   addFriendButtonText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     color: '#fff',
//   },
// });