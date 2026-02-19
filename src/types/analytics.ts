export interface AnalyticsData {
  // Overview
  totalViews: number;
  totalEngagement: number;
  followerGrowth: number;
  
  // Live Streams
  streamCount: number;
  totalStreamDuration: number;
  peakViewers: number;
  avgViewers: number;
  
  // Hauls
  haulCount: number;
  totalLikes: number;
  totalShares: number;
  totalSaves: number;
  
  // Revenue
  totalRevenue: number;
  commissionRate: number;
  pendingPayout: number;
  lifetimeEarnings: number;
  
  // Time series data
  dailyStats: DailyStat[];
  topProducts: TopProduct[];
  audienceDemographics: Demographics;
}

export interface DailyStat {
  date: string;
  views: number;
  likes: number;
  newFollowers: number;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  brand: string;
  clicks: number;
  conversions: number;
  revenue: number;
  image: string;
}

export interface Demographics {
  ageGroups: { range: string; percentage: number }[];
  gender: { label: string; percentage: number }[];
  topLocations: { city: string; percentage: number }[];
}

export interface LiveStats {
  currentViewers: number;
  totalViewers: number;
  newFollowers: number;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
}
