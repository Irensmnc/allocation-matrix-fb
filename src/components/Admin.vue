<template>
  <div>
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
          :items="projects"
          :search="search"
        >
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.code }}</td>
            <td class="text-xs-right">{{ props.item.status }}</td>
            <td class="text-xs-right">
              <v-autocomplete
                :disabled="isUpdating"
                :items="people"
                box
                chips
                color="blue-grey lighten-2"
                label="Select"
                item-text="name"
                item-value="name"
                multiple
              >

              </v-autocomplete>
            </td>
            <td class="text-xs-right">
                <v-flex xs12 sm6 md3>
                  <v-text-field
                    label="Days"
                  ></v-text-field>
                </v-flex>
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
            label="Project Name"
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
            label="Project Code"
            v-model="name"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>
          <v-textarea
            label="Status"
            v-model="status"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>
          <v-textarea
            label="Information"
            v-model="content"
            prepend-icon="edit"
            :rules="inputRules"
          ></v-textarea>

          <v-menu>
            <vue-pikaday
              :value="startDate"
              slot="activator"
              placeholder="Start date"
            />
            <vue-pikaday v-model="startDate"></vue-pikaday>
          </v-menu>
          <v-menu>
            <vue-pikaday
              :value="endDate"
              slot="activator"
              placeholder="End date"
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
    <v-btn round class="text-align:right" color="primary" dark @click=""
    >Submit
    </v-btn
    >

    <template>
      <v-container fluid grid-list-md>
        <v-switch v-model="expand" :label="(expand) ? 'Expand Multiple' : 'Expand Single'"></v-switch>
        <v-data-iterator
          :items="items"
          item-key="name"
          :rows-per-page-items="rowsPerPageItems"
          :pagination.sync="pagination"
          content-tag="v-layout"
          :expand="expand"
          row
          wrap
        >
          <template v-slot:item="props">
            <v-flex
              xs12
              sm6
              md4
              lg3
            >
              <v-card>
                <v-card-title>
                  <h4>{{ props.item.name }}</h4>
                </v-card-title>
                <v-switch
                  v-model="props.expanded"
                  :label="(props.expanded) ? 'Expanded' : 'Closed'"
                  class="pl-3 mt-0"
                ></v-switch>
                <v-divider></v-divider>
                <v-list v-if="props.expanded" dense>
                  <v-list-tile>
                    <v-list-tile-content>Zurich:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.zurich }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Wakanda:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.wakanda }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>UCB:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.carbs }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Molo:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.protein }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>UCI:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.sodium }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>ACEA:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.calcium }}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-list-tile-content>Optima:</v-list-tile-content>
                    <v-list-tile-content class="align-end">{{ props.item.iron }}</v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-container>
    </template>
  </div>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

export default {
  name: 'Admin',
  data() {
    return {
      expand: false,
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4
      },
      autoUpdate: true,
      search: '',
      isUpdating: false,
      name: '',
      cc: '',
      content: '',
      clientName: '',
      assignedUsers: [],
      status: '',
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
      loading: false,
      headers: [
        {
          text: 'Project Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Charge Code', value: 'code' },
        { text: 'Status', value: 'status' },
        { text: 'People Assigned', value: 'people' },
        { text: 'Days Assigned', value: 'days' },
        { text: 'Additional Information', value: 'info' }
      ],
      projects: [
        {
          name: 'Wakanda',
          code: 'WAKA001',
          status: 'active',
          people: 'Irena Nemchova',
          days: 4,
          info: '..'
        },
        {
          name: 'UCB',
          code: 'UCB001',
          status: 'active',
          people: 'Irena Nemchova',
          days: 4,
          info: '..'
        },
        {
          name: 'Zurich',
          code: 'Zurich001',
          status: 'active',
          people: 'Irena Nemchova',
          days: 4,
          info: '..'
        },
      ],
      people: [
        { name: 'Irena Nemchova' },
        { name: 'Jakub Golan' },
        { name: 'Michal Szaiter' },
        { name: 'Carlos' },
        { name: 'Boudi' }
      ],
      items: [
        {
          name: 'Zurich',
          Irena: 22,
          Michal: 10,
          Carlos: 5
        },
        {
          name: 'Wakanda',
          Boudi: 22,
          Michal: 10,
          Peter: 5
        },
        {
          name: 'UCB',
          Victor: 10,
          Carlos: 12,
          Irena: 5
        }
      ]
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
    remove (item) {
      const index = this.friends.indexOf(item.name)
      if (index >= 0) this.friends.splice(index, 1)
    },
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
          status: this.status,
        };
        db.collection('projects')
          .add(project)
          .then(() => {
            this.loading = false;
          });
      }
    },
  },
  watch: {
    isUpdating (val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000)
      }
    }
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
