import { db } from '@/main';
import firebase from 'firebase';
import { PROJECTUSERS_ROUTE } from '@/router';

export default {
  name: 'AdminProjects',
  data() {
    return {
      PROJECTUSERS_ROUTE,
      alert: false,
      autoUpdate: true,
      search: '',
      isUpdating: false,
      addDialogForm: {
        name: '',
        clientName: '',
        projectLead: '',
        code: '',
        info: '',
        people: [],
        startDate: null,
        endDate: null,
        status: ''
      },
      user: '',
      visible: false,
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
      editedItem: {
        name: '',
        clientName: '',
        projectLead: '',
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
  computed: {
    label() {
      return this.visible ? 'Hide' : 'Show';
    }
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
          addDialogForm: this.addDialogForm
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
    async deleteProject(item) {
      const db = firebase.firestore();
      this.loading = true;
      await db
        .collection('projects')
        .doc(item.id)
        .delete();
      const index = this.projects.indexOf(item);
      confirm('Are you sure you want to delete this item?') &&
        this.projects.splice(index, 1);
    },
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
    editItem(item) {
      this.editedIndex = this.projects.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    async save() {
      await db
        .collection('projects')
        .doc(this.editedItem.id)
        .set(this.editedItem);
      this.loadData();
      this.close();
    },
    loadData() {
      this.projects = [];
      db.collection('projects').onSnapshot(res => {
        this.projects = [];
        res.forEach(doc => {
          this.projects.push({
            ...doc.data(),
            id: doc.id
          });
        });
      });
    }
  },
  watch: {
    isUpdating(val) {
      if (val) {
        setTimeout(() => (this.isUpdating = false), 3000);
      }
    }
  },
  created() {
    this.loadData();
  }
};
