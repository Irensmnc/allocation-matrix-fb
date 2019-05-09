<template>
  <v-card>
    <v-card-title>
      Projects
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="projects"
      :search="search"
    >
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.code }}</td>
        <td class="text-xs-right">{{ props.item.status }}</td>
        <td class="text-xs-right">
          <v-autocomplete
            :disabled="isUpdating"
            :items="people"
            box
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            item-value="name"
            multiple
          >

          </v-autocomplete>
        </td>
        <td class="text-xs-right">{{ props.item.days }}</td>
        <td class="text-xs-right">{{ props.item.info }}</td>
      </template>
      <template v-slot:no-results>
        <v-alert :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  export default {
    data () {
      return {
        autoUpdate: true,
        search: '',
        isUpdating: false,
        headers: [
          {
            text: 'Project Name',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Charge Code', value: 'code' },
          { text: 'Status', value: 'status' },
          { text: 'People Assigned', value: 'people' },
          { text: 'Days Assigned', value: 'days' },
          { text: 'Additional Information', value: 'info' }
        ],
        projects: [
          {
            name: 'Wakanda',
            code: 'WAKA001',
            status: 'active',
            people: 'Irena Nemchova',
            days: 4,
            info: '..'
          },
          {
            name: 'UCB',
            code: 'UCB001',
            status: 'active',
            people: 'Irena Nemchova',
            days: 4,
            info: '..'
          },
          {
            name: 'Zurich',
            code: 'Zurich001',
            status: 'active',
            people: 'Irena Nemchova',
            days: 4,
            info: '..'
          },
        ],
        people: [
          { name: 'Irena Nemchova' },
          { name: 'Jakub Golan' },
          { name: 'Michal Szaiter' },
          { name: 'Carlos' },
          { name: 'Boudi' }
        ]
      }
    },
    watch: {
      isUpdating (val) {
        if (val) {
          setTimeout(() => (this.isUpdating = false), 3000)
        }
      }
    },

    methods: {
      remove (item) {
        const index = this.friends.indexOf(item.name)
        if (index >= 0) this.friends.splice(index, 1)
      }
    }
  }
</script>