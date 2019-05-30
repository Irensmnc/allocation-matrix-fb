import Vue from 'vue';
import firebase from 'firebase';
import Vuetify from 'vuetify';
import 'firebase/firestore';
import VuePikaday from '@enrian/vue-pikaday';

import '@enrian/vue-pikaday/dist/vue-pikaday.min.css';
import 'vuetify/dist/vuetify.min.css';

import App from '@/App.vue';
import router from '@/router';
import { store } from '@/store';

Vue.use(Vuetify, {
  theme: {
    primary: '#9CCC65'
  }
});
Vue.use(VuePikaday);

firebase.initializeApp({
  apiKey: 'AIzaSyAKxjzDxBeRzRwechEP5eT5pN9ZhU7Ap7o',
  authDomain: 'allocation-matrix.firebaseapp.com',
  databaseURL: 'https://allocation-matrix.firebaseio.com',
  projectId: 'allocation-matrix',
  storageBucket: 'allocation-matrix.appspot.com',
  messagingSenderId: '322441837080'
});

Vue.config.productionTip = false;

export const db = firebase.firestore();

/* eslint-disable no-new */
const unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    created() {
      if (firebaseUser) {
        store.dispatch('autoSignIn', firebaseUser);
      }
    }
  });
  unsubscribe();
});
