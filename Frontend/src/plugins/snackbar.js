const install = function (Vue) {
  Vue.prototype.$snackbar = {};
  Vue.prototype.$snackbar.success = () => {
    console.error("Not implemented function");
  };
  Vue.prototype.$snackbar.error = () => {
    console.error("Not implemented function");
  };
  Vue.prototype.$snackbar.info = () => {
    console.error("Not implemented function");
  };

  Vue.prototype.$snackbar.registerCallbacks = function (
    onSuccess,
    onError,
    onInfo,
    setText,
  ) {
    Vue.prototype.$snackbar.success = (msg) => {
      onSuccess();
      setText(msg);
    };
    Vue.prototype.$snackbar.error = (msg) => {
      onError();
      setText(msg);
    };
    Vue.prototype.$snackbar.errorhandle = (err) => {
      onError();
      if( err.response && err.response.data){
        setText(err.response.data.message)
      }else{
        setText(err.toString());
      }
    }

    Vue.prototype.$snackbar.info = (msg) => {
      onInfo();
      setText(msg);
    };
  };

  Vue.prototype.$snackbar.unregister = function () {
    Vue.prototype.$snackbar.success = () => {
      console.error("Not implemented function");
    };
    Vue.prototype.$snackbar.error = () => {
      console.error("Not implemented function");
    };
    Vue.prototype.$snackbar.info = () => {
      console.error("Not implemented function");
    };
  };
};

export default {
  install,
};
