import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFollow } from '../context/FollowContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme, VIBE_BOARDS } from '../constants/theme';
import { User } from '../types/social';

interface Props {
  navigation?: any;
}

export const UserSearchScreen: React.FC<Props> = ({ navigation }) => {
  const { searchUsers, suggestedUsers, isFollowing, followUser, unfollowUser } = useFollow();
  
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setSearchResults(searchUsers(query));
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  // Filter by vibe
  const filteredResults = selectedVibe
    ? searchResults.filter(u => u.vibeBoards.includes(selectedVibe))
    : searchResults;

  const renderUserItem = ({ item }: { item: User }) => {
    const isUserFollowing = isFollowing(item.id);

    return (
      <TouchableOpacity 
        style={styles.userItem}
        onPress={() => navigation?.navigate('UserProfile', { userId: item.id })}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text variant="bodyBold">{item.name}</Text>
            {item.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          <Text variant="caption" color="secondary">@{item.username}</Text>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {item.bio}
          </Text>
          
          {/* Common vibes */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.vibesContainer}
          >
            {item.vibeBoards.slice(0, 3).map(vibe => (
              <View key={vibe} style={styles.vibeChip}>
                <Text variant="caption" style={styles.vibeText}>{vibe}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <Button
          variant={isUserFollowing ? 'ghost' : 'primary'}
          size="sm"
          onPress={() => isUserFollowing ? unfollowUser(item.id) : followUser(item.id)}
        >
          {isUserFollowing ? 'Following' : 'Follow'}
        </Button>
      </TouchableOpacity>
    );
  };

  const renderSuggestedUser = (item: User) => {
    const isUserFollowing = isFollowing(item.id);

    return (
      <View key={item.id} style={styles.suggestedCard}>
        <Image source={{ uri: item.avatar }} style={styles.suggestedAvatar} />
        <TouchableOpacity 
          style={styles.suggestedInfo}
          onPress={() => navigation?.navigate('UserProfile', { userId: item.id })}
        >
          <View style={styles.nameRow}>
            <Text variant="bodyBold" numberOfLines={1}>{item.name}</Text>
            {item.isVerified && (
              <Text style={styles.verifiedBadge}>✓</Text>
            )}
          </View>
          <Text variant="caption" color="secondary">@{item.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.followButtonSmall, isUserFollowing && styles.followingButtonSmall]}
          onPress={() => isUserFollowing ? unfollowUser(item.id) : followUser(item.id)}
        >
          <Text variant="caption" style={isUserFollowing ? styles.followingText : styles.followText}>
            {isUserFollowing ? 'Following' : 'Follow'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h1">Discover People</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name or username"
          placeholderTextColor={theme.colors.textSecondary}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Vibe Filter (only when searching) */}
      {query.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vibeFilter}
        >
          <TouchableOpacity
            style={[styles.vibeChipFilter, selectedVibe === null && styles.vibeChipFilterActive]}
            onPress={() => setSelectedVibe(null)}
          >
            <Text variant="caption" style={selectedVibe === null ? styles.vibeChipTextActive : undefined}>
              All Vibes
            </Text>
          </TouchableOpacity>
          {VIBE_BOARDS.slice(0, 6).map(vibe => (
            <TouchableOpacity
              key={vibe.id}
              style={[styles.vibeChipFilter, selectedVibe === vibe.name && styles.vibeChipFilterActive]}
              onPress={() => setSelectedVibe(vibe.name === selectedVibe ? null : vibe.name)}
            >
              <Text variant="caption" style={selectedVibe === vibe.name ? styles.vibeChipTextActive : undefined}>
                {vibe.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Results or Suggested */}
      {query.length > 0 ? (
        <FlatList
          data={filteredResults}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="h3" center>No results found</Text>
              <Text variant="body" color="secondary" center>
                Try searching with different keywords
              </Text>
            </View>
          }
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Suggested Section */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Suggested for You</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestedContainer}
            >
              {suggestedUsers.map(renderSuggestedUser)}
            </ScrollView>
          </View>

          {/* Popular Vibes Section */}
          <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Browse by Vibe</Text>
            <View style={styles.vibesGrid}>
              {VIBE_BOARDS.slice(0, 8).map(vibe => (
                <TouchableOpacity 
                  key={vibe.id} 
                  style={styles.vibeCard}
                  onPress={() => {
                    setSelectedVibe(vibe.name);
                    setQuery(vibe.name);
                  }}
                >
                  <View style={[styles.vibeColor, { backgroundColor: vibe.color }]} />
                  <Text variant="bodyBold" style={styles.vibeCardName}>{vibe.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  clearIcon: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xs,
  },
  vibeFilter: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  vibeChipFilter: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipFilterActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  vibeChipTextActive: {
    color: theme.colors.surface,
  },
  list: {
    padding: theme.spacing.lg,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  vibesContainer: {
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  vibeChip: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vibeText: {
    color: theme.colors.textSecondary,
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  section: {
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  suggestedContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  suggestedCard: {
    width: 140,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  suggestedAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  suggestedInfo: {
    alignItems: 'center',
    width: '100%',
  },
  followButtonSmall: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  followingButtonSmall: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  followText: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  followingText: {
    color: theme.colors.text,
    fontWeight: '600',
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  vibeCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  vibeColor: {
    height: 80,
  },
  vibeCardName: {
    padding: theme.spacing.md,
  },
});
