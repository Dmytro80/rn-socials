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
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as Location from "expo-location";

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
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    return () => subscription?.remove();
  }, []);

  const keyboardHide = () => {
    Keyboard.dismiss();
  };

  const handlerSubmit = () => {
    console.log({ ...inputs, photo, location });

    keyboardHide();

    navigation.navigate("DefaultScreen", { ...inputs, photo, location });
    setInputs(initialInputs);
    setPhoto(null);
  };

  const handlerFocus = (nameInput) => {
    setFocus((prevState) => ({ ...prevState, [nameInput]: true }));
  };

  const takePhoto = async () => {
    const { uri } = await camera.takePictureAsync();

    const location = await Location.getCurrentPositionAsync({});

    setLocation(location);

    setPhoto(uri);
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View
          style={{
            ...styles.form,
            width: dimensions,
          }}
        >
          <View style={{ marginTop: 32 }}>
            <View style={styles.cameraWrapper}>
              <Camera
                style={styles.camera}
                ref={(ref) => {
                  setCamera(ref);
                }}
              >
                {photo && (
                  <View style={styles.takePhotoContainer}>
                    <Image source={{ uri: photo }} style={styles.image} />
                  </View>
                )}
              </Camera>
              <TouchableOpacity
                onPress={takePhoto}
                style={styles.snapContainer}
              >
                <FontAwesome5 name="camera" size={24} color="#BDBDBD" />
              </TouchableOpacity>
              <Text style={styles.text}>Загрузите фото</Text>
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
              disabled={!photo}
              onPress={handlerSubmit}
            >
              <Text
                style={{
                  ...styles.titleBtn,
                  color: photo ? "#FFFFFF" : "#BDBDBD",
                }}
              >
                Опубликовать
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.trashBtnWrapper}>
            <TouchableOpacity style={styles.trashBtn}>
              <Feather name="trash-2" size={24} color="#BDBDBD" />
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
    height: 240,
    position: "relative",
    marginBottom: 32,
  },
  camera: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 8,
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  takePhotoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 240,
    zIndex: 3,
    borderRadius: 8,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  trashBtnWrapper: { alignItems: "center", marginBottom: 34 },
});
