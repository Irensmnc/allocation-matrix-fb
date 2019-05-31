import firebase from 'firebase';
import { find, reduce } from 'lodash';
import { mapGetters } from 'vuex';
import '@enrian/vue-pikaday';
import moment from 'moment';

const cardTemplate = {
  project: null,
  user: null,
  daysCharged: 0,
  cardId: ''
};

export default {
  name: 'Home',
  data() {
    return {
      date: null,
      options: {
        parse: () => moment(this.date),
        pickWholeWeek: true,
        toString: this.customFormat,
        disableWeekends: true
      },
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
      alert: false
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
          console.log(this.Cards);
          return (
            (item || '').toLowerCase().indexOf((search || '').toLowerCase()) >
            -1
          );
        });
      }, 500);
    }
  },

  methods: {
    hasItem(item) {
      return this.selectedValues.indexOf(this.getValue(item)) > -1;
    },
    selectedProject(card) {
      return card.project ? card.project.id : null;
    },
    updateSelectedProject(card, id) {
      card.project = find(this.projects, { id });
    },
    findAssignedUser(haystack, uid) {
      return find(haystack, item => uid === item.user.id && item.days > 0, {});
    },
    submit() {
      this.Cards.forEach(card => {
        const db = firebase.firestore();
        let ref = db.collection('users_projects');
        let countCard = card.daysCharged;
        ref.get().then(snapshot =>
          snapshot.docChanges().forEach(document => {
            let project = document.doc.data();
            let userProject = this.findAssignedUser(
              project.assignedUsers,
              this.user.uid
            );
            if (userProject) {
              let countDB = project.assignedUsers.daysCharged;
              let result = (countCard += countDB);
              db.collection('users_projects')
                .doc(doc.id)
                .update({
                  projectsCharged: [
                    {
                      daysCharged: card.daysCharged,
                      projectId: document.doc.id
                    }
                  ],
                  userId: this.user.uid,
                  weekOf: this.weekOf
                });
            } else {
              db.collection('users_projects')
                .doc(this.user.uid)
                .update({
                  projectsCharged: firebase.firestore.FieldValue.arrayUnion({
                    daysCharged: card.daysCharged,
                    projectId: card.project.id,
                    projectName: card.project.name,
                    weekOf: this.weekOf
                  })
                })
                .then(() => {
                  this.alert = true;
                });
            }
          })
        );
      });
    },
    increment(card) {
      if (card.daysCharged < 5) {
        card.daysCharged = card.daysCharged + 0.5;
      }
    },
    decrement(card) {
      if (card.daysCharged > 0) {
        card.daysCharged = card.daysCharged - 0.5;
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
          return (
            (item || '').toLowerCase().indexOf((search || '').toLowerCase()) >
            -1
          );
        });
        this.loading = false;
      }, 500);
    },
    customFormat(date, format) {
      const start = moment(date, format).day(1);
      const end = moment(date, format).day(5);
      return `${start.format(format)} - ${end.format(format)}`;
    }
  },
  created() {
    const db = firebase.firestore();
    let ref = db.collection('projects');

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(document => {
        let project = document.doc.data();
        let userProject = this.findAssignedUser(
          project.assignedUsers,
          this.user.uid
        );
        if (userProject && userProject.user) {
          let existingProject = find(this.Cards, { id: document.doc.id });
          if (
            !existingProject ||
            existingProject.daysCharged < userProject.days
          ) {
            this.projects.push({
              id: document.doc.id,
              ...project
            });
          }
        }
      });
    });
  }
};
