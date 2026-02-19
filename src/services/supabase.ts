import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          style_profile: any;
          created_at: string;
          updated_at: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          brand: string;
          price: number;
          currency: string;
          image_urls: string[];
          video_url: string | null;
          category: string;
          tags: string[];
          affiliate_url: string | null;
          seller_id: string;
          created_at: string;
        };
      };
      rankings: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          score: number;
          review_text: string | null;
          created_at: string;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
      };
      wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          notify_on_live: boolean;
          created_at: string;
        };
      };
      hauls: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string;
          product_ids: string[];
          view_count: number;
          created_at: string;
        };
      };
      live_streams: {
        Row: {
          id: string;
          host_id: string;
          title: string;
          status: 'scheduled' | 'live' | 'ended';
          scheduled_at: string | null;
          started_at: string | null;
          ended_at: string | null;
          viewer_count: number;
          product_ids: string[];
          stream_key: string;
          playback_url: string;
        };
      };
    };
  };
};
