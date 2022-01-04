<template>
  <v-dialog persistent :value="value" width="600">
    <v-card>
      <v-card-title>Update Index</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col cols="12"
            ><span
              ><v-icon>mdi-warning</v-icon>Your current layersettings will be removed and reloaded
              again. Do you want continue?</span
            >
          </v-col>
          <v-col cols="12">
            <v-file-input
              @change="onFileChange"
              :solo="!$vuetify.theme.dark"
              :outlined="$vuetify.theme.dark"
              accept="application/x-zip-compressed"
              label="Upload *.zip with layers"
              :show-size="1000"
              v-model="file"
            >
              <template v-slot:selection="obj">
                <v-chip color="deep-purple accent-4" dark label small>
                  {{ obj.text }}
                </v-chip>
              </template>
            </v-file-input>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6">
          <v-btn block @click="btnCancel" color="red">Cancel</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block @click="btnContinue" color="green">{{ btnText }}</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      file: null,
    };
  },
  computed: {
    btnText() {
      return this.file !== null ? "Upload" : "Continue";
    },
  },
  methods: {
    btnContinue() {
      this.$emit("input", false);
      if (this.file !== null) this.$emit("yes", new File([this.file], this.file.name));
      this.file = null;
      this.$emit("yes", null);
    },
    btnCancel() {
      this.file = null;
      this.$emit("input", false);
    },
    onFileChange() {
      console.log(this.file);
    },
  },
  async mounted() {},
};
</script>

<style lang="scss">
.preview-image {
  &:hover {
    cursor: pointer;
  }
}
</style>
