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

export default function PostsScreen() {
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
      <NestedScreen.Screen name="Comments" component={CommentsScreen} />
      <NestedScreen.Screen name="Map" component={MapScreen} />
    </NestedScreen.Navigator>
  );
}
