import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import axios from "./plugins/axios";
import Snackbar from "./plugins/snackbar";
import hostsettings from "./utils/host";
import VueSocketIOExt from "vue-socket.io-extended";
import { io } from "socket.io-client";
import "./assets/style.scss";

Vue.config.productionTip = false;

console.log(hostsettings);

const socket = io(`http://${hostsettings.host}:${hostsettings.port}`);

Vue.use(VueSocketIOExt, socket);
Vue.use(axios, { host: hostsettings.host, port: hostsettings.port });
Vue.use(Snackbar);
new Vue({
  router,
  vuetify,
  axios,
  Snackbar,
  render: (h) => h(App),
}).$mount("#app");
