import { router } from 'expo-router';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const confirmLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/(modals)/settings/account')}>
        <Text style={styles.itemText}>Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/(modals)/settings/privacy')}>
        <Text style={styles.itemText}>Privacy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/(modals)/settings/notifications')}>
        <Text style={styles.itemText}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => router.push('/(modals)/settings/help')}>
        <Text style={styles.itemText}>Help</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.item, styles.logout]} onPress={confirmLogout}>
        <Text style={[styles.itemText, styles.logoutText]}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1db954',
  },
  item: {
    paddingVertical: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  logout: {
    marginTop: 40,
  },
  logoutText: {
    color: '#d9534f',
    fontWeight: 'bold',
  },
});
