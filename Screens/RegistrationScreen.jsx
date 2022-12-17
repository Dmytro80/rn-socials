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

const initialState = {
  login: "",
  email: "",
  password: "",
};

const initialFocusState = {
  login: false,
  email: false,
  password: false,
};

export default function RegistrationScreen() {
  const [state, setState] = useState(initialState);
  const [isShowPassword, setIsShowPassword] = useState(true);
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [focus, setFocus] = useState(initialFocusState);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

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
    console.log(state);
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
          source={require("../assets/images/photo-bg.jpg")}
        >
          <View style={styles.box}>
            <View style={styles.avatarBox}>
              <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.7}>
                <Text style={styles.avatarBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>Регистрация</Text>
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
                  borderColor: focus.login ? "#FF6C00" : "#E8E8E8",
                }}
                value={state.login}
                placeholder="Логин"
                placeholderTextColor="#BDBDBD"
                onFocus={() => handlerFocus("login")}
                onBlur={() =>
                  setFocus((prevState) => ({ ...prevState, login: false }))
                }
                onChangeText={(value) =>
                  setState((prevState) => ({ ...prevState, login: value }))
                }
              />
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
                <Text style={styles.titleBtn}>Зарегистрироваться</Text>
              </TouchableOpacity>
              <Text style={styles.textLink}>Уже есть аккаунт? Войти</Text>
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
  avatarBox: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarBtn: {
    position: "absolute",
    right: -13,
    bottom: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    backgroundColor: "#FFFFFF",
    borderRadius: "50%",
    borderWidth: 1,
    borderColor: "#FF6C00",
    color: "FF6C00",
  },
  avatarBtnText: {
    color: "#FF6C00",
    fontSize: 18,
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
