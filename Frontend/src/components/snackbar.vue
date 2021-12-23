<template>
  <div class="text-center">
    <v-snackbar
      :dark="$vuetify.theme.dark"
      app
      top
      absolute
      :color="color"
      v-model="snackbar"
      :timeout="timeout"
    >
      <span v-if="!array">{{text}}</span>
      <span v-else v-for="(msg,index) in text" :key="index">{{msg}}<br></span>
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      snackbar: false,
      text: "",
      timeout: 3000,
      color: "primary",
      array: false,
    };
  },
  methods: {
    setText(msg) {
      if (Array.isArray(msg)) {
        this.array = true;
        this.text = msg;
      } else {
        this.array = false;
        this.text = msg;
      }

      this.snackbar = true;
    },
    success() {
      this.color = "green";
    },
    error() {
      this.color = "red";
    },
    info() {
      this.color = "blue";
    },
  },
  mounted() {
    this.$snackbar.registerCallbacks(
      this.success,
      this.error,
      this.info,
      this.setText
    );
  },
  beforeDestroy() {
    this.$snackbar.unregister();
  },
};
</script>

<style>
</style>