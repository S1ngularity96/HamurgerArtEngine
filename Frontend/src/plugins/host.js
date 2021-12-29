const install = function(Vue) {
  const host = { host: "", port: "" };
  switch (process.env.NODE_ENV) {
    case "development":
      host.host = process.env.VUE_APP_HOST;
      host.port = process.env.VUE_APP_PORT;
      break;
    case "production":
      host.host = process.env.VUE_APP_HOST;
      host.port = process.env.VUE_APP_PORT;
      break;
    default:
      throw new Error("Missing Environment");
  }
  Vue.prototype.$remote = host;
};

export default {
  install,
};
