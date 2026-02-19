import React, { createContext, useContext, useState, useCallback } from 'react';
import { WishlistItem, Collection, WishlistSort, WishlistFilter } from '../types/wishlist';
import { mockCollections, mockWishlistItems } from '../data/mockWishlist';

interface WishlistContextType {
  // Wishlist items
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromWishlist: (itemId: string) => void;
  updateItemPriority: (itemId: string, priority: WishlistItem['priority']) => void;
  updateItemNotes: (itemId: string, notes: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Collections
  collections: Collection[];
  createCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'shares'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  addToCollection: (collectionId: string, item: WishlistItem) => void;
  removeFromCollection: (collectionId: string, itemId: string) => void;
  getCollectionById: (id: string) => Collection | undefined;
  
  // Filtering & Sorting
  sortBy: WishlistSort;
  setSortBy: (sort: WishlistSort) => void;
  filterBy: WishlistFilter;
  setFilterBy: (filter: WishlistFilter) => void;
  getFilteredItems: () => WishlistItem[];
  
  // Sharing
  shareCollection: (collectionId: string, options: { isPublic: boolean; users?: string[] }) => string;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [items, setItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [sortBy, setSortBy] = useState<WishlistSort>('recent');
  const [filterBy, setFilterBy] = useState<WishlistFilter>('all');

  // Add to wishlist
  const addToWishlist = useCallback((item: Omit<WishlistItem, 'id' | 'addedAt'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `wish-${Date.now()}`,
      addedAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    // Also remove from all collections
    setCollections(prev => prev.map(collection => ({
      ...collection,
      items: collection.items.filter(item => item.id !== itemId),
    })));
  }, []);

  // Update item priority
  const updateItemPriority = useCallback((itemId: string, priority: WishlistItem['priority']) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, priority } : item
    ));
  }, []);

  // Update item notes
  const updateItemNotes = useCallback((itemId: string, notes: string) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, notes } : item
    ));
  }, []);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.productId === productId);
  }, [items]);

  // Create collection
  const createCollection = useCallback((collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'shares'>) => {
    const now = new Date().toISOString();
    const newCollection: Collection = {
      ...collection,
      id: `collection-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      shares: 0,
    };
    setCollections(prev => [newCollection, ...prev]);
  }, []);

  // Update collection
  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(collection => 
      collection.id === id 
        ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
        : collection
    ));
  }, []);

  // Delete collection
  const deleteCollection = useCallback((id: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== id));
  }, []);

  // Add to collection
  const addToCollection = useCallback((collectionId: string, item: WishlistItem) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { 
            ...collection, 
            items: [...collection.items, item],
            updatedAt: new Date().toISOString(),
          }
        : collection
    ));
  }, []);

  // Remove from collection
  const removeFromCollection = useCallback((collectionId: string, itemId: string) => {
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { 
            ...collection, 
            items: collection.items.filter(item => item.id !== itemId),
            updatedAt: new Date().toISOString(),
          }
        : collection
    ));
  }, []);

  // Get collection by ID
  const getCollectionById = useCallback((id: string) => {
    return collections.find(c => c.id === id);
  }, [collections]);

  // Get filtered and sorted items
  const getFilteredItems = useCallback(() => {
    let filtered = [...items];

    // Apply filter
    switch (filterBy) {
      case 'high-priority':
        filtered = filtered.filter(item => item.priority === 'high');
        break;
      case 'on-sale':
        filtered = filtered.filter(item => item.originalPrice && item.originalPrice > item.price);
        break;
      default:
        break;
    }

    // Apply sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
    }

    return filtered;
  }, [items, filterBy, sortBy]);

  // Share collection
  const shareCollection = useCallback((collectionId: string, options: { isPublic: boolean; users?: string[] }) => {
    const shareId = `share-${Date.now()}`;
    const shareLink = options.isPublic 
      ? `https://haul.app/collection/${collectionId}?share=${shareId}`
      : undefined;
    
    // Update collection share count
    setCollections(prev => prev.map(collection => 
      collection.id === collectionId 
        ? { ...collection, shares: collection.shares + 1 }
        : collection
    ));

    return shareLink || shareId;
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        updateItemPriority,
        updateItemNotes,
        isInWishlist,
        collections,
        createCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        getCollectionById,
        sortBy,
        setSortBy,
        filterBy,
        setFilterBy,
        getFilteredItems,
        shareCollection,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
