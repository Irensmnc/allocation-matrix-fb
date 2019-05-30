<template>
  <div>
    <div>
      {{ project.name }}
    </div>
    <v-data-table :headers="headers" :items="project.people || []">
      <template v-slot:items="props">
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.userAssigned"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.userAssigned }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-edit-dialog
            :return-value.sync="props.item.daysAssigned"
            large
            lazy
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.daysAssigned }}</div>
            <template v-slot:input>
              <div class="mt-3 title">Update Assigned Days</div>
            </template>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.daysAssigned"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="600px" v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-btn flat color="light-green lighten-1" v-on="on"
          >Assign Users
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h4>Assign a User to this Project</h4>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Name"
              v-model="userAssigned"
              prepend-icon="folder"
            ></v-text-field>
            <v-textarea
              label="Days Assigned"
              v-model="daysAssigned"
              prepend-icon="edit"
            ></v-textarea>
          </v-form>
          <v-btn flat color="#9CCC65" @click="assignUsers" :loading="loading"
            >Assign a user
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { db } from '@/main';
import firebase from 'firebase';

export default {
  name: 'projectprofile',
  data() {
    return {
      project: {},
      max25chars: v => v.length <= 25 || 'Input too long!',
      snack: false,
      dialog: false,
      loading: false,
      snackColor: '',
      snackText: '',
      users: [],
      items: [],
      daysAssigned: 0,
      userAssigned: '',
      displayName: '',
      headers: [
        { text: 'Assigned Users', value: 'users' },
        { text: 'Assigned Days', value: 'days' }
      ]
    };
  },
  computed: {
    projectId() {
      return this.$route.params.id;
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    assignUsers() {
      const db = firebase.firestore();
      this.loading = true;
      db.collection('projects')
        .doc(this.$route.params.id)
        .update({
          people: firebase.firestore.FieldValue.arrayUnion({
            userAssigned: this.userAssigned,
            daysAssigned: this.daysAssigned,
            displayName: this.displayName
          })
        })
        .then(() => {
          this.loading = false;
        });
    },
    save() {
      this.snack = true;
      this.snackColor = 'success';
      this.snackText = 'Changes have been successfully saved';
    },
    cancel() {
      this.snack = true;
      this.snackColor = 'error';
      this.snackText = 'Canceled';
    },
    open() {
      this.snack = true;
      this.snackColor = 'info';
      this.snackText = 'Edit Assigned Days';
    },
    close() {
      console.log('All changes have been successfully saved');
    },
    async loadData() {
      db.collection('projects')
        .doc(this.projectId)
        .get()
        .then(doc => (this.project = doc.data()));
    }
  }
};
</script>
