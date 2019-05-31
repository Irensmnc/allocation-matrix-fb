import { mapState } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      feedback: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
        // reuse validEmail validator
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be greater than 6 characters'
      ]
    };
  },
  computed: {
    ...mapState(['error','loading'])
  },
  methods: {
    userSignIn() {
      // same like in signup, let error from action propagate upwards, catch and react here
      try {
        this.$store.dispatch('userSignIn', {
          email: this.email,
          password: this.password
        });
      } catch (e) {
      }
      // set variable "error" to true and display error in template
      this.$router.push('/home');
    }
  }
};
