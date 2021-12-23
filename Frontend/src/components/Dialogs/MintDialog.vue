<template>
  <v-dialog width="400px" :value="opened" persistent>
    <v-card>
      <v-card-title>Started creating images</v-card-title>
      <v-card-text>
        <p>Please Wait ...</p>
        <v-progress-linear rounded stream :value="this.progress" height="25" color="green">
          <template v-slot:default="{}">
            <strong>{{ created }} of {{ limit }} images created</strong>
          </template>
        </v-progress-linear>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('abort', null)" outlined color="red">Abort</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    opened: Boolean,
    created: Number,
    limit: Number,
  },
  computed: {
    progress() {
      return (100 * this.created) / this.limit;
    },
  },
};
</script>

<style></style>
