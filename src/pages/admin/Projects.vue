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
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }"> </template>
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.name"
                    label="Project Name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.clientName"
                    label="Client Name"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.projectLead"
                    label="Project Lead"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.code"
                    label="Code"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.status"
                    label="Status"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="editedItem.info"
                    label="Additional Information"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="close">Cancel</v-btn>
            <v-btn color="primary" flat @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

    <v-dialog max-width="600px" v-model="dialog1">
      <template v-slot:activator="{ on }">
        <v-btn flat color="light-green lighten-1" v-on="on"
          >Add a new Project
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h4>Add a new Project</h4>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Project Name"
              v-model="addDialogForm.name"
              prepend-icon="folder"
              :rules="inputRules"
            ></v-text-field>
            <v-textarea
              label="Client Name"
              v-model="addDialogForm.clientName"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Project Lead"
              v-model="addDialogForm.projectLead"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Charge Code"
              v-model="addDialogForm.code"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Status"
              v-model="addDialogForm.status"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>
            <v-textarea
              label="Information"
              v-model="addDialogForm.info"
              prepend-icon="edit"
              :rules="inputRules"
            ></v-textarea>

            <v-menu>
              <vue-pikaday
                v-model="addDialogForm.startDate"
                slot="activator"
                placeholder="Start date"
              ></vue-pikaday>
            </v-menu>
            <v-menu>
              <vue-pikaday
                v-model="addDialogForm.endDate"
                slot="activator"
                placeholder="End date"
              />
            </v-menu>
          </v-form>
          <v-btn flat color="#9CCC65" @click="addProject" :loading="loading"
            >Add Project
          </v-btn>
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
