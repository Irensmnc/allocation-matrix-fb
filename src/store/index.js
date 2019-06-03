import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

import admin from '@/store/modules/admin';
import user from '@/store/modules/user';
import project from '@/store/modules/project';

Vue.use(Vuex);

const state = {
  appTitle: 'Time App',
  error: null,
  loading: false,
  cards: [],
  user: null,
  projects: [],
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    admin, user, project
  }
});
