<template>
  <v-dialog  v-model="value" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dark flat>
        <v-btn icon @click="$emit('input', false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-carousel  height="93vh"  :continuous="false"  :value="current">
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-img class="carousel-image" contain :src="slide.src"></v-img>
        </v-carousel-item>
      </v-carousel>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    slides: Array,
    current: Number,
  },
};
</script>

<style scoped>
.carousel-image {
  height: 100%;
}
</style>
