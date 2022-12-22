import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Публикации" component={PostsScreen} />
      <Tab.Screen name="Создать публикацию" component={CreatePostsScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
