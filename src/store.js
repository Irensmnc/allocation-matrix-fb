import Vue from 'vue';
import Vuex from 'vuex';
import * as firebase from 'firebase';
import router from '@/router';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    appTitle: 'Time App',
    error: null,
    loading: false,
    cards: [],
    user: null
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setProject(state, payload) {
      state.cards = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
  },
  actions: {
    userSignUp({ commit }, { email, password, displayName }) {
      commit('setLoading', true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then( ({ user }) => {
          console.log(user)
          commit('setUser', user)
          commit('setLoading', false);
          router.push('/home');
        })
        .catch(error => {
          commit('setUser', null);
          commit('setError', alert (error.message));
          console.log(error.message)
          commit('setLoading', false);
          router.push('/');
        });
    },
    userSignIn({ commit }, { email, password }) {
      commit('setLoading', true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(({ user }) => {
          commit('setUser', user)
          commit('setLoading', false);
          router.push('/home');
        })
        .catch(error => {
          commit('setError', error.message);
          console.log(error.message)
          commit('setLoading', false);
          router.push('/');
        });
    },
    userSignOut({ commit }) {
      firebase.auth().signOut().then(() => {
        commit('setUser', null);
        router.push('/');
      })
        .catch(() => {
          commit('setUser', null);
          router.push('/');
        });
    },
    autoSignIn({ commit }, payload) {
      commit('setUser', payload);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return !!state.user;
    }
  }
});
