import { Image } from 'react-native';

// Image optimization configuration
export const IMAGE_CONFIG = {
  // Default sizes for different contexts
  sizes: {
    thumbnail: { width: 100, height: 100 },
    feed: { width: 300, height: 400 },
    detail: { width: 600, height: 800 },
    avatar: { width: 200, height: 200 },
  },
  
  // Quality settings
  quality: {
    low: 0.3,
    medium: 0.6,
    high: 0.9,
  },
  
  // Cache duration in seconds
  cacheDuration: 7 * 24 * 60 * 60, // 7 days
};

// Get optimized image URL with query params for resizing
export const getOptimizedImageUrl = (
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'low' | 'medium' | 'high';
  } = {}
): string => {
  // For Unsplash images, use their optimization API
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    
    if (options.width) {
      params.append('w', options.width.toString());
    }
    if (options.height) {
      params.append('h', options.height.toString());
    }
    if (options.quality) {
      params.append('q', (IMAGE_CONFIG.quality[options.quality] * 100).toString());
    }
    
    // Add fit=crop for consistent sizing
    params.append('fit', 'crop');
    
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${params.toString()}`;
  }
  
  return url;
};

// Preload images for faster rendering
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => 
      Image.prefetch(url).catch(err => {
        console.warn('Failed to preload image:', url, err);
      })
    )
  );
};

// Get blurhash placeholder (mock implementation)
export const getBlurhashPlaceholder = (): string => {
  // In a real app, you'd store blurhash strings with your images
  return 'LEHV6nWB2yk8pyo0adR*.7kCMdnj';
};
