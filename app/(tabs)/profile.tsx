import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
  moreInfo: {
    team: 'Kileleshwa FC',
    position: 'FW',
    dob: '12th Dec 2011',
    foot: 'L',
    location: 'Kileleshwa',
  },
  activity: [
    { team: 'Kilimani Fc', tournament: 'Ujamma Tournament', g: 3, a: 1, p: 2 },
    { team: 'Kilimani Fc', tournament: 'JAMHURI TROPHY', g: 4, a: 1, p: 5 },
  ],
  comments: [
    {
      name: 'Thiery Scout',
      text: 'Phenomenal finisher cuts in on his left with deadly precision even at 14 years old. This is a TOP TALENT!!',
      likes: 21,
      time: '2 w',
    },
    {
      name: 'Jay Mwalimu',
      text: 'Great attacking wise however you need to improve on your work rate as modern football tactics require forwards to press',
      likes: 5,
      time: '3 w',
    },
  ],
};

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'comments'>('posts');

  const handleEditProfile = () => {
    router.push('/(modals)/edit-profile');
  };

  const renderTabContent = () => {
    if (activeTab === 'posts') {
      return (
        <View style={styles.tabContent}>
          {profileData.posts.map((img, idx) => (
            <Image key={idx} source={img} style={styles.postImage} />
          ))}
        </View>
      );
    } else if (activeTab === 'about') {
      return (
        <View style={{ padding: 16 }}>
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>MORE INFO:</Text>
            <Text style={styles.infoLine}>
              <Text style={styles.bold}>Current Team:</Text> {profileData.moreInfo.team}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.bold}>Position:</Text> {profileData.moreInfo.position}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.bold}>Date of Birth:</Text> {profileData.moreInfo.dob}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.bold}>Preferred foot:</Text> {profileData.moreInfo.foot}
            </Text>
            <Text style={styles.infoLine}>
              <Text style={styles.bold}>Location:</Text> {profileData.moreInfo.location}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>RECENT ACTIVITY</Text>
            {profileData.activity.map((a, idx) => (
              <Text key={idx} style={styles.infoLine}>
                ⚽ {a.team} - {a.tournament} → {a.g} {a.a} {a.p}
              </Text>
            ))}
            <Text style={[styles.infoLine, { color: 'green', marginTop: 6 }]}>view full history</Text>
          </View>
        </View>
      );
    } else if (activeTab === 'comments') {
      return (
        <View style={{ padding: 16 }}>
          {profileData.comments.map((c, i) => (
            <View key={i} style={styles.commentCard}>
              <Text style={styles.commentHeader}>Scout {c.name} • {c.time}</Text>
              <Text style={styles.commentText}>{c.text}</Text>
              <Text style={styles.commentLikes}>♡ {c.likes}</Text>
            </View>
          ))}
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

          {/* Edit button centered */}
          <TouchableOpacity onPress={handleEditProfile} style={styles.centeredEditProfile}>
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

        {/* Tab Buttons */}
        <View style={styles.tabBar}>
          {['posts', 'about', 'comments'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab as any)}
              style={[
                styles.tabItem,
                activeTab === tab && styles.activeTabItem,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab === 'posts' ? 'Posts' : tab === 'about' ? 'About' : 'Scouts Comments'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderTabContent()}
      </ScrollView>
    </View>
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

  centeredEditProfile: {
    marginTop: 20,
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

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  tabItem: {
    paddingVertical: 12,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderColor: '#1db954',
  },
  tabText: {
    fontSize: 14,
    color: '#777',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#1db954',
  },

  tabContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    justifyContent: 'space-between',
  },
  postImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: '#ecfff1',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  infoLine: {
    fontSize: 14,
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },

  commentCard: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  commentHeader: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  commentLikes: {
    fontSize: 12,
    color: '#888',
  },
});