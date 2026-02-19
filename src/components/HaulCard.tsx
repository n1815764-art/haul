import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text } from './Text';
import { theme } from '../constants/theme';
import { Haul } from '../types/stream';

interface Props {
  haul: Haul;
  onPress?: () => void;
  onLike?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  compact?: boolean;
}

// Helper to format large numbers
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Helper to format time ago
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const HaulCard: React.FC<Props> = ({
  haul,
  onPress,
  onLike,
  onSave,
  onShare,
  compact = false,
}) => {
  if (compact) {
    return (
      <TouchableOpacity style={styles.compactCard} onPress={onPress}>
        <Image source={{ uri: haul.images[0] }} style={styles.compactImage} />
        <View style={styles.compactOverlay}>
          <View style={styles.compactHeader}>
            <Image source={{ uri: haul.author.avatar }} style={styles.compactAvatar} />
            <Text variant="caption" style={styles.compactName} numberOfLines={1}>
              {haul.author.name}
            </Text>
          </View>
          <Text variant="bodyBold" style={styles.compactTitle} numberOfLines={2}>
            {haul.title}
          </Text>
          <View style={styles.compactStats}>
            <Text variant="caption" style={styles.compactStat}>♡ {formatCount(haul.likes)}</Text>
            <Text variant="caption" style={styles.compactStat}>💾 {formatCount(haul.saves)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      {/* Author Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.authorInfo}>
          <Image source={{ uri: haul.author.avatar }} style={styles.authorAvatar} />
          <View>
            <View style={styles.authorNameRow}>
              <Text variant="bodyBold">{haul.author.name}</Text>
              {haul.author.isVerified && (
                <Text style={styles.verifiedBadge}>✓</Text>
              )}
            </View>
            <Text variant="caption" color="secondary">
              {formatTimeAgo(haul.createdAt)}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreIcon}>⋯</Text>
        </TouchableOpacity>
      </View>

      {/* Images */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.imagesContainer}
      >
        {haul.images.map((image, index) => (
          <TouchableOpacity key={index} onPress={onPress}>
            <Image source={{ uri: image }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={styles.content}>
        <Text variant="h3" style={styles.title}>{haul.title}</Text>
        <Text variant="body" color="secondary" style={styles.description} numberOfLines={2}>
          {haul.description}
        </Text>

        {/* Vibes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vibesContainer}
        >
          {haul.vibes.map(vibe => (
            <View key={vibe} style={styles.vibeTag}>
              <Text variant="caption" style={styles.vibeText}>{vibe}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Products Preview */}
        {haul.products.length > 0 && (
          <View style={styles.productsSection}>
            <Text variant="label" style={styles.productsLabel}>
              {haul.products.length} {haul.products.length === 1 ? 'Item' : 'Items'} • ${haul.totalPrice.toFixed(0)}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            >
              {haul.products.slice(0, 3).map(product => (
                <View key={product.id} style={styles.productChip}>
                  <Image source={{ uri: product.image }} style={styles.productChipImage} />
                  <Text variant="caption" numberOfLines={1} style={styles.productChipName}>
                    {product.name}
                  </Text>
                </View>
              ))}
              {haul.products.length > 3 && (
                <View style={styles.moreProductsChip}>
                  <Text variant="caption" style={styles.moreProductsText}>
                    +{haul.products.length - 3}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, haul.isLiked && styles.actionButtonActive]} 
            onPress={onLike}
          >
            <Text style={[styles.actionIcon, haul.isLiked && styles.actionIconActive]}>
              {haul.isLiked ? '♥' : '♡'}
            </Text>
            <Text 
              variant="caption" 
              style={[styles.actionText, haul.isLiked && styles.actionTextActive]}
            >
              {formatCount(haul.likes)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text variant="caption" style={styles.actionText}>
              {formatCount(haul.comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onShare}>
            <Text style={styles.actionIcon}>↗</Text>
            <Text variant="caption" style={styles.actionText}>
              {formatCount(haul.shares)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, haul.isSaved && styles.actionButtonActive]} 
            onPress={onSave}
          >
            <Text style={[styles.actionIcon, haul.isSaved && styles.actionIconActive]}>
              {haul.isSaved ? '🔖' : '🔖'}
            </Text>
            <Text 
              variant="caption" 
              style={[styles.actionText, haul.isSaved && styles.actionTextActive]}
            >
              {formatCount(haul.saves)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Full Card Styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  moreButton: {
    padding: theme.spacing.sm,
  },
  moreIcon: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  imagesContainer: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  image: {
    width: 280,
    height: 200,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  description: {
    lineHeight: 22,
  },
  vibesContainer: {
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  vibeTag: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  vibeText: {
    color: theme.colors.textSecondary,
  },
  productsSection: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  productsLabel: {
    marginBottom: theme.spacing.sm,
  },
  productsContainer: {
    gap: theme.spacing.sm,
  },
  productChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.background,
    paddingRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  productChipImage: {
    width: 40,
    height: 40,
  },
  productChipName: {
    maxWidth: 100,
  },
  moreProductsChip: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreProductsText: {
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.primary + '15',
  },
  actionIcon: {
    fontSize: 20,
  },
  actionIconActive: {
    color: theme.colors.primary,
  },
  actionText: {
    color: theme.colors.textSecondary,
  },
  actionTextActive: {
    color: theme.colors.primary,
  },

  // Compact Card Styles
  compactCard: {
    width: 160,
    height: 220,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  compactAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  compactName: {
    color: '#fff',
    flex: 1,
  },
  compactTitle: {
    color: '#fff',
    fontSize: 16,
  },
  compactStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  compactStat: {
    color: 'rgba(255,255,255,0.8)',
  },
});
