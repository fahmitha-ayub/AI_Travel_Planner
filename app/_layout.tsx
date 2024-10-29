import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  useFonts({
    'outfit': require("./../assets/fonts/Outfit-Regular.ttf"),
    'outfit-bold': require("./../assets/fonts/Outfit-Bold.ttf"),
    'outfit-medium': require("./../assets/fonts/Outfit-Medium.ttf"),
  });

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}} />
      </Stack>
    </AuthProvider>
  );
}
