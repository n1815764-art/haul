import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRanking } from '../context/RankingContext';
import { Text } from '../components/Text';
import { Badge } from '../components/Badge';
import { theme } from '../constants/theme';
import { mockProducts } from '../data/mockProducts';
import { ProductScore } from '../types/product';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TIME_PERIODS = ['Today', 'This Week', 'This Month', 'All Time'];

export const LeaderboardScreen: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week');
  const { topProducts, totalRankings } = useRanking();

  // Sort products by score and add rank
  const rankedProducts = topProducts
    .map((score) => ({
      ...score,
      product: mockProducts.find(p => p.id === score.productId),
    }))
    .filter(item => item.product)
    .slice(0, 20);

  const renderRankItem = ({ item, index }: { item: typeof rankedProducts[0]; index: number }) => {
    const rank = index + 1;
    const isTop3 = rank <= 3;

    return (
      <Pressable style={styles.rankItem}>
        {/* Rank Number */}
        <View style={[styles.rankNumber, isTop3 && styles.rankNumberTop3]}>
          <Text
            variant="h3"
            color={isTop3 ? 'light' : 'secondary'}
            weight="bold"
          >
            {rank}
          </Text>
        </View>

        {/* Product Image */}
        <Image
          source={{ uri: item.product?.images[0] }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text variant="caption" color="secondary">
            {item.product?.brand}
          </Text>
          <Text variant="body" weight="semibold" numberOfLines={2}>
            {item.product?.name}
          </Text>
          <Text variant="caption" color="secondary">
            {item.wins} wins · {item.losses} losses
          </Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text variant="body" weight="bold" color="primary">
            {Math.round(item.score)}
          </Text>
          <Text variant="caption" color="secondary">
            ELO
          </Text>
        </View>

        {/* Trend */}
        <View style={styles.trendContainer}>
          <Text style={styles.trendIcon}>▲</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1" align="center">Leaderboard</Text>
        <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
          Top ranked products based on {totalRankings} votes
        </Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodContainer}>
        {TIME_PERIODS.map((period) => (
          <Pressable
            key={period}
            onPress={() => setSelectedPeriod(period)}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
          >
            <Text
              variant="caption"
              weight={selectedPeriod === period ? 'semibold' : 'regular'}
              color={selectedPeriod === period ? 'light' : 'secondary'}
            >
              {period}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Podium - Top 3 */}
      {rankedProducts.length >= 3 && (
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <View style={styles.podiumImageContainer}>
              <Image
                source={{ uri: rankedProducts[1].product?.images[0] }}
                style={[styles.podiumImage, styles.podiumImageSecond]}
              />
              <View style={[styles.podiumBadge, styles.podiumBadgeSecond]}>
                <Text variant="caption" weight="bold" color="light">2</Text>
              </View>
            </View>
            <Text variant="body" weight="semibold" align="center" numberOfLines={1}>
              {rankedProducts[1].product?.brand}
            </Text>
            <Text variant="caption" color="secondary" align="center">
              {Math.round(rankedProducts[1].score)} pts
            </Text>
          </View>

          {/* 1st Place */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <View style={styles.podiumImageContainer}>
              <Image
                source={{ uri: rankedProducts[0].product?.images[0] }}
                style={[styles.podiumImage, styles.podiumImageFirst]}
              />
              <View style={[styles.podiumBadge, styles.podiumBadgeFirst]}>
                <Text variant="body" weight="bold" color="light">1</Text>
              </View>
              <View style={styles.crownIcon}>
                <Text style={styles.crown}>👑</Text>
              </View>
            </View>
            <Text variant="body" weight="bold" align="center" numberOfLines={1}>
              {rankedProducts[0].product?.brand}
            </Text>
            <Text variant="caption" color="secondary" align="center">
              {Math.round(rankedProducts[0].score)} pts
            </Text>
          </View>

          {/* 3rd Place */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <View style={styles.podiumImageContainer}>
              <Image
                source={{ uri: rankedProducts[2].product?.images[0] }}
                style={[styles.podiumImage, styles.podiumImageThird]}
              />
              <View style={[styles.podiumBadge, styles.podiumBadgeThird]}>
                <Text variant="caption" weight="bold" color="light">3</Text>
              </View>
            </View>
            <Text variant="body" weight="semibold" align="center" numberOfLines={1}>
              {rankedProducts[2].product?.brand}
            </Text>
            <Text variant="caption" color="secondary" align="center">
              {Math.round(rankedProducts[2].score)} pts
            </Text>
          </View>
        </View>
      )}

      {/* Rankings List */}
      <FlatList
        data={rankedProducts.slice(3)}
        renderItem={renderRankItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          rankedProducts.length > 3 ? (
            <Text variant="label" style={styles.listHeader}>
              MORE RANKINGS
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text variant="h3" align="center">
              No rankings yet!
            </Text>
            <Text variant="body" color="secondary" align="center">
              Start ranking products to see the leaderboard
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  periodContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  periodButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    height: 200,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
    gap: theme.spacing.xs,
  },
  podiumFirst: {
    zIndex: 3,
    marginHorizontal: theme.spacing.md,
  },
  podiumSecond: {
    zIndex: 2,
    marginTop: 40,
  },
  podiumThird: {
    zIndex: 1,
    marginTop: 60,
  },
  podiumImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  podiumImage: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.border,
  },
  podiumImageFirst: {
    width: 100,
    height: 100,
    ...theme.shadows.card,
  },
  podiumImageSecond: {
    width: 80,
    height: 80,
  },
  podiumImageThird: {
    width: 70,
    height: 70,
  },
  podiumBadge: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  podiumBadgeFirst: {
    backgroundColor: '#FFB800',
  },
  podiumBadgeSecond: {
    backgroundColor: '#C0C0C0',
  },
  podiumBadgeThird: {
    backgroundColor: '#CD7F32',
  },
  crownIcon: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
  },
  crown: {
    fontSize: 24,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  listHeader: {
    marginBottom: theme.spacing.md,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  rankNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumberTop3: {
    backgroundColor: theme.colors.primary,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.border,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  scoreContainer: {
    alignItems: 'center',
    minWidth: 50,
  },
  trendContainer: {
    width: 32,
    alignItems: 'center',
  },
  trendIcon: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
