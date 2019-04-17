<template>
  <v-dialog max-width="600px">
    <v-btn flat slot="activator" color="light-green lighten-1"
      >Add a new Project</v-btn
    >
    <v-card>
      <v-card-title>
        <h4>Add a new Project</h4>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            label="Project Charge Code"
            v-model="cc"
            prepend-icon="folder"
            :rules="inputRules"
          ></v-text-field>
          <v-textarea
            label="Client Name"
            v-model="clientName"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>
          <v-textarea
            label="Project Name"
            v-model="name"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>
          <v-textarea
            label="Information"
            v-model="content"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>
          <v-textarea
            label="Person Assigned - Insert Enrian email"
            v-model="user"
            prepend-icon="edit"
            :rules="emailRules"
          ></v-textarea>
          <v-textarea
            label="Number of Days Assigned to this person"
            v-model="days"
            prepend-icon="edit"
            required
          ></v-textarea>

          <v-menu>
            <vue-pikaday
              :value="startDate"
              slot="activator"
              label="Start date"
              v-p-visible="visible"
              prepend-icon="date_range"
            />
            <vue-pikaday v-model="startDate"></vue-pikaday>
          </v-menu>
          <v-menu>
            <vue-pikaday
              :value="endDate"
              slot="activator"
              label="End date"
              v-p-visible="visible"
              prepend-icon="date_range"
            />
            <vue-pikaday v-model="endDate"></vue-pikaday>
          </v-menu>

          <v-btn flat color="#9CCC65" @click="submit" :loading="loading"
            >Add Project</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

export default {
  name: 'Admin',
  data() {
    return {
      name: '',
      cc: '',
      content: '',
      clientName: '',
      assignedUsers: [],
      user: '',
      days: '',
      startDate: null,
      endDate: null,
      visible: false,
      inputRules: [
        v => !!v || 'This field is required',
        v => v.length >= 3 || 'Minimum length is 3 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      loading: false
    };
  },
  firestore() {
    return {
      locations: db.collection('projects').orderBy('createdAt')
    };
  },
  computed:{
    label() {
      return this.visible ? 'Hide' : 'Show';
    },
  },
  methods: {
    toggle() {
      this.visible = !this.visible;
    },
    findAssignedUserByEmail(haystack, user) {
      return find(haystack, (user) => uid === user.email, {});
    },
    submit() {
      const db = firebase.firestore();
        let user = db.collection('Authentication').where('email', '==', firebase.auth().currentUser.uid).get()
          .then(function(doc){
        console.log(doc);

          })
      if (this.$refs.form.validate()) {
        this.loading = true;
        const project = {
          name: this.name,
          clientName: this.clientName,
          cc: this.cc,
          content: this.content,
          assignedUsers: [{user: this.user, days: this.days}],
          startDate: this.startDate,
          endDate: this.endDate,
        };
        db.collection('projects')
          .add(project)
          .then(() => {
            this.loading = false;
          });
      }
    },
  },
  created() {
    db.collection('users_projects').onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === 'modified') {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }
      })
    })
  }
};
</script>

<style scoped></style>
