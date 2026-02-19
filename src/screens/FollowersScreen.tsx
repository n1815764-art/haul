import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFollow } from '../context/FollowContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { User } from '../types/social';

type ListType = 'followers' | 'following';

interface Props {
  route?: { params?: { userId?: string; initialTab?: ListType } };
  navigation?: any;
}

export const FollowersScreen: React.FC<Props> = ({ route, navigation }) => {
  const { 
    currentUser, 
    getUserById, 
    isFollowing, 
    followUser, 
    unfollowUser,
    getFollowing,
  } = useFollow();

  const userId = route?.params?.userId;
  const initialTab = route?.params?.initialTab || 'followers';
  const [activeTab, setActiveTab] = useState<ListType>(initialTab);

  const profileUser = userId ? getUserById(userId) : currentUser;
  const followingList = getFollowing('current-user');

  // Mock followers/following data
  const mockFollowers: User[] = [
    getUserById('user-1'),
    getUserById('user-2'),
    getUserById('user-3'),
  ].filter(Boolean) as User[];

  const data = activeTab === 'followers' ? mockFollowers : followingList;

  const renderUserItem = ({ item }: { item: User }) => {
    const isUserFollowing = isFollowing(item.id);
    const isSelf = item.id === 'current-user';

    return (
      <View style={styles.userItem}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => navigation?.navigate('UserProfile', { userId: item.id })}
        >
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text variant="bodyBold">{item.name}</Text>
              {item.isVerified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text variant="caption" color="secondary">@{item.username}</Text>
            <Text variant="caption" color="secondary" numberOfLines={1}>
              {item.bio}
            </Text>
          </View>
        </TouchableOpacity>
        
        {!isSelf && (
          <Button
            variant={isUserFollowing ? 'ghost' : 'primary'}
            size="sm"
            onPress={() => isUserFollowing ? unfollowUser(item.id) : followUser(item.id)}
          >
            {isUserFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text variant="bodyBold">{profileUser?.username || 'User'}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'followers' && styles.tabActive]}
          onPress={() => setActiveTab('followers')}
        >
          <Text variant="bodyBold">{profileUser?.followerCount || 0}</Text>
          <Text variant="caption" color={activeTab === 'followers' ? 'primary' : 'secondary'}>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'following' && styles.tabActive]}
          onPress={() => setActiveTab('following')}
        >
          <Text variant="bodyBold">{profileUser?.followingCount || 0}</Text>
          <Text variant="caption" color={activeTab === 'following' ? 'primary' : 'secondary'}>
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="h3" center>No {activeTab} yet</Text>
            <Text variant="body" color="secondary" center>
              {activeTab === 'followers' 
                ? 'When someone follows you, they\'ll appear here'
                : 'Follow users to see them here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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
  placeholder: {
    width: 24,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  list: {
    padding: theme.spacing.lg,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDetails: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
});
