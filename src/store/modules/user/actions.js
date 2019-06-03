import * as firebase from '@/store/actions';
import store from '@/store';

const cardTemplate = {
  id: null,
  project: null,
  user: null,
  daysCharged: 0
};

export function fetchMatrix({ commit}) {
  const data = [
    {
      ...cardTemplate
    }
  ];
  commit('SET_MATRIX', data);
}

export function saveMatrix({commit, state}) {
  axios.post('user/save', state.matrix)
}