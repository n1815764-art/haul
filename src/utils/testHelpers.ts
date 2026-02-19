// Testing helpers for the Haul app

import { render } from '@testing-library/react-native';
import React from 'react';

// Mock providers wrapper
export const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

// Custom render function that includes providers
export const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything from testing-library
export * from '@testing-library/react-native';

// Test IDs for components
export const testIDs = {
  // Screens
  welcomeScreen: 'welcome-screen',
  loginScreen: 'login-screen',
  signUpScreen: 'signup-screen',
  feedScreen: 'feed-screen',
  productDetailScreen: 'product-detail-screen',
  liveStreamScreen: 'live-stream-screen',
  profileScreen: 'profile-screen',
  wishlistScreen: 'wishlist-screen',
  
  // Components
  productCard: 'product-card',
  haulCard: 'haul-card',
  button: 'button',
  input: 'input',
  loadingSpinner: 'loading-spinner',
  errorMessage: 'error-message',
  
  // Navigation
  tabBar: 'tab-bar',
  backButton: 'back-button',
};

// Mock data generators
export const generateMockProduct = (overrides = {}) => ({
  id: `product-${Date.now()}`,
  name: 'Test Product',
  brand: 'Test Brand',
  price: 99,
  images: ['https://example.com/image.jpg'],
  description: 'Test description',
  category: 'Clothing',
  vibes: ['Clean Girl'],
  colors: ['Black'],
  inStock: true,
  retailer: { name: 'Test Retailer' },
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockUser = (overrides = {}) => ({
  id: `user-${Date.now()}`,
  name: 'Test User',
  username: 'testuser',
  avatar: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  isVerified: false,
  vibeBoards: ['Clean Girl'],
  followerCount: 0,
  followingCount: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockHaul = (overrides = {}) => ({
  id: `haul-${Date.now()}`,
  title: 'Test Haul',
  description: 'Test haul description',
  author: generateMockUser(),
  images: ['https://example.com/haul.jpg'],
  products: [],
  vibes: ['Clean Girl'],
  totalPrice: 0,
  likes: 0,
  comments: 0,
  shares: 0,
  saves: 0,
  createdAt: new Date().toISOString(),
  ...overrides,
});

// Async utilities
export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

// Navigation mock helpers
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  setParams: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
});
