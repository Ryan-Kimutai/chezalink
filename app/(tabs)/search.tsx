// ✅ app/(tabs)/search.tsx - Search Screen (based on new UI)
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const mockResults = [
  {
    id: '1',
    name: 'Noni Madueke',
    sport: 'Football',
    profilePic: require('../../assets/profile1.jpg'),
  },
  {
    id: '2',
    name: 'Aisha Wambua',
    sport: 'Athletics',
    profilePic: require('../../assets/profile2.jpg'),
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');

  const filteredResults = mockResults.filter((athlete) =>
    athlete.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for athletes..."
        placeholderTextColor="#888"
        style={styles.searchInput}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultCard}>
            <Image source={item.profilePic} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sport}>{item.sport}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No results found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    gap: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sport: {
    fontSize: 14,
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
