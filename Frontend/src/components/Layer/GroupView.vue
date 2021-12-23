<template>
  <v-container fluid class="pa-0">
    <image-select></image-select>
    <create-group-dialog @data="changeGroups" v-model="createDialog"></create-group-dialog>
    <v-row>
      <v-col cols="2" v-for="(group, index) in groups" :key="index">
        <group-card @data="changeGroups" :group=group></group-card>
      </v-col>
      <v-col cols="2">
        <group-create @create="createDialog = true"></group-create>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ImageSelectDialog from "../Dialogs/ImageSelectDialog.vue";
import GroupCard from "../Layer/Group/Card.vue";
import GroupCreateCard from "../Layer/Group/Create.vue";
import CreateGroupDialog from "../Dialogs/CreateGroupDialog.vue";

export default {
  components: {
    "image-select": ImageSelectDialog,
    "group-card": GroupCard,
    "group-create": GroupCreateCard,
    "create-group-dialog": CreateGroupDialog,
  },
  data() {
    return {
      createDialog: false,
      groups: [],
    };
  },
  methods: {
    changeGroups(data) {
      this.groups = data;
    },
    async getGroups(){
      try{
        let response = await this.$axios.get("/api/layers/groups");
        this.groups = response.data.data;
      }catch(err){
        this.$snackbar.error(err.toString());
      }
    },
  },
  async mounted(){
    this.getGroups();
  }
};
</script>

<style></style>
