<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <h1>Active Projects this week:</h1>

    <v-btn fab dark small color="primary" v-on:click="newCard" left>
      <v-icon dark>add</v-icon>
      <label>Add a new Project Card</label>
    </v-btn>
    <v-btn fab dark small color="primary" v-on:click="removeCard" left>
      <v-icon dark>remove</v-icon>
      <label>Add a new Project Card</label>
    </v-btn>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="card in Cards" :key="card.title">
          <v-card flat class="text-xs-center ma-3">
            <v-card-title>Project selection</v-card-title>
            <v-autocomplete
              v-model="card.ProjectId"
              :items="items"
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
              <template v-slot:selection="{ item, selected }">
                <v-chip
                  :selected="selected"
                  color="blue-grey"
                  class="white--text"
                >
                  <v-icon left>mdi-coin</v-icon>
                  <span v-text="item.name"></span>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <v-list-tile-avatar
                  color="primary"
                  class="headline font-weight-light white--text"
                >
                  {{ item.name.charAt(0) }}
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-text="item.id">
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon>mdi-coin</v-icon>
                </v-list-tile-action>
              </template>
            </v-autocomplete>
            <v-card-text class="justify-center">
              <div>Total days charged: {{ card.count }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn fab dark small color="primary" v-on:click="projectCount(card)">
                <v-icon dark>remove</v-icon>
              </v-btn>
              <div>{{ card.count }}</div>
              <v-btn
                fab
                dark
                small
                color="primary"
                v-on:click="projectCount(card)"
              >
                <v-icon dark>add</v-icon>
              </v-btn>
              <v-btn flat>
                <v-icon small right></v-icon>
                <span>Save</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="text-xs-center">
      <v-btn round color="primary" dark v-on:click="userProjectSubmit()"
        >Submit</v-btn
      >
      <v-btn round color="primary" dark>Go to Dashboard</v-btn>
    </div>
  </div>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

const cardTemplate = {
  ProjectId: firebase.uid,
  count: null,
  name: ''
};

export default {
  data() {
    return {
      Cards: [],
      select: null,
      items: [],
      search: null,
      loading: false,
      userProjectDetails: { ...cardTemplate },
      active: true,
      count: null
      //ref: firebase.firestore().collection('users_projects'),
      // users__project: {}
    };
  },
  firestore() {
    return {
      locations: db.collection('projects').orderBy('createdAt')
    };
  },
  methods: {
    projectCount(card) {
      card.count >= 5 ? card.count-- : card.count++;
      //card.count.stepUp(5) ? card.count++ : card.count--;
    },
    /* increment(card) {
      if (card.count < 5) {
        card.count++;
      }
    },
    remove(card) {
      if (card.count > 0) {
        card.count--;
      }
    },
    onclick(){
      this.projectCount.apply()
    },*/
    newCard() {
      this.Cards.push({ ...cardTemplate });
    },
    removeCard() {
      this.Cards.pop();
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.items.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
        });
        this.loading = false;
      }, 500);
    },
    /* userProjectSubmit() {
      this.loading = true;
      const projectData = db.collection('users_projects').doc();
      projectData
        .set({
          userProjectDetails: '',
          active: this.active
        })
        .then(function() {

        });
      this.loading = false;

      // this.projectName = '';
      // this.userProjectCount = 0;
    }
  }, */

    watch: {
      search(val) {
        val && val !== this.select && this.querySelections(val);
      }
    },
    /*
  .onSnapshot(res => {
        const changes = res.docChanges();

        changes.forEach(change => {
          if(change.type === 'added') {
            this.userProject.push ({
              ...change.doc.data(),
            })
            //this.projectName = doc.data();
            //this.userProjectCount = doc.data()
          }
        })*/

    //  }).add(userProject).then(() => {
    //     this.loading = false
    /* projectSubmit(){
      this.$store.dispatch ('projectSubmit', {
          userProjectCount: this.userProjectCount,
          projectName: this.projectName

      })
    },*/
    /*created() {
      db.collection('projects').get().then(snapshot => {
        snapshot.forEach(doc => {
          let project = doc.data()
          project.id = doc.id
          this.projects.push(project)
          console.log(this.projects.push(project))
        })
      })
    }*/
    getMyProject() {
      const db = firebase.firestore();
      db.collection('projects').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
          let projects = doc.data();

          projects = JSON.stringify(projects)

          this.setState({ projects: projects })
        })
      })
    }
  },
    created() {
      const db = firebase.firestore();
      let ref = db.collection('projects');

      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            let doc = change.doc;
            //console.log(doc.data().name);
            this.items.push({
              id: doc.id,
              name: doc.data().name,
              count: doc.data().count
            });
          }
        });
      });
    }
};

/* componentDidMount() {
     this.getMyProject()
   }*/
//const projectList = document.querySelector('#project-list')
//this.ref.add(this.users_project).then(docRef) => {
//  this.users_project.projectId = ''
//this.users__project.userId =''
//this.users_project.count = 0
//}
</script>
