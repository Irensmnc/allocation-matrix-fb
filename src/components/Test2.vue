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
    <v-card color="blue-green darken-1">
      <v-card-title>Project selection</v-card-title>
      <v-autocomplete
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        cache-items
        class="mx-3"
        flat
        hide-no-data
        hide-details
        label="What project would you like to add?"
        solo-inverted
      >
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <template v-slot:no-data>
          <v-list-tile>
            <v-list-tile-title>
              Search for your active
              <strong>Projects</strong>
            </v-list-tile-title>
          </v-list-tile>
        </template>
        <template v-slot:selection="{ item, selected }">
          <v-chip :selected="selected" color="blue-grey" class="white--text">
            <v-icon left>mdi-coin</v-icon>
            <span v-text="item.name"></span>
          </v-chip>
        </template>
        <template v-slot:project="{ item }">
          <v-list-tile-avatar
            color="indigo"
            class="headline font-weight-light white--text"
          >
            {{ item.name.charAt(0) }}
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.name"></v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-icon>mdi-coin</v-icon>
          </v-list-tile-action>
        </template>
      </v-autocomplete>
      <template v-slot:extension>
        <v-tabs
          :hide-slider="!model"
          color="transparent"
          slider-color="blue-grey"
        >
        </v-tabs>
      </template>
    </v-card>

    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm6 md4 lg3 v-for="card in Cards" :key="card.name">
          <v-card flat class="text-xs-center ma-3">
            <v-card-text class="justify-center">
              <div>Total days charged: {{ count }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn fab dark small color="primary" v-on:click="remove">
                <v-icon dark>remove</v-icon>
              </v-btn>
              <div>{{ count }}</div>
              <v-btn fab dark small color="primary" v-on:click="increment">
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

    <v-container class="my-5"> </v-container>
    <div class="text-xs-center">
      <v-btn round color="primary" dark v-on:click="projectSubmit()"
        >Submit</v-btn
      >
      <v-btn round color="primary" dark>Go to Dashboard</v-btn>
    </div>
  </div>
</template>

<script>
import { db } from '../main';
import firebase from 'firebase';

export default {
  data() {
    return {
      Cards: [{ name: 'Zurich', avatar: '/assets/Zurich.png' }],
      select: null,
      items: [],
      search: null,
      userProject: null,
      userProjectCount: 0,
      count: 0,
      loading: false
      //ref: firebase.firestore().collection('users_projects'),
      // users__project: {}
    };
  },
  methods: {
    increment() {
      if (this.count < 5) {
        this.count++;
      }
    },
    remove() {
      if (this.count > 0) {
        this.count--;
      }
    },
    newCard() {
      this.Cards.push('Card');
    },
    removeCard() {
      this.Cards.pop();
    },
    /* projectsSubmit() {
          this.loading = true;
          let ref = db.collection('users_projects').where('userId', '==', firebase.auth().currentUser.uid );
          ref.get().then(snapshot => {
            snapshot.forEach(doc => {
              this.userProject = doc.data();
              this.count = doc.data()
            })
          })
        },*/
    projectSubmit() {
      this.loading = true;
      let ref = db
        .collection('users_projects')
        .doc()
        .where('userId', '==', firebase.auth().currentUser.uid);
      const userProject = {
        projectName: this.projectName,
        userProjectCount: this.userProjectCount
      };
      ref.add(userProject).then(() => {
        this.loading = false;
      });
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
    }
  },
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
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    }
  },
  /* getMyProject () {
         const db = firebase.firestore();
         db.collection('projects').get().then((snapshot)=> {
           snapshot.docs.forEach(doc => {
             let projects = doc.data();

             projects = JSON.stringify(projects)

             this.setState({ projects: projects})
           })
         })*/
  created() {
    const db = firebase.firestore();
    let ref = db.collection('projects');

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          let doc = change.doc;
          console.log(doc.data().title);
          this.items.push({
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content
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
