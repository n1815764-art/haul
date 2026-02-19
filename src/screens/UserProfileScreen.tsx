import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFollow } from '../context/FollowContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { HaulCard } from '../components/HaulCard';
import { theme } from '../constants/theme';
import { useLiveStream } from '../context/LiveStreamContext';

// Helper to format large numbers
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

interface Props {
  route?: { params?: { userId?: string; username?: string } };
  navigation?: any;
}

export const UserProfileScreen: React.FC<Props> = ({ route, navigation }) => {
  const { 
    currentUser, 
    getUserById, 
    getUserByUsername, 
    isFollowing, 
    followUser, 
    unfollowUser,
    getFollowing,
  } = useFollow();
  const { getHaulById, hauls } = useLiveStream();

  const userId = route?.params?.userId;
  const username = route?.params?.username;
  
  // Get user profile
  const profileUser = userId 
    ? getUserById(userId) 
    : username 
    ? getUserByUsername(username)
    : currentUser;

  const isOwnProfile = !userId && !username;
  const following = isFollowing(profileUser?.id || '');

  // Get user's hauls (mock - in real app would filter by user)
  const userHauls = hauls.slice(0, 3);

  const handleFollow = () => {
    if (profileUser) {
      if (following) {
        unfollowUser(profileUser.id);
      } else {
        followUser(profileUser.id);
      }
    }
  };

  if (!profileUser) {
    return (
      <SafeAreaView style={styles.container}>
        <Text variant="h3" center>User not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text variant="bodyBold">{profileUser.username}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>⋯</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
        
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text variant="h2">{profileUser.name}</Text>
            {profileUser.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          
          <Text variant="body" color="secondary">@{profileUser.username}</Text>
          
          <Text variant="body" style={styles.bio}>{profileUser.bio}</Text>
          
          {/* Vibes */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vibesContainer}
          >
            {profileUser.vibeBoards.map(vibe => (
              <View key={vibe} style={styles.vibeTag}>
                <Text variant="caption" style={styles.vibeText}>{vibe}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <View style={styles.stat}>
          <Text variant="h3">{formatCount(profileUser.followerCount)}</Text>
          <Text variant="caption" color="secondary">Followers</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text variant="h3">{formatCount(profileUser.followingCount)}</Text>
          <Text variant="caption" color="secondary">Following</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text variant="h3">{userHauls.length}</Text>
          <Text variant="caption" color="secondary">Hauls</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsSection}>
        {isOwnProfile ? (
          <Button variant="ghost" onPress={() => {}}>
            Edit Profile
          </Button>
        ) : (
          <View style={styles.actionButtons}>
            <Button 
              variant={following ? 'ghost' : 'primary'} 
              onPress={handleFollow}
              style={styles.followButton}
            >
              {following ? 'Following' : 'Follow'}
            </Button>
            <Button variant="ghost" onPress={() => {}}>
              Message
            </Button>
          </View>
        )}
      </View>

      {/* Content Tabs */}
      <View style={styles.tabsSection}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text variant="bodyBold">Hauls</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text variant="body" color="secondary">Liked</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text variant="body" color="secondary">Saved</Text>
        </TouchableOpacity>
      </View>

      {/* Hauls */}
      <View style={styles.haulsSection}>
        {userHauls.length > 0 ? (
          userHauls.map(haul => (
            <HaulCard 
              key={haul.id} 
              haul={haul}
              onPress={() => {}}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text variant="h3" center>No hauls yet</Text>
            <Text variant="body" color="secondary" center>
              {isOwnProfile ? 'Share your first haul!' : 'This user hasn\'t shared any hauls yet'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    fontSize: 24,
    color: theme.colors.text,
  },
  moreButton: {
    fontSize: 20,
    color: theme.colors.text,
  },
  profileSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  userInfo: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  bio: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  vibesContainer: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  vibeTag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeText: {
    color: theme.colors.textSecondary,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: theme.colors.border,
  },
  actionsSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  followButton: {
    flex: 1,
  },
  tabsSection: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  haulsSection: {
    paddingTop: theme.spacing.lg,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
});
