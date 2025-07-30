import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TournamentsScreen() {
  const tournaments = [
    {
      id: 1,
      name: 'Spring Cup 2025',
      date: 'July 15, 2025',
      location: 'Nairobi Stadium',
      owner: 'John Doe',
      image: 'https://via.placeholder.com/300x150.png?text=Spring+Cup',
    },
    {
      id: 2,
      name: 'Champions League',
      date: 'August 3, 2025',
      location: 'Kasarani Grounds',
      owner: 'Elite Sports',
      image: 'https://via.placeholder.com/300x150.png?text=Champions+League',
    },
    {
      id: 3,
      name: 'Youth Football Fest',
      date: 'September 10, 2025',
      location: 'Mombasa Arena',
      owner: 'Youth United',
      image: 'https://via.placeholder.com/300x150.png?text=Youth+Fest',
    },
  ];

  const handleAddTournament = () => {
    console.log('Add tournament button pressed');
    // Navigation or modal logic can go here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournaments</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {tournaments.map((item) => (
          <View key={item.id} style={styles.shadowBox}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>📅 {item.date}</Text>
            <Text style={styles.detail}>📍 {item.location}</Text>
            <Text style={styles.detail}>🧑 {item.owner}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTournament}
        activeOpacity={0}
      >
        <FontAwesome6 name="plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 5,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
  },
  matchText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#06753aff',
    marginBottom: 10,
    alignSelf: 'center',
  },
  shadowBox: {
    width: '99%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 50,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2
    ,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#ffffffff',
    borderRadius: 30,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});

