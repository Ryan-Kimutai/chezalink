// ✅ app/(modals)/_layout.tsx
import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        animation: Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade_from_bottom',
        gestureEnabled: true,
        headerShown: false,
        contentStyle: {
          backgroundColor: '#fff',
          flex: 1,
        },
      }}
    >
      {/* If needed in the future, you can set per-screen options here */}
    </Stack>
  );
}
