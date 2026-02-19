export interface Notification {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'share' | 'live' | 'haul' | 'price_drop' | 'back_in_stock' | 'order_update';
  title: string;
  body: string;
  data?: {
    userId?: string;
    productId?: string;
    haulId?: string;
    streamId?: string;
    orderId?: string;
  };
  image?: string;
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  followNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  mentionNotifications: boolean;
  liveNotifications: boolean;
  haulNotifications: boolean;
  priceDropNotifications: boolean;
  orderNotifications: boolean;
  emailNotifications: boolean;
  marketingEmails: boolean;
}

export type NotificationCategory = 'all' | 'social' | 'shopping' | 'updates';
