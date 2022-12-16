import React from "react";
import { View, StyleSheet, ImageBackground, Text } from "react-native";

export default function RegistrationScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../assets/images/photo-bg.jpg")}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Регистрация</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  form: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 79,
  },
  title: {
    fontWeight: "500",
    fontSize: 30,
    lineLeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
});
