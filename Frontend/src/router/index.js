import Vue from "vue";
import VueRouter from "vue-router";
import Layers from "../views/_Layer/index";
import Layer from "../views/_Layer/_id";
import Minter from "../views/_Minter/index";
import Settings from "../views/_Settings/index";
import GroupById from "../views/_Group/_id";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Layers",
    component: Layers,
  },
  {
    path: "/layer/:id",
    name: "View & Edit Layer",
    component: Layer,
  },
  {
    path: "/minter",
    name: "Minter",
    component: Minter,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },
  {
    path: "/layer/group/:id",
    name: "Edit Group",
    component: GroupById,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
