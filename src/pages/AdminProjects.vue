<template>
  <v-card>
    <v-card-title>
      Users
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>

    <v-data-table :headers="headers" :items="items" :search="search">
      <template v-slot:items="props">
        <td>
          {{ props.item.name }}
          <v-autocomplete
            :disabled="isUpdating"
            :items="users"
            :key="name"
            box
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="displayName"
            item-value="id"
            multiple
            v-model="displayName"
          >
          </v-autocomplete>
        </td>
        <td class="text-xs-right">
          <v-autocomplete
            :disabled="isUpdating"
            :items="projects"
            box
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            item-value="id"
            multiple
          >
          </v-autocomplete>
          <v-flex xs12 sm6 md3>
            <v-text-field v-model="daysAssigned" label="Days"></v-text-field>
          </v-flex>
          <template>
            <v-btn fab dark small color="primary" v-on="">
              <v-icon dark>add</v-icon>
            </v-btn>
            <v-btn round color="primary" dark @click="submit()">Submit </v-btn>
          </template>
        </td>
        <td class="text-xs-right">
          {{ props.item.info }}
          <v-textarea
            v-model="info"
            name="input-7-1"
            box
            label="Label"
            auto-grow
            value="Lorem ipsum"
          ></v-textarea>
        </td>
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
import { db } from '@/main';
import firebase from 'firebase';

const usersTemplate = {
  projectId: '',
  displayName: '',
  info: '',
  daysAssigned: 0
};

const rows = [
  {
    id: 1,
    users: [],
    projects: []
  },
  {
    id: 2,
    users: [],
    projects: []
  },
  {
    id: 3,
    users: [],
    projects: []
  },
  {
    id: 4,
    users: [],
    projects: []
  }
];

export default {
  name: 'adminprojects',
  data() {
    return {
      autoUpdate: true,
      search: '',
      name: '',
      isUpdating: false,
      projects: [],
      users: [],
      items: [],
      people: '',
      daysAssigned: 0,
      displayName: '',
      assignedProjects: [],
      fields: [],
      info: '',
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'displayName'
        },
        { text: 'Projects Assigned', value: 'projects' },
        { text: 'Additional Information', value: 'info' }
      ]
    };
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
      }
    }
  },

  methods: {
    remove(item) {
      const index = this.projects.indexOf(item.name);
      if (index >= 0) this.projects.splice(index, 1);
    },
    usersField(item) {
      const index = this.users.indexOf(item.name);
      if (index >= 0) this.users.splice(index, 1);
    },
    findAssignedProject(haystack, projectId) {
      return find(haystack, item => projectId === item.project.id, {});
      console.log(item.project.id);
    },
    submit() {
      const db = firebase.firestore();
      let ref = db.collection('projects');
      ref.get().then(snapshot =>
        snapshot.docChanges().forEach(document => {
          let project = document.doc.id;
          // let userProject = this.findAssignedProject(user.assignedProjects, this.projects.projectId);
          console.log(project);
          if (project) {
            const usersUpdate = {
              displayName: this.displayName,
              info: this.info,
              projectName: document.doc.id,
              assignedProjects: [{ daysAssigned: this.daysAssigned }]
            };
            db.collection('users')
              .doc(document.doc.id)
              .update(usersUpdate);
          } else {
            db.collection('users')
              .doc(this.project.projectId)
              .set({
                projectId: this.project.projectId,
                email: this.email,
                info: this.info
              })
              .then(() => {
                this.loading = false;
              });
          }
        })
      );
    }
  },
  created() {
    db.collection('projects')
      .get()
      .then(snapshot =>
        snapshot.forEach(doc => {
          let project = doc.data();
          this.projects.push({
            id: doc.id,
            ...project
          });
        })
      );
    db.collection('users')
      .get()
      .then(snapshot =>
        snapshot.forEach(doc => {
          let user = doc.data();
          this.users.push({
            id: doc.id,
            ...user,
            displayName: doc.data().displayName
          });
        })
      );
  }
};
</script>
