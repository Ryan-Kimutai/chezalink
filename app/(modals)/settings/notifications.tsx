import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotificationSettings() {
  return (
    <>
      <Stack.Screen options={{ title: 'Notification Settings' }} />
      <View style={styles.container}>
        <Text style={styles.text}>Notification Settings Screen (Placeholder)</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#333' },
});
