// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  if (isLoggedIn === null) {
    // show loading spinner
    return null;
  }

  return (
    <GestureHandlerRootView>
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
    </GestureHandlerRootView>

  );
}
