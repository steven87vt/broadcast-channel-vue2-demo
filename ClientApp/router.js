import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'

Vue.use(VueRouter)

var base = '/'

let router = new VueRouter({
  mode: 'history',
  base,
  routes: routes
})

export default router
