<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign In</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form @submit.prevent="userSignIn">
          <v-layout column>
            <v-flex>
              <v-text-field
                name="email"
                label="Email"
                id="email"
                type="email"
                v-model="email"
                required
                :rules="emailRules"
              ></v-text-field>
            </v-flex>
            <p v-if="feedback">{{ feedback }}</p>
            <v-flex>
              <v-text-field
                name="password"
                label="Password"
                id="password"
                type="password"
                v-model="password"
                required
                :rules="passwordRules"
              ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="light-green lighten-1" type="submit">Sign In</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
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
    ...mapState([ 'loading'])
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
        if(e){
        alert(e.message)

        }
        // set variable "error" to true and display error in template
      }
      this.$router.push('/home');
    }
  }
};
</script>
