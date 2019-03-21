import Vuex from 'vuex'
import merge from 'lodash/merge'
import BroadcastChannel from 'broadcast-channel'

export const createStore = (http, storeOverrides) => {
  const defaults = {
    state: {
      user: null
    },

    mutations: {
      user(state, payload) {
        state.user = payload.user
      }
    },

    actions: {
      async setUser({ commit }, user) {
        let obj = {}
        obj.user = user
        commit('user', obj)
      }
    },

    modules: {}
  }


  return new Vuex.Store(merge(defaults, storeOverrides))
}
