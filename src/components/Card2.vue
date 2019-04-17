<template>
  <div>
    <div>
      <v-container fluid grid-list-md>
        <h4>Active Projects this week:</h4>
        <v-layout row wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6>
            <vue-pikaday
              v-model="now"
              v-p-visible="visible"
              placeholder="Choose an appropriate week"
              prepend-icon="date_range"
              :value="now"
            />
          </v-flex>
        </v-layout>
      </v-container>
      </div>
    <div>
      <v-container fluid grid-list-md>
        <v-layout row wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6 md4 lg3>
            <h4>Total Days charged this week: {{ Cards.count }}</h4>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div>
      <v-btn fab dark small color="primary" @click="newCard" left>
        <v-icon dark>add</v-icon>
        <label>Add a new Project Card</label>
      </v-btn>
      <v-btn fab dark small color="primary" @click="removeCard" left>
        <v-icon dark>remove</v-icon>
      </v-btn>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg3 v-for="card in Cards" :key="card.id">
            <v-card flat class="text-xs-center ma-3">
              <v-card-title>Project selection</v-card-title>
              <v-autocomplete
                :value="selectedProject(card)"
                @change="updateSelectedProject(card, $event)"
                :items="projects"
                :loading="loading"
                :search-input.sync="search"
                chips
                clearable
                hide-details
                hide-selected
                item-text="name"
                item-value="id"
                label="Search for a project you would like to add..."
                solo
              >
                <template v-slot:no-data>
                  <v-list-tile>
                    <v-list-tile-title>
                      Search for your current active
                      <strong>Projects</strong>
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
              </v-autocomplete>
              <v-card-text class="justify-center" v-if="card.project">
                <div>Days charged this week: {{ card.count }}</div>
                <br/>
                <div>Total days assigned/charged: {{ findAssignedUser(card.project.assignedUsers, user.uid).days
                  }}/{{'Will be shown here'}}
                </div>
              </v-card-text>
              <v-card-actions v-model="card.count">
                <v-btn fab dark small color="primary" @click="decrement(card)">
                  <v-icon dark>remove</v-icon>
                </v-btn>
                <div>{{ card.count }}</div>
                <v-btn fab dark small color="primary" @click="increment(card)">
                  <v-icon dark>add</v-icon>
                </v-btn>
                <v-btn flat @click="editCard(card)">
                  <v-icon small right></v-icon>
                  <span>Edit</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <div class="text-xs-center">
        <v-btn round color="primary" dark @click="submit()"
        >Submit
        </v-btn
        >
        <v-btn round color="primary" dark>See other projects</v-btn>
      </div>
    </div>
  </div>
</template>

<script>

  import firebase from 'firebase';
  import { find } from 'lodash';
  import { mapGetters } from 'vuex';
  import '@enrian/vue-pikaday';

  const cardTemplate = {
    project: null,
    user: null,
    count: 0
  };

  export default {
    name: "Card2",
    data() {
      return {
        Cards: [],
        select: null,
        projects: [],
        search: null,
        loading: false,
        active: true,
        name: '',
        count: 0,
        cc: '',
        content: '',
        now: null,
        visible: false,
        pickWholeWeek: true
      };
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user']),
      label() {
        return this.visible ? 'Hide' : 'Show';
      },
    },

    methods: {
      selectedProject(card) {
        return card.project ? card.project.id : null;
      },
      updateSelectedProject(card, id) {
        card.project = find(this.projects, { id });
      },
      findAssignedUser(haystack, uid) {
        return find(haystack, (item) => uid === item.user.id && item.days > 0, {});
      },
      toggle() {
        this.visible = !this.visible;
      },
      submit() {
        this.Cards.forEach(async (card) => {
          const db = firebase.firestore();
          let countCard = card.count;

         /* const exists = !(await db.collection('users_projects').where('project.id', '==', card.project.id).where('user.uid', '==', card.user.uid).get()).empty;

          if(!exists) {
            db.collection('users_projects').add(card);
          } else {
            db.collection("users_projects").doc(card.id).set({
              count: countCard
            });
          }

          console.log(exists)*/




          db.collection("users_projects").get().then(snapshot => snapshot.forEach(doc => {
            console.log(doc.data().project.id)
            let currentProject = doc.data().project.id;
            if (currentProject) {
              let countDB = doc.data().count;
              let result = countCard += countDB;
              db.collection("users_projects").doc(doc.id).update({
                count: result
              });
            } else {
              console.log(card)
              // db.collection('users_projects').add(card)
            }
          }));
        })
      },
    increment(card) {
      if (card.count < 5) {
        card.count = card.count + 0.5
      }
    },
    decrement(card) {
      if (card.count > 0) {
        card.count = card.count - 0.5
      }
    },
    newCard() {
      this.Cards.push({ ...cardTemplate, user: this.user });
    },
    removeCard() {
      this.Cards.pop();
    },
    querySelections(search) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.projects = this.projects.filter(item => {
          return (item || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    }
  },
    created() {
      const db = firebase.firestore();
      let ref = db.collection('projects');

      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(document => {
          let project = document.doc.data();
          let userProject = this.findAssignedUser(project.assignedUsers, this.user.uid);
          if (userProject && userProject.user) {
            let existingProject = find(this.Cards, { id: document.doc.id });
            if (!existingProject || existingProject.count < userProject.days) {
              this.projects.push({
                id: document.doc.id,
                ...project
              });
            }
          }
        });
      });
    }
  }

</script>
<style>
  .topright {
    position: absolute;
    top: 8px;
    right: 16px;
  }
</style>