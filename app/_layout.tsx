import { Stack } from "expo-router";
import { useFonts } from "expo-font";
//import ModeofTravel from "./screens/chooseTravel";
export default function RootLayout() {

  useFonts({
    'outfit': require("./../assets/fonts/Outfit-Regular.ttf"),
    'outfit-bold': require("./../assets/fonts/Outfit-Bold.ttf"),
    'outfit-medium': require("./../assets/fonts/Outfit-Medium.ttf"),
})

  return (
    <Stack>
      {/* <Stack.Screen name="chooseTravel" component={ModeofTravel} options={{headerShown:false}} /> */}
      <Stack.Screen name="index" options={{headerShown:false}} />
    </Stack>
  );
}
