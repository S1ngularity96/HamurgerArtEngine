<template>
  <v-container v-if="group" fluid>
    <yesno-dialog
      v-model="deleteDialog"
      @yes="deleteGroup"
      title="Continue?"
      text="By pressing continue your group and all associations will be removed."
      :width="500"
    ></yesno-dialog>
    <image-select-dialog
      :open="selectDialog"
      @close="selectDialog = false"
      @select="onSelect"
      :customURI="`/api/layers/group/${group._id}/imagesavailable`"
      v-model="group.images"
    ></image-select-dialog>
    <v-toolbar dense flat>
      <v-toolbar-title>{{ group.name }} - {{group.images.length}} Groupitems</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="deleteDialog = true" icon>
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </v-toolbar>
    <v-row class="my-2">
      <v-col cols="10">
        <v-responsive content-class="imagecontainer">
          <v-row>
            <v-col cols="3" v-for="(image, index) in group.images" :key="index">
              <v-card>
                <v-toolbar flat>
                  <v-toolbar-title> {{ image.name | removeExtension }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn @click="removeImageAtIndex(index)" icon>
                    <v-icon>mdi-trash-can</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-img
                  class="card--image"
                  :src="
                    `http://${host.host}:${host.port}/static/layers/${image.layer.name}/${image.name}`
                  "
                ></v-img>
              </v-card>
            </v-col>
          </v-row>
        </v-responsive>
      </v-col>
      <v-col cols="2">
        <v-card>
          <v-card-title>Edit Group</v-card-title>
          <v-card-text>
            <v-text-field hide-details outlined label="Name" v-model="group.name"></v-text-field>
            <v-checkbox v-model="group.exclusive" label="Exclusive Group"></v-checkbox>
            <v-btn block outlined color="green" @click="selectDialog = true">Add Images</v-btn>
          </v-card-text>
          <v-card-text>
            <v-btn @click="patchGroup" block color="primary">Save</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import hostsettings from "../../utils/host";
import ImageSelectDialog from "../../components/Dialogs/ImageSelectDialog.vue";
import YesNoDialog from "../../components/Dialogs/YesNoDialog.vue";
export default {
  data() {
    return {
      group: null,
      deleteDialog: false,
      selectDialog: false,
      attributes: null,
    };
  },
  components: {
    "image-select-dialog": ImageSelectDialog,
    "yesno-dialog": YesNoDialog,
  },
  mounted() {
    let groupId = this.$route.params.id;
    this.getGroupById(groupId);
  },
  computed: {
    host() {
      return hostsettings;
    },
  },
  filters: {
    removeExtension(value) {
      return value.replace(".png", "");
    },
  },
  methods: {
    async patchGroup() {
      try {
        let response = await this.$axios.patch(`/api/layers/group/${this.group._id}`, this.group);
        this.group = response.data.data;
        this.$snackbar.success("Saved successfully");
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    async getGroupById(groupId) {
      try {
        let response = await this.$axios.get(`/api/layers/group/${groupId}`);
        this.group = response.data.data;
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
    removeImageAtIndex(index) {
      if (this.group) {
        this.group.images.splice(index, 1);
      }
    },
    onSelect(images) {
      this.group.images = images;
    },
    async deleteGroup() {
      try {
        await this.$axios.delete(`/api/layers/group/${this.group.id}`);
        this.$router.push("/");
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
};
</script>

<style></style>
