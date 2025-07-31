import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';



export default function TournamentDetails() {
  const [activeTab, setActiveTab] = useState('Info');
 const {name ,location } = useLocalSearchParams();
 

  const renderContent = () => {
    switch (activeTab) {
      case 'Info':
        return (
          <ScrollView style={styles.content}>
            {[...Array(1)].map((_, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>More about this tournament?</Text>
                <Text style={styles.cardText}>I'd also love to know...</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'Matches':
        return (
          <ScrollView style={styles.content}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>Match #{i + 1}</Text>
                <Text style={styles.cardText}>coming soon</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'Stats':
        return (
          <View style={[styles.content, { padding: 16 }]}>
            <Text style={styles.cardTitle}>Tap ins</Text>
            <Text style={styles.cardText}>
              You know I top the charts, just wait
            </Text>
          </View>
        );
         case 'Table':
        return (
          <View style={[styles.content, { padding: 16 }]}>
            <Text style={styles.cardTitle}>Tables are still in development</Text>
            <Text style={styles.cardText}>
              me and the table....walking side by side
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const tabs = ['Info', 'Matches', 'Stats','Table'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner */}
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
        <Text style={styles.name}>Tournament:{name}</Text>
        <Text style={styles.location}>Location:{location}</Text>
      </View>

      {/* Pill Tab Bar */}
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

      {/* Tab Content */}
      {renderContent()}
    </SafeAreaView>
  );
}

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
});
