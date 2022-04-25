import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Couple from '../views/Couple.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Operation from '../views/Operation.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    alias:'/home'
  },
  {
    path: '/operation',
    name: 'Operation',
    component: Operation,
  },
  {
    path: '/couple',
    name: 'Couple',
    component: Couple,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
