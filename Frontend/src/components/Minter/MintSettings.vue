<template>
  <v-card>
    <v-card-title>Mint Settings</v-card-title>
    <v-container>
      <v-expansion-panels v-model="panels" multiple flat accordion>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-5">Groups</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-responsive content-class="panel-responsive" max-height="15vh">
              <v-checkbox v-model="config.all" class="my-0" hide-details label="All"></v-checkbox>
              <v-checkbox
                :disabled="config.all"
                v-for="group in groups"
                :key="group.name"
                :value="group._id"
                v-model="config.groups"
                hide-details
                class="my-0"
                :label="group.name"
              ></v-checkbox>
            </v-responsive>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-5">Createoptions</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12">
                <v-checkbox v-model="config.parallel" label="Build groups in parallel"></v-checkbox>
                <v-text-field
                  type="number"
                  min="1"
                  max="10000"
                  outlined
                  dense
                  v-model.number="config.limit"
                  label="Limit"
                ></v-text-field>
                <v-text-field
                  type="number"
                  min="1"
                  outlined
                  dense
                  hide-details
                  v-model.number="config.stepSize"
                  label="Stepsize"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="px-5">Functions</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12">
                <v-btn block @click="$emit('shuffle', config)" color="orange">Shuffle</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn block @click="$emit('validate', config)" color="green">Validate</v-btn>
              </v-col>
              <v-col cols="12">
                <v-btn @click="$emit('mint', config)" block color="green">{{ mintText }}</v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-card>
</template>

<script>
export default {
  props: {
    mintText: String,
  },
  data() {
    return {
      config: {
        limit: 1,
        all: true,
        parallel: false,
        stepSize: 1,
        continueMint: false,
        groups: [],
      },
      panels: [0, 1, 2],
      groups: [],
    };
  },
  methods: {
    async getMintGroups() {
      try {
        let response = await this.$axios.get("/api/layers/groups");
        let groupArray = response.data.data;
        this.groups = groupArray.map((group) => {
          return { name: group.name, _id: group._id, value: false };
        });
      } catch (err) {
        this.$snackbar.errorhandle(err);
      }
    },
  },
  async created() {
    await this.getMintGroups();
  },
};
</script>

<style></style>
