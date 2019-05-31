import firebase from 'firebase';

firebase.initializeApp({
  apiKey: 'AIzaSyAKxjzDxBeRzRwechEP5eT5pN9ZhU7Ap7o',
  authDomain: 'allocation-matrix.firebaseapp.com',
  databaseURL: 'https://allocation-matrix.firebaseio.com',
  projectId: 'allocation-matrix',
  storageBucket: 'allocation-matrix.appspot.com',
  messagingSenderId: '322441837080'
});

const db = firebase.firestore();

export {
  firebase,
  db
};
