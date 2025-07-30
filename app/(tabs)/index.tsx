// app/(tabs)/index.tsx
import { ResizeMode, Video } from 'expo-av';
import { useCallback, useState } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

const posts = [
  {
    id: '1',
    username: 'noni_madueke',
    profilePic: require('../../assets/profile1.jpg'),
    video: require('../../assets/noni.mp4'),
    caption: 'Great goal in training today ⚽️🔥',
    likes: 120,
    comments: 34,
  },
  {
    id: '2',
    username: 'aisha_wambua',
    profilePic: require('../../assets/profile2.jpg'),
    video: require('../../assets/aisha.mp4'),
    caption: 'Speed day 💨🇰🇪',
    likes: 98,
    comments: 17,
  },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>
          Cheza
          <Text style={{ color: '#000' }}>Link</Text>
        </Text>
      </View>

      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <View style={styles.userRow}>
            <Image source={post.profilePic} style={styles.avatar} />
            <Text style={styles.username}>{post.username}</Text>
          </View>

          <Video
            source={post.video}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            useNativeControls
            isLooping
          />

          <View style={styles.actions}>
            <Text>♥ {post.likes}</Text>
            <Text>💬 {post.comments}</Text>
            <Text>🔗</Text>
          </View>

          <Text style={styles.caption}>{post.caption}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 10,
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
