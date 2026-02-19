import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { COLORS, SPACING } from '../constants/theme';

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text variant="h1" center style={styles.title}>
            Haul
          </Text>
          <Text variant="body" center color={COLORS.textSecondary}>
            Shop what your friends actually love
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('SignUp' as never)}
            style={styles.button}
          >
            Sign Up
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onPress={() => navigation.navigate('Login' as never)}
            style={styles.button}
          >
            I have an account
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING['2xl'],
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  buttonContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  button: {
    width: '100%',
  },
});

export default WelcomeScreen;
