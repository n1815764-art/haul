import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Contexts
import { AuthProvider } from './src/context/AuthContext';
import { RankingProvider } from './src/context/RankingContext';
import { LiveStreamProvider } from './src/context/LiveStreamContext';
import { FollowProvider } from './src/context/FollowContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { OrderProvider } from './src/context/OrderContext';

// Screens - Phase 1 (Auth & Onboarding)
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingQuizScreen } from './src/screens/OnboardingQuizScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';

// Screens - Phase 2 (Product Feed & Ranking)
import { ProductFeedScreen } from './src/screens/ProductFeedScreen';
import { RankingScreen } from './src/screens/RankingScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';

// Screens - Phase 3 (Live Streaming & Hauls)
import { LiveStreamScreen } from './src/screens/LiveStreamScreen';
import { CreateHaulScreen } from './src/screens/CreateHaulScreen';

// Screens - Phase 4 (Social Features)
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { FollowersScreen } from './src/screens/FollowersScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { UserSearchScreen } from './src/screens/UserSearchScreen';

// Screens - Phase 5 (Wishlists & Collections)
import { WishlistScreen } from './src/screens/WishlistScreen';

// Screens - Phase 6 (Search & Discovery)
import { SearchScreen } from './src/screens/SearchScreen';

// Screens - Phase 7 (Notifications)
import { NotificationScreen } from './src/screens/NotificationScreen';

// Screens - Phase 8 (Order Tracking)
import { OrdersScreen } from './src/screens/OrdersScreen';
import { OrderDetailScreen } from './src/screens/OrderDetailScreen';

// Screens - Phase 9 (Analytics)
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';

// Theme
import { theme } from './src/constants/theme';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Navigation types
export type RootStackParamList = {
  // Auth
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
  
  // Main App
  Feed: undefined;
  Rank: undefined;
  Leaderboard: undefined;
  ProductDetail: { productId: string };
  
  // Live & Hauls
  LiveStream: { streamId?: string };
  CreateHaul: undefined;
  
  // Social
  UserProfile: { userId?: string; username?: string };
  Followers: { userId?: string; initialTab?: 'followers' | 'following' };
  Activity: undefined;
  UserSearch: undefined;
  
  // Wishlist
  Wishlist: undefined;
  
  // Search
  Search: undefined;
  
  // Notifications
  Notifications: undefined;
  
  // Orders
  Orders: undefined;
  OrderDetail: { orderId: string };
  
  // Analytics
  Analytics: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <RankingProvider>
            <LiveStreamProvider>
              <FollowProvider>
                <WishlistProvider>
                  <NotificationProvider>
                    <OrderProvider>
                      <NavigationContainer>
                        <Stack.Navigator
                          initialRouteName="Welcome"
                          screenOptions={{
                            headerShown: false,
                            contentStyle: {
                              backgroundColor: theme.colors.background,
                            },
                          }}
                        >
                          {/* Auth Flow - Phase 1 */}
                          <Stack.Screen name="Welcome" component={WelcomeScreen} />
                          <Stack.Screen name="SignUp" component={SignUpScreen} />
                          <Stack.Screen name="Login" component={LoginScreen} />
                          
                          {/* Onboarding - Phase 1 */}
                          <Stack.Screen name="Onboarding" component={OnboardingQuizScreen} />
                          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
                          
                          {/* Main App - Phase 2 */}
                          <Stack.Screen name="Feed" component={ProductFeedScreen} />
                          <Stack.Screen name="Rank" component={RankingScreen} />
                          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                          
                          {/* Live Streaming & Hauls - Phase 3 */}
                          <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
                          <Stack.Screen name="CreateHaul" component={CreateHaulScreen} />
                          
                          {/* Social Features - Phase 4 */}
                          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
                          <Stack.Screen name="Followers" component={FollowersScreen} />
                          <Stack.Screen name="Activity" component={ActivityScreen} />
                          <Stack.Screen name="UserSearch" component={UserSearchScreen} />
                          
                          {/* Wishlists - Phase 5 */}
                          <Stack.Screen name="Wishlist" component={WishlistScreen} />
                          
                          {/* Search & Discovery - Phase 6 */}
                          <Stack.Screen name="Search" component={SearchScreen} />
                          
                          {/* Notifications - Phase 7 */}
                          <Stack.Screen name="Notifications" component={NotificationScreen} />
                          
                          {/* Order Tracking - Phase 8 */}
                          <Stack.Screen name="Orders" component={OrdersScreen} />
                          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
                          
                          {/* Analytics - Phase 9 */}
                          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
                        </Stack.Navigator>
                        <StatusBar style="dark" />
                      </NavigationContainer>
                    </OrderProvider>
                  </NotificationProvider>
                </WishlistProvider>
              </FollowProvider>
            </LiveStreamProvider>
          </RankingProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
