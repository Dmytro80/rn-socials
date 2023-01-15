import db from "../../firebase/config";
import { authSlice } from "./authReducer";

const uploadAvatar = async (avatar) => {
  const response = await fetch(avatar);

  const file = await response.blob();

  const uniqueId = Date.now().toString();

  await db.storage().ref(`avatar/${uniqueId}`).put(file);

  const url = await db.storage().ref("avatar").child(uniqueId).getDownloadURL();

  return url;
};

const getAvatarUrl = async (photo) => {
  try {
    if (photo) {
      const url = await uploadAvatar(photo);

      return url;
    }
    const url = await uploadAvatar(
      "https://pixabay.com/get/gc112d9b29705463f84b9a7df746542dbcd3b6d6b354b9e582589bc7853053eec0f011f2e664b6f759fd972a933355265_640.png"
    );
    return url;
  } catch (error) {
    console.log("error gettint avatarUrl", error.message);
  }
};

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

export const authSignUpUser =
  ({ login, email, password, pickedImagePath }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);

      const user = await db.auth().currentUser;

      const userAvatarUrl = await getAvatarUrl(pickedImagePath);

      await user.updateProfile({ displayName: login, photoURL: userAvatarUrl });

      const { uid, displayName, photoURL } = await db.auth().currentUser;

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          login: displayName,
          userAvatar: photoURL,
        })
      );
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    await db.auth().signOut();

    dispatch(authSlice.actions.authSignOut());
  } catch (error) {
    console.log("error.message", error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await db.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          authSlice.actions.updateUserProfile({
            userId: user.uid,
            login: user.displayName,
            userAvatar: user.photoURL,
          })
        );
        dispatch(authSlice.actions.authStateChange({ stateChange: true }));
      }
    });
  } catch (error) {
    console.log("error.message", error.message);
  }
};
