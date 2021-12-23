<template>
  <v-dialog persistent :value="value" width="600">
    <v-card>
      <v-card-title>Create Group</v-card-title>
      <v-card-text>
        <v-container class="pa-0">
          <v-row>
            <v-col cols="8">
              <v-text-field
                v-model="name"
                @keydown.enter="btnCreate"
                outlined
                label="Groupname"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-checkbox v-model="exclusive" hide-details label="Exclusive Group"></v-checkbox>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="btnCreate" outlined color="green">Create</v-btn>
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
    return {
      name: "",
      exclusive: false,
    };
  },
  methods: {
    async btnCreate() {
      try {
        if (this.validate()) {
          let response = await this.$axios.post("/api/layers/group", { name: this.name, exclusive: this.exclusive });
          this.$emit("data", response.data.data);
          this.$emit("input", false);
        }
      } catch (err) {
        this.$snackbar.error(err.toString());
      }
    },
    btnCancel() {
      this.$emit("input", false);
    },
    validate() {
      if (this.name.length === 0) {
        this.$snackbar.error("Name can not be blank");
        return false;
      }
      return true;
    },
  },
};
</script>

<style></style>
