import * as firebase from 'firebase';
import "firebase/firestore";

 export const firebaseConfig = {
    apiKey: "AIzaSyBE7tjvadykEtSDMZbxHCgKSREXqigAa7k",
    authDomain: "petapp-64e34.firebaseapp.com",
    databaseURL: "https://petapp-64e34.firebaseio.com",
    projectId: "petapp-64e34",
    storageBucket: "petapp-64e34.appspot.com",
    messagingSenderId: "831172014060",
    appId: "1:831172014060:web:63d4373102fe79a9341ac9",
    measurementId: "G-TNDGL05D7L"
  };

const app = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore(app);
export const storage = firebase.storage();

