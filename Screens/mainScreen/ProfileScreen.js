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
  FlatList,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";

import db from "../../firebase/config";

import {
  authUpdateAvatar,
  authSignOutUser,
} from "../../redux/auth/authOperations";

import { Feather, AntDesign } from "@expo/vector-icons";

export default function ProfileScreen({ navigation }) {
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const { userAvatar, login, userId } = useSelector((state) => state.auth);

  const [pickedImagePath, setPickedImagePath] = useState(null);

  const [currentUserPosts, setCurrentUserPosts] = useState([]);

  const dispatch = useDispatch();

  const getCurrentPosts = async () => {
    try {
      await db
        .firestore()
        .collection("posts")
        .where("userId", "==", userId)
        .onSnapshot((data) =>
          setCurrentUserPosts(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  const incrementCountLikes = (postId) => {
    const currentPostRef = db.firestore().collection("posts").doc(postId);

    currentPostRef.update({
      countLike: db.firestore.FieldValue.increment(1),
    });
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
      dispatch(authUpdateAvatar(result.assets[0].uri));
    }
  };

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    setPickedImagePath(userAvatar);

    getCurrentPosts();

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    setPickedImagePath(userAvatar);
  }, [userAvatar]);

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imageBg}
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
          <View style={{ marginTop: 75 }}>
            {login && <Text style={styles.title}>{login}</Text>}
          </View>
          {currentUserPosts.length > 0 && (
            <View style={{ width: dimensions, marginBottom: 110 }}>
              <FlatList
                data={currentUserPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View
                    style={{
                      marginTop: 32,
                    }}
                  >
                    <View>
                      <Image
                        source={{ uri: item.photo }}
                        style={styles.image}
                      />
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <Text style={styles.photoName}>{item.photoName}</Text>
                    </View>
                    <View style={styles.actionsWrapper}>
                      <View style={{ flexDirection: "row" }}>
                        <View style={styles.commentsContainer}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate("Comments", {
                                postId: item.id,
                                photo: item.photo,
                              })
                            }
                          >
                            {item.countComments === 0 ? (
                              <Image
                                source={require("../../assets/images/message-circle.png")}
                                style={{ tintColor: "#BDBDBD" }}
                              />
                            ) : (
                              <Image
                                source={require("../../assets/images/message-circle-fill.png")}
                              />
                            )}
                          </TouchableOpacity>
                          <Text
                            style={{
                              ...styles.commentCount,
                              color:
                                item.countComments === 0
                                  ? "#BDBDBD"
                                  : "#212121",
                            }}
                          >
                            {item.countComments}
                          </Text>
                        </View>
                        <View style={styles.likesContainer}>
                          <TouchableOpacity
                            onPress={() => incrementCountLikes(item.id)}
                          >
                            <AntDesign
                              name="like2"
                              size={24}
                              color={
                                item.countLike === 0 ? "#BDBDBD" : "#FF6C00"
                              }
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              ...styles.likesCount,
                              color:
                                item.countLike === 0 ? "#BDBDBD" : "#212121",
                            }}
                          >
                            {item.countLike}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.locationContainer}>
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Map", item)}
                        >
                          <Feather name="map-pin" size={24} color="#BDBDBD" />
                        </TouchableOpacity>
                        <Text style={styles.locationTitle}>
                          {item.photoLocation}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
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
  imageBg: {
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
  title: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    textAlign: "center",
    letterSpacing: 0.01,
    color: "#212121",
  },
  image: {
    flex: 1,
    height: 240,
    borderRadius: 8,
  },
  photoName: {
    fontFamily: "Roboto-Medium",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  actionsWrapper: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 24,
  },
  commentCount: {
    marginLeft: 6,
    ontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  likesCount: {
    marginLeft: 6,
    ontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  locationTitle: {
    marginLeft: 4,
    ontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textDecorationLine: "underline",
  },
});
