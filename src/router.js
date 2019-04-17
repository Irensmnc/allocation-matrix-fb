import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase';

const routerOptions = [
  { path: '/', component: 'Landing' },
  { path: '/signin', component: 'Signin' },
  { path: '/signup', component: 'Signup' },
  { path: '/card2', component: 'Card2', meta: { requiresAuth: true } },
  { path: '/admin', component: 'Admin', meta: { requiresAuth: true } },
  { path: '*', component: '404' }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  };
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !isAuthenticated) {
      next('/signin');
    } else {
      next();
  }
});

export default router;
