import React, { useState, useEffect } from "react";
import db from "../../firebase/config";

import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function DefaultScreen({ navigation }) {
  const [posts, setPosts] = useState([]);

  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );

  const getAllPosts = async () => {
    try {
      await db
        .firestore()
        .collection("posts")
        .onSnapshot((data) =>
          setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
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

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width - 16 * 2;
      setDimensions(width);
    };
    const subscription = Dimensions.addEventListener("change", onChange);

    getAllPosts();

    return () => subscription?.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ width: dimensions }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                marginTop: 32,
              }}
            >
              <View>
                <Image source={{ uri: item.photo }} style={styles.image} />
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
                        color: item.countComments === 0 ? "#BDBDBD" : "#212121",
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
                        color={item.countLike === 0 ? "#BDBDBD" : "#FF6C00"}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        ...styles.likesCount,
                        color: item.countLike === 0 ? "#BDBDBD" : "#212121",
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
                  <Text style={styles.locationTitle}>{item.photoLocation}</Text>
                </View>
              </View>
            </View>
          )}
        />
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
