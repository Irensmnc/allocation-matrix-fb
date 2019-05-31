import { firebase, db } from '@/fb';
import { PROJECTUSERS_ROUTE } from '@/router';

const DEFAULT_ITEM = {
  name: null,
  clientName: null,
  projectLead: null,
  code: null,
  status: null,
  people: [],
  info: null,
  startDate: null,
  endDate: null
};

export default {
  name: 'AdminProjects',
  data() {
    return {
      PROJECTUSERS_ROUTE,
      alert: false,
      search: '',
      editing: false,
      displayItemDialog: false,
      loading: false,
      projects: [],
      editedItem: {
        ...DEFAULT_ITEM
      },
      inputRules: [
        v => !!v || 'This field is required',
        v => (v && v.length >= 3) || 'Minimum length is 3 characters'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => (v && /.+@.+/.test(v)) || 'E-mail must be valid'
      ],
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
      ]
    };
  },
  created() {
    this.registerDataObserver();
  },
  methods: {
    async addProject() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.loading = true;

      await db.collection('projects').add(this.editedItem);

      this.alert = true;
      this.loading = false;

      this.close();
    },
    async deleteProject(item) {
      if (!confirm('Are you sure you want to delete this item?')) {
        return;
      }

      await db
        .collection('projects')
        .doc(item.id)
        .delete();
    },
    async assignUsers() {
      this.loading = true;

      await db.collection('projects')
        .doc(this.$route.params.id)
        .update({
          people: firebase.firestore.FieldValue.arrayUnion({
            userAssigned: this.userAssigned,
            daysAssigned: this.daysAssigned,
            displayName: this.displayName
          })
        });

      this.loading = false;
    },
    editItem(item) {
      this.$refs.form.reset();
      this.editing = true;
      this.displayItemDialog = true;
      this.editedItem = { ...item };
    },
    close() {
      this.editing = false;
      this.displayItemDialog = false;
      this.editedItem = { ...DEFAULT_ITEM };
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      await db
        .collection('projects')
        .doc(this.editedItem.id)
        .set(this.editedItem);

      this.close();
    },
    registerDataObserver() {
      db.collection('projects').onSnapshot(res => {
        this.projects = [];

        res.forEach(doc => {
          this.projects.push({
            ...doc.data(),
            id: doc.id
          });
        });

        this.loading = false;
      });
    }
  }
};
