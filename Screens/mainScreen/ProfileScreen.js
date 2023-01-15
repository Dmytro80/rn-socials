import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import db from "../../firebase/config";

export default function ProfileScreen() {
  // const uploadAvatar = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://pixabay.com/get/gc112d9b29705463f84b9a7df746542dbcd3b6d6b354b9e582589bc7853053eec0f011f2e664b6f759fd972a933355265_640.png"
  //     );

  //     console.log("response", response);
  //     const file = await response.blob();
  //     console.log("file", file);

  //     const uniqueId = Date.now().toString();

  //     await db.storage().ref(`avatar/${uniqueId}`).put(file);

  //     const url = await db
  //       .storage()
  //       .ref("avatar")
  //       .child(uniqueId)
  //       .getDownloadURL();

  //     console.log("url", url);
  //   } catch (error) {
  //     console.log("error gettint avatarUrl", error.message);
  //   }
  // };

  // useEffect(() => {
  //   uploadAvatar();
  // }, []);
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
