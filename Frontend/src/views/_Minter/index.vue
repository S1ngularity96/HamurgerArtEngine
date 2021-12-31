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
          <a :href="`http://${$remote.host}:${$remote.port}/api/minter/download/minted.zip`">
            <v-btn color="orange">
              Download
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </a>
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
                  <v-btn block outlined color="red" @click="resetFilters">Reset</v-btn>
                </v-col>
                <v-col cols="6">
                  <v-btn block outlined color="green" @click="applyFilters">Search</v-btn>
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
              <v-card @click="onCardImageClick(index)">
                <v-card-text>
                  <v-img :src="src"></v-img>
                </v-card-text>
              </v-card>
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
        <v-card>
          <v-card-title>Mint Settings</v-card-title>
          <v-expansion-panels v-model="panels" multiple flat accordion>
            <v-expansion-panel>
              <v-expansion-panel-header class="px-5">Groups</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-responsive content-class="panel-responsive" max-height="15vh">
                  <v-checkbox
                    v-model="config.all"
                    class="my-0"
                    hide-details
                    label="All"
                  ></v-checkbox>
                  <v-checkbox
                    :disabled="config.all"
                    v-for="group in groups"
                    :key="group.name"
                    :value="group._id"
                    v-model="config.groups"
                    hide-details
                    class="my-0"
                    :label="group.name"
                  ></v-checkbox>
                </v-responsive>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="px-5">Createoptions</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="config.parallel"
                      label="Build groups in parallel"
                    ></v-checkbox>
                    <v-text-field
                      type="number"
                      min="1"
                      max="10000"
                      outlined
                      dense
                      v-model.number="config.limit"
                      label="Limit"
                    ></v-text-field>
                    <v-text-field
                      type="number"
                      min="1"
                      outlined
                      dense
                      hide-details
                      v-model.number="config.stepSize"
                      label="Stepsize"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header class="px-5">Functions</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row>
                  <v-col cols="12">
                    <v-btn block @click="getShuffle" color="orange">Shuffle</v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-btn @click="prepareForMint" block color="green">Start minting</v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card-actions> </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SliderDialog from "../../components/Dialogs/SliderDialog.vue";
import MintDialog from "../../components/Dialogs/MintDialog.vue";
import ContinueDialog from "../../components/Dialogs/ContinueDialog.vue";
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
  },
  data() {
    return {
      continueDialog: false,
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
      config: {
        limit: 1,
        all: true,
        parallel: false,
        stepSize: 1,
        continueMint: false,
        groups: [],
      },
      groups: [],
      filters: [],
      selectedFilter: [],
      currentSlide: 0,
      panels: [0, 1, 2],
      slides: [],
    };
  },

  methods: {
    onCardImageClick(index) {
      this.slider.current = index;
      this.slider.opened = true;
    },
    async getMintGroups() {
      try {
        let response = await this.$axios.get("/api/layers/groups");
        let groupArray = response.data.data;
        this.groups = groupArray.map((group) => {
          return { name: group.name, _id: group._id, value: false };
        });
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async stopMinting() {
      try {
        this.$axios.get("/api/minter/stop");
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    prepareForMint() {
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
      this.slides = response.data.data.items.map((image) => {
        return { src: `http://${this.$remote.host}:${this.$remote.port}/static${image.filepath}` };
      });
      this.pagination.totalItems = response.data.data.count;
      this.pagination.pages = Math.ceil(response.data.data.count / this.pagination.pageSize);
    },
  },

  async mounted() {
    await this.getMintGroups();
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
