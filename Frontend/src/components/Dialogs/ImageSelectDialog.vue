<template>
  <v-dialog persistent v-model="open" width="600">
    <v-card>
      <v-card-title>Image Select</v-card-title>
      <v-card-text>
        <v-data-table
          :loading="loading"
          :search="search"
          v-model="selected"
          show-select
          item-key="_id"
          :headers="headers"
          :items="items"
          :items-per-page="8"
        >
          <template v-slot:top>
            <v-text-field outlined v-model="search" label="Search ..." class="pa-2"></v-text-field>
          </template>
          <template v-slot:item.image="{ item }">
            <v-img
              class="ma-1 card--image"
              width="45px"
              :src="`http://${host.host}:${host.port}/static/layers/${item.filepath}`"
            ></v-img>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" outlined color="green">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import hostsettings from "../../utils/host";
export default {
  props: {
    open: Boolean,
    value: Array,
    customURI: String,
  },
  data() {
    return {
      loading: false,
      search: "",
      headers: [
        {
          text: "Preview",
          value: "image",
          align: "start",
          filterable: false,
          sortable: false,
        },
        { text: "Layer", value: "layer.name", align: "start" },
        { text: "Name", value: "name", align: "start" },
      ],
      items: [],
    };
  },
  filters: {
    removeExtension(value) {
      return value.replace(".png", "");
    },
  },
  computed: {
    host() {
      return hostsettings;
    },
    selected: {
      get() {
        if (this.value) {
          return this.value;
        }
        return [];
      },
      set(value) {
        this.$emit("input", value);
      },
    },
    imagesURI(){
      if(this.customURI){
        return this.customURI;
      }
      return "/api/layers/images"
    }
  },
  watch: {
    async open(isOpen) {
      if (isOpen) await this.getAllImages();
    },
  },
  methods: {
    async cancel() {
      this.$emit("close");
    },
    async getAllImages() {
      try {
        this.loading = true;

        let response = await this.$axios.get(this.imagesURI);
        this.items = response.data.data;
      } catch (err) {
        this.$snackbar.error(err.toString());
      }finally{
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.preview-image {
  &:hover {
    cursor: pointer;
  }
}
</style>
