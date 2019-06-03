import moment from 'moment';
import { find, reduce } from 'lodash';
import { mapGetters, mapState } from 'vuex';
import '@enrian/vue-pikaday';

export default {
  name: 'Home',
  data() {
    return {
      date: null,
      pikadayOptions: {
        parse: () => moment(this.date),
        pickWholeWeek: true,
        toString: this.customFormat,
        disableWeekends: true
      },
      select: null,
      search: null,
      loading: false,
      active: true,
      daysCharged: 0,
      pickWholeWeek: true,
      alert: false
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
    ...mapState('user', ['matrix']),
    ...mapState('project', {
      projects: state => state.list || []
    }),
    label() {
      return this.visible ? 'Hide' : 'Show';
    },
    haveFiveMandays() {
      return reduce(this.matrix, (sum, item) => sum + item.daysCharged, 0) >= 5;
    },
    haveOneSelectedProject(search) {
      return this.matrix.filter(item => {
        return (
          (item || '').toLowerCase().indexOf((search || '').toLowerCase()) >
          -1
        );
      });
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
      this.$store.dispatch('user/saveMatrix');
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
      // call vuex easy access array splice
    },
    removeCard() {
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
      return `${ start.format(format) } - ${ end.format(format) }`;
    }
  }
};
