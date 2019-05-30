<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 class="text-xs-center" mt-5>
        <h1>Sign Up</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 mt-3>
        <form @submit.prevent="userSignUp">
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
            <v-flex>
              <v-text-field
                name="displayName"
                label="Display Name"
                id="displayName"
                type="text"
                v-model="displayName"
                required
              ></v-text-field>
              <p v-if="feedback">{{ feedback }}</p>
            </v-flex>
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
            <v-flex>
              <v-text-field
                name="confirmPassword"
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                v-model="confirmPassword"
                :rules="[comparePasswords]"
                required
              ></v-text-field>
            </v-flex>
            <v-flex class="text-xs-center" mt-5>
              <v-btn color="light-green lighten-1" type="submit" :disabled="loading">Sign Up</v-btn>
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { mapState } from 'vuex';
import { auth, createUserProfileDocument } from 'firebase';
import slugify from 'slugify';
import { db } from '../main';
import firebase from 'firebase';
import functions from 'firebase/functions'

export default {
  data() {
    return {
      email: '',
      password: '',
      displayName: '',
      confirmPassword: '',
      feedback: null,
      slug: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v =>
          v.length >= 6 ||
          'Password must be greater than 6 characters'
      ]
    };
  },
  computed: {
    ...mapState(['error', 'loading']),

    comparePasswords() {
      return this.password === this.confirmPassword ? true : 'Passwords don\'t match'
    },
  },
  methods: {
    /*   handleSubmit = async event => {
      event.preventDefault();

      const {this.email, this.password, this.displayName };

      try {
        const { user } = await auth.createUserWithEmailAndPassword(email, password)
      },
      createUserProfileDocument(user, { displayName });
    } catch (error) {
      console.error(error);
    }

    this.setState({ displayName: '', email: '', password: '' });
};*/
    userSignUp() {
     /* if (this.displayName && this.email && this.password) {
        this.slug = slugify(this.displayName, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        });
        let createProfile = firebase.functions().httpsCallable('createProfile')
        createProfile({ userRecord: this.userRecord }).then(result => {
          console.log(result)
        })
        /*  if (doc.exists) {
            console.log('doc exists')
            this.feedback = 'This username already exists'
          } else {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
              .then(user => {
                ref.set({
                  username: this.username,
                  user_id: user.uid
                })
              }).then(() => {
              this.$router.push({ name: 'card2' })
            }).catch(error => {
              this.feedback = error.message
            })
            console.log('it does not')
            this.feedback = 'This username is free to use'
          }
        })
        console.log(this.slug)*/
     /* } else {
        this.feedback = 'You must enter a all fields'
      }
      if (this.comparePasswords !== true) {
        return
      } */
      this.$store.dispatch('userSignUp', { email: this.email, password: this.password })
      this.$router.push('/home')
    },
  }
      }

</script>
