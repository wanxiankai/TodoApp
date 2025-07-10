import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    // GestureHandlerRootView is essential for gesture-based interactions
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index" // This targets the app/index.js file
          options={{
            headerShown: false, // We will create our own title in the screen
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}