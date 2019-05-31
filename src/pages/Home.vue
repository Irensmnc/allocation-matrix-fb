<template>
  <div>
    <div>
      <v-container fluid grid-list-md>
        <h4>Active Projects this week:</h4>
        <v-layout row wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6>
            <vue-pikaday
              v-model="date"
              :options="options"
              data-vue-pikaday
            ></vue-pikaday>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <div>
      <v-container fluid grid-list-md>
        <v-layout column wrap class="text-xs-center ma-3">
          <v-flex xs12 sm6 md4 lg3></v-flex>
        </v-layout>
      </v-container>
    </div>
    <div>
      <v-btn fab dark small color="primary" @click="newCard" left>
        <v-icon dark>add</v-icon>
        <label>Add a new Project Card</label>
      </v-btn>
      <v-btn fab dark small color="primary" @click="removeCard" left>
        <v-icon dark>remove</v-icon>
      </v-btn>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg3 v-for="card in Cards" :key="card.id">
            <v-card flat class="text-xs-center ma-3">
              <v-card-title>Project selection</v-card-title>
              <v-autocomplete
                :value="selectedProject(card)"
                @change="updateSelectedProject(card, $event)"
                :items="projects"
                :loading="loading"
                :search-input.sync="search"
                chips
                clearable
                hide-details
                hide-selected
                item-text="name"
                item-value="id"
                label="Search for a project you would like to add..."
                solo
              >
                <template v-slot:no-data>
                  <v-list-tile>
                    <v-list-tile-title>
                      Search for your current active
                      <strong>Projects</strong>
                    </v-list-tile-title>
                  </v-list-tile>
                </template>
              </v-autocomplete>
              <v-card-text class="justify-center" v-if="card.project">
                <div>Days charged this week: {{ card.daysCharged }}</div>
                <br />
                <div>
                  Total days assigned/charged:
                  {{
                    findAssignedUser(card.project.assignedUsers, user.uid).days
                  }}/{{ 'Will be shown here' }}
                </div>
              </v-card-text>
              <v-card-actions v-model="card.daysCharged">
                <v-btn fab dark small color="primary" @click="decrement(card)">
                  <v-icon dark>remove</v-icon>
                </v-btn>
                <div>{{ card.daysCharged }}</div>
                <v-btn
                  fab
                  dark
                  small
                  color="primary"
                  :disabled="haveFiveMandays"
                  @click="increment(card)"
                >
                  <v-icon dark>add</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <div class="text-xs-center">
        <v-btn round color="primary" dark @click="submit()">Submit</v-btn>
        <v-alert
          v-model="alert"
          color="primary"
          dismissible
          transition="scale-transition"
        >
          Your projects have been successfully submitted.
        </v-alert>
      </div>
      <!--   <v-btn round color="primary" dark @click="$router.push('allprojects')">See other projects</v-btn> -->
    </div>
  </div>
</template>

<script src="./Home.js"></script>
<style>
.topright {
  position: absolute;
  top: 8px;
  right: 16px;
}
</style>
