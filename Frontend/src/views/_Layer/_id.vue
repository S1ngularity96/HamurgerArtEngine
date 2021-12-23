<template>
  <v-container v-if="layer" fluid>
    <v-row>
      <v-col cols="9">
        <v-responsive content-class="imagecontainer">
          <v-row>
            <v-col cols="3" v-for="(image, index) in layer.images" :key="index">
              <v-card @click="select(image)">
                <v-card-title>{{ image.name | removeExtension }}</v-card-title>
                <v-img
                  class="card--image"
                  :src="`http://${host.host}:${host.port}/static/layers/${image.filepath}`"
                ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-responsive>
      </v-col>
      <v-col cols="3">
        <image-attributes :selected="selected" :layername="layer.name"></image-attributes>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import hostsettings from "../../utils/host";
import ImageAttributes from "../../components/Layer/ImageAttributes.vue";
export default {
  data() {
    return {
      layer: null,
      selected: null,
    };
  },
  components: {
    "image-attributes": ImageAttributes,
  },
  async mounted() {
    await this.getLayerByName(this.$route.params.id);
  },
  computed: {
    host() {
      return hostsettings;
    },
  },
  filters: {
    removeExtension(value) {
      return value.replace(".png", "");
    },
  },
  methods: {
    async getLayerByName(id) {
      try {
        let response = await this.$axios.get(`/api/layers/${id}`);
        this.layer = response.data.data;
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
    changeAttributes(image) {
      this.selected = image;
    },
    async select(image) {
      this.selected = image;
    },
  },
};
</script>

<style></style>
