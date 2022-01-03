<template>
  <v-data-table
    dense
    v-if="stats"
    :headers="headers"
    :items="stats"
    :sort-by="['present']"
    :sort-desc="['present']"
    :items-per-page="12"
  >
    <template v-slot:item.image="{ item }">
      <v-img
        class="ma-1 card--image"
        width="45px"
        :src="`http://${$remote.host}:${$remote.port}/static/layers/${item.filepath}`"
      ></v-img>
    </template>
    <template v-slot:item.conflicts="{ item }">
      {{ item.conflicts.length }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      stats: null,
      headers: [
        { text: "Preview", value: "image", align: "start", width: "5%" },
        { text: "Name", value: "name", align: "start", width: 0 },
        { text: "Excludes", value: "conflicts", align: "center", width: "10%" },
        { text: "Used", value: "present", align: "center", width: "10%" },
        { text: "Rarity", value: "rarity", align: "center", width: "15%" },
      ],
    };
  },
  methods: {
    async getStats() {
      try {
        let response = await this.$axios.get("/api/minter/statistics");
        this.stats = response.data.data;
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
  async created() {
    await this.getStats();
  },
};
</script>

<style></style>
