<template>
  <v-container fluid>
    <slider-dialog
      v-model="slider.opened"
      :current="slider.current"
      :slides="slides"
    ></slider-dialog>
    <mint-dialog
      :opened="mintdialog.opened"
      :created="mintdialog.created"
      :limit="mintdialog.limit"
      @abort="stopMinting"
    ></mint-dialog>
    <download-dialog :opened="downloadDialog" @close="downloadDialog = false"></download-dialog>
    <continue-dialog
      :opened="continueDialog"
      @yes="continueMinting"
      @no="startMinting"
      @close="continueDialog = false"
    ></continue-dialog>
    <v-row>
      <v-col cols="12">
        <v-toolbar flat dense>
          <v-spacer></v-spacer>
          <v-btn @click="downloadDialog = true" color="orange">
            Download
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-card-title>Filters - {{ selectedFilter.length }}</v-card-title>
          <v-expansion-panels flat accordion>
            <v-expansion-panel v-for="(filter, index) in filters" :key="index">
              <v-expansion-panel-header>{{ filter.name }}</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-checkbox
                  dense
                  multiple
                  v-model="selectedFilter"
                  hide-details
                  v-for="(image, index) in filter.images"
                  :key="index"
                  :value="image._id"
                  :label="image.name"
                ></v-checkbox>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card-actions>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-btn block  color="red" @click="resetFilters">Reset</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn block  color="green" @click="applyFilters">Search</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-responsive height="75vh" class="panel-responsive">
          <v-row>
            <v-col v-for="(src, index) in slides" :key="index" cols="3">
              <mint-card :src="src" @click="onCardImageClick(index)"></mint-card>
            </v-col>
          </v-row>
        </v-responsive>
        <v-row>
          <v-col offset="5" cols="1">
            <v-pagination
              v-if="slides.length > 0"
              @input="getMintedImages"
              v-model="pagination.page"
              total-visible="5"
              :length="pagination.pages"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2">
        <mint-settings
          mintText="Start minting"
          @mint="prepareForMint"
          @shuffle="getShuffle"
        ></mint-settings>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SliderDialog from "../../components/Dialogs/SliderDialog.vue";
import MintDialog from "../../components/Dialogs/MintDialog.vue";
import ContinueDialog from "../../components/Dialogs/ContinueDialog.vue";
import DownloadDialog from "../../components/Dialogs/DownloadDialog.vue";
import MintSettings from "../../components/Minter/MintSettings.vue";
import MintCard from "../../components/Minter/MintCard.vue";
export default {
  sockets: {
    "/mint/status": function(data) {
      if (data) {
        this.mintdialog.opened = data.running;
        this.mintdialog.created = data.created;
        this.mintdialog.limit = data.of;
      }
    },
  },
  components: {
    "slider-dialog": SliderDialog,
    "mint-dialog": MintDialog,
    "continue-dialog": ContinueDialog,
    "download-dialog": DownloadDialog,
    "mint-settings": MintSettings,
    "mint-card": MintCard,
  },
  data() {
    return {
      menu: false,
      config: null, //save
      continueDialog: false,
      downloadDialog: false,
      mintdialog: {
        opened: false,
        created: 0,
        limit: 0,
      },
      pagination: {
        totalItems: 0,
        pages: 1,
        page: 1,
        pageSize: 10,
      },
      slider: {
        opened: false,
        current: 0,
      },
      groups: [],
      filters: [],
      selectedFilter: [],
      currentSlide: 0,
      slides: [],
    };
  },

  methods: {
    onCardImageClick(index) {
      this.slider.current = index;
      this.slider.opened = true;
    },

    async stopMinting() {
      try {
        this.$axios.get("/api/minter/stop");
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    prepareForMint(config) {
      this.config = config;
      this.config.continueMint = false;
      if (this.pagination.totalItems > 0) {
        this.continueDialog = true;
      } else {
        this.startMinting();
      }
    },
    continueMinting() {
      this.config.continueMint = true;
      this.startMinting();
    },
    async startMinting() {
      if (this.config === null) this.$snackbar.error("Konfiguration nicht geladen");
      this.continueDialog = false;
      try {
        this.slides = [];
        let response = await this.$axios.post("/api/minter/init", {
          config: { ...this.config },
        });
        this.setMintedImagesData(response);
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async getFilters() {
      try {
        let response = await this.$axios.get("/api/minter/filters");
        if (response.data && response.data.data) {
          this.filters = response.data.data.map((layer) => {
            return {
              name: layer.name,
              images: layer.images,
            };
          });
        }
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async getShuffle() {
      try {
        this.pagination.page = 1;
        let response = await this.$axios.get("/api/minter/shuffle");
        this.setMintedImagesData(response);
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async applyFilters() {
      try {
        let skip = 0;
        this.pagination.page = 1;
        let response = await this.$axios.post(`/api/minter/images/${skip}`, {
          filters: this.selectedFilter,
        });
        this.setMintedImagesData(response);
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async resetFilters() {
      this.selectedFilter = [];
      await this.getMintedImages();
    },
    async getMintedImages() {
      try {
        let skip = this.pagination.page - 1;
        let response = await this.$axios.post(`/api/minter/images/${skip}`, {
          filters: this.selectedFilter,
        });
        this.setMintedImagesData(response);
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    setMintedImagesData(response) {
      console.log(response);
      this.slides = response.data.data.items.map((image) => {
        return {
          src: `http://${this.$remote.host}:${this.$remote.port}/static${image.filepath}`,
          id: image._id,
        };
      });
      this.pagination.totalItems = response.data.data.count;
      this.pagination.pages = Math.ceil(response.data.data.count / this.pagination.pageSize);
    },
  },

  async mounted() {
    await this.getFilters();
    await this.getMintedImages();
  },
};
</script>

<style lang="scss">
.panel-responsive {
  overflow-y: auto;
  overflow-x: hidden;
}
.v-expansion-panel-content__wrap {
  padding: 0;
}
</style>
