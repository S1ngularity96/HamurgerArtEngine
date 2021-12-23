<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row>
      <!--All available layers-->
      <v-col v-for="layer in layers" :key="layer.name" cols="3">
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card
              :elevation="hover ? 4 : 2"
              class="layers--color transition-swing"
              :color="cardColor"
              @click="editLayer(layer._id)"
            >
              <v-card-title>{{ layer.name }}</v-card-title>
              <v-card-subtitle>Includes {{ layer.images.length }} layers</v-card-subtitle>
            </v-card>
          </template>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    layers: Array,
  },

  computed: {
    cardColor() {
      if (this.$vuetify.theme.dark) {
        return "teal";
      } else {
        return "white";
      }
    },
  },
  methods: {
    editLayer(id) {
      this.$router.push("/layer/" + id);
    },
  },
};
</script>

<style lang="scss">
.layers {
  &--card {
    user-select: none;
    :hover {
      cursor: pointer;
    }
  }
}
</style>
