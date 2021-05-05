const dotenv = require('dotenv').config();
import * as firebase from 'firebase';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.FIREBASE_DBURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE,
    messagingSenderId: process.env.FIREBASE_MESSAGEID,
    appId: process.env.FIREBASE_APPID
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos")