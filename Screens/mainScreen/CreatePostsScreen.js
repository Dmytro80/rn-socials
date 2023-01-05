import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import { nanoid } from "@reduxjs/toolkit";
import db from "../../firebase/config";

const initialInputs = {
  photoName: "",
  photoLocation: "",
};

const initialFocusState = {
  photoName: false,
  photoLocation: false,
};

export default function LoginScreen({ navigation }) {
  const [inputs, setInputs] = useState(initialInputs);
  const [focus, setFocus] = useState(initialFocusState);
  const [isShowKeybord, setIsShowKeybord] = useState(false);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState(CameraType.back);

  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  const [isShowPhoto, setIsShowPhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userId, login } = useSelector((state) => state.auth);

  const permission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();

    setCameraPermission(status);

    if (status !== "granted") {
      alert("Permission for camera access needed.");
    }

    const { granted } = await Location.requestForegroundPermissionsAsync();

    setLocationPermission(granted);
  };

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    permission();

    return () => subscription?.remove();
  }, []);

  const keyboardHide = () => {
    setIsShowKeybord(false);
    Keyboard.dismiss();
  };

  const handlerSubmit = async () => {
    keyboardHide();
    setIsLoading(true);

    await uploadPostToServer();

    navigation.navigate("DefaultScreen");
    cleanNote();
  };

  const handlerFocus = (nameInput) => {
    setIsShowKeybord(true);
    setFocus((prevState) => ({ ...prevState, [nameInput]: true }));
  };

  const takePhoto = async () => {
    const { uri } = await camera.takePictureAsync();

    setPhoto(uri);
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleShowPhoto = () => {
    if (!photo) {
      return;
    }
    setIsShowPhoto(!isShowPhoto);
  };

  const cleanNote = () => {
    setInputs(initialInputs);
    setPhoto(null);
    setIsShowPhoto(false);
    setIsLoading(false);
  };

  const uploadPostToServer = async () => {
    const photo = await uploadPhotoToServer();

    const currentLocation = await Location.getCurrentPositionAsync({});

    const createPost = await db
      .firestore()
      .collection("posts")
      .add({
        ...inputs,
        photo,
        location: locationPermission ? currentLocation.coords : null,
        userId,
        login,
      });

    console.log("createPost", createPost);
  };

  const uploadPhotoToServer = async () => {
    const response = await fetch(photo);
    const file = await response.blob();

    const postId = nanoid();

    await db.storage().ref(`postImage/${postId}`).put(file);

    const processedPhoto = await db
      .storage()
      .ref("postImage")
      .child(postId)
      .getDownloadURL();

    return processedPhoto;
  };

  if (!cameraPermission) {
    return;
  }

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View
          style={{
            ...styles.form,
            width: dimensions,
          }}
        >
          <View style={{ marginTop: isShowKeybord ? 3 : 32 }}>
            <View
              style={{
                ...styles.cameraWrapper,
                marginBottom: isShowKeybord ? 0 : 32,
              }}
            >
              {isShowPhoto ? (
                <View>
                  <Image source={{ uri: photo }} style={styles.image} />
                </View>
              ) : (
                <View>
                  <View style={styles.flip}>
                    <TouchableOpacity onPress={toggleCameraType}>
                      <Text style={{ color: "red" }}>Flip Camera</Text>
                    </TouchableOpacity>
                  </View>
                  <Camera
                    style={styles.camera}
                    ref={(ref) => {
                      setCamera(ref);
                    }}
                    type={type}
                  >
                    {photo && (
                      <View style={styles.takePhotoContainer}>
                        <Image
                          source={{ uri: photo }}
                          style={{ height: 100, width: 100, borderRadius: 10 }}
                        />
                      </View>
                    )}
                  </Camera>
                </View>
              )}
              <TouchableOpacity
                disabled={isShowPhoto}
                onPress={takePhoto}
                style={{
                  ...styles.snapContainer,
                  backgroundColor: isShowPhoto
                    ? "rgba(255, 255, 255, 0.3)"
                    : "#fff",
                }}
              >
                <FontAwesome5
                  name="camera"
                  size={24}
                  color={isShowPhoto ? "#fff" : "#BDBDBD"}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleShowPhoto}>
                <Text style={styles.text}>
                  {isShowPhoto && photo
                    ? "Редактировать фото"
                    : "Загрузите фото"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: focus.photoName ? "#FF6C00" : "#E8E8E8",
                }}
                value={inputs.photoName}
                placeholder="Название..."
                placeholderTextColor="#BDBDBD"
                onFocus={() => handlerFocus("photoName")}
                onBlur={() =>
                  setFocus((prevState) => ({ ...prevState, photoName: false }))
                }
                onChangeText={(value) =>
                  setInputs((prevState) => ({ ...prevState, photoName: value }))
                }
              />
            </View>
            <View style={{ marginBottom: 32, position: "relative" }}>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: focus.photoLocation ? "#FF6C00" : "#E8E8E8",
                  paddingLeft: 28,
                }}
                value={inputs.photoLocation}
                placeholder="Местность..."
                placeholderTextColor="#BDBDBD"
                onFocus={() => handlerFocus("photoLocation")}
                onBlur={() =>
                  setFocus((prevState) => ({
                    ...prevState,
                    photoLocation: false,
                  }))
                }
                onChangeText={(value) =>
                  setInputs((prevState) => ({
                    ...prevState,
                    photoLocation: value,
                  }))
                }
              />
              <View style={{ position: "absolute", top: 13, left: 0 }}>
                <Feather name="map-pin" size={24} color="#BDBDBD" />
              </View>
            </View>
            <TouchableOpacity
              style={{
                ...styles.submitBtn,
                backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
              }}
              activeOpacity={0.7}
              disabled={!photo || isLoading}
              onPress={handlerSubmit}
            >
              <Text
                style={{
                  ...styles.titleBtn,
                  color: photo ? "#FFFFFF" : "#BDBDBD",
                }}
              >
                {isLoading ? "Загружаем публикацию..." : "Опубликовать"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.trashBtnWrapper}>
            <TouchableOpacity
              style={{
                ...styles.trashBtn,
                backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
              }}
              disabled={!photo || isLoading}
              onPress={cleanNote}
            >
              <Feather
                name="trash-2"
                size={24}
                color={photo ? "#FFFFFF" : "#BDBDBD"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cameraWrapper: {
    position: "relative",
  },
  flip: { position: "absolute", top: 10, right: 10, zIndex: 3 },
  camera: {
    height: 240,
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  snapContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  takePhotoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
  },
  image: {
    height: 240,
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  text: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
  },
  form: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  input: {
    paddingBottom: 16,
    paddingTop: 16,
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },

  submitBtn: {
    height: 51,
    backgroundColor: "#F6F6F6",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBtn: {
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  trashBtn: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trashBtnWrapper: { alignItems: "center", marginBottom: 34 },
});
