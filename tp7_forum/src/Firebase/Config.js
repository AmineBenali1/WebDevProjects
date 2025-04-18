import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDPbfNxkpAysDlGuq_gS18SiHDqXSk3UJ8",
    authDomain: "tp7-forum-bc465.firebaseapp.com",
    projectId: "tp7-forum-bc465",
    storageBucket: "tp7-forum-bc465.firebasestorage.app",
    messagingSenderId: "1029137340390",
    appId: "1:1029137340390:web:04185dfdf001f627416827"
};

// Initialize Firebase
let app;
try {
    app = firebase.initializeApp(firebaseConfig)
    console.log('Firebase initialized successfully')
} catch (error) {
    console.error('Firebase initialization error:', error)
    if (error.code === 'app/duplicate-app') {
        app = firebase.app()
        console.log('Using existing Firebase app')
    } else {
        throw error
    }
}

// Initialize services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// Export FieldValue for timestamp
const FieldValue = firebase.firestore.FieldValue

console.log('Firebase Auth initialized:', projectAuth)
console.log('Firebase Firestore initialized:', projectFirestore)

export { projectFirestore, projectAuth, FieldValue }
