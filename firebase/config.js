import * as firebase from "firebase";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDop9_sVN0QMzcbY77F4jj7zkr3QkYawvg",
  authDomain: "rn-socials-1074c.firebaseapp.com",
  projectId: "rn-socials-1074c",
  storageBucket: "rn-socials-1074c.appspot.com",
  messagingSenderId: "502247901206",
  appId: "1:502247901206:web:a5834cb2c979248d60cd37",
  measurementId: "G-313LVFDR6P",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
