import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

const BASE_URL = 'http://192.168.0.106';
const PROFILE_API = `${BASE_URL}:4001/api/profile`;
const SOCIAL_PROFILE_API = (username: string) => `${BASE_URL}:4002/api/social/profile/${username}`;

const ProfileScreen = ({ route }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  : `${PROFILE_API}/${parsedUser.name}`; // match login.tsx profile check

const res = await fetch(apiUrl, { headers });


      if (!res.ok) {
        const errorText = await res.text();
        if (res.status === 404) setErrorMessage('Profile not found');
        else if (res.status === 401) setErrorMessage('Unauthorized. Please log in again.');
        else setErrorMessage('Something went wrong.');
        return;
      }

      const data = await res.json();
      setProfile(data);
    } catch (error: any) {
      setErrorMessage('Network error. Please check your connection or server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
