import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";

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

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [isHidePassword, setIsHidePassword] = useState(true);
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [focus, setFocus] = useState(initialFocusState);
  const [pickedImagePath, setPickedImagePath] = useState("");

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

  const handleSubmit = async () => {
    dispatch(authSignUpUser({ ...state, pickedImagePath }));
    console.log(state);
    keyboardHide();
    setState(initialState);
  };

  const handleFocus = (nameInput) => {
    setIsShowKeybord(true);
    setFocus((prevState) => ({ ...prevState, [nameInput]: true }));
  };

  const toggleShowPassword = () => {
    setIsHidePassword(!isHidePassword);
  };

  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPickedImagePath(result.assets[0].uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../assets/images/photo-bg.jpg")}
        >
          <View style={styles.box}>
            <View style={styles.avatarBox}>
              {pickedImagePath !== "" && (
                <Image
                  source={{ uri: pickedImagePath }}
                  style={styles.avatarImage}
                />
              )}
              <TouchableOpacity
                onPress={() => showImagePicker()}
                style={{
                  ...styles.avatarBtn,
                  borderColor: pickedImagePath !== "" ? "#BDBDBD" : "#FF6C00",
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: pickedImagePath !== "" ? "#BDBDBD" : "#FF6C00",
                    fontSize: 13,
                  }}
                >
                  {pickedImagePath !== "" ? "X" : "+"}
                </Text>
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
                onFocus={() => handleFocus("login")}
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
                onFocus={() => handleFocus("email")}
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
                  secureTextEntry={isHidePassword}
                  onFocus={() => handleFocus("password")}
                  onBlur={() =>
                    setFocus((prevState) => ({ ...prevState, password: false }))
                  }
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
                <Text style={styles.inputBtn} onPress={toggleShowPassword}>
                  {isHidePassword ? "Показать" : "Скрыть"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.submitBtn}
                activeOpacity={0.7}
                onPress={handleSubmit}
              >
                <Text style={styles.titleBtn}>Зарегистрироваться</Text>
              </TouchableOpacity>
              <Text
                style={styles.textLink}
                onPress={() => navigation.navigate("Login")}
              >
                Уже есть аккаунт? Войти
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
  avatarBox: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,

    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarImage: {
    width: 120,
    height: 120,
    resizeMode: "cover",
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
