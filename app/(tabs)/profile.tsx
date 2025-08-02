import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const res = await fetch('http://localhost:3000/api/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED LINE
        },
      });

      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    router.push('/(modals)/edit-profile');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1db954" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: 'red' }}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Top Icons */}
      <View style={styles.topIcons}>
        <TouchableOpacity onPress={() => router.push('/(modals)/notifications')}>
          <Ionicons name="notifications-outline" size={24} color="#1db954" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(modals)/settings')} style={{ marginLeft: 16 }}>
          <Ionicons name="settings-outline" size={24} color="#1db954" />
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/profile2.jpg')} // Replace with Cloudinary later
          style={styles.avatar}
        />
        <Text style={styles.fullName}>{profile.first_name} {profile.last_name}</Text>
        <Text style={styles.bio}>{profile.bio || 'No bio yet'}</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity onPress={handleEditProfile} style={styles.editProfileButton}>
          <LinearGradient
            colors={['#1db954', '#003c1b']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Tab placeholders */}
      <View style={styles.tabButtons}>
        <Text style={styles.tabButton}>Posts</Text>
        <Text style={styles.tabButton}>About</Text>
        <Text style={styles.tabButton}>Scouts Comments</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, color: '#444' }}>Tab content placeholder (static)</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

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
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 12,
    marginBottom: 8,
  },
  fullName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 40,
  },
  statBox: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { fontSize: 12, color: '#777' },

  editProfileButton: {
    marginTop: 16,
  },
  gradientButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1db954',
  },
});
