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
    path: '/companias',
    name: 'Compañias',
    component: () => import('../views/company/Company.vue'),
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
  const info = JSON.parse(localStorage.getItem('user')) || false;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      if (!info.role && to.fullPath == '/usuarios') next({ path: '/error404' });
      next();
    } else {
      next({ path: '/' });
    }
  } else {
    if (!info.role && to.fullPath == '/usuarios') next({ path: '/error404' });
    next();
  }
});

export default router;
