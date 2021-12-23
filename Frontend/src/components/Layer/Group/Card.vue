<template>
  <v-hover>
    <template v-slot:default="{ hover }">
      <v-card :ripple="false" :elevation="hover ? 6 : 3" class="transition-swing" height="200">
        <v-toolbar dense flat>
          <v-toolbar-title>{{ group.name }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <yesno-dialog
            v-model="deleteDialog"
            @yes="deleteGroup"
            title="Continue?"
            text="By pressing continue your group and all associations will be removed."
            :width="500"
          ></yesno-dialog>
          <v-btn @click="editGroup" icon>
            <v-icon>mdi-image-edit</v-icon>
          </v-btn>
          <v-btn @click="deleteDialog = true" icon>
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-2 py-0">
          <v-row>
            <v-col v-for="image in images" :key="image.name" cols="6">
              <v-img
                class="ma-1 card--image"
                :src="
                  `http://${host.host}:${host.port}/static/layers/${image.layer.name}/${image.name}`
                "
              ></v-img>
            </v-col>
          </v-row>
          <p
            v-if="group.exclusive"
            class="d-flex justify-center ma-0 pa-0 red--text text--lighten-1 overline"
          >
            exclusive
          </p>
        </v-card-text>
      </v-card>
    </template>
  </v-hover>
</template>

<script>
import YesNoDialog from "../../Dialogs/YesNoDialog.vue";
import host from "../../../utils/host";
export default {
  props: {
    group: Object,
  },
  components: {
    "yesno-dialog": YesNoDialog,
  },
  data() {
    return {
      deleteDialog: false,
    };
  },
  computed: {
    host() {
      return host;
    },
    images() {
      return this.group.images.slice(0, 2);
    },
  },

  methods: {
    editGroup() {
      this.$router.push(`/layer/group/${this.group._id}`);
    },
    async deleteGroup() {
      try {
        let response = await this.$axios.delete(`/api/layers/group/${this.group._id}`);

        this.$emit("data", response.data.data);
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
  },
};
</script>

<style></style>
