import * as firebase from 'firebase';
import router from '@/router';

export function userSignUp({ commit }, { email, password, displayName }) {
  commit('SET_LOADING', true);
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(({ user }) => {
    console.log(user);
    commit('SET_USER', user);
    commit('SET_LOADING', false);
    router.push('/home');
  })
  .catch(error => {
    commit('SET_USER', null);
    commit('SET_ERROR', alert(error.message));
    console.log(error.message);
    commit('SET_LOADING', false);
    router.push('/');
  });
}

export function userSignIn({ commit }, { email, password }) {
  commit('SET_LOADING', true);
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(({ user }) => {
    commit('SET_USER', user)
    commit('SET_LOADING', false);
    router.push('/home');
  })
  .catch(error => {
    commit('SET_ERROR', error.message);
    console.log(error.message)
    commit('SET_LOADING', false);
    router.push('/');
  });
}

export function userSignOut({ commit }) {
  firebase
    .auth()
    .signOut()
    .then(() => {
      commit('SET_USER', null);
      router.push('/');
    })
    .catch(() => {
      commit('SET_USER', null);
      router.push('/');
    });
}

export function autoSignIn({ commit }, payload) {
  commit('SET_USER', payload);
}
