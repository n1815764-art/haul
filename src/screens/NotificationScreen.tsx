import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotification } from '../context/NotificationContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { Notification, NotificationCategory } from '../types/notification';

// Helper to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Notification icons
const notificationIcons: Record<string, string> = {
  follow: '👋',
  like: '♥',
  comment: '💬',
  mention: '@',
  share: '↗',
  live: '🔴',
  haul: '🛍',
  price_drop: '🏷',
  back_in_stock: '📦',
  order_update: '🚚',
};

export const NotificationScreen: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotifications,
    preferences,
    updatePreferences,
    pushToken,
    requestPushPermissions,
  } = useNotification();

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = getNotifications(activeCategory);

  const categories: { id: NotificationCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'social', label: 'Social' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'updates', label: 'Updates' },
  ];

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.notificationUnread]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationIcon}>
        <Text style={styles.iconText}>{notificationIcons[item.type]}</Text>
      </View>

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.notificationImage} />
      )}

      <View style={styles.notificationContent}>
        <Text variant="bodyBold" style={styles.notificationTitle}>
          {item.title}
        </Text>
        <Text variant="body" color="secondary" style={styles.notificationBody}>
          {item.body}
        </Text>
        <Text variant="caption" color="secondary" style={styles.notificationTime}>
          {formatTimeAgo(item.createdAt)}
        </Text>
      </View>

      <View style={styles.notificationActions}>
        {!item.isRead && <View style={styles.unreadDot} />}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (showSettings) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text variant="bodyBold">Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Push Notifications */}
          <View style={styles.settingsSection}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text variant="bodyBold">Push Notifications</Text>
                <Text variant="caption" color="secondary">
                  Receive push notifications on your device
                </Text>
              </View>
              <Switch
                value={preferences.pushEnabled}
                onValueChange={(value) => updatePreferences({ pushEnabled: value })}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              />
            </View>
          </View>

          {/* Social Notifications */}
          <View style={styles.settingsSection}>
            <Text variant="label" style={styles.settingsSectionTitle}>Social</Text>
            
            {[
              { key: 'followNotifications', label: 'New Followers', icon: '👋' },
              { key: 'likeNotifications', label: 'Likes', icon: '♥' },
              { key: 'commentNotifications', label: 'Comments', icon: '💬' },
              { key: 'mentionNotifications', label: 'Mentions', icon: '@' },
            ].map(setting => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <Text variant="body">{setting.label}</Text>
                </View>
                <Switch
                  value={preferences[setting.key as keyof typeof preferences] as boolean}
                  onValueChange={(value) => updatePreferences({ [setting.key]: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            ))}
          </View>

          {/* Content Notifications */}
          <View style={styles.settingsSection}>
            <Text variant="label" style={styles.settingsSectionTitle}>Content</Text>
            
            {[
              { key: 'liveNotifications', label: 'Live Streams', icon: '🔴' },
              { key: 'haulNotifications', label: 'New Hauls', icon: '🛍' },
            ].map(setting => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <Text variant="body">{setting.label}</Text>
                </View>
                <Switch
                  value={preferences[setting.key as keyof typeof preferences] as boolean}
                  onValueChange={(value) => updatePreferences({ [setting.key]: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            ))}
          </View>

          {/* Shopping Notifications */}
          <View style={styles.settingsSection}>
            <Text variant="label" style={styles.settingsSectionTitle}>Shopping</Text>
            
            {[
              { key: 'priceDropNotifications', label: 'Price Drops', icon: '🏷' },
              { key: 'orderNotifications', label: 'Order Updates', icon: '🚚' },
            ].map(setting => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <Text variant="body">{setting.label}</Text>
                </View>
                <Switch
                  value={preferences[setting.key as keyof typeof preferences] as boolean}
                  onValueChange={(value) => updatePreferences({ [setting.key]: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            ))}
          </View>

          {/* Email Notifications */}
          <View style={styles.settingsSection}>
            <Text variant="label" style={styles.settingsSectionTitle}>Email</Text>
            
            {[
              { key: 'emailNotifications', label: 'Email Notifications', icon: '✉️' },
              { key: 'marketingEmails', label: 'Marketing & Promotions', icon: '📢' },
            ].map(setting => (
              <View key={setting.key} style={styles.settingItem}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingIcon}>{setting.icon}</Text>
                  <Text variant="body">{setting.label}</Text>
                </View>
                <Switch
                  value={preferences[setting.key as keyof typeof preferences] as boolean}
                  onValueChange={(value) => updatePreferences({ [setting.key]: value })}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            ))}
          </View>

          {/* Push Token Info */}
          <View style={styles.tokenSection}>
            <Text variant="caption" color="secondary">
              Push Token: {pushToken ? '✓ Active' : '✗ Not registered'}
            </Text>
            {!pushToken && (
              <Button variant="primary" onPress={requestPushPermissions} style={styles.tokenButton}>
                Enable Push Notifications
              </Button>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Notifications</Text>
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text variant="body" color="primary">Mark all read</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryChip, activeCategory === category.id && styles.categoryChipActive]}
            onPress={() => setActiveCategory(category.id)}
          >
            <Text 
              variant="body"
              style={activeCategory === category.id ? styles.categoryChipTextActive : undefined}
            >
              {category.label}
            </Text>
            {category.id === 'all' && unreadCount > 0 && (
              <View style={styles.badge}>
                <Text variant="caption" style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text variant="h3" center>No notifications</Text>
            <Text variant="body" color="secondary" center>
              You\'re all caught up!
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  settingsIcon: {
    fontSize: 20,
  },
  backButton: {
    fontSize: 24,
  },
  placeholder: {
    width: 24,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipTextActive: {
    color: theme.colors.surface,
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  list: {
    padding: theme.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  notificationUnread: {
    backgroundColor: theme.colors.primary + '08',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
  },
  notificationContent: {
    flex: 1,
    gap: 2,
  },
  notificationTitle: {
    fontSize: 15,
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationTime: {
    marginTop: 2,
  },
  notificationActions: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  settingsSection: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
  },
  settingsSectionTitle: {
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  settingIcon: {
    fontSize: 20,
  },
  tokenSection: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  tokenButton: {
    marginTop: theme.spacing.md,
  },
});
