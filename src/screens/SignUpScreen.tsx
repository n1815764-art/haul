import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Check your email to confirm your account!');
      navigation.navigate('OnboardingQuiz' as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>Create Account</Text>
        <Text variant="caption" color={COLORS.textSecondary} style={styles.subtitle}>
          Join the community of style-savvy shoppers
        </Text>

        <Card style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={COLORS.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={COLORS.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSignUp}
            style={styles.button}
          >
            Sign Up
          </Button>
        </Card>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('Login' as never)}
        >
          Already have an account? Log in
        </Button>
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
    justifyContent: 'center',
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING['2xl'],
  },
  form: {
    marginBottom: SPACING.xl,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    marginTop: SPACING.sm,
  },
});

export default SignUpScreen;
