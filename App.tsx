import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RankingProvider } from './src/context/RankingContext';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OnboardingQuizScreen } from './src/screens/OnboardingQuizScreen';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { ProductFeedScreen } from './src/screens/ProductFeedScreen';
import { RankingScreen } from './src/screens/RankingScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { theme } from './src/constants/theme';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
  Onboarding: undefined;
  ProfileSetup: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main app tabs/screens after authentication
const MainNavigator: React.FC = () => {
  // For now, we'll use a simple stack for the main screens
  // In a real app, this would be a BottomTabNavigator
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={ProductFeedScreen} />
      <Stack.Screen name="Rank" component={RankingScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RankingProvider>
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
              {/* Auth Flow */}
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              
              {/* Onboarding */}
              <Stack.Screen name="Onboarding" component={OnboardingQuizScreen} />
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
              
              {/* Main App - Phase 2 */}
              <Stack.Screen name="Feed" component={ProductFeedScreen} />
              <Stack.Screen name="Rank" component={RankingScreen} />
              <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            </Stack.Navigator>
            <StatusBar style="dark" />
          </NavigationContainer>
        </RankingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
