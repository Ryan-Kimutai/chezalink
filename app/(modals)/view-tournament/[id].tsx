import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ViewTournamentScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Details</Text>
      <Text style={styles.subtitle}>Tournament ID: {id}</Text>

      {/* Later: fetch details based on ID */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1db954',
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
  },
});
