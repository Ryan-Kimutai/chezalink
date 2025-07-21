// ✅ app/(tabs)/notifications.tsx - Notifications Screen
import { FlatList, StyleSheet, Text, View } from 'react-native';

const mockNotifications = [
  { id: '1', message: 'Scout James followed you.' },
  { id: '2', message: 'Your post on Noni Madueke received 5 likes.' },
  { id: '3', message: 'Coach Faith viewed your profile.' },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications.</Text>}
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
  notification: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
  },
});
