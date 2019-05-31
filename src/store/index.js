import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

Vue.use(Vuex);

const state = {
  appTitle: 'Time App',
  error: null,
  loading: false,
  cards: [],
  user: null
};

export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions,
  getters
});
