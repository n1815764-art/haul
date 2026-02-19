import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { LiveStream, ChatMessage, StreamState, StreamRole, Haul } from '../types/stream';
import { mockLiveStreams, mockChatMessages, mockHauls } from '../data/mockStreams';

interface LiveStreamContextType {
  // Live streams
  liveStreams: LiveStream[];
  currentStream: LiveStream | null;
  chatMessages: ChatMessage[];
  
  // Stream state
  streamState: StreamState;
  streamRole: StreamRole;
  
  // Actions
  joinStream: (streamId: string) => void;
  leaveStream: () => void;
  startStream: (title: string, vibes: string[]) => void;
  endStream: () => void;
  sendChatMessage: (text: string) => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  likeStream: () => void;
  
  // Hauls
  hauls: Haul[];
  createHaul: (haul: Omit<Haul, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'saves'>) => void;
  likeHaul: (haulId: string) => void;
  saveHaul: (haulId: string) => void;
  getHaulById: (haulId: string) => Haul | undefined;
  
  // Discovery
  getLiveStreams: (filters?: { vibes?: string[] }) => LiveStream[];
  getUpcomingStreams: () => LiveStream[];
  getTrendingHauls: () => Haul[];
  getHaulsByVibe: (vibes: string[]) => Haul[];
}

const LiveStreamContext = createContext<LiveStreamContextType | undefined>(undefined);

