import React from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";
import { Feather } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Home({ navigation }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          title: "Публикации",
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name="grid" size={size} color={color} />
          ),
          headerRight: () => (
            <View style={{ paddingRight: 16 }}>
              <TouchableWithoutFeedback>
                <Feather name="log-out" size={24} color="#BDBDBD" />
              </TouchableWithoutFeedback>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          title: "Создать публикацию",
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name="plus" size={size} color={color} />
          ),
          headerLeft: () => (
            <View style={{ paddingLeft: 16 }}>
              <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Feather name="arrow-left" size={24} color="#BDBDBD" />
              </TouchableWithoutFeedback>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
