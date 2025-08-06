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
  View,
  ViewToken,
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
  const [viewableItems, setViewableItems] = useState<string[]>([]);

  const videoRefs = useRef<Record<string, any>>({});

  const fetchFeed = async (name: string) => {
    try {
      const res = await fetch(`http://172.20.10.14:3000/api/posts/feed?user_name=${name}`);
      const data = await res.json();
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
    } catch (err) {
      console.error('Failed to retrieve user name:', err);
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
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const visiblePostIds = viewableItems.map(item => item.item.post_id);
    setViewableItems(visiblePostIds);
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const renderItem = ({ item: post }: { item: Post }) => {
    const isVideoVisible = viewableItems.includes(post.post_id);

    return (
      <View style={styles.post}>
        <Text style={styles.username}>@{post.user_name}</Text>

        {post.type === 'video' && post.video_url && (
          <Video
           ref={(ref) => {
  videoRefs.current[post.post_id] = ref;
}}

            source={{ uri: post.video_url }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            isLooping
            shouldPlay={isVideoVisible}
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
            <View style={styles.gradientWrapper}>
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
            </View>
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
    );
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.post_id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewConfigRef.current}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f7f7f7' },
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
  gradientWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
  },
});
