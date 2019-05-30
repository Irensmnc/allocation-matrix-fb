import { mapGetters } from 'vuex';

import { LANDING_ROUTE } from '@/router';

export default {
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
        return [{ title: 'Home', path: '/home', icon: 'user' }];
      } else {
        return [
          { title: 'Sign Up', path: '/signup', icon: 'face' },
          { title: 'Sign In', path: '/signin', icon: 'lock_open' }
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
