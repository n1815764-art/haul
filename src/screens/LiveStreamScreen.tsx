import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLiveStream } from '../context/LiveStreamContext';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { theme } from '../constants/theme';
import { LiveStream, ChatMessage } from '../types/stream';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Helper to format viewer count
const formatCount = (count: number): string => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Helper to format duration
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const LiveStreamScreen: React.FC<{ route?: { params?: { streamId?: string } } }> = ({ route }) => {
  const {
    currentStream,
    chatMessages,
    streamState,
    streamRole,
    joinStream,
    leaveStream,
    endStream,
    sendChatMessage,
    toggleMute,
    toggleCamera,
    likeStream,
    getLiveStreams,
  } = useLiveStream();

  const [messageText, setMessageText] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const chatListRef = useRef<FlatList>(null);

  const streamId = route?.params?.streamId;
  const streams = getLiveStreams();

  // Auto-join stream if streamId provided
  useEffect(() => {
    if (streamId && !currentStream) {
      joinStream(streamId);
    }
    return () => {
      if (currentStream) {
        leaveStream();
      }
    };
  }, [streamId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatMessages.length > 0 && chatListRef.current) {
      chatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendChatMessage(messageText.trim());
      setMessageText('');
    }
  };

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={styles.chatMessage}>
      {item.user.isHost && <View style={styles.hostBadge}><Text variant="caption" style={styles.hostBadgeText}>HOST</Text></View>}
      <Text variant="bodyBold" style={styles.chatUsername}>{item.user.name}</Text>
      <Text variant="body" style={styles.chatText}>{item.text}</Text>
    </View>
  );

  // Stream discovery view
  if (!currentStream) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.discoveryHeader}>
          <Text variant="h1">Live</Text>
          <Text variant="body" color="secondary">
            {streams.length} streams happening now
          </Text>
        </View>

        {/* Vibe Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vibeFilter}
        >
          <TouchableOpacity
            style={[styles.vibeChip, selectedVibe === null && styles.vibeChipActive]}
            onPress={() => setSelectedVibe(null)}
          >
            <Text variant="body" style={selectedVibe === null ? styles.vibeChipTextActive : undefined}>All</Text>
          </TouchableOpacity>
          {['Clean Girl', 'Y2K', 'Quiet Luxury', 'Cottagecore', 'Dark Feminine'].map(vibe => (
            <TouchableOpacity
              key={vibe}
              style={[styles.vibeChip, selectedVibe === vibe && styles.vibeChipActive]}
              onPress={() => setSelectedVibe(vibe === selectedVibe ? null : vibe)}
            >
              <Text variant="body" style={selectedVibe === vibe ? styles.vibeChipTextActive : undefined}>{vibe}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stream Grid */}
        <FlatList
          data={selectedVibe ? streams.filter(s => s.vibes.includes(selectedVibe)) : streams}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.streamGrid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.streamCard}
              onPress={() => joinStream(item.id)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text variant="caption" style={styles.liveText}>LIVE</Text>
              </View>
              <View style={styles.streamOverlay}>
                <Text variant="caption" style={styles.viewerCount}>
                  👁 {formatCount(item.viewerCount)}
                </Text>
              </View>
              <View style={styles.streamInfo}>
                <Text variant="bodyBold" numberOfLines={1}>{item.title}</Text>
                <View style={styles.hostRow}>
                  <Image source={{ uri: item.host.avatar }} style={styles.hostAvatar} />
                  <Text variant="caption" numberOfLines={1} style={styles.hostName}>
                    {item.host.name}
                  </Text>
                  {item.host.isVerified && (
                    <Text style={styles.verifiedBadge}>✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text variant="h3" center>No live streams</Text>
              <Text variant="body" color="secondary" center>
                Check back later for new streams
              </Text>
            </View>
          }
        />

        {/* Go Live Button */}
        <View style={styles.goLiveContainer}>
          <Button variant="primary" onPress={() => {}}>
            Go Live
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  // Active stream view
  return (
    <View style={styles.streamContainer}>
      {/* Stream Video/Thumbnail */}
      <Image source={{ uri: currentStream.thumbnail }} style={styles.streamBackground} />
      <View style={styles.streamOverlayFull} />

      {/* Header */}
      <SafeAreaView style={styles.streamHeader}>
        <View style={styles.hostInfo}>
          <Image source={{ uri: currentStream.host.avatar }} style={styles.streamHostAvatar} />
          <View>
            <Text variant="bodyBold" style={styles.streamHostName}>{currentStream.host.name}</Text>
            <Text variant="caption" style={styles.viewerInfo}>
              {formatCount(currentStream.viewerCount)} viewers
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {streamRole === 'broadcaster' && (
            <View style={styles.durationBadge}>
              <View style={styles.recordingDot} />
              <Text variant="caption" style={styles.durationText}>
                {formatDuration(streamState.duration)}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={leaveStream}>
            <Text variant="bodyBold" style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text variant="h3" style={styles.streamTitle}>{currentStream.title}</Text>
        <View style={styles.vibeTags}>
          {currentStream.vibes.map(vibe => (
            <View key={vibe} style={styles.vibeTag}>
              <Text variant="caption" style={styles.vibeTagText}>{vibe}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Chat */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <FlatList
          ref={chatListRef}
          data={chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderChatMessage}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />

        {/* Chat Input */}
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Say something..."
            placeholderTextColor={theme.colors.textSecondary}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text variant="bodyBold" style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Actions */}
      <SafeAreaView style={styles.bottomActions} edges={['bottom']}>
        {streamRole === 'broadcaster' ? (
          // Broadcaster controls
          <View style={styles.broadcasterControls}>
            <TouchableOpacity
              style={[styles.controlButton, streamState.isMuted && styles.controlButtonActive]}
              onPress={toggleMute}
            >
              <Text style={styles.controlIcon}>{streamState.isMuted ? '🔇' : '🎤'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, !streamState.isCameraOn && styles.controlButtonActive]}
              onPress={toggleCamera}
            >
              <Text style={styles.controlIcon}>{streamState.isCameraOn ? '📹' : '🚫'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.endStreamButton} onPress={endStream}>
              <Text variant="bodyBold" style={styles.endStreamText}>End Stream</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Viewer controls
          <View style={styles.viewerControls}>
            <TouchableOpacity style={styles.likeButton} onPress={likeStream}>
              <Text style={styles.likeIcon}>♡</Text>
              <Text variant="caption" style={styles.likeCount}>
                {formatCount(currentStream.likes)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  discoveryHeader: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  vibeFilter: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  vibeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vibeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  vibeChipTextActive: {
    color: theme.colors.surface,
  },
  streamGrid: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  streamCard: {
    flex: 1,
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  streamThumbnail: {
    width: '100%',
    height: 160,
  },
  liveBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontWeight: '700',
  },
  streamOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  viewerCount: {
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  streamInfo: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  hostAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  hostName: {
    flex: 1,
  },
  verifiedBadge: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  emptyState: {
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  goLiveContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  // Active Stream Styles
  streamContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  streamBackground: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  streamOverlayFull: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  streamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  streamHostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
  },
  streamHostName: {
    color: '#fff',
  },
  viewerInfo: {
    color: 'rgba(255,255,255,0.8)',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
  },
  durationText: {
    color: '#fff',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  streamTitle: {
    color: '#fff',
    marginBottom: theme.spacing.sm,
  },
  vibeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  vibeTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  vibeTagText: {
    color: '#fff',
  },
  chatContainer: {
    flex: 1,
    marginTop: theme.spacing.lg,
  },
  chatList: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  chatMessage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },
  hostBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hostBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  chatUsername: {
    color: '#fff',
  },
  chatText: {
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: '#fff',
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
  },
  bottomActions: {
    padding: theme.spacing.lg,
  },
  broadcasterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#FF3B30',
  },
  controlIcon: {
    fontSize: 24,
  },
  endStreamButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  endStreamText: {
    color: '#fff',
  },
  viewerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  likeIcon: {
    fontSize: 24,
    color: '#fff',
  },
  likeCount: {
    color: '#fff',
  },
  shareButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareIcon: {
    fontSize: 24,
    color: '#fff',
  },
});
