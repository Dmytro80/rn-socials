import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CommentsScreen from "../nestedScreen/CommentsScreen";
import DefaultScreen from "../nestedScreen/DefaultScreen";
import MapScreen from "../nestedScreen/MapScreen";

const NestedScreen = createStackNavigator();

export default function PostsScreen() {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          title: "Публикации",
        }}
      />
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
}
