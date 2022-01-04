<template>
  <v-dialog v-model="value" :width="dWidth">
    <v-card>
      <v-card-title class="text-h6">
        {{ dTitle }}
      </v-card-title>
      <v-card-text>
        {{ dText }}
      </v-card-text>
      <v-divider v-if="dText"></v-divider>
      <v-card-actions>
        <v-col cols="6">
          <v-btn block @click="$emit('input', false)" color="red">Cancel</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn block @click="yes" color="green">Continue</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    value: Boolean,
    width: Number,
  },
  methods: {
    yes() {
      this.$emit("yes");
      this.$emit("input", false);
    },
  },
  computed: {
    dTitle() {
      return this.title !== null ? this.title : "Yes or No Dialog";
    },
    dText() {
      return this.text !== null ? this.text : "";
    },
    dWidth() {
      return this.width !== 0 ? this.width : "400";
    },
  },
};
</script>

<style></style>
