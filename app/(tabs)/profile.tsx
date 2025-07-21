// ✅ app/(tabs)/profile.tsx - Profile Screen
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockSavedPlayers = [
  {
    id: '1',
    name: 'Faith Wanjiku',
    sport: 'Athletics - Sprinter',
    image: require('../../assets/aisha.jpg'),
  },
  {
    id: '2',
    name: 'Collins Kipkoech',
    sport: 'Rugby - Winger',
    image: require('../../assets/noni.jpg'),
  },
];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>

      <FlatList
        data={mockSavedPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sport}>{item.sport}</Text>
              <TouchableOpacity>
                <Text style={styles.link}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>You haven't saved any players yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1db954',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sport: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  link: {
    color: '#1db954',
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
});
