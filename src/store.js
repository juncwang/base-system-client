import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemName: 'hello world',
    auth: {}
  },
  mutations: {
    setAuths: (state, payload) => {
      state.auth = payload
    }
  },
  actions: {
    updataAuths: (context, payload) => {
      context.commit('setAuths', payload)
    }
  }
})
