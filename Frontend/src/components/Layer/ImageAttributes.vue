<template>
  <v-container class="ma-0 pa-0">
    <image-select-dialog
      v-if="attributes"
      v-model="attributes.conflicts"
      :open="selectDialog"
      @close="selectDialog = false"
    ></image-select-dialog>
    <v-card flat :disabled="!selected" style="background:transparent">
      <v-row>
        <v-col cols="12">
          <h3>{{ selectedName | removeExtension }}</h3>
        </v-col>
      </v-row>
      <div v-if="attributes">
        <v-row>
          <v-col cols="12">
            <h4>Avoid combinations with these Layers</h4>
          </v-col>
          <v-col class="pa-0 ma-1" cols="12">
            <v-chip
              class="ma-2"
              v-for="(layer, index) in attributes.conflicts"
              :key="layer.name"
              close
              @click:close="removeSelected(index)"
            >
              {{ layer.name | removeExtension }}
            </v-chip>
            <v-chip
              label
              :color="$vuetify.theme.dark ? 'teal' : ''"
              class="ma-2"
              @click="selectDialog = true"
            >
              Exclude Layers <v-icon class="ma-1">mdi-plus</v-icon>
            </v-chip>
          </v-col>
        </v-row>
      </div>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="postImageAttributes" block>Save</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import ImageSelectDialog from "../Dialogs/ImageSelectDialog.vue";
export default {
  props: {
    selected: Object,
    layername: String,
  },
  data() {
    return {
      selectDialog: false,
      attributes: null,
    };
  },
  components: {
    "image-select-dialog": ImageSelectDialog,
  },
  computed: {
    selectedName() {
      if (this.selected !== null) {
        return this.selected.name;
      }
      return "Select image ...";
    },
  },
  watch: {
    async selected() {
      this.getImageAttributs();
    },
  },
  methods: {
    async getImageAttributs() {
      try {
        let response = await this.$axios.get(`/api/layers/${this.layername}/${this.selected._id}`);
        this.attributes = response.data.data;
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
    removeSelected(index) {
      this.attributes.conflicts.splice(index, 1);
    },
    async postImageAttributes() {
      try {
        let response = await this.$axios.post(
          `/api/layers/${this.layername}/${this.selected._id}`,
          this.attributes
        );
        this.attributes = response.data.data;
        this.$emit("change", null);
        this.$snackbar.success("Saved successfully");
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
  },
  filters: {
    removeExtension(value) {
      return value.replace(".png", "");
    },
  },
};
</script>
