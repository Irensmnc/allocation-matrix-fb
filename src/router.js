import Vue from 'vue';
import Router from 'vue-router';
import { firebase } from '@/fb';

export const LANDING_ROUTE = 'landing';
export const SIGNIN_ROUTE = 'signin';
export const SIGNUP_ROUTE = 'signup';
export const HOME_ROUTE = 'home';
export const ALLPROJECTS_ROUTE = 'allprojects';
export const PROJECTUSERS_ROUTE = 'projectusers';
export const ADMIN_PROJECTS_ROUTE = 'projects';
// create constants for other routes and use it everywhere as ":to={name: ROUTE_CONSTANT}"

const routerOptions = [
  { path: '/', component: 'Landing', name: LANDING_ROUTE },
  { path: '/signin', component: 'Signin', name: SIGNIN_ROUTE },
  { path: '/signup', component: 'Signup', name: SIGNUP_ROUTE },
  {
    path: '/home',
    component: 'Home',
    name: HOME_ROUTE,
    meta: { requiresAuth: true }
  },
  {
    path: '/allprojects/allprojects',
    component: 'AllProjects',
    name: ALLPROJECTS_ROUTE,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/project/:id/users',
    component: 'admin/ProjectUsers',
    name: PROJECTUSERS_ROUTE,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/projects',
    component: 'admin/Projects',
    name: ADMIN_PROJECTS_ROUTE,
    meta: { requiresAuth: true }
  },
  { path: '*', component: '404' }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/pages/${route.component}.vue`)
  };
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = firebase.auth().currentUser;
  const requiresAuth = to.meta.requiresAuth;
  if (requiresAuth && !isAuthenticated) {
    next('/signin');
  } else {
    next();
  }
});

export default router;
