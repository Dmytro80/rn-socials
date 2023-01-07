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
import getCurrentDate from "../../utils/getCurrentDate";

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

    return () => subscription?.remove();
  }, []);

  const createComment = async () => {
    try {
      const date = getCurrentDate();
      console.log("date", date);
      await db
        .firestore()
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({ comment, login, date });
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
        .orderBy("date", "asc")
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

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <SafeAreaView style={styles.container}>
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
          <View
            style={{
              flex: 1,
              marginBottom: 32,
              marginTop: 32,
              justifyContent: "center",
            }}
          >
            <FlatList
              data={allComments}
              renderItem={({ item }) => (
                <View
                  style={{
                    marginBottom: 24,
                    flexDirection: login === item.login ? "row-reverse" : "row",
                  }}
                >
                  <View
                    style={{
                      ...styles.avatarWrapper,
                      marginLeft: login === item.login ? 16 : 0,
                      marginRight: login !== item.login ? 16 : 0,
                    }}
                  >
                    <Text>{item.login}</Text>
                  </View>
                  <View
                    style={{
                      ...styles.commentWrapper,
                      borderTopLeftRadius: login === item.login ? 6 : 0,
                      borderTopRightRadius: login === item.login ? 0 : 6,
                    }}
                  >
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.comment}>{item.comment}</Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          ...styles.date,
                          textAlign: login === item.login ? "left" : "right",
                        }}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
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
      </SafeAreaView>
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
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: "50%",
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  commentWrapper: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 16,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  comment: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
  },
  date: {
    fontFamily: "Roboto-Regular",
    fontSize: 10,
    lineHeight: 12,
    color: "#BDBDBD",
  },
});
