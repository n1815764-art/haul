import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRanking } from '../context/RankingContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { Badge } from '../components/Badge';
import { theme } from '../constants/theme';
import { mockProducts, getTrendingProducts, getNewArrivals } from '../data/mockProducts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = ['All', 'Clothing', 'Shoes', 'Accessories', 'Activewear'];

export const ProductFeedScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const { topProducts } = useRanking();

  const trendingProducts = getTrendingProducts();
  const newArrivals = getNewArrivals();

  const filteredProducts = selectedCategory === 'All'
    ? mockProducts
    : mockProducts.filter(p => p.category === selectedCategory);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderCategoryChip = (category: string) => (
    <Button
      key={category}
      title={category}
      variant={selectedCategory === category ? 'primary' : 'outline'}
      size="small"
      onPress={() => setSelectedCategory(category)}
      style={styles.categoryChip}
    />
  );

  const renderSection = (title: string, products: typeof mockProducts, showRank?: boolean) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text variant="h3">{title}</Text>
        <Button title="See All" variant="ghost" size="small" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {products.map((product, index) => (
          <View key={product.id} style={styles.productWrapper}>
            {showRank && index < 3 && (
              <View style={[styles.rankBadge, index === 0 && styles.rankBadgeFirst]}>
                <Text variant="caption" weight="bold" color="light">
                  #{index + 1}
                </Text>
              </View>
            )}
            <ProductCard
              product={product}
              variant="feed"
              showPrice
              showBrand
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'content' }]}
      renderItem={() => (
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="h1">Discover</Text>
            <Text variant="body" color="secondary">
              Find your next favorite pieces
            </Text>
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map(renderCategoryChip)}
          </ScrollView>

          {/* Rank & Win CTA */}
          <View style={styles.rankCTA}>
            <View style={styles.rankCTAContent}>
              <Text variant="h3" color="light">
                Help Shape the Rankings
              </Text>
              <Text variant="body" color="light" style={styles.rankCTASubtitle}>
                Vote on products you love and discover new favorites
              </Text>
              <Button
                title="Start Ranking"
                variant="light"
                onPress={() => {}}
                style={styles.rankCTAButton}
              />
            </View>
          </View>

          {/* Trending Section */}
          {trendingProducts.length > 0 && renderSection('Trending Now', trendingProducts)}

          {/* Top Ranked Section */}
          {topProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="h3">Top Ranked</Text>
                <Button title="See All" variant="ghost" size="small" />
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {topProducts.map((score, index) => {
                  const product = mockProducts.find(p => p.id === score.productId);
                  if (!product) return null;
                  return (
                    <View key={product.id} style={styles.productWrapper}>
                      <View style={[styles.rankBadge, index === 0 && styles.rankBadgeFirst]}>
                        <Text variant="caption" weight="bold" color="light">
                          #{index + 1}
                        </Text>
                      </View>
                      <ProductCard
                        product={product}
                        variant="feed"
                        showPrice
                        showBrand
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* New Arrivals Section */}
          {newArrivals.length > 0 && renderSection('New Arrivals', newArrivals)}

          {/* All Products Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text variant="h3">
                {selectedCategory === 'All' ? 'All Products' : selectedCategory}
              </Text>
            </View>
            <View style={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="feed"
                  showPrice
                  showBrand
                />
              ))}
            </View>
          </View>
        </View>
      )}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryChip: {
    marginRight: theme.spacing.xs,
  },
  rankCTA: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  rankCTAContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  rankCTASubtitle: {
    opacity: 0.9,
  },
  rankCTAButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  horizontalScroll: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  productWrapper: {
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.text.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    ...theme.shadows.card,
  },
  rankBadgeFirst: {
    backgroundColor: '#FFB800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
