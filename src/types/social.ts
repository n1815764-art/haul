export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  vibeBoards: string[];
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean;
  createdAt: string;
}

export interface FollowRelationship {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'follow' | 'like' | 'comment' | 'mention' | 'share' | 'live' | 'haul';
  user: User;
  targetUser?: User;
  targetId?: string;
  targetType?: 'product' | 'haul' | 'stream' | 'comment';
  content?: string;
  createdAt: string;
  isRead: boolean;
}

export type ActivityFilter = 'all' | 'follows' | 'likes' | 'mentions' | 'hauls';
