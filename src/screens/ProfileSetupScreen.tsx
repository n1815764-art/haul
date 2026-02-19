import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

export const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const checkUsername = async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('username', value)
      .single();
    
    setUsernameAvailable(!data);
    setCheckingUsername(false);
  };

  const handleComplete = async () => {
    if (!username || !displayName) {
      Alert.alert('Error', 'Please fill in username and display name');
      return;
    }
    
    if (usernameAvailable === false) {
      Alert.alert('Error', 'Username is already taken');
      return;
    }

    setLoading(true);

    // Upload avatar if selected
    let avatarUrl = null;
    if (avatarUri) {
      const fileName = `${user?.id}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, { uri: avatarUri, type: 'image/jpeg' } as any);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        avatarUrl = publicUrl;
      }
    }

    // Update user profile
    const { error } = await supabase.from('users').upsert({
      id: user?.id,
      email: user?.email,
      username,
      display_name: displayName,
      bio,
      avatar_url: avatarUrl,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      // Navigate to main app
      Alert.alert('Success', 'Profile created!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="h2" style={styles.title}>Set up your profile</Text>
        <Text variant="caption" color={COLORS.textSecondary} style={styles.subtitle}>
          Let's personalize your experience
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              <Avatar uri={avatarUri} name={displayName || 'You'} size="xl" />
              <View style={styles.avatarOverlay}>
                <Text variant="caption" style={styles.changePhotoText}>Change Photo</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Card style={styles.form}>
            <Text variant="label" style={styles.label}>Username *</Text>
            <TextInput
              style={styles.input}
              placeholder="@username"
              placeholderTextColor={COLORS.textSecondary}
              value={username}
              onChangeText={(text) => {
                setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                checkUsername(text);
              }}
              autoCapitalize="none"
            />
            {checkingUsername && (
              <Text variant="caption" color={COLORS.textSecondary}>Checking...</Text>
            )}
            {usernameAvailable === true && (
              <Text variant="caption" color={COLORS.success}>Username available!</Text>
            )}
            {usernameAvailable === false && (
              <Text variant="caption" color={COLORS.error}>Username taken</Text>
            )}

            <Text variant="label" style={styles.label}>Display Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={COLORS.textSecondary}
              value={displayName}
              onChangeText={setDisplayName}
            />

            <Text variant="label" style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about your style..."
              placeholderTextColor={COLORS.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              maxLength={150}
            />
            <Text variant="caption" color={COLORS.textSecondary} style={styles.charCount}>
              {bio.length}/150
            </Text>
          </Card>

          <Button
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleComplete}
            style={styles.button}
          >
            Complete Setup
          </Button>
        </ScrollView>
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
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: SPACING.sm,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
  },
  changePhotoText: {
    color: COLORS.surface,
    textAlign: 'center',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  label: {
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  button: {
    marginBottom: SPACING.xl,
  },
});

export default ProfileSetupScreen;
