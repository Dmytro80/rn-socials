import db from "../../firebase/config";
import { authSlice } from "./authReducer";

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      const user = await db.auth().signInWithEmailAndPassword(email, password);
      console.log("user", user);
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

export const authSignUpUser =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      await db.auth().createUserWithEmailAndPassword(email, password);

      const user = await db.auth().currentUser;

      await user.updateProfile({ displayName: login });

      const { uid, displayName } = await db.auth().currentUser;

      dispatch(
        authSlice.actions.updateUserProfile({
          userId: uid,
          login: displayName,
        })
      );
    } catch (error) {
      console.log("error.message", error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
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
          })
        );
        dispatch(authSlice.actions.authStateChange({ stateChange: true }));
      }
    });
  } catch (error) {
    console.log("error.message", error.message);
  }
};
