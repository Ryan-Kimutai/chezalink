import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity onPress={() => router.push('/settings/account')}>
        <Text style={styles.item}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/settings/privacy')}>
        <Text style={styles.item}>Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/settings/notifications')}>
        <Text style={styles.item}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/settings/help')}>
        <Text style={styles.item}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => alert('Logged out')}>
        <Text style={[styles.item, { color: '#e53935' }]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1db954',
  },
  item: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
});
