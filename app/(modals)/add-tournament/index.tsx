import { StyleSheet, Text, View } from 'react-native';

export default function AddTournamentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Tournament Modal</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
