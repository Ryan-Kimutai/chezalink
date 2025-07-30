// ✅ app/(modals)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: 'card', // Use 'modal' for iOS-style modal; 'card' for full screen
      }}
    />
  );
}
