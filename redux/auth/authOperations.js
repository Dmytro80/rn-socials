import db from "../../firebase/config";
import { authSlice } from "./authReducer";

const uploadAvatar = async (avatar, userId) => {
  try {
    const response = await fetch(avatar);

    const file = await response.blob();

    await db.storage().ref(`avatar/${userId}`).put(file);

    const url = await db.storage().ref("avatar").child(userId).getDownloadURL();

    return url;
  } catch (error) {
    console.log("error uploading avatarUrl", error.message);
  }
};

const getAvatarUrl = async (photo, userId) => {
  try {
    if (photo) {
      const url = await uploadAvatar(photo, userId);

      return url;
    }
    const url = await uploadAvatar(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_150.png",
      userId
    );
    return url;
  } catch (error) {
    console.log("error getting avatarUrl", error.message);
  }
};

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log("error sign in", error.message);
    }
  };

export const authSignUpUser =
  ({ login, email, password, pickedImagePath }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);

      const user = await db.auth().currentUser;

      const userAvatarUrl = await getAvatarUrl(pickedImagePath, user.uid);

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
      console.log("error sign up", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    await db.auth().signOut();

    dispatch(authSlice.actions.authSignOut());
  } catch (error) {
    console.log("error sign out", error.message);
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
    console.log("error changing state", error.message);
  }
};

export const authUpdateAvatar = (newAvatar) => async (dispatch, getState) => {
  try {
    const user = await db.auth().currentUser;

    const userAvatarUrl = await getAvatarUrl(newAvatar, user.uid);

    await user.updateProfile({ photoURL: userAvatarUrl });

    const { photoURL } = await db.auth().currentUser;

    dispatch(
      authSlice.actions.updateUserAvatar({
        userAvatar: photoURL,
      })
    );
  } catch (error) {
    console.log("error updating avatar", error.message);
  }
};
