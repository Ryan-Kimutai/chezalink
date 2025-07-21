// ✅ app/(tabs)/search.tsx - Search Screen with profile linking
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const mockPlayers = [
  {
    id: '1',
    name: 'Brian Otieno',
    image: require('../../assets/noni.jpg'),
    sport: 'Football',
    description: 'Striker • Quick footwork • Local academy',
  },
  {
    id: '2',
    name: 'Faith Wanjiku',
    image: require('../../assets/aisha.jpg'),
    sport: 'Athletics',
    description: 'Sprinter • Under 18 team • 100m/200m',
  },
  {
    id: '3',
    name: 'Collins Kipkoech',
    image: require('../../assets/noni.jpg'),
    sport: 'Rugby',
    description: 'Winger • High speed and strength',
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = mockPlayers.filter((player) =>
    player.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <TextInput
        placeholder="Search players by name..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />

      {filtered.map((player) => (
        <TouchableOpacity
          key={player.id}
          style={styles.card}
          onPress={() => router.push({ pathname: '/view/[id]', params: { id: player.id } })}

        >
          <Image source={player.image} style={styles.image} resizeMode="cover" />
          <View style={styles.info}>
            <Text style={styles.name}>{player.name}</Text>
            <Text style={styles.sport}>{player.sport}</Text>
            <Text style={styles.description}>{player.description}</Text>
            <Text style={styles.action}>View Profile</Text>
          </View>
        </TouchableOpacity>
      ))}

      {filtered.length === 0 && (
        <Text style={styles.empty}>No players found.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1db954',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sport: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  action: {
    color: '#1db954',
    fontWeight: '600',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});
