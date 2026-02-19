export interface SearchFilters {
  query?: string;
  vibes?: string[];
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  priceRange?: 'budget' | 'mid' | 'splurge' | 'luxury';
  onSale?: boolean;
  inStock?: boolean;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'popular';
}

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'brand' | 'vibe' | 'user' | 'recent';
  text: string;
  image?: string;
}

export interface TrendingSearch {
  id: string;
  term: string;
  searchCount: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface VoiceSearchResult {
  text: string;
  confidence: number;
}

export interface StyleRecommendation {
  id: string;
  title: string;
  description: string;
  image: string;
  vibes: string[];
  productIds: string[];
}
