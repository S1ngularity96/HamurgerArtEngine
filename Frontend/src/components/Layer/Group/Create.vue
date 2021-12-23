<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card
        :ripple="false"
        :elevation="hover ? 6 : 3"
        class="transition-swing"
        @click="onCardClick"
        height="200"
        width="300"
      >
        <v-toolbar dense flat>
          <v-toolbar-title>Group</v-toolbar-title>
        </v-toolbar>
        <v-card-text class="d-flex justify-center align-content-center">
          <v-icon x-large>mdi-plus</v-icon>
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
export default {
  methods: {
    onCardClick() {
      this.$emit("create", null);
    },
  },
};
</script>

<style></style>
