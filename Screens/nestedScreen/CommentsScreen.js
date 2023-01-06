import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  SafeAreaView,
  FlatList,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";

import { useSelector } from "react-redux";
import db from "../../firebase/config";

export default function CommentsScreen({ route }) {
  const { postId, photo } = route.params;

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState(null);
  const [focus, setFocus] = useState(false);
  const [isShowKeybord, setIsShowKeybord] = useState(false);

  const { login } = useSelector((state) => state.auth);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    getAllComments();
    const time = getCurrentDate();
    console.log("time", time);

    return () => subscription?.remove();
  }, []);

  const createComment = async () => {
    try {
      await db
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({ comment, login });
      keyboardHide();
      setComment("");
    } catch (error) {
      console.log("Error creating comment", error.message);
    }
  };

  const getAllComments = async () => {
    try {
      await db
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .onSnapshot((data) =>
          setAllComments(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          )
        );
    } catch (error) {
      console.log("Error geting comments", error.message);
    }
  };

  const keyboardHide = () => {
    setIsShowKeybord(false);
    Keyboard.dismiss();
  };

  const handleFocus = () => {
    setIsShowKeybord(true);
    setFocus(true);
  };

  function getCurrentDate(separator = " ") {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();
    let hour = newDate.getHours();
    let minutes = newDate.getMinutes();

    return `${date < 10 ? `0${date}` : `${date}`}${separator}${
      months[month]
    }${","}${separator}${year}${separator}${"|"}${separator}${
      hour < 10 ? `0${hour}` : `${hour}`
    }${":"}${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
  }
  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View
          style={{
            width: dimensions,
            flex: 1,
            marginBottom: isShowKeybord ? 232 : 0,
            marginTop: isShowKeybord ? 0 : 32,
          }}
        >
          <View>
            <Image source={{ uri: photo }} style={styles.image} />
          </View>
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={allComments}
              renderItem={({ item }) => (
                <View>
                  <Text>{item.comment}</Text>
                  <Text>{item.login}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </SafeAreaView>
          <View
            style={{
              marginBottom: 16,
              position: "relative",
            }}
          >
            <TextInput
              style={{
                ...styles.input,
                borderColor: focus ? "#FF6C00" : "#E8E8E8",
              }}
              value={comment}
              placeholder="Комментировать..."
              placeholderTextColor="#BDBDBD"
              onFocus={() => handleFocus()}
              onBlur={() => setFocus(false)}
              onChangeText={(value) => setComment(value)}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={createComment}>
              <Image
                source={require("../../assets/images/arrow-up.png")}
                style={{ tintColor: "#fff" }}
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
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    height: 240,
    borderRadius: 8,
  },
  input: {
    padding: 16,
    paddingRight: 46,
    backgroundColor: "#F6F6F6",
    borderWidth: 1,
    height: 50,
    borderRadius: 100,
    fontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  submitBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: "50%",
    backgroundColor: "#FF6C00",
  },
});
