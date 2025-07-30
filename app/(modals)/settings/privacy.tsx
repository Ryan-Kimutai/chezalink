import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function PrivacySettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Settings' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Privacy Settings Screen (Placeholder)</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#333' },
});
