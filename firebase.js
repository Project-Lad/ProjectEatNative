import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {API_KEY, AUTH_DOMAIN, DATABASE_URL, STORAGE_BUCKET, MESSAGE_SENDER_ID, APP_ID} from '@env'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp({
    apiKey:API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: DATABASE_URL,
    storageBucket:STORAGE_BUCKET,
    messagingSenderId: MESSAGE_SENDER_ID,
    appId: APP_ID
});

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
//export const db = getFirestore();
export default app

