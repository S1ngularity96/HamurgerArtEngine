import axios from "axios"
const install = function (Vue, options) {
    // 1. add global method or property
    Vue.myGlobalMethod = function () {}
    function createAxiosInstance(){
        let axiosInstance = axios.create({
            baseURL: `http://${options.host}${options.port ? `:${options.port}`:""}`
        })

        return axiosInstance;
    }
    Vue.prototype.$axios = createAxiosInstance();
}

export default {
    install
}
