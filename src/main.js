import Vue from 'vue';
import Vuetify from 'vuetify';
import VuePikaday from '@enrian/vue-pikaday';

import '@enrian/vue-pikaday/dist/vue-pikaday.min.css';
import 'vuetify/dist/vuetify.min.css';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

Vue.use(Vuetify, {
  theme: {
    primary: '#9CCC65'
  }
});
Vue.use(VuePikaday);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
