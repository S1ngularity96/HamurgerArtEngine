<template>
  <v-menu v-model="menu" open-on-hover open-delay="1000" :nudge-width="200" offset-x>
    <template v-slot:activator="{ on, attrs }">
      <v-card @click="$emit('click')">
        <v-card-text>
          <v-img v-bind="attrs" v-on="on" :src="src.src"></v-img>
        </v-card-text>
      </v-card>
    </template>

    <v-card v-if="metadata">
      <v-card-title>{{ metadata.name }}</v-card-title>
      <v-card-subtitle>{{ metadata.image }}</v-card-subtitle>
      <v-divider></v-divider>
      <v-simple-table dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Layer
              </th>
              <th class="text-left">
                Asset
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(attr, index) in metadata.attributes" :key="index">
              <td>{{ attr.trait_type }}</td>
              <td>{{ attr.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    src: Object,
  },

  data() {
    return {
      menu: false,
      metadata: null,
    };
  },
  watch: {
    menu(value) {
      if (value === true && this.metadata === null) {
        this.getMetadataById(this.src.id);
      }
    },
  },
  methods: {
    async getMetadataById(id) {
      try {
        let res = await this.$axios.get("/api/minter/metadata/" + id);
        this.metadata = res.data.data;
        console.log(this.metadata);
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
};
</script>

<style></style>
