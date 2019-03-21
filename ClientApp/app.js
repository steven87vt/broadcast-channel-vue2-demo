import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import { sync } from 'vuex-router-sync'
import { createStore } from './store/index'
import bootstrap from 'bootstrap'
import App from './components/app-root'


Vue.use(Vuex)

const store = createStore(Vue.prototype.$http)
sync(store, router)

const app = new Vue({
  store,
  router,
  ...App
})

export { app, router, store }
