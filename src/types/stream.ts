export interface LiveStream {
  id: string;
  title: string;
  host: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
    followerCount: number;
  };
  thumbnail: string;
  viewerCount: number;
  totalViewers: number;
  isLive: boolean;
  scheduledFor?: string;
  startedAt?: string;
  endedAt?: string;
  vibes: string[];
  products: string[];
  likes: number;
}

export interface ChatMessage {
  id: string;
  streamId: string;
  user: {
    id: string;
    name: string;
    avatar: string;
    isHost?: boolean;
    isModerator?: boolean;
  };
  text: string;
  timestamp: string;
  likes: number;
}

export interface Haul {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    isVerified: boolean;
  };
  images: string[];
  products: HaulProduct[];
  vibes: string[];
  totalPrice: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface HaulProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  link?: string;
  description?: string;
}

export type StreamRole = 'viewer' | 'broadcaster' | 'moderator';

export interface StreamState {
  isStreaming: boolean;
  isMuted: boolean;
  isCameraOn: boolean;
  viewerCount: number;
  duration: number;
}

export interface StreamFilters {
  vibes?: string[];
  isLive?: boolean;
  upcoming?: boolean;
}
