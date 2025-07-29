import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockProfiles = {
  '1': {
    username: 'noni_madueke',
    fullName: 'Noni Madueke',
    profilePic: require('../../assets/profile1.jpg'),
    bio: 'Left winger • England U21 ⚽',
    sport: 'Football',
    country: 'England',
    videos: [require('../../assets/noni.mp4')],
  },
  '2': {
    username: 'aisha_wambua',
    fullName: 'Aisha Wambua',
    profilePic: require('../../assets/profile2.jpg'),
    bio: '100m Sprinter 🇰🇪 | Kenya Junior Team',
    sport: 'Athletics',
    country: 'Kenya',
    videos: [],
  },
};

export default function ViewProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const profile = mockProfiles[id as keyof typeof mockProfiles];


  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>User not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={profile.profilePic} style={styles.avatar} />
        <Text style={styles.username}>@{profile.username}</Text>
        <Text style={styles.fullName}>{profile.fullName}</Text>
        <Text style={styles.bio}>{profile.bio}</Text>
        <Text style={styles.details}>
          Sport: <Text style={styles.bold}>{profile.sport}</Text> | Country: <Text style={styles.bold}>{profile.country}</Text>
        </Text>

        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Highlights</Text>
        {profile.videos.length > 0 ? (
          profile.videos.map((vid, idx) => (
            <Text key={idx} style={styles.videoPlaceholder}>🎥 Video {idx + 1}</Text>
            // You can replace with <Video> if needed
          ))
        ) : (
          <Text style={styles.noContent}>No videos yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 4,
  },
  bio: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 6,
  },
  details: {
    marginTop: 10,
    fontSize: 13,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
    color: '#1db954',
  },
  followButton: {
    marginTop: 16,
    backgroundColor: '#1db954',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  videoPlaceholder: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  noContent: {
    color: '#777',
    fontStyle: 'italic',
  },
});
