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
                    prepend-inner-icon="mdi-file-outline"
                    label="Your Project Name"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="3">
          <v-card>
            <v-card-title>Metadata Settings</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    prepend-inner-icon="mdi-card-text-outline"
                    label="Asset-Prefix"
                    placeholder="e.g. #"
                    v-model="settings.assetprefix"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    prepend-inner-icon="mdi-card-text-outline"
                    placeholder="Describe your project in few words..."
                    label="Projectdescription"
                    v-model="settings.description"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    prepend-inner-icon="mdi-web"
                    label="Base URI for assets"
                    placeholder="https://<addr>/ | http://<addr>/ | ipfs://<addr>/ "
                    v-model="settings.baseURI"
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
        assetprefix: "",
        baseURI: "",
        description: "",
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
        } else {
          this.$snackbar.info("Check your fields!");
        }
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
  async mounted() {
    await this.getSettings();
  },
};
</script>

<style></style>
