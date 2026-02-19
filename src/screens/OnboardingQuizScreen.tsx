import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { COLORS, SPACING, VIBE_BOARDS, PRICE_RANGES, CATEGORIES, BRANDS } from '../constants/theme';

type QuizStep = 'vibes' | 'price' | 'brands' | 'categories' | 'essentials' | 'summary';

export const OnboardingQuizScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState<QuizStep>('vibes');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [essentials, setEssentials] = useState<Record<string, string>>({});

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibeId) 
        ? prev.filter(v => v !== vibeId)
        : [...prev, vibeId]
    );
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges(prev => 
      prev.includes(rangeId)
        ? prev.filter(r => r !== rangeId)
        : [...prev, rangeId]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const selectEssential = (question: string, answer: string) => {
    setEssentials(prev => ({ ...prev, [question]: answer }));
  };

  const handleNext = () => {
    if (currentStep === 'vibes' && selectedVibes.length < 3) {
      Alert.alert('Select at least 3 vibes');
      return;
    }
    
    const steps: QuizStep[] = ['vibes', 'price', 'brands', 'categories', 'essentials', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      // Save and navigate
      navigation.navigate('ProfileSetup' as never);
    }
  };

  const handleBack = () => {
    const steps: QuizStep[] = ['vibes', 'price', 'brands', 'categories', 'essentials', 'summary'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const canSkip = currentStep !== 'vibes';
  const canProceed = {
    vibes: selectedVibes.length >= 3,
    price: selectedPriceRanges.length > 0,
    brands: true, // optional
    categories: selectedCategories.length > 0,
    essentials: Object.keys(essentials).length >= 3,
    summary: true,
  }[currentStep];

  const renderStep = () => {
    switch (currentStep) {
      case 'vibes':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>What's your vibe?</Text>
            <Text variant="caption" color={COLORS.textSecondary} style={styles.stepSubtitle}>
              Pick 3 or more that resonate with you
            </Text>
            <View style={styles.vibeGrid}>
              {VIBE_BOARDS.map(vibe => (
                <TouchableOpacity
                  key={vibe.id}
                  style={[
                    styles.vibeCard,
                    selectedVibes.includes(vibe.id) && styles.vibeCardSelected,
                  ]}
                  onPress={() => toggleVibe(vibe.id)}
                >
                  <View style={[styles.vibeColor, { backgroundColor: vibe.color }]} />
                  <Text variant="bodyBold" center>{vibe.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'price':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Price range that feels right</Text>
            <Text variant="caption" color={COLORS.textSecondary} style={styles.stepSubtitle}>
              You can pick multiple
            </Text>
            <View style={styles.priceContainer}>
              {PRICE_RANGES.map(range => (
                <TouchableOpacity
                  key={range.id}
                  style={[
                    styles.priceCard,
                    selectedPriceRanges.includes(range.id) && styles.priceCardSelected,
                  ]}
                  onPress={() => togglePriceRange(range.id)}
                >
                  <Text variant="h3" center>{range.symbol}</Text>
                  <Text variant="body" center>{range.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'brands':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Brands you love</Text>
            <Text variant="caption" color={COLORS.textSecondary} style={styles.stepSubtitle}>
              Search and select (optional)
            </Text>
            <View style={styles.brandGrid}>
              {BRANDS.slice(0, 12).map(brand => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.brandChip,
                    selectedBrands.includes(brand) && styles.brandChipSelected,
                  ]}
                  onPress={() => toggleBrand(brand)}
                >
                  <Text variant="caption" center>{brand}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'categories':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Categories you shop most</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategories.includes(category) && styles.categoryChipSelected,
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text variant="body" center>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'essentials':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Your essentials</Text>
            <Text variant="caption" color={COLORS.textSecondary} style={styles.stepSubtitle}>
              Fun rapid-fire either/or
            </Text>
            
            {[
              { question: 'Lip gloss or lipstick?', options: ['Lip gloss', 'Lipstick'] },
              { question: 'Gold or silver?', options: ['Gold', 'Silver'] },
              { question: 'Flats or heels?', options: ['Flats', 'Heels'] },
              { question: 'Tote bag or crossbody?', options: ['Tote', 'Crossbody'] },
              { question: 'Candles or diffuser?', options: ['Candles', 'Diffuser'] },
            ].map(({ question, options }) => (
              <Card key={question} style={styles.essentialCard}>
                <Text variant="bodyBold" style={styles.question}>{question}</Text>
                <View style={styles.optionRow}>
                  {options.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        essentials[question] === option && styles.optionButtonSelected,
                      ]}
                      onPress={() => selectEssential(question, option)}
                    >
                      <Text variant="body" center>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            ))}
          </View>
        );

      case 'summary':
        return (
          <View>
            <Text variant="h2" style={styles.stepTitle}>Your Style Profile</Text>
            <Card style={styles.summaryCard}>
              <Text variant="bodyBold" style={styles.summaryTitle}>Style Type</Text>
              <Badge label={selectedVibes[0] || 'Mixed'} variant="primary" />
              
              <Text variant="bodyBold" style={styles.summarySection}>Top Vibes</Text>
              <View style={styles.tagRow}>
                {selectedVibes.map(vibe => (
                  <Badge key={vibe} label={VIBE_BOARDS.find(v => v.id === vibe)?.name || vibe} />
                ))}
              </View>
              
              <Text variant="bodyBold" style={styles.summarySection}>Price Range</Text>
              <Text variant="body">
                {selectedPriceRanges.map(r => PRICE_RANGES.find(p => p.id === r)?.symbol).join(', ')}
              </Text>
              
              <Text variant="bodyBold" style={styles.summarySection}>Categories</Text>
              <Text variant="body">{selectedCategories.join(', ')}</Text>
            </Card>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentStep !== 'vibes' && (
          <Button variant="ghost" size="sm" onPress={handleBack}>Back</Button>
        )}
        {canSkip && (
          <Button variant="ghost" size="sm" onPress={handleNext}>Skip</Button>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.progressBar}>
          {['vibes', 'price', 'brands', 'categories', 'essentials', 'summary'].map((step, index) => (
            <View
              key={step}
              style={[
                styles.progressDot,
                index <= ['vibes', 'price', 'brands', 'categories', 'essentials', 'summary'].indexOf(currentStep) && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        
        <Button
          variant="primary"
          size="lg"
          onPress={handleNext}
          disabled={!canProceed}
          style={styles.nextButton}
        >
          {currentStep === 'summary' ? 'Complete' : 'Continue'}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  content: {
    flex: 1,
    padding: SPACING['2xl'],
  },
  stepTitle: {
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    marginBottom: SPACING.xl,
  },
  vibeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  vibeCard: {
    width: '48%',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  vibeCardSelected: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  vibeColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: SPACING.md,
    alignSelf: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  priceCard: {
    width: '48%',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  priceCardSelected: {
    borderColor: COLORS.primary,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  brandChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  essentialCard: {
    marginBottom: SPACING.md,
  },
  question: {
    marginBottom: SPACING.md,
  },
  optionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  optionButton: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  summaryCard: {
    marginTop: SPACING.lg,
  },
  summaryTitle: {
    marginBottom: SPACING.md,
  },
  summarySection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  footer: {
    padding: SPACING['2xl'],
    paddingTop: 0,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
  nextButton: {
    width: '100%',
  },
});

export default OnboardingQuizScreen;
