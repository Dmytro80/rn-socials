import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
} from "react-native";

export default function RegistrationScreen() {
  const [isShowPassword, setIsShowPassword] = useState(true);
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../assets/images/photo-bg.jpg")}
      >
        <View style={styles.box}>
          <Text style={styles.title}>Регистрация</Text>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Логин"
              placeholderTextColor="#BDBDBD"
            />
            <TextInput
              style={styles.input}
              placeholder="Адрес электронной почты"
              placeholderTextColor="#BDBDBD"
            />
            <View style={{ marginBottom: 43, position: "relative" }}>
              <TextInput
                style={styles.input}
                marginBottom={0}
                placeholder="Пароль"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={isShowPassword}
              />
              <Text
                style={styles.inputBtn}
                onPress={() => setIsShowPassword(false)}
              >
                Показать
              </Text>
            </View>
          </View>
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
  box: {
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  form: {
    marginBottom: 92,
    marginTop: 32,
  },
  title: {
    marginTop: 92,
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    lineLeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  input: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    borderColor: "#E8E8E8",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineLeight: 19,
  },
  inputBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineLeight: 19,
    color: "#1B4371",
  },
});
