import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    systemName: 'hello world',
    // 系统初始化的最高权限
    authNoDeleteName: 'root',
    // 第一个用户
    userNoDeleteName: 'juncwang@live.com',
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
