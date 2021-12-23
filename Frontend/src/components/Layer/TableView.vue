<template>
  <v-card>
    <v-card-title>Layer options</v-card-title>
    <v-card-text>
      <v-data-table dense :items="wSize" :headers="headers">
        <template v-slot:item.order="{ item }">
          <v-select
            clearable
            hide-details
            class="pa-2"
            :solo="!darkTheme"
            :solo-inverted="darkTheme"
            v-model="item.order"
            label="select order"
            :items="orderitems"
          ></v-select>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    layers: Array,
  },
  data() {
    return {
      headers: [
        { text: "Layer", value: "name", align: "start" },
        { text: "Size", value: "size", align: "center", width: "20%" },
        { text: "Order", value: "order", align: "center", width: "25%" },
      ],
    };
  },
  computed: {
    wSize(){
      if(this.layers){
        return this.layers.map(layer => {
          layer.size = layer.images.length;
          return layer;
        })
      }
      return  []
    },
    darkTheme(){
      return this.$vuetify.theme.dark;
    },
    orderitems() {
      let items = [];
      if (this.layers) {
        for (let item = 1; item <= this.layers.length; item++) {
          items.push(item);
        }
      }
      return items;
    },
  },
};
</script>

<style></style>
