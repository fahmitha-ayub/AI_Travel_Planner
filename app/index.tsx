import { View } from "react-native";
import Login from "./../components/Login";
//import {init} from './database'
import { useEffect } from "react";
export default function Index() {
  // useEffect(() => {
  //   init();
  // }, []);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Login />
    </View>
  );
}
