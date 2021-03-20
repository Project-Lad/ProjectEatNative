import firebase from "firebase/app";
require('firebase/auth')
import "firebase/firestore";
/*import "firebase/"*/

const app = firebase.initializeApp({
    apiKey: "AIzaSyBjcZhu8KmGCAPEYJnFpm1hZpZE4XLW-a4",
    authDomain: "eat-out-c3046.firebaseapp.com",
    projectId: "eat-out-c3046",
    storageBucket: "eat-out-c3046.appspot.com",
    messagingSenderId: "849340667852",
    appId: "1:849340667852:web:f5115bbca36242377def69"
});
/*export const db = app.firestore();*/
export default app

