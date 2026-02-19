import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Notification, NotificationPreferences, NotificationCategory } from '../types/notification';
import { mockNotifications } from '../data/mockNotifications';

interface NotificationContextType {
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  getNotifications: (category?: NotificationCategory) => Notification[];
  
  // Preferences
  preferences: NotificationPreferences;
  updatePreferences: (updates: Partial<NotificationPreferences>) => void;
  
  // Push notifications
  pushToken: string | null;
  requestPushPermissions: () => Promise<boolean>;
}

const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  followNotifications: true,
  likeNotifications: true,
  commentNotifications: true,
  mentionNotifications: true,
  liveNotifications: true,
  haulNotifications: true,
  priceDropNotifications: true,
  orderNotifications: true,
  emailNotifications: true,
  marketingEmails: false,
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Get notifications by category
  const getNotifications = useCallback((category?: NotificationCategory) => {
    let filtered = notifications;

    switch (category) {
      case 'social':
        filtered = notifications.filter(n => 
          ['follow', 'like', 'comment', 'mention', 'share'].includes(n.type)
        );
        break;
      case 'shopping':
        filtered = notifications.filter(n => 
          ['price_drop', 'back_in_stock', 'order_update'].includes(n.type)
        );
        break;
      case 'updates':
        filtered = notifications.filter(n => 
          ['live', 'haul'].includes(n.type)
        );
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [notifications]);

  // Update preferences
  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  }, []);

  // Request push permissions (mock)
  const requestPushPermissions = useCallback(async () => {
    // In real app, would use expo-notifications
    setPushToken('mock-push-token-12345');
    return true;
  }, []);

  // Computed values
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Schedule push permission request on mount
  useEffect(() => {
    if (preferences.pushEnabled && !pushToken) {
      requestPushPermissions();
    }
  }, [preferences.pushEnabled, pushToken, requestPushPermissions]);

  return (
    <NotificationContext.Provider
      value={{
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
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
