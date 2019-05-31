<template>
  <div>
    <div>
      {{ project.name }}
    </div>
    <v-data-table :headers="headers" :items="project.people || []">
      <template v-slot:items="props">
        <td>
          <v-edit-dialog
            :return-value.sync="props.item.userAssigned"
            lazy
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            {{ props.item.userAssigned }}
            <template v-slot:input>
              <v-text-field
                v-model="props.item.name"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
        <td class="text-xs-right">
          <v-edit-dialog
            :return-value.sync="props.item.daysAssigned"
            large
            lazy
            persistent
            @save="save"
            @cancel="cancel"
            @open="open"
            @close="close"
          >
            <div>{{ props.item.daysAssigned }}</div>
            <template v-slot:input>
              <div class="mt-3 title">Update Assigned Days</div>
            </template>
            <template v-slot:input>
              <v-text-field
                v-model="props.item.daysAssigned"
                :rules="[max25chars]"
                label="Edit"
                single-line
                counter
                autofocus
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="600px" v-model="dialog">
      <template v-slot:activator="{ on }">
        <v-btn flat color="light-green lighten-1" v-on="on"
          >Assign Users
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h4>Assign a User to this Project</h4>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field
              label="Name"
              v-model="userAssigned"
              prepend-icon="folder"
            ></v-text-field>
            <v-textarea
              label="Days Assigned"
              v-model="daysAssigned"
              prepend-icon="edit"
            ></v-textarea>
          </v-form>
          <v-btn flat color="#9CCC65" @click="assignUsers" :loading="loading"
            >Assign a user
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}
      <v-btn flat @click="snack = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script src="./ProjectUsers.js"></script>
