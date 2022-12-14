import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";

const initialState = {
  email: "",
  password: "",
};

const initialFocusState = {
  email: false,
  password: false,
};

export default function LoginScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [focus, setFocus] = useState(initialFocusState);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  const keyboardHide = () => {
    setIsShowKeybord(false);
    Keyboard.dismiss();
  };

  const handlerSubmit = () => {
    dispatch(authSignInUser(state));
    keyboardHide();
    setState(initialState);
  };

  const handlerFocus = (nameInput) => {
    setIsShowKeybord(true);
    setFocus((prevState) => ({ ...prevState, [nameInput]: true }));
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/photo-bg.jpg")}
        >
          <View style={styles.box}>
            <Text style={styles.title}>Войти</Text>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeybord ? 205 : 92,
                width: dimensions,
              }}
            >
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: focus.email ? "#FF6C00" : "#E8E8E8",
                }}
                value={state.email}
                placeholder="Адрес электронной почты"
                placeholderTextColor="#BDBDBD"
                onFocus={() => handlerFocus("email")}
                onBlur={() =>
                  setFocus((prevState) => ({ ...prevState, email: false }))
                }
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, email: value }))
                }
              />
              <View style={{ marginBottom: 43, position: "relative" }}>
                <TextInput
                  style={{
                    ...styles.input,
                    borderColor: focus.password ? "#FF6C00" : "#E8E8E8",
                  }}
                  value={state.password}
                  marginBottom={0}
                  placeholder="Пароль"
                  placeholderTextColor="#BDBDBD"
                  secureTextEntry={isShowPassword}
                  onFocus={() => handlerFocus("password")}
                  onBlur={() =>
                    setFocus((prevState) => ({ ...prevState, password: false }))
                  }
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <Text
                  style={styles.inputBtn}
                  onPress={() => setIsShowPassword(false)}
                >
                  Показать
                </Text>
              </View>
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.7}
                onPress={handlerSubmit}
              >
                <Text style={styles.titleBtn}>Войти</Text>
              </TouchableOpacity>
              <Text
                style={styles.textLink}
                onPress={() => navigation.navigate("Registration")}
              >
                Нет аккаунта? Зарегистрироваться
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  form: {
    marginTop: 32,
  },
  title: {
    marginTop: 92,
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
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
    lineHeight: 19,
  },
  inputBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
  submitBtn: {
    marginBottom: 16,
    height: 51,
    backgroundColor: "#FF6C00",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBtn: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#ffffff",
  },
  textLink: {
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#1B4371",
  },
});
