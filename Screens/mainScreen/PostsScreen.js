import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CommentsScreen from "../nestedScreen/CommentsScreen";
import DefaultScreen from "../nestedScreen/DefaultScreen";
import MapScreen from "../nestedScreen/MapScreen";
import { Feather } from "@expo/vector-icons";
import { View, TouchableWithoutFeedback } from "react-native";
import { useDispatch } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";

const NestedScreen = createStackNavigator();

export default function PostsScreen({ navigation }) {
  const dispatch = useDispatch();

  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultScreen}
        options={{
          title: "Публикации",
          headerRight: () => (
            <View style={{ paddingRight: 16 }}>
              <TouchableWithoutFeedback
                onPress={() => dispatch(authSignOutUser())}
              >
                <Feather name="log-out" size={24} color="#BDBDBD" />
              </TouchableWithoutFeedback>
            </View>
          ),
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          title: "Комментарии",
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
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: "Карта",
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
    </NestedScreen.Navigator>
  );
}
