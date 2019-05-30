<template>
  <v-card>
    <v-card-title>
      Users {{ usersInfo }}
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
      :items="users"
      :search="search"
    >
        <td> {{ usersInfo }}
          <v-flex >
            <v-text-field
              v-model="displayName"
              label="Regular"
            ></v-text-field>
          </v-flex>
        </td>
        <td> do you see me ?
          <v-flex >
            <v-text-field
              v-model="displayName"
              label="Regular"
            ></v-text-field>
          </v-flex>
        </td>
        <td class="text-xs-right">
          {{ usersInfo }}
          <v-autocomplete
            :disabled="isUpdating"
            :items="projects"
            box
            chips
            color="blue-grey lighten-2"
            label="Select"
            item-text="name"
            item-value="name"
            multiple
          >
          </v-autocomplete>
          <v-flex xs12 sm6 md3>
            <v-text-field
              v-model="daysAssigned"
              label="Days"
            ></v-text-field>
          </v-flex>

            <v-btn round color="primary" dark @click="submit()"
            >Submit
            </v-btn>
        </td>
        <td class="text-xs-right">
          <v-textarea
            v-model="info"
            name="input-7-1"
            box
            label="Label"
            auto-grow
            value="Lorem ipsum"
          ></v-textarea></td>
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
  name: 'userCard',
  props: ['usersInfo'],
  data() {
    return {
      autoUpdate: true,
      search: '',
      isUpdating: false,
      projects: [],
      users: [],
      people: '',
      daysAssigned: 0,
      displayName: '',
      fields: [],
      info:'',
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'displayName'
        },
        { text: 'Projects Assigned', value: 'projects' },
        { text: 'Additional Information', value: 'info' }
      ],
    }
  },
}
</script>