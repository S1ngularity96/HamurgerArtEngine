<template>
  <v-app>
    <nav-drawer></nav-drawer>
    <v-app-bar app dense>
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="$vuetify.theme.dark" hide-details inset label="Darkmode"></v-switch>
    </v-app-bar>
    <v-main>
      <snack-bar></snack-bar>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Nav from "./components/Nav.vue";
import Snackbar from "./components/snackbar.vue";
export default {
  name: "App",
  components: {
    "nav-drawer": Nav,
    "snack-bar": Snackbar,
  },
  data: () => ({}),
};
</script>
