export function SET_USER(state, payload) {
  state.user = payload;
}

export function SET_PROJECT(state, payload) {
  state.cards = payload;
}
export function SET_ERROR(state, payload) {
  state.error = payload;
}

export function SET_LOADING(state, payload) {
  state.loading = payload;
}
