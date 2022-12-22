import React, { useState } from "react";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { useRouter } from "./router";
import { NavigationContainer } from "@react-navigation/native";

const loadApplication = async () => {
  await Font.loadAsync({
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
  });
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  const routing = useRouter(true);

  if (!isReady) {
    return (
      <AppLoading
        startAsync={loadApplication}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }
  return <NavigationContainer>{routing}</NavigationContainer>;
}
