// Deep linking configuration for the Haul app
export const DEEP_LINK_CONFIG = {
  // Scheme for the app
  scheme: 'haul',
  
  // Prefixes for universal links
  prefixes: ['https://haul.app', 'haul://'],
  
  // Route configuration
  screens: {
    // Product routes
    'product/:productId': 'ProductDetail',
    'p/:productId': 'ProductDetail',
    
    // User routes
    'user/:userId': 'UserProfile',
    'u/:username': 'UserProfile',
    '@:username': 'UserProfile',
    
    // Haul routes
    'haul/:haulId': 'HaulDetail',
    'h/:haulId': 'HaulDetail',
    
    // Stream routes
    'live/:streamId': 'LiveStream',
    'stream/:streamId': 'LiveStream',
    
    // Collection routes
    'collection/:collectionId': 'CollectionDetail',
    'c/:collectionId': 'CollectionDetail',
    
    // Order routes
    'order/:orderId': 'OrderDetail',
    'o/:orderId': 'OrderDetail',
    
    // Search routes
    'search': 'Search',
    'search/:query': 'Search',
    
    // Tab routes
    'discover': 'Feed',
    'rank': 'Rank',
    'live': 'LiveStream',
    'wishlist': 'Wishlist',
    'profile': 'Profile',
  },
};

// Parse deep link URL and return route info
export const parseDeepLink = (url: string): { screen: string; params?: Record<string, string> } | null => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname.slice(1); // Remove leading slash
    const parts = path.split('/');
    
    if (parts.length < 1) return null;
    
    const [type, id] = parts;
    
    // Map URL patterns to screens
    const routeMap: Record<string, { screen: string; paramKey: string }> = {
      'product': { screen: 'ProductDetail', paramKey: 'productId' },
      'p': { screen: 'ProductDetail', paramKey: 'productId' },
      'user': { screen: 'UserProfile', paramKey: 'userId' },
      'u': { screen: 'UserProfile', paramKey: 'username' },
      'haul': { screen: 'HaulDetail', paramKey: 'haulId' },
      'h': { screen: 'HaulDetail', paramKey: 'haulId' },
      'live': { screen: 'LiveStream', paramKey: 'streamId' },
      'stream': { screen: 'LiveStream', paramKey: 'streamId' },
      'collection': { screen: 'CollectionDetail', paramKey: 'collectionId' },
      'c': { screen: 'CollectionDetail', paramKey: 'collectionId' },
      'order': { screen: 'OrderDetail', paramKey: 'orderId' },
      'o': { screen: 'OrderDetail', paramKey: 'orderId' },
    };
    
    const route = routeMap[type];
    if (!route) {
      // Handle tab routes
      const tabRoutes: Record<string, string> = {
        'discover': 'Feed',
        'rank': 'Rank',
        'wishlist': 'Wishlist',
        'profile': 'UserProfile',
        'search': 'Search',
      };
      
      if (tabRoutes[type]) {
        return { screen: tabRoutes[type] };
      }
      
      return null;
    }
    
    return {
      screen: route.screen,
      params: id ? { [route.paramKey]: id } : undefined,
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

// Generate shareable deep link
export const generateDeepLink = (screen: string, params?: Record<string, string>): string => {
  const baseUrl = 'https://haul.app';
  
  const pathMap: Record<string, string> = {
    'ProductDetail': 'product',
    'UserProfile': 'user',
    'HaulDetail': 'haul',
    'LiveStream': 'live',
    'CollectionDetail': 'collection',
    'OrderDetail': 'order',
  };
  
  const path = pathMap[screen];
  if (!path) return baseUrl;
  
  const paramKey = Object.keys(params || {})[0];
  const paramValue = paramKey ? params?.[paramKey] : null;
  
  return paramValue ? `${baseUrl}/${path}/${paramValue}` : `${baseUrl}/${path}`;
};
