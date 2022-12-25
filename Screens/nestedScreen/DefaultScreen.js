import React, { useState, useEffect } from "react";
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

export default function DefaultScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  console.log("route.params", route.params);
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

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  console.log("posts", posts);

  return (
    <View style={styles.container}>
      <View style={{ width: dimensions }}>
        <FlatList
          data={posts}
          keyExtractor={(item, indx) => indx.toString()}
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
                <View style={styles.commentsContainer}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Comments")}
                  >
                    <Feather name="message-circle" size={24} color="#BDBDBD" />
                  </TouchableOpacity>
                  <Text style={styles.commentCount}>0</Text>
                </View>
                <View style={styles.locationContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate("Map")}>
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

  commentCount: {
    marginLeft: 6,
    ontFamily: "Roboto-Regular",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    color: "#BDBDBD",
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
