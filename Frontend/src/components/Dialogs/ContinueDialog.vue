<template>
  <v-dialog width="400px" :value="opened" persistent>
    <v-card>
      <v-card-title>Continue generate?</v-card-title>
      <v-card-text>
        <p>You already have generated images. Do you want to continue adding new images?</p>
        <p>
          By clicking on FROM BEGIN all generated data will be lost and the process will restart.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="$emit('close', null)" color="red">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('no', null)" color="orange">From Begin</v-btn>
        <v-btn @click="$emit('yes', null)"  color="green">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    opened: Boolean,
  },
};
</script>

<style></style>
