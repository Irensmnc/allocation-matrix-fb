import { PROJECTUSERS_ROUTE } from '@/router';
import { mapState } from 'vuex';

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
  computed: {
    ...mapState(['admin/projects'])
  },
  created() {
    this.registerDataObserver();
  },
  methods: {
    addProject() {
      this.$store.dispatch('admin/addProjectAsAdmin')
    },
    deleteProject() {
      this.$store.dispatch('admin/deleteProjectAsAdmin')
    },
    async assignUsers() {
      this.$store.dispatch('admin/assignProjectsAsAdmin')
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
    save() {
      this.$store.dispatch('admin/saveEditedProjects')
    },
    registerDataObserver() {
      this.$store.dispatch('fetchProjects')
    }
  }
};
