import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Navigate to main app (handled by auth state change)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>Welcome Back</Text>
        <Text variant="caption" color={COLORS.textSecondary} style={styles.subtitle}>
          Log in to continue shopping with friends
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
            variant="ghost"
            size="sm"
            onPress={() => navigation.navigate('ForgotPassword' as never)}
            style={styles.forgotButton}
          >
            Forgot password?
          </Button>

          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleLogin}
            style={styles.button}
          >
            Log In
          </Button>
        </Card>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('SignUp' as never)}
        >
          Don't have an account? Sign up
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.md,
  },
  button: {
    marginTop: SPACING.sm,
  },
});

export default LoginScreen;
