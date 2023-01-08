import db from "../../firebase/config";
import { authSlice } from "./authReducer";

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

      const response = await fetch(pickedImagePath);
      const file = await response.blob();

      await db.storage().ref(`avatarImage/${user.uid}`).put(file);

      const userAvatar = await db
        .storage()
        .ref("avatarImage")
        .child(user.uid)
        .getDownloadURL();

      await user.updateProfile({ displayName: login, photoURL: userAvatar });

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
