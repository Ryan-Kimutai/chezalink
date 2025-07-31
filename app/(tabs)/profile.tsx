import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const profileData = {
  username: 'aisha_wambua',
  fullName: 'Aisha Wambua',
  bio: 'Barcelona Femini 🇰🇪 | Kenya Junior Team',
  profilePic: require('../../assets/profile2.jpg'),
  followers: 1200,
  following: 180,
  posts: [
    require('../../assets/aisha1.jpg'),
    require('../../assets/aisha2.jpg'),
    require('../../assets/aisha3.jpg'),
  ],
};

export default function ProfileScreen() {
  const router = useRouter();

  const handleEditProfile = () => {
    // ✅ Correct usage without "/index"
    router.push('/(modals)/edit-profile');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => router.push('/(modals)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#1db954" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(modals)/settings')}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="settings-outline" size={24} color="#1db954" />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <Image source={profileData.profilePic} style={styles.avatar} />
        <Text style={styles.username}>@{profileData.username}</Text>
        <Text style={styles.fullName}>{profileData.fullName}</Text>
        <Text style={styles.bio}>{profileData.bio}</Text>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profileData.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{profileData.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gallery}>
        {profileData.posts.map((img, idx) => (
          <Image key={idx} source={img} style={styles.postImage} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
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
  stats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 40,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#1db954',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  postImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
});
