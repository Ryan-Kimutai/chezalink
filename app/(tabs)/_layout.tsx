import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#1db954',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            backgroundColor: colorScheme === 'dark' ? '#111' : '#fff',
            borderTopWidth: 0.5,
            borderTopColor: '#ccc',
            paddingBottom: 4,
            paddingTop: 6,
            height: 60,
          },
          tabBarLabel:
            route.name === 'index'
              ? 'Home'
              : route.name === 'search'
              ? 'Search'
              : route.name === 'new'
              ? 'New'
              : route.name === 'tournaments'
              ? 'Tournaments'
              : route.name === 'profile'
              ? 'Profile'
              : '',
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'index':
                iconName = 'home';
                break;
              case 'search':
                iconName = 'search';
                break;
              case 'new':
                iconName = 'add-circle';
                break;
              case 'tournaments':
                iconName = 'football';
                break;
              case 'profile':
                iconName = 'person';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="new" />
        <Tabs.Screen name="tournaments" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </ThemeProvider>
  );
}
