<template>
  <v-navigation-drawer app permanent  expand-on-hover width="256px">
    <v-list nav dense>
      <v-list-item v-for="(item, index) in navitems" :key="index" :to="item.to">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
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

<style></style>
