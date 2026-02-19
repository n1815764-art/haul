import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFollow } from '../context/FollowContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { ActivityItem } from '../types/social';

// Helper to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Activity icons
const activityIcons: Record<string, string> = {
  follow: '👋',
  like: '♥',
  comment: '💬',
  mention: '@',
  share: '↗',
  live: '🔴',
  haul: '🛍',
};

interface Props {
  navigation?: any;
}

export const ActivityScreen: React.FC<Props> = ({ navigation }) => {
  const { activities, unreadCount, markAsRead, markAllAsRead, getActivities } = useFollow();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const filteredActivities = getActivities(activeFilter === 'all' ? undefined : activeFilter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'follows', label: 'Follows' },
    { id: 'likes', label: 'Likes' },
    { id: 'mentions', label: 'Mentions' },
    { id: 'hauls', label: 'Hauls' },
  ];

  const renderActivityItem = ({ item }: { item: ActivityItem }) => {
    let message = '';
    
    switch (item.type) {
      case 'follow':
        message = 'started following you';
        break;
      case 'like':
        message = `liked your ${item.targetType || 'post'}`;
        break;
      case 'comment':
        message = `commented: "${item.content}"`;
        break;
      case 'mention':
        message = `mentioned you: "${item.content}"`;
        break;
      case 'share':
        message = `shared your ${item.targetType || 'post'}`;
        break;
      case 'live':
        message = 'is live now';
        break;
      case 'haul':
        message = 'shared a new haul';
        break;
      default:
        message = 'interacted with you';
    }

    return (
      <TouchableOpacity 
        style={[styles.activityItem, !item.isRead && styles.activityItemUnread]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.activityIconContainer}>
          <Text style={styles.activityIcon}>{activityIcons[item.type]}</Text>
        </View>
        
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        
        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <Text variant="bodyBold">{item.user.name}</Text>
            {item.user.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
            <Text variant="caption" color="secondary" style={styles.timeAgo}>
              {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
          
          <Text variant="body" color="secondary">
            {message}
          </Text>
          
          {item.content && item.type !== 'comment' && item.type !== 'mention' && (
            <Text variant="caption" color="secondary" style={styles.content} numberOfLines={2}>
              "{item.content}"
            </Text>
          )}
        </View>
        
        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Activity</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text variant="body" color="primary">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[styles.filterChip, activeFilter === filter.id && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter.id)}
          >
            <Text 
              variant="body" 
              style={activeFilter === filter.id ? styles.filterTextActive : undefined}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activity List */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        renderItem={renderActivityItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text variant="h3" center>No activity yet</Text>
            <Text variant="body" color="secondary" center>
              When someone interacts with you, it will appear here
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
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
  list: {
    padding: theme.spacing.lg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityItemUnread: {
    backgroundColor: theme.colors.primary + '08',
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  activityIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  activityIcon: {
    fontSize: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  activityContent: {
    flex: 1,
    gap: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  timeAgo: {
    marginLeft: 'auto',
  },
  content: {
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
});
