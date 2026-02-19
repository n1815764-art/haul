import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, FollowRelationship, ActivityItem } from '../types/social';
import { mockUsers, mockActivities, mockCurrentUser } from '../data/mockSocial';

interface FollowContextType {
  // Current user
  currentUser: User;
  updateCurrentUser: (updates: Partial<User>) => void;
  
  // Users
  users: User[];
  getUserById: (id: string) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
  searchUsers: (query: string) => User[];
  
  // Following
  following: FollowRelationship[];
  followers: FollowRelationship[];
  isFollowing: (userId: string) => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  getFollowers: (userId: string) => User[];
  getFollowing: (userId: string) => User[];
  
  // Activity
  activities: ActivityItem[];
  unreadCount: number;
  markAsRead: (activityId: string) => void;
  markAllAsRead: () => void;
  getActivities: (filter?: string) => ActivityItem[];
  
  // Recommendations
  suggestedUsers: User[];
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

export const FollowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [following, setFollowing] = useState<FollowRelationship[]>([]);
  const [followers, setFollowers] = useState<FollowRelationship[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);

  // Update current user
  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  }, []);

  // Get user by ID
  const getUserById = useCallback((id: string) => {
    if (id === 'current-user') return currentUser;
    return users.find(u => u.id === id);
  }, [users, currentUser]);

  // Get user by username
  const getUserByUsername = useCallback((username: string) => {
    if (username.toLowerCase() === currentUser.username.toLowerCase()) return currentUser;
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }, [users, currentUser]);

  // Search users
  const searchUsers = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return users.filter(u => 
      u.name.toLowerCase().includes(lowerQuery) ||
      u.username.toLowerCase().includes(lowerQuery) ||
      u.bio.toLowerCase().includes(lowerQuery)
    );
  }, [users]);

  // Check if following
  const isFollowing = useCallback((userId: string) => {
    return following.some(f => f.followingId === userId);
  }, [following]);

  // Follow user
  const followUser = useCallback((userId: string) => {
    const newFollow: FollowRelationship = {
      id: `follow-${Date.now()}`,
      followerId: 'current-user',
      followingId: userId,
      createdAt: new Date().toISOString(),
    };

    setFollowing(prev => [...prev, newFollow]);
    
    // Update follower count on target user
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, followerCount: u.followerCount + 1, isFollowing: true }
        : u
    ));

    // Update following count on current user
    setCurrentUser(prev => ({ ...prev, followingCount: prev.followingCount + 1 }));

    // Create activity
    const targetUser = getUserById(userId);
    if (targetUser) {
      const newActivity: ActivityItem = {
        id: `activity-${Date.now()}`,
        type: 'follow',
        user: currentUser,
        targetUser,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [currentUser, getUserById]);

  // Unfollow user
  const unfollowUser = useCallback((userId: string) => {
    setFollowing(prev => prev.filter(f => f.followingId !== userId));
    
    // Update follower count on target user
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, followerCount: Math.max(0, u.followerCount - 1), isFollowing: false }
        : u
    ));

    // Update following count on current user
    setCurrentUser(prev => ({ ...prev, followingCount: Math.max(0, prev.followingCount - 1) }));
  }, []);

  // Get followers of a user
  const getFollowers = useCallback((userId: string) => {
    return users.filter(u => isFollowing(u.id) || following.some(f => f.followerId === userId && f.followingId === u.id));
  }, [users, following, isFollowing]);

  // Get users a user is following
  const getFollowing = useCallback((userId: string) => {
    if (userId === 'current-user') {
      return users.filter(u => isFollowing(u.id));
    }
    return [];
  }, [users, isFollowing]);

  // Mark activity as read
  const markAsRead = useCallback((activityId: string) => {
    setActivities(prev => prev.map(a => 
      a.id === activityId ? { ...a, isRead: true } : a
    ));
  }, []);

  // Mark all activities as read
  const markAllAsRead = useCallback(() => {
    setActivities(prev => prev.map(a => ({ ...a, isRead: true })));
  }, []);

  // Get activities with filter
  const getActivities = useCallback((filter?: string) => {
    let filtered = activities;
    
    switch (filter) {
      case 'follows':
        filtered = activities.filter(a => a.type === 'follow');
        break;
      case 'likes':
        filtered = activities.filter(a => a.type === 'like');
        break;
      case 'mentions':
        filtered = activities.filter(a => a.type === 'mention');
        break;
      case 'hauls':
        filtered = activities.filter(a => a.type === 'haul');
        break;
      default:
        break;
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activities]);

  // Computed values
  const unreadCount = activities.filter(a => !a.isRead).length;
  const suggestedUsers = users
    .filter(u => u.id !== 'current-user' && !isFollowing(u.id))
    .slice(0, 5);

  return (
    <FollowContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        users,
        getUserById,
        getUserByUsername,
        searchUsers,
        following,
        followers,
        isFollowing,
        followUser,
        unfollowUser,
        getFollowers,
        getFollowing,
        activities,
        unreadCount,
        markAsRead,
        markAllAsRead,
        getActivities,
        suggestedUsers,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
};
