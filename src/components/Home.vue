<template>
  <div>
    <div>
      <v-container fluid grid-list-md>
        <h4>Active Projects this week:</h4>
        <v-layout row wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6>
         <!--   <vue-pikaday
              v-show="false"
              placeholder="Choose an appropriate week"
              :customFormatter="formatWeek"
              :options="{pickWholeWeek:true, disableWeekends:true, firstDay: 1, showWeekNumber: true }"
            />-->
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div>
      <v-container fluid grid-list-md>
        <v-layout column wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6 md4 lg3>
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
                <div>Days charged this week: {{ card.daysCharged }}</div>
                <br/>
                <div>Total days assigned/charged: {{ findAssignedUser(card.project.assignedUsers, user.uid).days
                  }}/{{'Will be shown here'}}
                </div>
              </v-card-text>
              <v-card-actions v-model="card.daysCharged">
                <v-btn fab dark small color="primary" @click="decrement(card)">
                  <v-icon dark>remove</v-icon>
                </v-btn>
                <div>{{ card.daysCharged }}</div>
                <v-btn fab dark small color="primary" :disabled="haveFiveMandays" @click="increment(card)">
                  <v-icon dark>add</v-icon>
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
        <v-alert
          v-model="alert"
          color="primary"
          dismissible
          transition="scale-transition"

        >
          Your projects have been successfully submitted.
        </v-alert>
      </div>
     <!--   <v-btn round color="primary" dark @click="$router.push('allprojects')">See other projects</v-btn> -->
    </div>
  </div>
</template>

<script>

  import firebase from 'firebase';
  import { find, reduce } from 'lodash';
  import { mapGetters } from 'vuex';
  import '@enrian/vue-pikaday';

  const cardTemplate = {
    project: null,
    user: null,
    daysCharged: 0,
    cardId: '',
  };

  export default {
    name: "Home",
    data() {
      return {
        Cards: [],
        select: null,
        projects: [],
        search: null,
        loading: false,
        active: true,
        name: '',
        daysCharged: 0,
        cc: '',
        content: '',
        weekOf: null,
        endDate: null,
        pickWholeWeek: true,
        alert: false,
      };
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user']),
      label() {
        return this.visible ? 'Hide' : 'Show';
      },
      haveFiveMandays() {
        return reduce(this.Cards, (sum, item) => sum + item.daysCharged, 0) >= 5;
      },
      haveOneSelectedProject(search) {
        setTimeout(() => {
          this.Cards = this.Cards.filter(item => {
            console.log(this.Cards)
            return (item || '').toLowerCase().indexOf((search || '').toLowerCase()) > -1;
          });
        }, 500)
      }
    },

    methods: {
      hasItem (item) {
        return this.selectedValues.indexOf(this.getValue(item)) > -1
      },
      selectedProject(card) {
        return card.project ? card.project.id : null;
      },
      updateSelectedProject(card, id) {
        card.project = find(this.projects, { id });
      },
      findAssignedUser(haystack, uid) {
        return find(haystack, (item) => uid === item.user.id && item.days > 0, {});
      },
      submit() {
        this.Cards.forEach((card) => {
          const db = firebase.firestore();
          let ref = db.collection('users_projects');
          let countCard = card.daysCharged;
          ref.get().then(snapshot => snapshot.docChanges().forEach(document => {
            let project = document.doc.data();
            let userProject = this.findAssignedUser(project.assignedUsers, this.user.uid);
            if (userProject) {
              let countDB = project.assignedUsers.daysCharged
              let result = countCard += countDB;
              db.collection("users_projects").doc(doc.id).update({
                projectsCharged: [{
                  daysCharged: card.daysCharged,
                  projectId: document.doc.id,

                }],
                userId: this.user.uid,
                weekOf: this.weekOf
              });
            } else {
              db.collection('users_projects')
                .doc(this.user.uid).update({
                projectsCharged: firebase.firestore.FieldValue.arrayUnion({
                  daysCharged: card.daysCharged,
                  projectId: card.project.id,
                  projectName: card.project.name,
                  weekOf: this.weekOf
                })
              })
                .then(() => {
                  this.alert = true
                });
            }
          }));
        })
      },
      increment(card) {
        if (card.daysCharged < 5) {
          card.daysCharged = card.daysCharged + 0.5
        }
      },
      decrement(card) {
        if (card.daysCharged > 0) {
          card.daysCharged = card.daysCharged - 0.5
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
      },
      /*formatWeek(date) {
        return "";
      }*/
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
            if (!existingProject || existingProject.daysCharged < userProject.days) {
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
