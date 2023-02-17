console.log('process.env', import.meta.env.VITE_APP_FIREBASE_APIKEY)

export const firebaseClientConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_APP_FIREBASE_DBURL,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGEID,
    appId: import.meta.env.VITE_APP_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENTID,
}
