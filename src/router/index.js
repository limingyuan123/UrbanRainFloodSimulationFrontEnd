import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Couple from '../views/Couple.vue'
import Operation from '../views/Operation.vue'
const routes = [
  {
    path: '/',
    name: 'Operation',
    component: Operation,
    alias:'/operation'
  },
  {
    path: '/couple',
    name: 'Couple',
    component: Couple,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
