export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  addedAt: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  items: WishlistItem[];
  vibes: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  likes: number;
  shares: number;
  author?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export interface CollectionShare {
  id: string;
  collectionId: string;
  sharedWith: string[];
  shareLink?: string;
  isPublic: boolean;
  createdAt: string;
}

export type WishlistSort = 'recent' | 'price-low' | 'price-high' | 'priority';
export type WishlistFilter = 'all' | 'high-priority' | 'on-sale';
