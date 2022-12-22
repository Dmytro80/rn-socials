import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RegistrationScreen from "./Screens/auth/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import Home from "./Screens/mainScreen/Home";

const MainStack = createStackNavigator();

export const useRouter = (isAuth) => {
  if (!isAuth) {
    return (
      <MainStack.Navigator>
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <MainStack.Screen
          options={{ headerShown: false }}
          name="Registration"
          component={RegistrationScreen}
        />
      </MainStack.Navigator>
    );
  }

  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
};
