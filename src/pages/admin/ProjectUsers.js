import { db } from '@/main';
import firebase from 'firebase';

export default {
  name: 'ProjectUsers',
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
