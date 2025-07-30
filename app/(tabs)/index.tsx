import { ResizeMode, Video } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Post = {
  id: string;
  userId: string;
  type: 'video' | 'image' | 'blog';
  content: string;
  videoUrl?: string;
  imageUrl?: string;
  likes: number;
  comments?: number;
  createdAt: string;
};

const userId = 'user123'; // 🔁 Replace with real user logic

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeed = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/posts/feed/${userId}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFeed().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

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

      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <Text style={styles.username}>@{post.userId}</Text>

          {post.type === 'video' && post.videoUrl && (
            <Video
              source={{ uri: post.videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              isLooping
            />
          )}

          {post.type === 'image' && post.imageUrl && (
            <Image source={{ uri: post.imageUrl }} style={styles.video} />
          )}

          {post.type === 'blog' && (
            <Text style={styles.blogContent}>{post.content}</Text>
          )}

          <View style={styles.actions}>
            <Text>♥ {post.likes}</Text>
            <Text>💬 0</Text>
            <Text>🔗</Text>
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
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
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 10,
  },
  blogContent: {
    fontSize: 16,
    lineHeight: 22,
    marginVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 10,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 10,
  },
});
