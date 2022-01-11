<template>
  <v-app>
    <snack-bar></snack-bar>
    <nav-drawer></nav-drawer>
    <v-app-bar :flat="$vuetify.theme.dark" app dense >
      <v-toolbar-title>{{ $route.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch
        v-model="$vuetify.theme.dark"
        hide-details
        inset
        append-icon="mdi-theme-light-dark"
      ></v-switch>
    </v-app-bar>
    <v-main>
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
  data() {
    return {
      navitems: [
        { name: "Layer", icon: "mdi-folder-multiple-image", to: "/" },
        { name: "Minter", icon: "mdi-hammer-screwdriver", to: "/minter" },
        { name: "Statistics", icon: "mdi-chart-bar-stacked", to: "/stats" },
        { name: "Settings", icon: "mdi-cog", to: "/settings" },
      ],
    };
  },
};
</script>
