import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { theme } from '../constants/theme';
import { mockProducts } from '../data/mockProducts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get product from route params or mock data
  const productId = (route.params as any)?.productId || '1';
  const product = mockProducts.find(p => p.id === productId) || mockProducts[0];

  const formatPrice = (price: number) => `$${price}`;

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return null;
  };

  const discount = calculateDiscount();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images[selectedImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        
        {/* Badges */}
        <View style={styles.badgesContainer}>
          {product.isNew && <Badge label="NEW" variant="accent" style={styles.badge} />}
          {discount && (
            <Badge label={`${discount}% OFF`} variant="outline" style={styles.badge} />
          )}
        </View>

        {/* Back Button */}
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>

        {/* Wishlist Button */}
        <Pressable
          style={styles.wishlistButton}
          onPress={() => setIsWishlisted(!isWishlisted)}
        >
          <Text style={[styles.heartIcon, isWishlisted && styles.heartIconActive]}>
            {isWishlisted ? '♥' : '♡'}
          </Text>
        </Pressable>

        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <View style={styles.thumbnailsContainer}>
            {product.images.map((image, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedImageIndex(index)}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailActive,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Brand & Name */}
        <Text variant="caption" color="secondary" style={styles.brand}>
          {product.brand}
        </Text>
        <Text variant="h2" style={styles.name}>
          {product.name}
        </Text>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text variant="h2" color="primary">
            {formatPrice(product.price)}
          </Text>
          {product.originalPrice && (
            <Text variant="body" color="secondary" style={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </Text>
          )}
        </View>

        {/* Rating */}
        {product.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Text
                  key={star}
                  style={[
                    styles.star,
                    star <= Math.round(product.rating!) && styles.starFilled,
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
            <Text variant="body" weight="medium">
              {product.rating}
            </Text>
            {product.reviewCount && (
              <Text variant="caption" color="secondary">
                ({product.reviewCount} reviews)
              </Text>
            )}
          </View>
        )}

        {/* Description */}
        <Card style={styles.descriptionCard}>
          <Text variant="body" color="secondary">
            {product.description}
          </Text>
        </Card>

        {/* Vibes */}
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionTitle}>
            VIBES
          </Text>
          <View style={styles.vibesContainer}>
            {product.vibes.map((vibe) => (
              <Badge
                key={vibe}
                label={vibe}
                variant="outline"
                style={styles.vibeBadge}
              />
            ))}
          </View>
        </View>

        {/* Colors */}
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionTitle}>
            AVAILABLE COLORS
          </Text>
          <View style={styles.colorsContainer}>
            {product.colors.map((color) => (
              <View key={color} style={styles.colorItem}>
                <View style={styles.colorSwatch}>
                  <View style={[styles.colorFill, { backgroundColor: getColorCode(color) }]} />
                </View>
                <Text variant="caption" color="secondary" style={styles.colorName}>
                  {color}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sizes */}
        {product.sizes && (
          <View style={styles.section}>
            <Text variant="label" style={styles.sectionTitle}>
              SELECT SIZE
            </Text>
            <View style={styles.sizesContainer}>
              {product.sizes.map((size) => (
                <Pressable
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonActive,
                  ]}
                >
                  <Text
                    variant="body"
                    weight={selectedSize === size ? 'semibold' : 'regular'}
                    color={selectedSize === size ? 'light' : 'primary'}
                  >
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Retailer */}
        <Card style={styles.retailerCard}>
          <Text variant="caption" color="secondary">
            SOLD BY
          </Text>
          <Text variant="body" weight="semibold">
            {product.retailer.name}
          </Text>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Add to Wishlist"
            variant="outline"
            onPress={() => setIsWishlisted(!isWishlisted)}
            style={styles.wishlistAction}
          />
          <Button
            title="Shop Now"
            variant="primary"
            onPress={() => {}}
            style={styles.shopButton}
          />
        </View>
      </View>
    </ScrollView>
  );
};

// Helper to map color names to approximate codes
const getColorCode = (color: string): string => {
  const colorMap: Record<string, string> = {
    'Cream': '#F5F5DC',
    'Camel': '#C19A6B',
    'Charcoal': '#36454F',
    'Black': '#000000',
    'Tan': '#D2B48C',
    'Vintage Blue': '#5B7C99',
    'Light Wash': '#B8D4E3',
    'Dark Wash': '#2C3E50',
    'White': '#FFFFFF',
    'Natural': '#F5F5DC',
    'Soft Blue': '#ADD8E6',
    'Sage': '#9CAF88',
    'Espresso': '#4B3621',
    'Floral Print': '#FFB6C1',
    'Pink': '#FFC0CB',
    'Yellow': '#FFFF00',
    'Orange': '#FFA500',
    'Ochre': '#CC7722',
    'Stone': '#928E85',
    'Sienna': '#A0522D',
    'Cocoa': '#D2691E',
    'Beige': '#F5F5DC',
    'Silver': '#C0C0C0',
    'Navy': '#000080',
    'Red': '#FF0000',
    'Forest Green': '#228B22',
    'Olive': '#808000',
    'Burgundy': '#800020',
    'Black/White Tweed': '#333333',
    'Navy Tweed': '#1a237e',
    'Cream Tweed': '#f5f5dc',
    'White/Grey': '#E0E0E0',
    'White/Green': '#E8F5E9',
    'White/Navy': '#E3F2FD',
    'Black/White': '#333333',
    'Milk': '#FFFAF0',
  };
  return colorMap[color] || '#CCCCCC';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: theme.colors.border,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
  },
  badgesContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: theme.colors.text.primary,
  },
  wishlistButton: {
    position: 'absolute',
    top: 60,
    right: theme.spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.card + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 24,
    color: theme.colors.text.secondary,
  },
  heartIconActive: {
    color: theme.colors.accent,
  },
  thumbnailsContainer: {
    position: 'absolute',
    bottom: theme.spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  thumbnailActive: {
    borderColor: theme.colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  brand: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  name: {
    marginTop: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    color: theme.colors.border,
  },
  starFilled: {
    color: '#FFB800',
  },
  descriptionCard: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  vibeBadge: {
    marginRight: 0,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  colorItem: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.card,
  },
  colorFill: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorName: {
    textAlign: 'center',
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sizeButton: {
    minWidth: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  sizeButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  retailerCard: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: 40,
  },
  wishlistAction: {
    flex: 1,
  },
  shopButton: {
    flex: 2,
  },
});
