import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Couple from '../views/Couple.vue'
import Operation from '../views/Operation.vue'
const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'Couple',
    component: Couple
  },
  {
    path: '/operation',
    name: 'Operation',
    component: Operation
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
