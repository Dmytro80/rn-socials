import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CreatePostsScreen() {
  return (
    <View style={styles.container}>
      <Text>Create Posts Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
