// ✅ app/view/[id].tsx - View Profile Screen (mocked)
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ViewProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock profile data (in future, fetch from backend using ID)
  const profile = {
    id,
    name: 'Brian Otieno',
    image: require('../../assets/noni.jpg'),
    sport: 'Football - Striker',
    location: 'Kibera, Nairobi',
    bio: 'Fast and strategic striker with vision. Played for multiple local teams and looking to join a national-level academy.',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={profile.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.sport}>{profile.sport}</Text>
        <Text style={styles.location}>{profile.location}</Text>

        <Text style={styles.bio}>{profile.bio}</Text>

        <TouchableOpacity
          style={styles.followButton}
          onPress={() => alert('Login to follow players.')}
        >
          <Text style={styles.followText}>Follow</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 280,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sport: {
    fontSize: 16,
    color: '#1db954',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 24,
  },
  followButton: {
    backgroundColor: '#1db954',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
