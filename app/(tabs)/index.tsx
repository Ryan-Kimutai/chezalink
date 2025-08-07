import { Feather, FontAwesome } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { InView } from 'react-native-intersection-observer';

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

const LIMIT = 10;

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const fetchFeed = async (name: string, reset = false) => {
    if (loadingRef.current || (!reset && !hasMore)) return;
    loadingRef.current = true;
    try {
      const res = await fetch(
        `http://10.97.227.154:3000/api/posts/feed?user_name=${name}&limit=${LIMIT}&offset=${reset ? 0 : offset}`
      );
      const data = await res.json();
      setPosts(prev => (reset ? data : [...prev, ...data]));
      setHasMore(data.length === LIMIT);
      if (!reset) setOffset(prev => prev + LIMIT);
   } catch (error: any) {
  console.error('❌ Failed to fetch feed from backend.');
  console.error('➡️ Endpoint:', `http://10.97.227.154:3000/api/posts/feed?user_name=${name}&limit=${LIMIT}&offset=${reset ? 0 : offset}`);
  console.error('🕵️ Error Type:', typeof error);
  console.error('📄 Error Message:', error?.message || 'No message provided');
  console.error('📦 Full Error Object:', error);

  if (error instanceof TypeError && error.message.includes('Network request failed')) {
    console.error('🌐 Network Error: Could not reach the server.');
    console.error('🔍 Possible causes:');
    console.error('- The backend server is not running or not reachable.');
    console.error('- Incorrect IP address or port.');
    console.error('- Device is offline or disconnected from local network.');
    console.error('- Request blocked by CORS or firewall.');

    console.error('✅ Suggested fixes:');
    console.error('- Ensure your server at 10.97.227.154:3000 is running.');
    console.error('- Verify your device is connected to the same network.');
    console.error('- Try pinging the backend from your mobile device or emulator.');
  }
}
finally {
      loadingRef.current = false;
      setRefreshing(false);
    }
  };

  const loadUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';
      setUserName(name);
      if (name) fetchFeed(name, true);
    } catch (err) {
      console.error('Failed to retrieve user name:', err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onRefresh = useCallback(() => {
    if (userName) {
      setRefreshing(true);
      setOffset(0);
      fetchFeed(userName, true);
    }
  }, [userName]);

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean) => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';

      const url = `http://10.97.227.154:3000/api/posts/like/${postId}`;
      const options = {
        method: currentlyLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: name }),
      };

      const res = await fetch(url, options);
      const data = await res.json();

      setPosts(prev =>
        prev.map(p =>
          p.post_id === postId
            ? {
                ...p,
                is_liked: !currentlyLiked,
                likes: parseInt(data.like_count, 10),
              }
            : p
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const renderItem = ({ item }: { item: Post }) => {
    return (
      <View style={styles.post}>
        <Text style={styles.username}>@{item.user_name}</Text>

      {item.type === 'video' && item.video_url && (
<InView triggerOnce={false} threshold={0.8}>
  {(props) => (
    <View ref={(props as any).ref}>
      <Video
        source={{ uri: item.video_url || '' }}
        style={styles.media}
        resizeMode={ResizeMode.COVER}
        useNativeControls
        isLooping
        shouldPlay={props.inView}
      />
    </View>
  )}
</InView>



)}


        {item.type === 'image' && item.image_url && (
          <Image source={{ uri: item.image_url }} style={styles.media} />
        )}

        {item.type === 'blog' && (
          <Text style={styles.blogContent}>{item.content}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleLikeToggle(item.post_id, item.is_liked)}
          >
            <FontAwesome
              name={item.is_liked ? 'heart' : 'heart-o'}
              size={20}
              color={item.is_liked ? 'transparent' : '#555'}
            />
            {item.is_liked && (
              <LinearGradient
                colors={['#1db954', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
              />
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

        {item.content && item.type !== 'blog' && (
          <Text style={styles.caption}>{item.content}</Text>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.post_id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onEndReached={() => userName && fetchFeed(userName)}
      onEndReachedThreshold={0.5}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7f7' },
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
    position: 'relative',
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
  caption: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
});
