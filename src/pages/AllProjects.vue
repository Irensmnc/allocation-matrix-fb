<template>
  <div class="projects">
    <h1 class="subheading grey--text">All Other Projects</h1>

    <v-container class="my-5">
      <v-expansion-panel>
        <v-expansion-panel-content
          v-for="project in allProjects"
          :key="project.title"
        >
          <div slot="header" class="py-1">{{ project.title }}</div>
          <v-card>
            <v-card-text class="px-4 grey--text">
              <div class="font-weight-bold">Due by {{ project.due }}</div>
              <div>{{ project.content }}</div>
            </v-card-text>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-container>
  </div>
</template>

<script src="./AllProjects.js"></script>
