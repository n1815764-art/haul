import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { Product } from '../types/product';
import { Text } from './Text';
import { Badge } from './Badge';
import { theme } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  variant?: 'feed' | 'ranking' | 'compact';
  showPrice?: boolean;
  showBrand?: boolean;
  showVibes?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  variant = 'feed',
  showPrice = true,
  showBrand = true,
  showVibes = false,
}) => {
  const isRanking = variant === 'ranking';
  const isCompact = variant === 'compact';

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
      return `${discount}% off`;
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        isRanking && styles.rankingContainer,
        isCompact && styles.compactContainer,
      ]}
      android_ripple={{ color: theme.colors.sage + '20' }}
    >
      {/* Image Container */}
      <View style={[styles.imageContainer, isRanking && styles.rankingImageContainer]}>
        <Image
          source={{ uri: product.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Overlays */}
        <View style={styles.overlayContainer}>
          {product.isNew && (
            <Badge
              label="NEW"
              variant="accent"
              style={styles.badge}
            />
          )}
          {product.isTrending && !product.isNew && (
            <Badge
              label="TRENDING"
              variant="primary"
              style={styles.badge}
            />
          )}
          {discount && (
            <Badge
              label={discount}
              variant="outline"
              style={styles.badge}
            />
          )}
        </View>

        {/* Wishlist Button */}
        <Pressable style={styles.wishlistButton}>
          <Text style={styles.heartIcon}>♡</Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={[styles.content, isCompact && styles.compactContent]}>
        {showBrand && (
          <Text variant="caption" color="secondary" style={styles.brand}>
            {product.brand}
          </Text>
        )}
        
        <Text
          variant="body"
          numberOfLines={isCompact ? 1 : 2}
          style={styles.name}
        >
          {product.name}
        </Text>

        {showPrice && (
          <View style={styles.priceContainer}>
            <Text variant="body" weight="semibold" color="primary">
              {formatPrice(product.price)}
            </Text>
            {product.originalPrice && (
              <Text variant="caption" color="secondary" style={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </Text>
            )}
          </View>
        )}

        {showVibes && product.vibes.length > 0 && (
          <View style={styles.vibesContainer}>
            {product.vibes.slice(0, 3).map((vibe) => (
              <Badge
                key={vibe}
                label={vibe}
                variant="outline"
                size="small"
                style={styles.vibeBadge}
              />
            ))}
          </View>
        )}

        {/* Rating */}
        {product.rating && (
          <View style={styles.ratingContainer}>
            <Text style={styles.starIcon}>★</Text>
            <Text variant="caption" weight="medium">
              {product.rating}
            </Text>
            {product.reviewCount && (
              <Text variant="caption" color="secondary">
                ({product.reviewCount})
              </Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.card,
    width: SCREEN_WIDTH * 0.44,
  },
  rankingContainer: {
    width: SCREEN_WIDTH * 0.42,
    transform: [{ scale: 1 }],
  },
  compactContainer: {
    width: SCREEN_WIDTH * 0.3,
    flexDirection: 'row',
  },
  imageContainer: {
    aspectRatio: 3 / 4,
    backgroundColor: theme.colors.border,
    position: 'relative',
  },
  rankingImageContainer: {
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    position: 'absolute',
    top: theme.spacing.xs,
    left: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  wishlistButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.card + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 18,
    color: theme.colors.text.secondary,
  },
  content: {
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  compactContent: {
    flex: 1,
    padding: theme.spacing.xs,
  },
  brand: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  vibeBadge: {
    marginRight: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.xs,
  },
  starIcon: {
    fontSize: 12,
    color: '#FFB800',
  },
});
