import { Feather, FontAwesome } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Post = {
  post_id: string;
  user_name: string;
  type: 'image' | 'video' | 'blog';
  content: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  likes: number;
  is_liked: boolean;
};

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  // pagination + loading states
  const LIMIT = 5; // posts per page
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // autoplay state
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const fetchFeed = async (name: string, offsetVal = 0) => {
    try {
      const res = await fetch(
        `http://192.168.0.106:3000/api/posts/feed?user_name=${encodeURIComponent(
          name
        )}&limit=${LIMIT}&offset=${offsetVal}`
      );
      const data = await res.json();
      console.log('Fetched feed:', data);

      if (!Array.isArray(data)) {
        console.warn('Expected array from feed endpoint, got:', data);
        return;
      }

      if (offsetVal === 0) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }

      // If returned less than limit, assume no more pages
      setHasMore(data.length === LIMIT);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const loadUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';
      setUserName(name);
      if (name) fetchFeed(name, 0);
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        console.error('Failed to parse stored user data. Possible malformed JSON:', err.message);
      } else if (err instanceof Error) {
        console.error(`Failed to retrieve user name from SecureStore: ${err.message}`);
      } else {
        console.error('An unknown error occurred while retrieving user name:', err);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (userName) {
      fetchFeed(userName, 0).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [userName]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loadingMore || !userName) return;
    setLoadingMore(true);
    try {
      await fetchFeed(userName, posts.length);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean) => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';

      const url = `http://192.168.0.106:3000/api/posts/like/${postId}`;
      const options = {
        method: currentlyLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: name }),
      };

      const res = await fetch(url, options);
      const data = await res.json();

      setPosts((prev) =>
        prev.map((p) =>
          p.post_id === postId
            ? {
                ...p,
                is_liked: !currentlyLiked,
                likes: parseInt(data.like_count, 10),
              }
            : p
        )
      );
    } catch (error: any) {
      console.error('❌ Error fetching feed:', error);

      if (error.name === 'TypeError' && error.message === 'Network request failed') {
        console.log(
          '⚠️ Network request failed. This is commonly caused by:\n' +
            '- 🔌 Backend server not running or unreachable\n' +
            "- 🧭 Incorrect API URL (e.g., wrong IP address or port)\n" +
            "- 🌐 Device/emulator not connected to the same Wi-Fi network as the backend\n" +
            "- 🛑 Using localhost (127.0.0.1) instead of your machine's IP address on physical devices\n" +
            '- 🔒 Firewall blocking the connection'
        );
        alert('Unable to connect to the server. Please check your internet or server settings.');
      } else if (error instanceof SyntaxError) {
        console.log(
          '🧩 Failed to parse server response as JSON. This might mean:\n' +
            '- The server responded with malformed JSON\n' +
            '- A non-JSON error (like HTML) was returned due to a crash or CORS issue'
        );
        alert('Unexpected server response format. Please contact the developer.');
      } else {
        console.log('🧨 An unexpected error occurred:', error.message);
        alert(`An error occurred: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Called by FlatList when viewable items change
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      // choose the first fully visible item to play
      const first = viewableItems[0];
      if (first && first.item && first.item.post_id) {
        setCurrentPlayingId(first.item.post_id);
      }
    }
  }).current;

  const ListHeader = (
    <View style={styles.header}>
      <Text style={styles.logo}>
        ぷ Cheza
        <Text style={{ color: '#000' }}>Link</Text>
      </Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.post_id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={ListHeader}
      renderItem={({ item, index }: { item: Post; index: number }) => (
        <View key={item.post_id} style={styles.post}>
          <Text style={styles.username}>@{item.user_name}</Text>

          {item.type === 'video' && item.video_url && (
            <Video
              source={{ uri: item.video_url }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              isLooping
              shouldPlay={currentPlayingId === item.post_id}
            />
          )}

          {item.type === 'image' && item.image_url && <Image source={{ uri: item.image_url }} style={styles.media} />}

          {item.type === 'blog' && <Text style={styles.blogContent}>{item.content}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
  style={styles.iconButton}
  onPress={() => handleLikeToggle(item.post_id, item.is_liked)}
>
  {item.is_liked ? (
    <FontAwesome name="heart" size={20} color="#055837ff" /> // Filled pink/red
  ) : (
    <FontAwesome name="heart-o" size={20} color="#555" /> // Unfilled gray
  )}
  <Text style={styles.iconText}>{item.likes}</Text>
</TouchableOpacity>


            <TouchableOpacity style={styles.iconButton}>
              <Feather name="message-circle" size={20} color="#555" />
              <Text style={styles.iconText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Feather name="share-2" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          {item.content && item.type !== 'blog' && <Text style={styles.caption}>{item.content}</Text>}
        </View>
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={() => {
        if (!loadingMore && hasMore) loadMore();
      }}
      onEndReachedThreshold={0.5}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      // optionally show a simple footer while loading more
      ListFooterComponent={loadingMore ? <Text style={{ textAlign: 'center', padding: 12 }}>Loading...</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: '#f7f7f7' },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
    color: '#1db954',
    fontFamily: 'sans-serif-condensed',
  },
  post: {
    marginBottom: 30,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 10,
  },
  blogContent: {
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 10,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    alignItems: 'center',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
  gradientIcon: {
    borderRadius: 100,
    padding: 6,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
});
