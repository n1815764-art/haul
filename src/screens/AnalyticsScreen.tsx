import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { theme } from '../constants/theme';
import { mockAnalytics } from '../data/mockAnalytics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper to format currency
const formatCurrency = (amount: number): string => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toFixed(0)}`;
};

// Helper to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};

export const AnalyticsScreen: React.FC = () => {
  const analytics = mockAnalytics;

  // Calculate weekly growth
  const thisWeek = analytics.dailyStats.slice(-7);
  const lastWeek = analytics.dailyStats.slice(-14, -7);
  const thisWeekViews = thisWeek.reduce((sum, d) => sum + d.views, 0);
  const lastWeekViews = lastWeek.reduce((sum, d) => sum + d.views, 0);
  const growthRate = lastWeekViews > 0 
    ? ((thisWeekViews - lastWeekViews) / lastWeekViews) * 100 
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1">Analytics</Text>
          <Text variant="body" color="secondary">Last 30 days</Text>
        </View>

        {/* Overview Stats */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.overviewContainer}
        >
          <View style={styles.statCard}>
            <Text variant="caption" color="secondary">Total Views</Text>
            <Text variant="h2">{formatNumber(analytics.totalViews)}</Text>
            <View style={styles.growthBadge}>
              <Text variant="caption" style={styles.growthText}>
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}%
              </Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text variant="caption" color="secondary">Engagement</Text>
            <Text variant="h2">{formatNumber(analytics.totalEngagement)}</Text>
            <View style={styles.growthBadge}>
              <Text variant="caption" style={styles.growthText}>
                +12.5%
              </Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <Text variant="caption" color="secondary">New Followers</Text>
            <Text variant="h2">{formatNumber(analytics.followerGrowth)}</Text>
            <View style={styles.growthBadge}>
              <Text variant="caption" style={styles.growthText}>
                +8.3%
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Revenue Section */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Revenue</Text>
          <View style={styles.revenueCard}>
            <View style={styles.revenueMain}>
              <View>
                <Text variant="caption" color="secondary">Total Revenue</Text>
                <Text variant="h1" style={styles.revenueAmount}>
                  {formatCurrency(analytics.totalRevenue)}
                </Text>
              </View>
              <View style={styles.commissionBadge}>
                <Text variant="caption" style={styles.commissionText}>
                  {analytics.commissionRate}% commission
                </Text>
              </View>
            </View>

            <View style={styles.revenueGrid}>
              <View style={styles.revenueItem}>
                <Text variant="caption" color="secondary">Pending Payout</Text>
                <Text variant="bodyBold">{formatCurrency(analytics.pendingPayout)}</Text>
              </View>
              <View style={styles.revenueItem}>
                <Text variant="caption" color="secondary">Lifetime Earnings</Text>
                <Text variant="bodyBold">{formatCurrency(analytics.lifetimeEarnings)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Live Stream Stats */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Live Streams</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text variant="caption" color="secondary">Streams</Text>
              <Text variant="h3">{analytics.streamCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="caption" color="secondary">Total Duration</Text>
              <Text variant="h3">{Math.round(analytics.totalStreamDuration / 60)}h</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="caption" color="secondary">Peak Viewers</Text>
              <Text variant="h3">{formatNumber(analytics.peakViewers)}</Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="caption" color="secondary">Avg Viewers</Text>
              <Text variant="h3">{formatNumber(analytics.avgViewers)}</Text>
            </View>
          </View>
        </View>

        {/* Haul Stats */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Haul Performance</Text>
          <View style={styles.haulCard}>
            <View style={styles.haulStat}>
              <Text style={styles.haulIcon}>🛍</Text>
              <Text variant="h3">{analytics.haulCount}</Text>
              <Text variant="caption" color="secondary">Hauls</Text>
            </View>
            <View style={styles.haulStat}>
              <Text style={styles.haulIcon}>♥</Text>
              <Text variant="h3">{formatNumber(analytics.totalLikes)}</Text>
              <Text variant="caption" color="secondary">Likes</Text>
            </View>
            <View style={styles.haulStat}>
              <Text style={styles.haulIcon}>↗</Text>
              <Text variant="h3">{formatNumber(analytics.totalShares)}</Text>
              <Text variant="caption" color="secondary">Shares</Text>
            </View>
            <View style={styles.haulStat}>
              <Text style={styles.haulIcon}>💾</Text>
              <Text variant="h3">{formatNumber(analytics.totalSaves)}</Text>
              <Text variant="caption" color="secondary">Saves</Text>
            </View>
          </View>
        </View>

        {/* Top Products */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Top Performing Products</Text>
          {analytics.topProducts.map((product, index) => (
            <View key={product.id} style={styles.productCard}>
              <Text variant="bodyBold" style={styles.productRank}>#{index + 1}</Text>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text variant="bodyBold" numberOfLines={1}>{product.name}</Text>
                <Text variant="caption" color="secondary">{product.brand}</Text>
                <View style={styles.productStats}>
                  <Text variant="caption">{product.clicks} clicks</Text>
                  <Text variant="caption">{product.conversions} sales</Text>
                </View>
              </View>
              <View style={styles.productRevenue}>
                <Text variant="bodyBold" style={styles.revenueText}>
                  {formatCurrency(product.revenue)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Audience Demographics */}
        <View style={styles.section}>
          <Text variant="h3" style={styles.sectionTitle}>Audience</Text>
          
          {/* Age Groups */}
          <View style={styles.demoCard}>
            <Text variant="bodyBold" style={styles.demoTitle}>Age Groups</Text>
            {analytics.audienceDemographics.ageGroups.map(age => (
              <View key={age.range} style={styles.demoRow}>
                <Text variant="body" style={styles.demoLabel}>{age.range}</Text>
                <View style={styles.demoBar}>
                  <View 
                    style={[styles.demoFill, { width: `${age.percentage}%` }]} 
                  />
                </View>
                <Text variant="caption" style={styles.demoValue}>{age.percentage}%</Text>
              </View>
            ))}
          </View>

          {/* Top Locations */}
          <View style={styles.demoCard}>
            <Text variant="bodyBold" style={styles.demoTitle}>Top Locations</Text>
            {analytics.audienceDemographics.topLocations.map((loc, index) => (
              <View key={loc.city} style={styles.locationRow}>
                <Text variant="bodyBold" style={styles.locationRank}>#{index + 1}</Text>
                <Text variant="body" style={styles.locationName}>{loc.city}</Text>
                <Text variant="caption" color="secondary">{loc.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  overviewContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    minWidth: 140,
    ...theme.shadows.sm,
  },
  growthBadge: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  growthText: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  revenueCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  revenueMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  revenueAmount: {
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  commissionBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  commissionText: {
    color: theme.colors.primary,
  },
  revenueGrid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  revenueItem: {
    gap: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statBox: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  haulCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  haulStat: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  haulIcon: {
    fontSize: 24,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  productRank: {
    width: 30,
    color: theme.colors.primary,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
  },
  productInfo: {
    flex: 1,
    gap: 2,
  },
  productStats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  productRevenue: {
    alignItems: 'flex-end',
  },
  revenueText: {
    color: theme.colors.primary,
  },
  demoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  demoTitle: {
    marginBottom: theme.spacing.md,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  demoLabel: {
    width: 60,
  },
  demoBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
  },
  demoFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  demoValue: {
    width: 40,
    textAlign: 'right',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  locationRank: {
    width: 40,
    color: theme.colors.primary,
  },
  locationName: {
    flex: 1,
  },
});
