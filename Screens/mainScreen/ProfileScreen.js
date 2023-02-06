import React, { useState, useEffect } from "react";

import * as ImagePicker from "expo-image-picker";

import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import {
  authUpdateAvatar,
  authSignOutUser,
} from "../../redux/auth/authOperations";

import { Feather } from "@expo/vector-icons";

export default function ProfileScreen() {
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const { userAvatar } = useSelector((state) => state.auth);

  const [pickedImagePath, setPickedImagePath] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    setPickedImagePath(userAvatar);

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    setPickedImagePath(userAvatar);
  }, [userAvatar]);

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
      dispatch(authUpdateAvatar(result.assets[0].uri));
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/photo-bg.jpg")}
      >
        <View style={styles.box}>
          <View style={styles.avatarBox}>
            {pickedImagePath && (
              <Image
                source={{ uri: pickedImagePath }}
                style={styles.avatarImage}
              />
            )}
            <TouchableOpacity
              onPress={() => showImagePicker()}
              style={{
                ...styles.avatarBtn,
                borderColor: pickedImagePath ? "#BDBDBD" : "#FF6C00",
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: pickedImagePath ? "#BDBDBD" : "#FF6C00",
                  fontSize: 13,
                }}
              >
                {pickedImagePath ? "X" : "+"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoutBtn}>
            <TouchableWithoutFeedback
              onPress={() => dispatch(authSignOutUser())}
            >
              <Feather name="log-out" size={24} color="#BDBDBD" />
            </TouchableWithoutFeedback>
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
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "80%",
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
  logoutBtn: {
    paddingRight: 16,
    position: "absolute",
    top: 22,
    right: 0,
  },
});
