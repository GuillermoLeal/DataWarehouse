import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/auth/Login.vue')
  },
  {
    path: '/contactos',
    name: 'Contactos',
    component: () => import('../views/contact/Contact.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: () => import('../views/user/User.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/regiones-ciudades',
    name: 'RegionesCiudades',
    component: () => import('../views/regions/ListRegions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    name: 'Error404',
    component: () => import('../views/error404.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      next();
    } else {
      next({ path: '/' });
    }
  } else {
    next();
  }
});

export default router;
