import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { theme, VIBE_BOARDS, CATEGORIES, BRANDS, PRICE_RANGES } from '../constants/theme';
import { mockProducts } from '../data/mockProducts';
import { Product } from '../types/product';
import { SearchFilters, SearchSuggestion, TrendingSearch } from '../types/search';

const trendingSearches: TrendingSearch[] = [
  { id: '1', term: 'Clean Girl Aesthetic', searchCount: 12500, trendDirection: 'up' },
  { id: '2', term: 'Quiet Luxury', searchCount: 9800, trendDirection: 'up' },
  { id: '3', term: 'The Row', searchCount: 8700, trendDirection: 'stable' },
  { id: '4', term: 'Vintage Denim', searchCount: 7600, trendDirection: 'up' },
  { id: '5', term: 'Spring Dresses', searchCount: 6500, trendDirection: 'up' },
  { id: '6', term: 'Khaite', searchCount: 5400, trendDirection: 'stable' },
  { id: '7', term: 'Coastal Grandma', searchCount: 4800, trendDirection: 'up' },
  { id: '8', term: 'Skims', searchCount: 4200, trendDirection: 'stable' },
];

const recentSearches: string[] = [
  'Cashmere sweaters',
  'Minimalist bags',
  'Alo Yoga',
];

export const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Search function
  const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilters = {}) => {
    if (!searchQuery.trim() && !Object.keys(searchFilters).length) {
      setResults([]);
      return;
    }

    let filtered = [...mockProducts];

    // Text search
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.brand.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.vibes.some(v => v.toLowerCase().includes(lowerQuery)) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply filters
    if (searchFilters.vibes?.length) {
      filtered = filtered.filter(p =>
        searchFilters.vibes!.some(v => p.vibes.includes(v))
      );
    }

    if (searchFilters.categories?.length) {
      filtered = filtered.filter(p =>
        searchFilters.categories!.includes(p.category)
      );
    }

    if (searchFilters.brands?.length) {
      filtered = filtered.filter(p =>
        searchFilters.brands!.includes(p.brand)
      );
    }

    if (searchFilters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= searchFilters.minPrice!);
    }

    if (searchFilters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= searchFilters.maxPrice!);
    }

    if (searchFilters.priceRange) {
      const ranges = {
        budget: [0, 100],
        mid: [100, 300],
        splurge: [300, 800],
        luxury: [800, Infinity],
      };
      const [min, max] = ranges[searchFilters.priceRange];
      filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    if (searchFilters.onSale) {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    // Sort
    switch (searchFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        break;
    }

    setResults(filtered);
    setIsSearching(true);
    Keyboard.dismiss();
  }, []);

  // Generate suggestions
  useEffect(() => {
    if (query.length > 0) {
      const lowerQuery = query.toLowerCase();
      const newSuggestions: SearchSuggestion[] = [
        // Product suggestions
        ...mockProducts
          .filter(p => p.name.toLowerCase().includes(lowerQuery))
          .slice(0, 3)
          .map(p => ({
            id: `product-${p.id}`,
            type: 'product' as const,
            text: p.name,
            image: p.images[0],
          })),
        // Brand suggestions
        ...BRANDS
          .filter(b => b.toLowerCase().includes(lowerQuery))
          .slice(0, 2)
          .map(b => ({
            id: `brand-${b}`,
            type: 'brand' as const,
            text: b,
          })),
        // Vibe suggestions
        ...VIBE_BOARDS
          .filter(v => v.name.toLowerCase().includes(lowerQuery))
          .slice(0, 2)
          .map(v => ({
            id: `vibe-${v.id}`,
            type: 'vibe' as const,
            text: v.name,
          })),
      ];
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const toggleFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => {
      const current = prev[key];
      if (Array.isArray(current)) {
        const exists = current.includes(value);
        return {
          ...prev,
          [key]: exists
            ? current.filter(v => v !== value)
            : [...current, value],
        };
      }
      return { ...prev, [key]: current === value ? undefined : value };
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Search</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search products, brands, vibes..."
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={() => performSearch(query, filters)}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setIsSearching(false); }}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={[styles.voiceButton, isListening && styles.voiceButtonActive]}
          onPress={() => setIsListening(!isListening)}
        >
          <Text style={styles.voiceIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          <TouchableOpacity
            style={[styles.filterChip, showFilters && styles.filterChipActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Text variant="caption">
              ⚙️ Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Text>
          </TouchableOpacity>
          
          {VIBE_BOARDS.slice(0, 4).map(vibe => (
            <TouchableOpacity
              key={vibe.id}
              style={[styles.filterChip, filters.vibes?.includes(vibe.name) && styles.filterChipActive]}
              onPress={() => toggleFilter('vibes', vibe.name)}
            >
              <Text 
                variant="caption"
                style={filters.vibes?.includes(vibe.name) ? styles.filterChipTextActive : undefined}
              >
                {vibe.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expanded Filters */}
      {showFilters && (
        <View style={styles.expandedFilters}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text variant="label" style={styles.filterLabel}>Price Range</Text>
              <View style={styles.filterOptions}>
                {PRICE_RANGES.map(range => (
                  <TouchableOpacity
                    key={range.id}
                    style={[styles.filterOption, filters.priceRange === range.id && styles.filterOptionActive]}
                    onPress={() => toggleFilter('priceRange', range.id)}
                  >
                    <Text 
                      variant="caption"
                      style={filters.priceRange === range.id ? styles.filterOptionTextActive : undefined}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.filterSection}>
              <Text variant="label" style={styles.filterLabel}>Categories</Text>
              <View style={styles.filterOptions}>
                {CATEGORIES.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.filterOption, filters.categories?.includes(category) && styles.filterOptionActive]}
                    onPress={() => toggleFilter('categories', category)}
                  >
                    <Text 
                      variant="caption"
                      style={filters.categories?.includes(category) ? styles.filterOptionTextActive : undefined}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort */}
            <View style={styles.filterSection}>
              <Text variant="label" style={styles.filterLabel}>Sort By</Text>
              <View style={styles.filterOptions}>
                {[
                  { id: 'relevance', label: 'Relevance' },
                  { id: 'price-low', label: 'Price: Low to High' },
                  { id: 'price-high', label: 'Price: High to Low' },
                  { id: 'newest', label: 'Newest' },
                  { id: 'popular', label: 'Most Popular' },
                ].map(sort => (
                  <TouchableOpacity
                    key={sort.id}
                    style={[styles.filterOption, filters.sortBy === sort.id && styles.filterOptionActive]}
                    onPress={() => toggleFilter('sortBy', sort.id)}
                  >
                    <Text 
                      variant="caption"
                      style={filters.sortBy === sort.id ? styles.filterOptionTextActive : undefined}
                    >
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button variant="ghost" onPress={clearFilters} style={styles.clearButton}>
              Clear All Filters
            </Button>
          </ScrollView>
        </View>
      )}

      {/* Suggestions */}
      {!isSearching && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map(suggestion => (
            <TouchableOpacity
              key={suggestion.id}
              style={styles.suggestion}
              onPress={() => {
                setQuery(suggestion.text);
                performSearch(suggestion.text);
              }}
            >
              {suggestion.image && (
                <Image source={{ uri: suggestion.image }} style={styles.suggestionImage} />
              )}
              <View style={styles.suggestionContent}>
                <Text variant="body">{suggestion.text}</Text>
                <Text variant="caption" color="secondary" style={styles.suggestionType}>
                  {suggestion.type}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Results or Discovery */}
      {!isSearching ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="h3">Recent</Text>
                <TouchableOpacity>
                  <Text variant="caption" color="primary">Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((term, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => {
                    setQuery(term);
                    performSearch(term);
                  }}
                >
                  <Text style={styles.clockIcon}>🕐</Text>
                  <Text variant="body">{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Trending */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Trending Now</Text>
            <View style={styles.trendingGrid}>
              {trendingSearches.map((trend, index) => (
                <TouchableOpacity
                  key={trend.id}
                  style={styles.trendingItem}
                  onPress={() => {
                    setQuery(trend.term);
                    performSearch(trend.term);
                  }}
                >
                  <Text variant="bodyBold" style={styles.trendNumber}>{index + 1}</Text>
                  <View style={styles.trendContent}>
                    <Text variant="body">{trend.term}</Text>
                    <View style={styles.trendStats}>
                      <Text 
                        variant="caption" 
                        color="secondary"
                        style={trend.trendDirection === 'up' ? styles.trendUp : undefined}
                      >
                        {trend.trendDirection === 'up' ? '📈' : trend.trendDirection === 'down' ? '📉' : '➡️'}
                        {' '}{trend.searchCount.toLocaleString()} searches
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Browse by Vibe */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Browse by Vibe</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.vibesContainer}
            >
              {VIBE_BOARDS.map(vibe => (
                <TouchableOpacity
                  key={vibe.id}
                  style={styles.vibeCard}
                  onPress={() => {
                    toggleFilter('vibes', vibe.name);
                    performSearch('', { ...filters, vibes: [vibe.name] });
                  }}
                >
                  <View style={[styles.vibeColor, { backgroundColor: vibe.color }]} />
                  <Text variant="bodyBold" style={styles.vibeCardName}>{vibe.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      ) : (
        /* Search Results */
        <>
          <View style={styles.resultsHeader}>
            <Text variant="body" color="secondary">
              {results.length} results
            </Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.resultsGrid}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard product={item} variant="feed" showPrice showBrand />
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text variant="h3" center>No results found</Text>
                <Text variant="body" color="secondary" center>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </>
      )}

      {/* Voice Search Overlay */}
      {isListening && (
        <View style={styles.voiceOverlay}>
          <View style={styles.voiceContent}>
            <View style={styles.voicePulse} />
            <Text variant="h2" style={styles.voiceText}>Listening...</Text>
            <Text variant="body" style={styles.voiceSubtext}>
              Say something like "Find me cashmere sweaters"
            </Text>
            <Button variant="primary" onPress={() => setIsListening(false)}>
              Cancel
            </Button>
          </View>
        </View>
      )}
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  clearIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xs,
  },
  voiceButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  voiceButtonActive: {
    backgroundColor: theme.colors.primary + '20',
    borderRadius: theme.borderRadius.md,
  },
  voiceIcon: {
    fontSize: 20,
  },
  filterBar: {
    marginBottom: theme.spacing.md,
  },
  filterChips: {
    paddingHorizontal: theme.spacing.lg,
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
  filterChipTextActive: {
    color: theme.colors.surface,
  },
  expandedFilters: {
    maxHeight: 300,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  filterSection: {
    marginBottom: theme.spacing.lg,
  },
  filterLabel: {
    marginBottom: theme.spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterOptionTextActive: {
    color: theme.colors.surface,
  },
  clearButton: {
    marginTop: theme.spacing.md,
  },
  suggestionsContainer: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionType: {
    textTransform: 'capitalize',
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  clockIcon: {
    fontSize: 16,
  },
  trendingGrid: {
    gap: theme.spacing.md,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  trendNumber: {
    width: 32,
    color: theme.colors.primary,
  },
  trendContent: {
    flex: 1,
  },
  trendStats: {
    marginTop: 2,
  },
  trendUp: {
    color: theme.colors.success,
  },
  vibesContainer: {
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  vibeCard: {
    width: 120,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  vibeColor: {
    height: 80,
  },
  vibeCardName: {
    padding: theme.spacing.md,
  },
  resultsHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  resultsGrid: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 100,
  },
  productWrapper: {
    flex: 1,
    margin: theme.spacing.xs,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  voiceOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceContent: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  voicePulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    opacity: 0.3,
  },
  voiceText: {
    color: '#fff',
  },
  voiceSubtext: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
