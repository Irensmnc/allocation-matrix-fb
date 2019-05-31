import { mapState } from 'vuex';
import { validEmail } from '@/services/validators';

export default {
  data() {
    return {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: '',
      feedback: null,
      error: false,
      emailRules: [v => !!v || 'E-mail is required', validEmail],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be greater than 6 characters'
      ]
    };
  },
  computed: {
    ...mapState(['loading']),

    comparePasswords() {
      return this.password === this.confirmPassword
        ? true
        : "Passwords don't match";
    }
  },
  methods: {
    userSignUp() {
      try {
        this.$store.dispatch('userSignUp', {
          email: this.email,
          password: this.password
        });
      } catch (e) {
        this.error = true;
        // set variable "error" to true and display error in template
      }
      this.$router.push('/home');
    }
  }
};
