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
            <td class="text-xs-right">{{ props.item.clientName }}</td>
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
                v-model="name"
              >

              </v-autocomplete>
            </td>
            <td class="text-xs-right">
                <v-flex xs12 sm6 md3>
                  <v-text-field
                    v-model="days"
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
            v-model="name"
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
            label="Charge Code"
            v-model="code"
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
            v-model="info"
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

          <v-btn flat color="#9CCC65" @click="addProject" :loading="loading"
            >Add Project</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
    <v-btn round class="text-align:right" color="primary" dark @click="submit()"
    >Submit
    </v-btn
    >
  </div>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

export default {
  name: 'Admin',
  data() {
    return {
      autoUpdate: true,
      search: '',
      isUpdating: false,
      name: '',
      code: '',
      info: '',
      clientName: '',
      assignedUsers: [],
      user: '',
      startDate: null,
      endDate: null,
      visible: false,
      status: '',
      days: 0,
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
        { text: 'Client Name', value: 'client' },
        { text: 'Charge Code', value: 'code' },
        { text: 'Status', value: 'status' },
        { text: 'People Assigned', value: 'people' },
        { text: 'Total Days Assigned', value: 'days' },
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
      ],
      people: [
        { name: 'Irena Nemchova', days: 0 },
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
    toggle() {
      this.visible = !this.visible;
    },
    addProject() {
      const db = firebase.firestore();
      if (this.$refs.form.validate()) {
        this.loading = true;
        const project = {
          name: this.name,
          clientName: this.clientName,
          code: this.code,
          info: this.info,
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
    submit(){
      const db = firebase.firestore();
      this.loading = true;
      const assignedUsers = {
        name: this.name,
        days: this.days
      };
      db.collection('Users').add(people).then(() => {
        this.loading = false;
      });

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
    db.collection('projects').onSnapshot(res => {
      const changes = res.docChanges();
      changes.forEach(change => {
        if (change.type === 'added') {
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
