import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import { store } from './store';
import firebase from 'firebase/app';
import 'firebase/firestore';
import DateFilter from './filters/date';
import VuePikaday from '@enrian/vue-pikaday'

import '@enrian/vue-pikaday/dist/vue-pikaday.min.css';



import 'vuetify/dist/vuetify.min.css';
import colors from 'vuetify/es5/util/colors';
import { ActionContext as $store } from 'vuex';

Vue.use(Vuetify, {
  theme: {
    primary: '#9CCC65'
  }
});
Vue.use(VuePikaday);
Vue.filter('date', DateFilter);

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
const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
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

