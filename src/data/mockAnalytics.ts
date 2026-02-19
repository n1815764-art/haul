import { AnalyticsData, LiveStats } from '../types/analytics';

export const mockAnalytics: AnalyticsData = {
  totalViews: 456789,
  totalEngagement: 89234,
  followerGrowth: 5234,
  
  streamCount: 24,
  totalStreamDuration: 4320, // minutes
  peakViewers: 2341,
  avgViewers: 456,
  
  haulCount: 15,
  totalLikes: 123456,
  totalShares: 8901,
  totalSaves: 23456,
  
  totalRevenue: 15432.50,
  commissionRate: 10,
  pendingPayout: 2456.80,
  lifetimeEarnings: 45321.90,
  
  dailyStats: [
    { date: '2025-01-20', views: 1234, likes: 234, newFollowers: 12, revenue: 123.50 },
    { date: '2025-01-21', views: 1456, likes: 289, newFollowers: 15, revenue: 145.60 },
    { date: '2025-01-22', views: 1890, likes: 345, newFollowers: 23, revenue: 189.00 },
    { date: '2025-01-23', views: 2134, likes: 412, newFollowers: 18, revenue: 213.40 },
    { date: '2025-01-24', views: 1567, likes: 298, newFollowers: 14, revenue: 156.70 },
    { date: '2025-01-25', views: 2345, likes: 567, newFollowers: 45, revenue: 234.50 },
    { date: '2025-01-26', views: 2890, likes: 678, newFollowers: 34, revenue: 289.00 },
    { date: '2025-01-27', views: 3123, likes: 789, newFollowers: 56, revenue: 312.30 },
    { date: '2025-01-28', views: 2789, likes: 654, newFollowers: 28, revenue: 278.90 },
    { date: '2025-01-29', views: 3234, likes: 876, newFollowers: 67, revenue: 323.40 },
    { date: '2025-01-30', views: 2890, likes: 543, newFollowers: 23, revenue: 289.00 },
    { date: '2025-01-31', views: 3456, likes: 987, newFollowers: 89, revenue: 345.60 },
    { date: '2025-02-01', views: 3678, likes: 1234, newFollowers: 78, revenue: 367.80 },
    { date: '2025-02-02', views: 2987, likes: 876, newFollowers: 45, revenue: 298.70 },
    { date: '2025-02-03', views: 4123, likes: 1456, newFollowers: 123, revenue: 412.30 },
    { date: '2025-02-04', views: 3789, likes: 1098, newFollowers: 67, revenue: 378.90 },
    { date: '2025-02-05', views: 3234, likes: 876, newFollowers: 34, revenue: 323.40 },
    { date: '2025-02-06', views: 4567, likes: 1876, newFollowers: 156, revenue: 456.70 },
    { date: '2025-02-07', views: 4234, likes: 1567, newFollowers: 89, revenue: 423.40 },
    { date: '2025-02-08', views: 3890, likes: 1234, newFollowers: 56, revenue: 389.00 },
    { date: '2025-02-09', views: 5123, likes: 2345, newFollowers: 234, revenue: 512.30 },
    { date: '2025-02-10', views: 4876, likes: 1987, newFollowers: 123, revenue: 487.60 },
    { date: '2025-02-11', views: 4234, likes: 1456, newFollowers: 78, revenue: 423.40 },
    { date: '2025-02-12', views: 5678, likes: 2678, newFollowers: 289, revenue: 567.80 },
    { date: '2025-02-13', views: 5345, likes: 2234, newFollowers: 167, revenue: 534.50 },
    { date: '2025-02-14', views: 4789, likes: 1876, newFollowers: 98, revenue: 478.90 },
    { date: '2025-02-15', views: 6123, likes: 2890, newFollowers: 345, revenue: 612.30 },
    { date: '2025-02-16', views: 5890, likes: 2567, newFollowers: 189, revenue: 589.00 },
    { date: '2025-02-17', views: 5234, likes: 1987, newFollowers: 123, revenue: 523.40 },
    { date: '2025-02-18', views: 6789, likes: 3123, newFollowers: 456, revenue: 678.90 },
  ],
  
  topProducts: [
    {
      id: 'p1',
      name: 'Cashmere Crew Neck Sweater',
      brand: 'Everlane',
      clicks: 12345,
      conversions: 234,
      revenue: 34632,
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200',
    },
    {
      id: 'p2',
      name: 'The Row Ginza Sandals',
      brand: 'The Row',
      clicks: 8765,
      conversions: 123,
      revenue: 104550,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200',
    },
    {
      id: 'p3',
      name: 'Alo Yoga Airlift Leggings',
      brand: 'Alo Yoga',
      clicks: 7654,
      conversions: 456,
      revenue: 44688,
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200',
    },
    {
      id: 'p4',
      name: 'Skims Soft Lounge Set',
      brand: 'Skims',
      clicks: 6543,
      conversions: 345,
      revenue: 40710,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200',
    },
    {
      id: 'p5',
      name: 'Khaite Leather Shoulder Bag',
      brand: 'Khaite',
      clicks: 5432,
      conversions: 89,
      revenue: 106800,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200',
    },
  ],
  
  audienceDemographics: {
    ageGroups: [
      { range: '18-24', percentage: 25 },
      { range: '25-34', percentage: 45 },
      { range: '35-44', percentage: 20 },
      { range: '45+', percentage: 10 },
    ],
    gender: [
      { label: 'Female', percentage: 78 },
      { label: 'Male', percentage: 18 },
      { label: 'Other', percentage: 4 },
    ],
    topLocations: [
      { city: 'New York, NY', percentage: 18 },
      { city: 'Los Angeles, CA', percentage: 14 },
      { city: 'Chicago, IL', percentage: 8 },
      { city: 'Miami, FL', percentage: 7 },
      { city: 'San Francisco, CA', percentage: 6 },
    ],
  },
};

export const mockLiveStats: LiveStats = {
  currentViewers: 1234,
  totalViewers: 5678,
  newFollowers: 45,
  likes: 3421,
  comments: 234,
  shares: 89,
  duration: 3600, // seconds
};
