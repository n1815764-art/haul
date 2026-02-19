import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWishlist } from '../context/WishlistContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme, VIBE_BOARDS } from '../constants/theme';
import { WishlistItem, Collection } from '../types/wishlist';

interface Props {
  navigation?: any;
}

export const WishlistScreen: React.FC<Props> = ({ navigation }) => {
  const {
    items,
    removeFromWishlist,
    updateItemPriority,
    updateItemNotes,
    collections,
    createCollection,
    addToCollection,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    getFilteredItems,
    shareCollection,
  } = useWishlist();

  const [activeTab, setActiveTab] = useState<'items' | 'collections'>('items');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const filteredItems = getFilteredItems();

  const priorityColors = {
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;

    createCollection({
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim(),
      items: selectedItem ? [selectedItem] : [],
      vibes: selectedVibes,
      isPrivate: false,
    });

    setShowCreateModal(false);
    setNewCollectionName('');
    setNewCollectionDesc('');
    setSelectedVibes([]);
    setSelectedItem(null);
  };

  const handleAddToCollection = (collectionId: string) => {
    if (selectedItem) {
      addToCollection(collectionId, selectedItem);
    }
    setShowAddToCollectionModal(false);
    setSelectedItem(null);
  };

  const handleShare = (collection: Collection) => {
    const link = shareCollection(collection.id, { isPublic: true });
    Alert.alert('Shared!', `Link copied to clipboard: ${link}`);
  };

  const renderWishlistItem = ({ item }: { item: WishlistItem }) => (
    <View style={styles.itemCard}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <View>
            <Text variant="bodyBold" numberOfLines={1}>{item.name}</Text>
            <Text variant="caption" color="secondary">{item.brand}</Text>
          </View>
          <TouchableOpacity
            style={[styles.priorityBadge, { backgroundColor: priorityColors[item.priority] + '20' }]}
            onPress={() => {
              const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
              const currentIndex = priorities.indexOf(item.priority);
              const nextPriority = priorities[(currentIndex + 1) % 3];
              updateItemPriority(item.id, nextPriority);
            }}
          >
            <Text variant="caption" style={{ color: priorityColors[item.priority] }}>
              {item.priority}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <Text variant="bodyBold" style={styles.price}>${item.price}</Text>
          {item.originalPrice && (
            <Text variant="caption" style={styles.originalPrice}>
              ${item.originalPrice}
            </Text>
          )}
          {item.originalPrice && (
            <Text variant="caption" style={styles.savings}>
              Save ${item.originalPrice - item.price}
            </Text>
          )}
        </View>

        {item.notes && (
          <Text variant="caption" color="secondary" style={styles.notes}>
            📝 {item.notes}
          </Text>
        )}

        <View style={styles.itemActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              setSelectedItem(item);
              setShowAddToCollectionModal(true);
            }}
          >
            <Text variant="caption" color="primary">+ Add to Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeFromWishlist(item.id)}
          >
            <Text variant="caption" color="error">Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCollection = ({ item }: { item: Collection }) => (
    <TouchableOpacity 
      style={styles.collectionCard}
      onPress={() => navigation?.navigate('CollectionDetail', { collectionId: item.id })}
    >
      <Image source={{ uri: item.coverImage }} style={styles.collectionImage} />
      <View style={styles.collectionOverlay}>
        {item.isPrivate && (
          <View style={styles.privateBadge}>
            <Text variant="caption" style={styles.privateText}>🔒</Text>
          </View>
        )}
        <Text variant="bodyBold" style={styles.collectionName}>{item.name}</Text>
        <Text variant="caption" style={styles.collectionCount}>
          {item.items.length} items
        </Text>
      </View>
      
      <View style={styles.collectionFooter}>
        <View style={styles.collectionInfo}>
          <Text variant="bodyBold" numberOfLines={1}>{item.name}</Text>
          <Text variant="caption" color="secondary">{item.items.length} items</Text>
        </View>
        <TouchableOpacity onPress={() => handleShare(item)}>
          <Text style={styles.shareIcon}>↗</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Wishlist</Text>
        <View style={styles.headerActions}>
          {activeTab === 'collections' && (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text variant="bodyBold" color="primary">+ New</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'items' && styles.tabActive]}
          onPress={() => setActiveTab('items')}
        >
          <Text variant="bodyBold">Items ({items.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'collections' && styles.tabActive]}
          onPress={() => setActiveTab('collections')}
        >
          <Text variant="bodyBold">Collections ({collections.length})</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'items' ? (
        <>
          {/* Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            <TouchableOpacity
              style={[styles.filterChip, filterBy === 'all' && styles.filterChipActive]}
              onPress={() => setFilterBy('all')}
            >
              <Text variant="caption">All Items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filterBy === 'high-priority' && styles.filterChipActive]}
              onPress={() => setFilterBy('high-priority')}
            >
              <Text variant="caption">🔥 High Priority</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filterBy === 'on-sale' && styles.filterChipActive]}
              onPress={() => setFilterBy('on-sale')}
            >
              <Text variant="caption">🏷 On Sale</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Sort */}
          <View style={styles.sortContainer}>
            <Text variant="caption" color="secondary">Sort by:</Text>
            {(['recent', 'price-low', 'price-high', 'priority'] as const).map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[styles.sortChip, sortBy === sort && styles.sortChipActive]}
                onPress={() => setSortBy(sort)}
              >
                <Text 
                  variant="caption" 
                  style={sortBy === sort ? styles.sortTextActive : undefined}
                >
                  {sort === 'price-low' ? 'Price ↑' : 
                   sort === 'price-high' ? 'Price ↓' : 
                   sort === 'priority' ? 'Priority' : 
                   'Recent'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Items List */}
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderWishlistItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💝</Text>
                <Text variant="h3" center>Your wishlist is empty</Text>
                <Text variant="body" color="secondary" center>
                  Save items you love while browsing
                </Text>
              </View>
            }
          />
        </>
      ) : (
        /* Collections Grid */
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          renderItem={renderCollection}
          numColumns={2}
          contentContainerStyle={styles.collectionsGrid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text variant="h3" center>No collections yet</Text>
              <Text variant="body" color="secondary" center>
                Create collections to organize your wishlist
              </Text>
            </View>
          }
        />
      )}

      {/* Create Collection Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h3" style={styles.modalTitle}>Create Collection</Text>
            
            <TextInput
              style={styles.modalInput}
              value={newCollectionName}
              onChangeText={setNewCollectionName}
              placeholder="Collection name"
              placeholderTextColor={theme.colors.textSecondary}
            />
            
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              value={newCollectionDesc}
              onChangeText={setNewCollectionDesc}
              placeholder="Description (optional)"
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              numberOfLines={3}
            />

            <Text variant="caption" color="secondary" style={styles.modalLabel}>Vibes</Text>
            <View style={styles.vibesGrid}>
              {VIBE_BOARDS.slice(0, 8).map(vibe => (
                <TouchableOpacity
                  key={vibe.id}
                  style={[
                    styles.vibeChip,
                    selectedVibes.includes(vibe.name) && styles.vibeChipActive,
                  ]}
                  onPress={() => {
                    setSelectedVibes(prev =>
                      prev.includes(vibe.name)
                        ? prev.filter(v => v !== vibe.name)
                        : [...prev, vibe.name]
                    );
                  }}
                >
                  <Text 
                    variant="caption"
                    style={selectedVibes.includes(vibe.name) ? styles.vibeChipTextActive : undefined}
                  >
                    {vibe.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <Button variant="ghost" onPress={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onPress={handleCreateCollection}>
                Create
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add to Collection Modal */}
      <Modal
        visible={showAddToCollectionModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddToCollectionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="h3" style={styles.modalTitle}>Add to Collection</Text>
            
            {collections.map(collection => (
              <TouchableOpacity
                key={collection.id}
                style={styles.collectionOption}
                onPress={() => handleAddToCollection(collection.id)}
              >
                <Image source={{ uri: collection.coverImage }} style={styles.collectionOptionImage} />
                <View style={styles.collectionOptionInfo}>
                  <Text variant="bodyBold">{collection.name}</Text>
                  <Text variant="caption" color="secondary">{collection.items.length} items</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.createNewOption}
              onPress={() => {
                setShowAddToCollectionModal(false);
                setShowCreateModal(true);
              }}
            >
              <Text variant="bodyBold" color="primary">+ Create New Collection</Text>
            </TouchableOpacity>

            <Button variant="ghost" onPress={() => setShowAddToCollectionModal(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
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
    gap: theme.spacing.md,
  },
  createButton: {
    padding: theme.spacing.sm,
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
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
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
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  sortChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surface,
  },
  sortChipActive: {
    backgroundColor: theme.colors.primary,
  },
  sortTextActive: {
    color: theme.colors.surface,
  },
  list: {
    padding: theme.spacing.lg,
  },
  itemCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.md,
  },
  itemInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  price: {
    color: theme.colors.primary,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  savings: {
    color: theme.colors.success,
  },
  notes: {
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  actionButton: {
    paddingVertical: theme.spacing.xs,
  },
  collectionsGrid: {
    padding: theme.spacing.lg,
  },
  collectionCard: {
    flex: 1,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  collectionImage: {
    width: '100%',
    height: 140,
  },
  collectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: theme.spacing.md,
    justifyContent: 'flex-end',
  },
  privateBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  privateText: {
    color: '#fff',
  },
  collectionName: {
    color: '#fff',
  },
  collectionCount: {
    color: 'rgba(255,255,255,0.8)',
  },
  collectionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  collectionInfo: {
    flex: 1,
  },
  shareIcon: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: theme.spacing.lg,
  },
  modalInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalLabel: {
    marginBottom: theme.spacing.sm,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  vibeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  vibeChipTextActive: {
    color: theme.colors.surface,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.md,
  },
  collectionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  collectionOptionImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
  },
  collectionOptionInfo: {
    flex: 1,
  },
  createNewOption: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
});
