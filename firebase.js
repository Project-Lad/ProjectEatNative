import firebase from "firebase/app";
require('firebase/auth')
import "firebase/firestore";
import {API_KEY, AUTH_DOMAIN, DATABASE_URL, STORAGE_BUCKET, MESSAGE_SENDER_ID, APP_ID} from '@env'
/*import "firebase/"*/

const app = firebase.initializeApp({
    apiKey:API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: DATABASE_URL,
    storageBucket:STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
});
export const db = app.firestore()
export default app

