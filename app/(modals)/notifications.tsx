import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const notifications = [
  {
    id: '1',
    type: 'like',
    user: 'scout_james',
    avatar: require('../../assets/profile3.jpg'),
    message: 'liked your post',
    time: '2h ago',
  },
  {
    id: '2',
    type: 'comment',
    user: 'coach_linda',
    avatar: require('../../assets/profile4.jpg'),
    message: 'commented: “Amazing run!”',
    time: '5h ago',
  },
  {
    id: '3',
    type: 'follow',
    user: 'elite_scouts',
    avatar: require('../../assets/profile5.jpg'),
    message: 'started following you',
    time: '1d ago',
  },
];

export default function NotificationsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.map((note) => (
        <View key={note.id} style={styles.card}>
          <Image source={note.avatar} style={styles.avatar} />
          <View style={styles.content}>
            <Text style={styles.message}>
              <Text style={styles.user}>{note.user}</Text> {note.message}
            </Text>
            <Text style={styles.time}>{note.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1db954',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    color: '#333',
  },
  user: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
