import 'dotenv/config';

// Environment configuration
export const ENV = {
  // App info
  APP_NAME: process.env.APP_NAME || 'Haul',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  BUILD_NUMBER: process.env.BUILD_NUMBER || '1',
  
  // API endpoints
  API_URL: process.env.API_URL || 'https://api.haul.app',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  
  // Features
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
  ENABLE_CRASHLYTICS: process.env.ENABLE_CRASHLYTICS === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.ENABLE_PUSH_NOTIFICATIONS !== 'false',
  
  // Deep linking
  DEEP_LINK_DOMAIN: process.env.DEEP_LINK_DOMAIN || 'haul.app',
  
  // Third party services
  STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || '',
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_STAGING: process.env.NODE_ENV === 'staging',
};

// Feature flags
export const FEATURES = {
  // Social features
  LIVE_STREAMING: true,
  HAULS: true,
  SOCIAL_FOLLOW: true,
  ACTIVITY_FEED: true,
  
  // Shopping features
  WISHLIST: true,
  ORDER_TRACKING: true,
  PRICE_ALERTS: true,
  
  // Creator features
  ANALYTICS: true,
  CREATOR_TOOLS: true,
  AFFILIATE_PROGRAM: true,
  
  // Discovery features
  VOICE_SEARCH: true,
  VISUAL_SEARCH: false, // Coming soon
  STYLE_RECOMMENDATIONS: true,
};
