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
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
        </template>
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.name" label="Project Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.clientName" label="Client Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.projectLead" label="Project Lead"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.code" label="Code"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.status" label="Status"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.info" label="Additional Information"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="close">Cancel</v-btn>
            <v-btn color="primary" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        :headers="headers"
        :items="projects"
        :search="search"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.clientName }}</td>
          <td class="text-xs-left">{{ props.item.projectLead }}</td>
          <td class="text-xs-left">{{ props.item.code }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
          <td class="text-xs-left">{{ props.item.people ? props.item.people.length : 0 }}
            <router-link tag="v-btn" color="primary" fab small
                         :to="{name:'project-users',params:{id: props.item.id}}">
              <v-icon color="primary">account_circle</v-icon>
            </router-link>
          </td>
          <td class="text-xs-left">{{ props.item.info }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteProject(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog max-width="600px" v-model="dialog1">
      <template v-slot:activator="{ on }">
        <v-btn flat color="light-green lighten-1" v-on="on"
        >Add a new Project
        </v-btn
        >
      </template>
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
              label="Project Lead"
              v-model="projectLead"
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
                v-model="startDate"
                slot="activator"
                placeholder="Start date"
              ></vue-pikaday>
            </v-menu>
            <v-menu>
              <vue-pikaday
                v-model="endDate"
                slot="activator"
                placeholder="End date"
              />
            </v-menu>

          </v-form>
          <v-btn flat color="#9CCC65" @click="addProject" :loading="loading"
          >Add Project
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-alert
      v-model="alert"
      color="primary"
      dismissible
      transition="scale-transition"

    >
      Awesome! Your project has been successfully added.
    </v-alert>
  </div>
</template>

<script>
  import { db } from '../main';
  import firebase from 'firebase';

  export default {
    name: 'Admin',
    data() {
      return {
        alert: false,
        autoUpdate: true,
        search: '',
        isUpdating: false,
        name: '',
        code: '',
        info: '',
        clientName: '',
        projectLead: '',
        userAssigned: [],
        daysAssigned: 0,
        user: '',
        startDate: null,
        endDate: null,
        visible: false,
        status: '',
        days: 0,
        dialog: false,
        dialog1: false,
        dialog2: false,
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
          { text: 'Client Name', value: 'clientName' },
          { text: 'Project Lead', value: 'projectLead' },
          { text: 'Charge Code', value: 'code' },
          { text: 'Status', value: 'status' },
          { text: 'Total People Assigned', value: 'people' },
          { text: 'Additional Information', value: 'info' }
        ],
        projects: [],
        editedIndex: -1,
        editedItem:
          {
            name: '',
            clientName: '',
            projectLead:'',
            code: 0,
            status: '',
            people: [],
            days: 0,
            info: ''
          },
        defaultItem: {
          name: '',
          clientName: '',
          projectLead: '',
          code: 0,
          status: '',
          people: [],
          days: 0,
          info: ''
        },
        people: [
          { name: 'Irena Nemchova' },
          { name: 'Jakub Golan' },
          { name: 'Michal Szaiter' },
          { name: 'Carlos' },
          { name: 'Boudi' }
        ],
        items: {}
      };
    },
    firestore() {
      return {
        locations: db.collection('projects').orderBy('createdAt')
      };
    },
    computed: {
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
            projectLead: this.projectLead,
            code: this.code,
            info: this.info,
            people: [{ userAssigned: this.userAssigned, daysAssigned: this.daysAssigned }],
            startDate: this.startDate,
            endDate: this.endDate,
            status: this.status,
          };
          db.collection('projects')
            .add(project)
            .then(() => {
              this.alert = true;
              this.loading = false;
              this.dialog1 = false;
            });
        }
      },
      async deleteProject(item){
        const db = firebase.firestore();
        this.loading = true;
        await db.collection('projects').doc(item.id).delete()
          const index = this.projects.indexOf(item)
          confirm('Are you sure you want to delete this item?') && this.projects.splice(index, 1)
      },
      assignUsers() {
        const db = firebase.firestore();
        this.loading = true;
        db.collection('projects').doc(this.$route.params.id)
          .update({
            people: firebase.firestore.FieldValue.arrayUnion({userAssigned: this.userAssigned, daysAssigned: this.daysAssigned, displayName: this.displayName})
          })
          .then(() => {
            this.loading = false;
          });
      },
      editItem(item) {
        this.editedIndex = this.projects.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialog = true
      },
      close() {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save() {
        await db.collection('projects').doc(this.editedItem.id).set(this.editedItem);
        this.loadData();
        this.close()
      },
      loadData() {
        this.projects = [];
        db.collection('projects').onSnapshot(res => {
          res.forEach(doc => {
            this.projects.push({
              ...doc.data(),
              id: doc.id
            })
          });
        })
      },
    },
    watch: {
      isUpdating(val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      }
    },
    created() {
      this.loadData();
    }
  };
</script>

<style scoped></style>
