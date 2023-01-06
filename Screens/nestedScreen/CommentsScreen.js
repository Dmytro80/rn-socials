import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { useSelector } from "react-redux";
import db from "../../firebase/config";

export default function CommentsScreen({ route }) {
  const { postId, photo } = route.params;

  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);

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
      db.firestore()
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({ comment, login });
    } catch (error) {
      console.log("Error creating comment", error.message);
    }
  };

  const getAllComments = async () => {
    try {
      db.firestore()
        .collection("post")
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

  return (
    <View style={styles.container}>
      <View style={{ width: dimensions }}>
        <View>
          <Image source={{ uri: photo }} style={styles.image} />
        </View>
      </View>
    </View>
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
    marginTop: 32,
  },
});
