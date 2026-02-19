export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  subcategory?: string;
  vibes: string[];
  colors: string[];
  sizes?: string[];
  inStock: boolean;
  retailer: {
    name: string;
    logo?: string;
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface Ranking {
  id: string;
  userId: string;
  winnerId: string;
  loserId: string;
  createdAt: string;
}

export interface ProductScore {
  productId: string;
  score: number;
  wins: number;
  losses: number;
  totalRankings: number;
}

export interface ProductMatchup {
  productA: Product;
  productB: Product;
}

export type RankingChoice = 'A' | 'B' | 'skip';

export interface ProductFilter {
  vibes?: string[];
  categories?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  inStock?: boolean;
}

export interface FeedItem {
  type: 'product' | 'matchup' | 'haul' | 'trending';
  data: Product | ProductMatchup | any;
  id: string;
}
