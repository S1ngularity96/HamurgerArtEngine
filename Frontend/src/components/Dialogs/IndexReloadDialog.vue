<template>
  <v-dialog persistent :value="value" width="600">
    <v-card>
      <v-card-title>Search files</v-card-title>
      <v-card-text>
        <span
          ><v-icon>mdi-warning</v-icon>Your current layersettings will be removed and reloaded
          again. Do you want continue?</span
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="btnContinue" outlined color="green">Continue</v-btn>
        <v-btn @click="btnCancel" outlined color="red">Cancel</v-btn>
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
    return {};
  },
  methods: {
    btnContinue() {
      this.$emit("input", false);
      this.$emit("yes", null);
    },
    btnCancel() {
      this.$emit("input", false);
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
