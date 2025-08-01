import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

const tournaments = [
  {
    id: 1,
    name: 'SAINt L 2025',
    date: 'July 15, 2025',
    location: 'Saint James Park',
    owner: 'Saint',
    image: 'https://via.placeholder.com/300x150.png?text=Spring+Cup',
  },
  {
    id: 2,
    name: 'Champions League',
    date: 'August 3, 2025',
    location: 'Kasarani Grounds',
    owner: 'Elite Sports',
    image: 'https://via.placeholder.com/300x150.png?text=Champions+League',
  },
  {
    id: 3,
    name: 'Youth Football Fest',
    date: 'September 10, 2025',
    location: 'Mombasa Arena',
    owner: 'Youth United',
    image: 'https://via.placeholder.com/300x150.png?text=Youth+Fest',
  },
];

const TournamentCard = ({ item, onEdit }: any) => (
  <TouchableOpacity onPress={() => router.push(`/(modals)/view-tournament/${item.id}` as any)}>
    <View style={styles.shadowBox}>
      <TouchableOpacity style={styles.dotsIcon} onPress={() => onEdit(item.id)}>
        <FontAwesome6 name="ellipsis-vertical" size={18} color="#444" />
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.detail}>📅 {item.date}</Text>
      <Text style={styles.detail}>📍 {item.location}</Text>
      <Text style={styles.detail}>🧑 {item.owner}</Text>
    </View>
  </TouchableOpacity>
);

export default function TournamentsScreen() {
  const layout = useWindowDimensions();

  const showEditOptions = (id: number) => {
    const editHandler = () => {
      router.push('/(modals)/edit-tournament');
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit Tournament'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            editHandler();
          }
        }
      );
    } else {
      Alert.alert('Options', '', [
        { text: 'Edit Tournament', onPress: editHandler },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const AllTournamentsRoute = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {tournaments.map((item) => (
        <TournamentCard key={item.id} item={item} onEdit={showEditOptions} />
      ))}
    </ScrollView>
  );

  const MyTournamentsRoute = () => {
    const myTournaments = tournaments.filter((t) => t.owner === 'Saint');
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {myTournaments.map((item) => (
          <TournamentCard key={item.id} item={item} onEdit={showEditOptions} />
        ))}
      </ScrollView>
    );
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'all', title: 'Tournaments' },
    { key: 'mine', title: 'My Tournaments' },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap({
            all: AllTournamentsRoute,
            mine: MyTournamentsRoute,
          })}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: '#06753a' }}
              style={{
                backgroundColor: 'white',
                height: 50,
                borderRadius: 0,
                overflow: 'hidden',
              }}
              activeColor="#06753a"
              inactiveColor="#888"
            />
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/(modals)/add-tournament')}
        >
          <FontAwesome6 name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  shadowBox: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    position: 'relative',
  },
  dotsIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
});
