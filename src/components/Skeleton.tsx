import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const opacity = new Animated.Value(0.3);

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Pre-built skeleton layouts
export const ProductCardSkeleton: React.FC = () => (
  <View style={styles.card}>
    <Skeleton height={200} borderRadius={theme.borderRadius.md} />
    <Skeleton width="70%" height={16} style={styles.text} />
    <Skeleton width="40%" height={14} style={styles.text} />
    <Skeleton width="50%" height={18} style={styles.text} />
  </View>
);

export const HaulCardSkeleton: React.FC = () => (
  <View style={styles.haulCard}>
    <Skeleton height={180} borderRadius={theme.borderRadius.md} />
    <View style={styles.haulContent}>
      <Skeleton width="80%" height={20} style={styles.text} />
      <Skeleton width="100%" height={40} style={styles.text} />
      <View style={styles.haulFooter}>
        <Skeleton width={60} height={30} borderRadius={theme.borderRadius.full} />
        <Skeleton width={60} height={30} borderRadius={theme.borderRadius.full} />
        <Skeleton width={60} height={30} borderRadius={theme.borderRadius.full} />
      </View>
    </View>
  </View>
);

export const UserListSkeleton: React.FC = () => (
  <View>
    {[1, 2, 3, 4, 5].map((i) => (
      <View key={i} style={styles.userItem}>
        <Skeleton width={50} height={50} borderRadius={25} />
        <View style={styles.userInfo}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={14} />
        </View>
        <Skeleton width={80} height={32} borderRadius={theme.borderRadius.md} />
      </View>
    ))}
  </View>
);

export const FeedSkeleton: React.FC = () => (
  <View>
    <View style={styles.section}>
      <Skeleton width="40%" height={24} style={styles.sectionTitle} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.feedItem}>
            <ProductCardSkeleton />
          </View>
        ))}
      </ScrollView>
    </View>
    <View style={styles.section}>
      <Skeleton width="50%" height={24} style={styles.sectionTitle} />
      {[1, 2].map((i) => (
        <HaulCardSkeleton key={i} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.xs,
    width: 160,
  },
  text: {
    marginTop: theme.spacing.sm,
  },
  haulCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
  },
  haulContent: {
    padding: theme.spacing.md,
  },
  haulFooter: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  feedItem: {
    marginLeft: theme.spacing.lg,
  },
});
