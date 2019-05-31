import db from '@/fb';

export default {
  name: 'allprojects',
  data() {
    return {
      projects: []
    };
  },
  methods: {
    loadData() {
      this.projects = [];
      db.collection('projects').onSnapshot(res => {
        res.forEach(doc => {
          this.projects.push({
            ...doc.data(),
            id: doc.id
          });
        });
      });
    }
  },
  computed: {
    allProjects() {
      return this.projects;
    }
  },
  created() {
    this.loadData();
  }
};
