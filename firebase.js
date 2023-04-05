//import firebase from "firebase/app";
import {getReactNativePersistence, initializeAuth} from 'firebase/auth/react-native';
//import "firebase/firestore";
//import * as admin from 'firebase-admin';
//const { getFirestore } = require('firebase-admin/firestore');
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {API_KEY, AUTH_DOMAIN, DATABASE_URL, STORAGE_BUCKET, MESSAGE_SENDER_ID, APP_ID} from '@env'
import AsyncStorage from "@react-native-async-storage/async-storage";
/*import "firebase/"*/

const app = initializeApp({
    apiKey:API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: DATABASE_URL,
    storageBucket:STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
});
initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const auth = getAuth(app);
//export const db = getFirestore();
export default app

