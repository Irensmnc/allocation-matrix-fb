import { mapGetters } from 'vuex';

import { LANDING_ROUTE, HOME_ROUTE, SIGNUP_ROUTE, SIGNIN_ROUTE, ADMIN_PROJECTS_ROUTE } from '@/router';

export default {
  name: 'App',
  data() {
    return {
      appTitle: 'Time App',
      sidebar: false,
      LANDING_ROUTE
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    menuItems() {
      if (this.isAuthenticated) {
        // check signed user role, if admin, add also admin link
        return [
          { title: 'Home', name: HOME_ROUTE, icon: 'user' },
          { title: 'Projects', name: ADMIN_PROJECTS_ROUTE, icon: 'user' },
        ];
      } else {
        return [
          { title: 'Sign Up', name: SIGNUP_ROUTE, icon: 'face' },
          { title: 'Sign In', name: SIGNIN_ROUTE, icon: 'lock_open' }
        ];
      }
    }
  },
  methods: {
    userSignOut() {
      this.$store.dispatch('userSignOut');
    }
  }
};
