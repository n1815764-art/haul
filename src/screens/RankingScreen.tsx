import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { useRanking } from '../context/RankingContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { theme } from '../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const RankingScreen: React.FC = () => {
  const {
    currentMatchup,
    generateNewMatchup,
    submitRanking,
    skipMatchup,
    totalRankings,
  } = useRanking();

  const [selectedChoice, setSelectedChoice] = useState<'A' | 'B' | null>(null);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (!currentMatchup) {
      generateNewMatchup();
    }
  }, []);

  useEffect(() => {
    // Reset animation when matchup changes
    animation.setValue(0);
    setSelectedChoice(null);
  }, [currentMatchup?.productA.id, currentMatchup?.productB.id]);

  const handleChoice = (choice: 'A' | 'B') => {
    setSelectedChoice(choice);
    
    // Animate selection
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      submitRanking(choice);
    });
  };

  const handleSkip = () => {
    skipMatchup();
  };

  if (!currentMatchup) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="h3">Finding your next matchup...</Text>
      </View>
    );
  }

  const { productA, productB } = currentMatchup;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="caption" color="secondary" style={styles.progress}>
          RANKING {totalRankings + 1}
        </Text>
        <Text variant="h2" align="center">
          This or That?
        </Text>
        <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
          Tap your favorite to rank products
        </Text>
      </View>

      {/* Matchup Cards */}
      <View style={styles.matchupContainer}>
        {/* Product A */}
        <Animated.View
          style={[
            styles.cardWrapper,
            selectedChoice === 'A' && {
              transform: [{
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                }),
              }],
            },
            selectedChoice === 'B' && {
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5],
              }),
            },
          ]}
        >
          <View style={styles.cardContainer}>
            <ProductCard
              product={productA}
              variant="ranking"
              onPress={() => handleChoice('A')}
              showPrice={true}
              showBrand={true}
            />
          </View>
          <Button
            title="Pick This"
            variant={selectedChoice === 'A' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => handleChoice('A')}
            style={styles.choiceButton}
          />
        </Animated.View>

        {/* VS Badge */}
        <View style={styles.vsContainer}>
          <View style={styles.vsBadge}>
            <Text variant="caption" weight="bold" color="primary">
              VS
            </Text>
          </View>
        </View>

        {/* Product B */}
        <Animated.View
          style={[
            styles.cardWrapper,
            selectedChoice === 'B' && {
              transform: [{
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.05],
                }),
              }],
            },
            selectedChoice === 'A' && {
              opacity: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5],
              }),
            },
          ]}
        >
          <View style={styles.cardContainer}>
            <ProductCard
              product={productB}
              variant="ranking"
              onPress={() => handleChoice('B')}
              showPrice={true}
              showBrand={true}
            />
          </View>
          <Button
            title="Pick This"
            variant={selectedChoice === 'B' ? 'primary' : 'secondary'}
            size="small"
            onPress={() => handleChoice('B')}
            style={styles.choiceButton}
          />
        </Animated.View>
      </View>

      {/* Skip Button */}
      <Button
        title="Skip This Pair"
        variant="ghost"
        size="small"
        onPress={handleSkip}
        style={styles.skipButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  progress: {
    textAlign: 'center',
    letterSpacing: 2,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
  matchupContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  cardWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  cardContainer: {
    transform: [{ scale: 1 }],
  },
  choiceButton: {
    minWidth: 120,
  },
  vsContainer: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    marginLeft: -20,
    zIndex: 10,
  },
  vsBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.card,
    borderWidth: 2,
    borderColor: theme.colors.sage,
  },
  skipButton: {
    marginBottom: 40,
    alignSelf: 'center',
  },
});
