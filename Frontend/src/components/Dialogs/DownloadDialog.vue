<template>
  <v-dialog width="400px" :value="opened" persistent>
    <v-card>
      <v-card-title>Download generated files</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <strong>Options</strong>
              <v-checkbox v-model="metadata" hide-details label="with *.json metadata"></v-checkbox>
            </v-col>
          </v-row>
          <!--<v-row>
            <v-col cols="12">
              <p>Please wait ...</p>
              <v-progress-linear rounded stream :value="0" height="25" color="green">
                <template v-slot:default="{}">
                  <strong>0 %</strong>
                </template>
              </v-progress-linear>
            </v-col>
          </v-row> -->
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6">
          <v-btn @click="$emit('close', null)" block color="red">Close</v-btn>
        </v-col>
        <v-col cols="6">
          <a style="text-decoration:none;" :href="downloadLink">
            <v-btn @click="$emit('yes', null)" block color="green">Continue</v-btn>
          </a>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    opened: Boolean,
  },
  computed: {
    downloadLink() {
      return `http://${this.$remote.host}:${this.$remote.port}/api/minter/download/minted.zip?metadata=${this.metadata}`;
    },
  },
  data() {
    return {
      metadata: false,
    };
  },
};
</script>

<style></style>
