/**
 * Haul Design System
 * Feminine-first shopping app aesthetic
 * Editorial magazine meets soft luxury
 */

export const COLORS = {
  // Backgrounds
  background: '#FDF8F4',      // warm cream
  surface: '#FFFFFF',         // white
  
  // Primary colors
  primary: '#A8B5A0',         // muted sage
  secondary: '#E8C4C4',       // soft blush
  accent: '#C4B1D4',          // warm lavender
  
  // Text colors
  text: '#2D2926',            // deep charcoal
  textSecondary: '#8A8279',   // warm gray
  
  // UI colors
  border: '#E8E2DA',          // light warm gray
  success: '#B5C9A8',         // soft green
  error: '#D4808A',           // dusty rose
  gold: '#C4A35A',            // warm gold (premium/leaderboard)
} as const;

export const FONTS = {
  // Editorial serif for headings
  heading: 'PlayfairDisplay',
  
  // Clean sans-serif for body
  body: 'Inter',
  
  // Accent serif for quotes and callouts
  accent: 'CormorantGaramond',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const SHADOWS = {
  // Soft, warm-toned shadows (not harsh black)
  sm: {
    shadowColor: '#8A8279',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#8A8279',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#8A8279',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

export const TYPOGRAPHY = {
  h1: {
    fontFamily: FONTS.heading,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    color: COLORS.text,
  },
  h2: {
    fontFamily: FONTS.heading,
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    color: COLORS.text,
  },
  h3: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    color: COLORS.text,
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    color: COLORS.text,
  },
  bodyBold: {
    fontFamily: FONTS.body,
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: COLORS.text,
  },
  caption: {
    fontFamily: FONTS.body,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    color: COLORS.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
} as const;

// Vibe board options for the app
export const VIBE_BOARDS = [
  { id: 'old_money', name: 'Old Money', color: '#C4A35A' },
  { id: 'clean_girl', name: 'Clean Girl', color: '#A8B5A0' },
  { id: 'coastal_grandma', name: 'Coastal Grandma', color: '#8B9DC3' },
  { id: 'that_girl', name: 'That Girl', color: '#E8C4C4' },
  { id: 'dark_feminine', name: 'Dark Feminine', color: '#4A4A4A' },
  { id: 'cottagecore', name: 'Cottagecore', color: '#B5C9A8' },
  { id: 'streetwear', name: 'Streetwear', color: '#2D2926' },
  { id: 'minimalist', name: 'Minimalist', color: '#8A8279' },
  { id: 'y2k', name: 'Y2K', color: '#C4B1D4' },
  { id: 'coquette', name: 'Coquette', color: '#F4C2C2' },
  { id: 'quiet_luxury', name: 'Quiet Luxury', color: '#D4C4B0' },
  { id: 'sporty_chic', name: 'Sporty Chic', color: '#A8B5A0' },
] as const;

// Price ranges
export const PRICE_RANGES = [
  { id: 'budget', label: 'Budget', symbol: '$' },
  { id: 'mid', label: 'Mid-Range', symbol: '$$' },
  { id: 'splurge', label: 'Splurge', symbol: '$$$' },
  { id: 'luxury', label: 'No Limit', symbol: '$$$$' },
] as const;

// Categories
export const CATEGORIES = [
  'Fashion',
  'Beauty',
  'Skincare',
  'Hair',
  'Home',
  'Tech',
  'Wellness',
  'Accessories',
  'Shoes',
] as const;

// Preloaded brands
export const BRANDS = [
  'Zara',
  'Aritzia',
  'Skims',
  'Glossier',
  'Rare Beauty',
  'Dyson',
  'Lululemon',
  'Mejuri',
  'Sephora',
  'Free People',
  'Revolve',
  'Reformation',
  'Khaite',
  'The Row',
  'Hermès',
  'Chanel',
  'Dior',
  'Charlotte Tilbury',
  'La Mer',
  'Drunk Elephant',
  'Summer Fridays',
  'Saie',
  'Tower 28',
  'Rhode',
] as const;
