import { Feather, FontAwesome } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
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

  const fetchFeed = async (name: string) => {
    try {
      const res = await fetch(`http://172.20.10.14:3000/api/posts/feed?user_name=${name}`);
      const data = await res.json();
      console.log('Fetched feed:', data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const loadUser = async () => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';
      setUserName(name);
      if (name) fetchFeed(name);
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
      fetchFeed(userName).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [userName]);

  useEffect(() => {
    loadUser();
  }, []);

  const handleLikeToggle = async (postId: string, currentlyLiked: boolean) => {
    try {
      const storedUser = await SecureStore.getItemAsync('user');
      const name = storedUser ? JSON.parse(storedUser).name : '';

      const url = `http://172.20.10.14:3000/api/posts/like/${postId}`;
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
   } catch (error: any) {
  console.error('❌ Error fetching feed:', error);

  if (error.name === 'TypeError' && error.message === 'Network request failed') {
    console.log(
      '⚠️ Network request failed. This is commonly caused by:\n' +
      '- 🔌 Backend server not running or unreachable\n' +
      '- 🧭 Incorrect API URL (e.g., wrong IP address or port)\n' +
      '- 🌐 Device/emulator not connected to the same Wi-Fi network as the backend\n' +
      '- 🛑 Using localhost (127.0.0.1) instead of your machine\'s IP address on physical devices\n' +
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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>
          ぷ Cheza
          <Text style={{ color: '#000' }}>Link</Text>
        </Text>
      </View>

      {posts.map((post: any) => (
        <View key={post.post_id} style={styles.post}>
          <Text style={styles.username}>@{post.user_name}</Text>

          {post.type === 'video' && post.video_url && (
            <Video
              source={{ uri: post.video_url }}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              isLooping
            />
          )}

          {post.type === 'image' && post.image_url && (
            <Image source={{ uri: post.image_url }} style={styles.media} />
          )}

          {post.type === 'blog' && (
            <Text style={styles.blogContent}>{post.content}</Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleLikeToggle(post.post_id, post.is_liked)}
            >
              {post.is_liked ? (
                <LinearGradient
                  colors={['#1db954', '#000']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientIcon}
                >
                  <FontAwesome name="heart" size={20} color="#fff" />
                </LinearGradient>
              ) : (
                <FontAwesome name="heart-o" size={20} color="#555" />
              )}
              <Text style={styles.iconText}>{post.likes}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Feather name="message-circle" size={20} color="#555" />
              <Text style={styles.iconText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton}>
              <Feather name="share-2" size={20} color="#555" />
            </TouchableOpacity>
          </View>

          {post.content && post.type !== 'blog' && (
            <Text style={styles.caption}>{post.content}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f7f7f7' },
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
