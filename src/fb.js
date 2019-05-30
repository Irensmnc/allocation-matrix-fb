/*import firebase from 'firebase';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAKxjzDxBeRzRwechEP5eT5pN9ZhU7Ap7o',
  authDomain: 'allocation-matrix.firebaseapp.com',
  databaseURL: 'https://allocation-matrix.firebaseio.com',
  projectId: 'allocation-matrix',
  storageBucket: 'allocation-matrix.appspot.com',
  messagingSenderId: '322441837080'
};

firebase.initializeApp(config);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;*/

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

firebase.initializeApp();

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

firestore.settings({ timestampsInSnapshots: true });

window.firebase = firebase;

export const createUserProfileDocument = async (user, additionalData) => {
  if (!user) return;

  // Get a reference to the place in the database where a user profile might be.
  const userRef = firestore.doc(`users/${user.uid}`);

  // Go and fetch the document from that location.
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = user;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        photoURL,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user', error.message);
    }
  }

  return getUserDocument(user.uid);
};

export const getUserDocument = async uid => {
  if (!uid) return null;
  try {
    return firestore.collection('users').doc(uid);
  } catch (error) {
    console.error('Error fetching user', error.message);
  }
};

export default firebase;
