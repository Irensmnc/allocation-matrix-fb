<template>
  <v-card>
    <v-card-title>
      Projects
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="users"
      :search="search"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">
          <v-autocomplete
            :disabled="isUpdating"
            :items="projects"
            box
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            item-value="name"
            multiple
          >
          </v-autocomplete>
          <v-flex xs12 sm6 md3>
            <v-text-field
              label="Days"
            ></v-text-field>
          </v-flex>
          <template>
          <v-btn fab dark small color="primary" v-on="addField()">
            <v-icon dark>add</v-icon>
          </v-btn>
            <v-btn round color="primary" dark @click="submit()"
            >Submit
            </v-btn>
          </template>
        </td>
        <td class="text-xs-right">{{ props.item.info }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

  import { db } from '../main';
  import firebase from  'firebase';

  export default {
    data() {
      return {
        autoUpdate: true,
        search: '',
        isUpdating: false,
        projects: [],
        user: null,
        headers: [
          {
            text: 'Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Projects Assigned', value: 'people' },
          { text: 'Additional Information', value: 'info' }
        ],
        users: [
          /*{ name: 'Irena Nemchova' },
          { name: 'Jakub Golan' },
          { name: 'Michal Szaiter' },
          { name: 'Carlos' },
          { name: 'Boudi' }*/
        ]
      }
    },
    watch: {
      isUpdating(val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      }
    },

    methods: {
      remove(item) {
        const index = this.projects.indexOf(item.name)
        if (index >= 0) this.projects.splice(index, 1)
      },
      addField() {

      },
      findAssignedUser(haystack, uid) {
        return find(haystack, (item) => uid === item.user.id, {});
      },
      submit() {
        const db = firebase.firestore();
        let ref = db.collection('users');
        ref.get().then(snapshot => snapshot.docChanges().forEach(document => {
          let project = document.doc.data();
          let userProject = this.findAssignedUser(project.assignedUsers, this.user.uid);
          console.log(userProject)
          if (userProject) {
            db.collection("users").doc(doc.id).update({
              daysAssigned: this.daysAssigned,
              userId: this.user.uid,
              projectId: document.doc.id
            });
          } else {
            db.collection('users_projects')
              .doc(this.user.uid).set({daysCharged: this.daysCharged, userId: this.user.uid, projectId: document.doc.id})
              .then(() => {
                this.loading = false;
              });
          }
        }));

        }
      },
      created() {
        db.collection("projects").get().then(snapshot => snapshot.forEach(doc => {
          let project = doc.data();
          this.projects.push({
            id: doc.id,
            ...project

          });
        }));
        db.collection("users").get().then(snapshot => snapshot.forEach(doc => {
          let user = doc.data();
          this.users.push({
            id: doc.id,
            ...user

          });
        }))
      }
    }
</script>