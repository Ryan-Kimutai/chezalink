import { Tabs } from 'expo-router';
import React from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderRadius: 10,
          marginHorizontal: 0,
          marginBottom: 0,
          height: 70,
          position: 'absolute',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'white',
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons name={focused ? 'home' : 'home'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons name={focused ? 'search' : 'search'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="new"
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons name={focused ? 'plus' : 'plus'} size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tournaments"
        options={{
          title: 'Tournaments',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'football' : 'football-outline'} size={30} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
