<template>
  <v-container fluid>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-row>
        <v-col cols="3">
          <v-card>
            <v-card-title>Main settings</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="settings.name"
                    outlined
                    :rules="rules.name"
                    label="Your Project Name"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    v-model.number="settings.startAt"
                    prefix="#"
                    :rules="rules.startAt"
                    label="Start minting at #number"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card>
            <v-card-title> Price Range</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    outlined
                    prefix="ETH"
                    v-model.number="settings.priceDefault"
                    label="Default price"
                    :rules="rules.priceDefault"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    prefix="ETH"
                    v-model.number="settings.priceMin"
                    :rules="rules.priceMin"
                    label="Minimum price"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    prefix="ETH"
                    :rules="rules.priceMax"
                    v-model.number="settings.priceMax"
                    label="Maximum price"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card>
            <v-card-title>Sizes</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <h4 class="ma-2">Images</h4>
                  <v-text-field
                    v-model.number="settings.imageHeigth"
                    label="height"
                    prefix="px"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model.number="settings.imageWidth"
                    label="width"
                    prefix="px"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <h4 class="ma-2">Thumbnails</h4>
                  <v-text-field
                    v-model.number="settings.thumbnailHeigth"
                    label="height"
                    prefix="px"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model.number="settings.thumbnailWidth"
                    label="width"
                    prefix="px"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col offset="11" cols="1">
        <v-btn @click="postSettings" block color="primary">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      settings: {
        name: "",
        startAt: 0,
        priceDefault: 0,
        priceMin: 0,
        priceMax: 0,
        imageHeigth: null,
        imageWidth: null,
        thumbnailHeigth: null,
        thumbnailWidth: null,
      },
      rules: {
        name: [],
        startAt: [],
        priceDefault: [],
        priceMin: [],
        priceMax: [],
      },
    };
  },
  methods: {
    createRules() {
      this.rules.name = [
        (v) => !!v || "Name can not be blank",
        (v) => v.length >= 1 || "Name must contain at least one character",
      ];

      this.rules.startAt = [(v) => v >= 0 || "Number must not be less than 0"];
      this.rules.priceDefault = [
        (v) =>
          (v >= this.settings.priceMin && v <= this.settings.priceMax) ||
          "Price must be between the pricerange",
      ];
      this.rules.priceMin = [
        (v) =>
          (v >= 0 && v < this.settings.priceMax) || "Min price must be between 0 and max price",
      ];
      this.rules.priceMax = [
        (v) => v > this.settings.priceMin || "Max price must be higher von min price",
      ];
    },
    async getSettings() {
      try {
        let response = await this.$axios.get("/api/settings");
        this.settings = response.data.data;
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
    async postSettings() {
      try {
        if (this.$refs.form.validate()) {
          let response = await this.$axios.post("/api/settings", {
            ...this.settings,
          });
          this.settings = response.data.data;
          this.$snackbar.success("Saved");
        }else{
          this.$snackbar.info("Check your fields!")
        }
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
  },
  async mounted() {
    this.createRules();
    await this.getSettings();
  },
};
</script>

<style></style>
