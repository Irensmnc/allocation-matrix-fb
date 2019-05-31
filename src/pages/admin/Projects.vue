<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
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
      <v-data-table :headers="headers" :items="projects" :search="search">
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.clientName }}</td>
          <td class="text-xs-left">{{ props.item.projectLead }}</td>
          <td class="text-xs-left">{{ props.item.code }}</td>
          <td class="text-xs-left">{{ props.item.status }}</td>
          <td class="text-xs-left">
            {{ props.item.people ? props.item.people.length : 0 }}
            <router-link
              tag="v-btn"
              color="primary"
              fab
              small
              :to="{
                name: PROJECTUSERS_ROUTE,
                params: { id: props.item.id }
              }"
            >
              <v-icon color="primary">account_circle</v-icon>
            </router-link>
          </td>
          <td class="text-xs-left">{{ props.item.info }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">
              edit
            </v-icon>
            <v-icon small @click="deleteProject(props.item)">
              delete
            </v-icon>
          </td>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog max-width="600px" v-model="displayItemDialog">
      <template v-slot:activator="{ on }">
        <v-btn flat color="light-green lighten-1" v-on="on">Add a new Project</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h4 v-if="editing">Edit project</h4>
          <h4 v-else>Add a new Project</h4>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Project Name"
              v-model="editedItem.name"
              prepend-icon="folder"
              :rules="inputRules"
            ></v-text-field>
            <v-textarea
              label="Client Name"
              v-model="editedItem.clientName"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Project Lead"
              v-model="editedItem.projectLead"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Charge Code"
              v-model="editedItem.code"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Status"
              v-model="editedItem.status"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Information"
              v-model="editedItem.info"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>

            <v-menu>
              <vue-pikaday
                v-model="editedItem.startDate"
                slot="activator"
                placeholder="Start date"
              ></vue-pikaday>
            </v-menu>
            <v-menu>
              <vue-pikaday
                v-model="editedItem.endDate"
                slot="activator"
                placeholder="End date"
              />
            </v-menu>
          </v-form>
          <v-btn v-if="editing" flat color="#9CCC65" @click="save" :loading="loading">Save</v-btn>
          <v-btn v-else flat color="#9CCC65" @click="addProject" :loading="loading">Create</v-btn>
          <v-btn flat color="#cccccc" @click="close">Close</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-alert
      v-model="alert"
      color="primary"
      dismissible
      transition="scale-transition"
    >
      Awesome! Your project has been successfully added.
    </v-alert>
  </div>
</template>

<script src="./Projects.js"></script>

<style scoped></style>
