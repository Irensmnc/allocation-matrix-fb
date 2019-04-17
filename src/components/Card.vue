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
              v-model="card.id"
              :items="projects"
              :loading="loading"
              :search-input.sync="search"
              :value="count"
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
            <v-card-text class="justify-center">
              <div>Total days charged: {{ count }}</div>
            </v-card-text>
            <v-card-actions v-model="count">
              <v-btn fab dark small color="primary" @click="decrement()">
                <v-icon dark>remove</v-icon>
              </v-btn>
              <div>{{ count }}</div>
              <v-btn fab dark small color="primary" @click="increment()">
                <v-icon dark>add</v-icon>
              </v-btn>
              <v-btn flat @click="deleteCard(card)">
                <v-icon small right></v-icon>
                <span>Delete</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="text-xs-center">
      <v-btn round color="primary" dark @click="saveProject()"
      >Submit
      </v-btn
      >
      <v-btn round color="primary" dark>Go to Dashboard</v-btn>
    </div>
    </div>
  </div>
</template>

<script>
  const cardTemplate = {
    ProjectId: null,
    userId: firebase.auth().currentUser.uid,
    count: this.count
  };
  import { db } from '../main';
  import firebase from 'firebase';

  export default {
    name: "Card",
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
        ProjectId: firebase.uid,
        now: null,
        visible: false,
        pickWholeWeek: true,
        userId: null,
      };
    },
    firestore() {
      return {
        locations: db.collection('user_projects').orderBy('createdAt')
      };
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      label() {
        return this.visible ? 'Hide' : 'Show';
      }
    },

    methods: {
      toggle() {
        this.visible = !this.visible;
      },
      deleteCard() {
        if (confirm('Are you sure?')) {
          db.collection('users_projects').where('userId', '==', firebase.auth().currentUser.uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.delete();
              alert('Congratulations, your card was successfully deleted')
            })
          })
        }
      },
      changes(){
        db.collection('users_projects').onSnapshot(res => {
          const changes = res.docChanges();
          console.log(res.docChanges())
          changes.forEach(change => {
            if (change.type === 'modified') {
              this.projects.push({
                ...change.doc.data(),
                count: this.card.count,
                id: change.doc.id,
                now: this.now,
                projects: this.projects.id,
                cardTemplate:{...cardTemplate},
                userId: firebase.auth().currentUser.uid,
                name: change.doc.data().name
              })
            } console.log('it worked')
            console.log(change.doc.count)
          })
        })
      },
      submit() {
        const ref = db.collection('users_projects')
          const query = ref.where('userId', '==', firebase.auth().currentUser.uid);
          query.get().then(
          (querySnapshot) => {
            console.log('qs', querySnapshot)
          const changes = querySnapshot.docChanges()
            changes.forEach((doc) => {
            console.log('doc', doc)
            data().update({
              now: this.now,
              count: this.count,
              projects: this.projects.id,
              cardTemplate: { ...cardTemplate }
            });
              console.log('it worked')
          })
        })
      },
      tryAgainAnditWillWorkEventually(){
        console.log(firebase.auth().currentUser.uid)
        db.collection('users_projects').where('userId', '==', firebase.auth().currentUser.uid).get().then(users_projects => {
          users_projects.docs.forEach(doc => {
            let data = doc.data();
            console.log(doc.data());
            if (data.uid === firebase.auth().currentUser){
              console.log(doc.data())
              doc.data().update({
                now: this.now,
                count: this.card.count,
                projects: this.projects.id,
                cardTemplate: { ...cardTemplate }
              });
              console.log('it worked')
              console.log(this.card.count)
            }
          })
        })

      },
      update(){
        db.collection('users_projects').where('userId', '==', firebase.auth().currentUser.uid).onSnapshot(res => {
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
      },
      saveProject() {
        db.collection('users_projects').add({
          count: this.count,
          userId: firebase.auth().currentUser.uid,



        })
      },
      increment() {
        if (this.count < 5) {
          this.count = this.count + 0.5
        }

      },
      decrement() {
        if (this.count > 0) {
          this.count = this.count - 0.5
        }
      },

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
          this.projects = this.projects.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
          });
          this.loading = false;
        }, 500);
      }
    },
    /* weekday(){
     const startOfWeek = moment().startOf('isoWeek');
     const endOfWeek = moment().endOf('isoWeek');

     const days = [];
     const day = startOfWeek;

     while (day <= endOfWeek) {
       days.push(day.toDate());
       day = day.clone().add(1, 'd');
     }
   }*/
    created() {
      const db = firebase.firestore();
      let ref = db.collection('projects');

      ref.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            let doc = change.doc;
            this.projects.push({
              id: doc.id,
              name: doc.data().name
            });
          }
        });
      });
    }
    }

</script>
