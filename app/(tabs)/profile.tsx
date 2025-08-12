import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator, Image,
  SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function ProfileScreen({ route }: any) {
  const BASE_URL = 'http://192.168.0.106';
  const PROFILE_API = `${BASE_URL}:4001/api/profile`;
  const SOCIAL_PROFILE_API = (username: string) => `${BASE_URL}:4002/api/social/profile/${username}`;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Info');

  const targetUser = route?.params?.targetUser;

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) throw new Error('No token found in SecureStore');

      const storedUser = await SecureStore.getItemAsync('user');
      if (!storedUser) throw new Error('No user found in SecureStore');
      const parsedUser = JSON.parse(storedUser);

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };

      const apiUrl = targetUser
        ? SOCIAL_PROFILE_API(targetUser)
        : `${PROFILE_API}/${parsedUser.name}`;

      const res = await fetch(apiUrl, { headers });

      if (!res.ok) {
        if (res.status === 404) setErrorMessage('Profile not found');
        else if (res.status === 401) setErrorMessage('Unauthorized. Please log in again.');
        else setErrorMessage('Something went wrong.');
        return;
      }

      const data = await res.json();
      setProfile(data);
    } catch (error) {
      setErrorMessage('Network error. Please check your connection or server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderAboutSection = () => {
    switch (profile?.account_type) {
      case 'player':
        return (
          <>
            <Text style={styles.label}>Bio: <Text style={styles.value}>{profile.bio}</Text></Text>
            <Text style={styles.label}>County: <Text style={styles.value}>{profile.county}</Text></Text>
            <Text style={styles.label}>DOB: <Text style={styles.value}>{profile.date_of_birth}</Text></Text>
            <Text style={styles.label}>Preferred Foot: <Text style={styles.value}>{profile.prefered_foot}</Text></Text>
            <Text style={styles.label}>Position: <Text style={styles.value}>{profile.position}</Text></Text>
          </>
        );
      case 'scout':
        return (
          <>
            <Text style={styles.label}>Bio: <Text style={styles.value}>{profile.bio}</Text></Text>
            <Text style={styles.label}>County: <Text style={styles.value}>{profile.county}</Text></Text>
            <Text style={styles.label}>DOB: <Text style={styles.value}>{profile.date_of_birth}</Text></Text>
            <Text style={styles.label}>Organization: <Text style={styles.value}>{profile.organization}</Text></Text>
            <Text style={styles.label}>Experience (Years): <Text style={styles.value}>{profile.experience_years}</Text></Text>
            <Text style={styles.label}>Specialization: <Text style={styles.value}>{profile.specialization}</Text></Text>
          </>
        );
      case 'institution':
        return (
          <>
            <Text style={styles.label}>Bio: <Text style={styles.value}>{profile.bio}</Text></Text>
            <Text style={styles.label}>County: <Text style={styles.value}>{profile.county}</Text></Text>
            <Text style={styles.label}>Institution Type: <Text style={styles.value}>{profile.institution_type}</Text></Text>
            <Text style={styles.label}>Founded Year: <Text style={styles.value}>{profile.founded_year}</Text></Text>
          </>
        );
      default:
        return <Text>No additional information</Text>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <ScrollView style={styles.content}>
            <View>{renderAboutSection()}</View>
          </ScrollView>
        );
      case 'Posts':
        return (
          <View style={[styles.content, { padding: 16 }]}>
            <Text style={styles.cardTitle}>Posts</Text>
            <Text style={styles.cardText}>Posts are not currently available</Text>
          </View>
        );
      case 'Stats':
        return (
          <View style={[styles.content, { padding: 16 }]}>
            <Text style={styles.cardTitle}>Stats</Text>
            <Text style={styles.cardText}>When the user posts their stats, it will appear here</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const tabs = ['Info', 'Posts', 'Stats'];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#06753a" />
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{errorMessage}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={{ uri: 'https://via.placeholder.com/400x100/1a1a1a/ffffff?text=Banner' }}
          style={styles.bannerImage}
        />
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/80.png?text=👤' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {profile.account_type === 'institution'
            ? profile.institution_name
            : `${profile.first_name} ${profile.last_name}`}
        </Text>
        <Text style={styles.location}>{profile.account_type}</Text>
      </View>

      <View style={styles.pillTabBar}>
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.pillWrapper}
            >
              {isActive ? (
                <LinearGradient
                  colors={['#1db954', '#013212ff']}
                  style={styles.pill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.activePillText}>{tab}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{tab}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

// keep your styles as they are

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  banner: { height: 100 },
  bannerImage: { width: '100%', height: '100%' },

  profileSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    color: '#888',
    marginTop: 4,
  },

  pillTabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  pillWrapper: {
  borderRadius: 30,
  overflow: 'visible',

  // iOS shadow
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,

  // Android shadow
  elevation: 2,
},

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  pillText: {
    color: '#555',
    fontWeight: '500',
  },
  activePillText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    marginVertical: 10,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
   row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    
  },
  cellSmall: {
    width: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cellTeam: {
    flex: 2,
    paddingLeft: 6,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
   label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
});



/*
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {profile.account_type === 'institution' ? profile.institution_name : `${profile.first_name} ${profile.last_name}`}
      </Text>
      
      <Text style={styles.label}>Bio: <Text style={styles.value}>{profile.bio}</Text></Text>
      <Text style={styles.label}>County: <Text style={styles.value}>{profile.county}</Text></Text>
      <Text style={styles.label}>Account Type: <Text style={styles.value}>{profile.account_type}</Text></Text>

      {profile.account_type === 'player' && (
        <>
          <Text style={styles.label}>DOB: <Text style={styles.value}>{profile.date_of_birth}</Text></Text>
          <Text style={styles.label}>Preferred Foot: <Text style={styles.value}>{profile.prefered_foot}</Text></Text>
          <Text style={styles.label}>Position: <Text style={styles.value}>{profile.position}</Text></Text>
        </>
      )}

      {profile.account_type === 'scout' && (
        <>
          <Text style={styles.label}>DOB: <Text style={styles.value}>{profile.date_of_birth}</Text></Text>
          <Text style={styles.label}>Organization: <Text style={styles.value}>{profile.organization}</Text></Text>
          <Text style={styles.label}>Experience (Years): <Text style={styles.value}>{profile.experience_years}</Text></Text>
          <Text style={styles.label}>Specialization: <Text style={styles.value}>{profile.specialization}</Text></Text>
        </>
      )}

      {profile.account_type === 'institution' && (
        <>
          <Text style={styles.label}>Institution Type: <Text style={styles.value}>{profile.institution_type}</Text></Text>
          <Text style={styles.label}>Founded Year: <Text style={styles.value}>{profile.founded_year}</Text></Text>
        </>
      )}
    </ScrollView>
  );
}; 

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#06753a',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
});

export default ProfileScreen;
*/