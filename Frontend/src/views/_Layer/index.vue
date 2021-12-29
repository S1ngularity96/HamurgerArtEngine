<template>
  <v-container fluid>
    <index-reload-dialog @yes="reIndex" v-model="reloadDialog"></index-reload-dialog>
    <v-tabs v-model="tab" background-color="transparent" show-arrows>
      <v-tab>Overview</v-tab>
      <v-tab>Groups</v-tab>
      <v-tab-item>
        <v-container class="pa-2" fluid>
          <v-row>
            <v-col cols="12">
              <v-toolbar flat dense>
                <v-spacer></v-spacer>
                <v-tooltip top v-for="action in actions" :key="action.text">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn large @click="action.click" icon v-bind="attrs" v-on="on">
                      <v-icon>{{ action.icon }}</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ action.text }}</span>
                </v-tooltip>
              </v-toolbar>
            </v-col>
          </v-row>
          <div v-if="hasLayers">
            <v-row>
              <v-col cols="6">
                <card-view :layers="layers"></card-view>
              </v-col>
              <v-col cols="6">
                <table-view :layers="layers"></table-view>
              </v-col>
            </v-row>
            <v-row>
              <v-col offset="11" cols="1">
                <v-btn @click="patchLayers" color="primary" block>Save</v-btn>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-tab-item>

      <v-tab-item>
        <v-container>
          <v-row>
            <v-col cols="12">
              <group-view></group-view>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import CardView from "../../components/Layer/CardView.vue";
import TableView from "../../components/Layer/TableView.vue";
import GroupView from "../../components/Layer/GroupView.vue";
import IndexReloadDialog from "../../components/Dialogs/IndexReloadDialog.vue";
export default {
  data() {
    return {
      tab: 0,
      reloadDialog: false,
      layers: [],
      actions: [
        {
          text: "Search files",
          click: () => {
            this.reloadDialog = true;
          },
          icon: "mdi-database-search",
        },
        /*{
          text: "Import & Export",
          click: () => {},
          icon: "mdi-download-circle",
        }*/
      ],
    };
  },
  components: {
    "card-view": CardView,
    "table-view": TableView,
    "group-view": GroupView,
    "index-reload-dialog": IndexReloadDialog,
  },
  computed: {
    hasLayers() {
      if (this.layers && this.layers.length > 0) {
        return true;
      }
      return false;
    },
  },
  methods: {
    async getLayers() {
      try {
        let response = await this.$axios.get("/api/layers");
        this.layers = response.data.data;
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async reIndex(fileBlob) {
      try {
        if (fileBlob !== null) {
          let formdata = new FormData();
          formdata.append("layers", fileBlob, "upload.zip");
          await this.$axios.post("/api/layers/upload", formdata, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await this.$axios.get("/api/layers/reload");
          this.$snackbar.success("Reload successfull");
        }
      } catch (err) {
        this.$snackbar.errorhandle(err);
      } finally {
        await this.getLayers();
      }
    },
    async patchLayers() {
      try {
        let response = await this.$axios.patch("/api/layers", { layers: this.layers });
        this.layers = response.data.data;
        this.$snackbar.success("Layers updated");
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
  async mounted() {
    await this.getLayers();
  },
};
</script>

<style lang="scss">
.theme--dark.v-tabs-items {
  background-color: transparent !important;
}
</style>