export const LiveStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(mockLiveStreams);
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [streamRole, setStreamRole] = useState<StreamRole>('viewer');
  const [hauls, setHauls] = useState<Haul[]>(mockHauls);
  const [streamState, setStreamState] = useState<StreamState>({
    isStreaming: false,
    isMuted: false,
    isCameraOn: true,
    viewerCount: 0,
    duration: 0,
  });

  // Timer ref for stream duration
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Join a stream
  const joinStream = useCallback((streamId: string) => {
    const stream = liveStreams.find(s => s.id === streamId);
    if (stream) {
      setCurrentStream(stream);
      setStreamRole('viewer');
      setChatMessages(mockChatMessages[streamId] || []);
      
      // Update viewer count
      setLiveStreams(prev => prev.map(s => 
        s.id === streamId 
          ? { ...s, viewerCount: s.viewerCount + 1 }
          : s
      ));
      
      setStreamState(prev => ({
        ...prev,
        viewerCount: stream.viewerCount + 1,
      }));
    }
  }, [liveStreams]);

  // Leave current stream
  const leaveStream = useCallback(() => {
    if (currentStream) {
      // Update viewer count
      setLiveStreams(prev => prev.map(s => 
        s.id === currentStream.id 
          ? { ...s, viewerCount: Math.max(0, s.viewerCount - 1) }
          : s
      ));
    }
    
    setCurrentStream(null);
    setChatMessages([]);
    setStreamRole('viewer');
    setStreamState({
      isStreaming: false,
      isMuted: false,
      isCameraOn: true,
      viewerCount: 0,
      duration: 0,
    });
  }, [currentStream]);

  // Start broadcasting
  const startStream = useCallback((title: string, vibes: string[]) => {
    const newStream: LiveStream = {
      id: `stream-${Date.now()}`,
      title,
      host: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        isVerified: false,
        followerCount: 0,
      },
      thumbnail: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800',
      viewerCount: 0,
      totalViewers: 0,
      isLive: true,
      startedAt: new Date().toISOString(),
      vibes,
      products: [],
      likes: 0,
    };
    
    setLiveStreams(prev => [newStream, ...prev]);
    setCurrentStream(newStream);
    setStreamRole('broadcaster');
    setChatMessages([]);
    setStreamState({
      isStreaming: true,
      isMuted: false,
      isCameraOn: true,
      viewerCount: 0,
      duration: 0,
    });
    
    // Start duration timer
    timerRef.current = setInterval(() => {
      setStreamState(prev => ({
        ...prev,
        duration: prev.duration + 1,
      }));
    }, 1000);
  }, []);

  // End broadcast
  const endStream = useCallback(() => {
    if (currentStream && timerRef.current) {
      clearInterval(timerRef.current);
      
      setLiveStreams(prev => prev.map(s => 
        s.id === currentStream.id 
          ? { ...s, isLive: false, endedAt: new Date().toISOString() }
          : s
      ));
      
      setCurrentStream(null);
      setStreamRole('viewer');
      setStreamState({
        isStreaming: false,
        isMuted: false,
        isCameraOn: true,
        viewerCount: 0,
        duration: 0,
      });
    }
  }, [currentStream]);

  // Send chat message
  const sendChatMessage = useCallback((text: string) => {
    if (!currentStream) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      streamId: currentStream.id,
      user: {
        id: 'current-user',
        name: streamRole === 'broadcaster' ? currentStream.host.name : 'You',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        isHost: streamRole === 'broadcaster',
      },
      text,
      timestamp: new Date().toISOString(),
      likes: 0,
    };
    
    setChatMessages(prev => [...prev, newMessage]);
  }, [currentStream, streamRole]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setStreamState(prev => ({
      ...prev,
      isMuted: !prev.isMuted,
    }));
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    setStreamState(prev => ({
      ...prev,
      isCameraOn: !prev.isCameraOn,
    }));
  }, []);

  // Like stream
  const likeStream = useCallback(() => {
    if (!currentStream) return;
    
    setCurrentStream(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
  }, [currentStream]);

  // Create haul
  const createHaul = useCallback((haul: Omit<Haul, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'saves'>) => {
    const newHaul: Haul = {
      ...haul,
      id: `haul-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      saves: 0,
    };
    
    setHauls(prev => [newHaul, ...prev]);
  }, []);

  // Like haul
  const likeHaul = useCallback((haulId: string) => {
    setHauls(prev => prev.map(haul => 
      haul.id === haulId 
        ? { ...haul, likes: haul.likes + (haul.isLiked ? -1 : 1), isLiked: !haul.isLiked }
        : haul
    ));
  }, []);

  // Save haul
  const saveHaul = useCallback((haulId: string) => {
    setHauls(prev => prev.map(haul => 
      haul.id === haulId 
        ? { ...haul, saves: haul.saves + (haul.isSaved ? -1 : 1), isSaved: !haul.isSaved }
        : haul
    ));
  }, []);

  // Get haul by ID
  const getHaulById = useCallback((haulId: string) => {
    return hauls.find(h => h.id === haulId);
  }, [hauls]);

  // Get live streams
  const getLiveStreams = useCallback((filters?: { vibes?: string[] }) => {
    let streams = liveStreams.filter(s => s.isLive);
    
    if (filters?.vibes?.length) {
      streams = streams.filter(s => 
        filters.vibes!.some(v => s.vibes.includes(v))
      );
    }
    
    return streams.sort((a, b) => b.viewerCount - a.viewerCount);
  }, [liveStreams]);

  // Get upcoming streams
  const getUpcomingStreams = useCallback(() => {
    return liveStreams.filter(s => !s.isLive && s.scheduledFor);
  }, [liveStreams]);

  // Get trending hauls
  const getTrendingHauls = useCallback(() => {
    return [...hauls].sort((a, b) => b.likes - a.likes).slice(0, 10);
  }, [hauls]);

  // Get hauls by vibe
  const getHaulsByVibe = useCallback((vibes: string[]) => {
    return hauls.filter(h => 
      vibes.some(v => h.vibes.includes(v))
    );
  }, [hauls]);

  return (
    <LiveStreamContext.Provider
      value={{
        liveStreams,
        currentStream,
        chatMessages,
        streamState,
        streamRole,
        joinStream,
        leaveStream,
        startStream,
        endStream,
        sendChatMessage,
        toggleMute,
        toggleCamera,
        likeStream,
        hauls,
        createHaul,
        likeHaul,
        saveHaul,
        getHaulById,
        getLiveStreams,
        getUpcomingStreams,
        getTrendingHauls,
        getHaulsByVibe,
      }}
    >
      {children}
    </LiveStreamContext.Provider>
  );
};

export const useLiveStream = () => {
  const context = useContext(LiveStreamContext);
  if (context === undefined) {
    throw new Error('useLiveStream must be used within a LiveStreamProvider');
  }
  return context;
};
