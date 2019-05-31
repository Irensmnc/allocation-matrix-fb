import Vue from 'vue';
import Vuetify from 'vuetify';
import VuePikaday from '@enrian/vue-pikaday';

import '@enrian/vue-pikaday/dist/vue-pikaday.min.css';
import 'vuetify/dist/vuetify.min.css';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { firebase } from '@/fb';

Vue.use(Vuetify, {
  theme: {
    primary: '#9CCC65'
  }
});
Vue.use(VuePikaday);

Vue.config.productionTip = false;

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
