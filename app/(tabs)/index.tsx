// ✅ app/(tabs)/index.tsx - Home Feed Screen (with pull-to-refresh, video support, and restricted comments)
import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const isLoggedIn = false; // TEMP: Later replace with auth context/state

const mockPosts = [
  {
    id: '1',
    name: 'Noni Madueke',
    image: require('../../assets/noni.jpg'),
    video: null,
    sport: 'Football',
    description: 'Left winger • Quick feet • England U21',
    comments: ['Great performance!', '🔥🔥🔥'],
  },
  {
    id: '2',
    name: 'Aisha Wambua',
    video: require('../../assets/aisha.mp4'),
    image: null,
    sport: 'Athletics',
    description: '100m sprinter • Kenya Junior Team',
    comments: ['She’s so fast!', 'Go Aisha! 💪'],
  },
];

export default function HomeFeed() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState(mockPosts.map(post => ({ ...post, liked: false })));
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  const toggleLike = (postId: string) => {
  if (!isLoggedIn) {
    alert('Please log in to like posts.');
    return;
  }
  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      return { ...post, liked: !post.liked };
    }
    return post;
  });
  setPosts(updatedPosts);
};

const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleAddComment = (postId: string) => {
    const comment = newComments[postId]?.trim();
    if (!comment) return;
    if (!isLoggedIn) {
      alert('Please log in to comment.');
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, comment],
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComments((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.title}>Feed</Text>

      {posts.map((post) => (
        <View key={post.id} style={styles.card}>
          {post.video ? (
            <Video
              source={post.video}
              style={styles.media}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              shouldPlay={false}
              isLooping
            />
          ) : (
            <Image source={post.image} style={styles.media} resizeMode="cover" />
          )}

          <View style={styles.info}>
            <Text style={styles.name}>{post.name}</Text>
            <Text style={styles.sport}>{post.sport}</Text>
            $1

            <TouchableOpacity onPress={() => toggleLike(post.id)}>
              <Text style={[styles.like, post.liked ? styles.liked : styles.unliked]}>
                {post.liked ? '♥ Liked' : '♡ Like'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push({ pathname: '/view/[id]', params: { id: post.id } })}
            >
              <Text style={styles.action}>View Profile</Text>
            </TouchableOpacity>

            {post.comments.length > 0 && (
              <View style={styles.commentBox}>
                <Text style={styles.commentTitle}>Comments</Text>
                {post.comments.map((comment, index) => (
                  <Text key={index} style={styles.comment}>• {comment}</Text>
                ))}
              </View>
            )}

            <View style={styles.commentInputBox}>
              <TextInput
                placeholder="Add a comment..."
                style={styles.commentInput}
                editable={isLoggedIn}
                value={newComments[post.id] || ''}
                onChangeText={(text) => setNewComments({ ...newComments, [post.id]: text })}
              />
              <TouchableOpacity onPress={() => handleAddComment(post.id)}>
                <Text style={[styles.send, !isLoggedIn && { color: '#aaa' }]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1db954',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  media: {
    width: '100%',
    height: 250,
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sport: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  action: {
    color: '#1db954',
    fontWeight: '600',
    marginBottom: 10,
  },
  like: {
    fontSize: 16,
    marginTop: 6,
  },
  liked: {
    color: '#e91e63',
    fontWeight: '600',
  },
  unliked: {
    color: '#888',
  },

  commentBox: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  comment: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  commentInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  send: {
    color: '#1db954',
    fontWeight: '600',
  },
});
