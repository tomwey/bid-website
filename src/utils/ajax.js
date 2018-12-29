import Vue from 'vue';
import axios from 'axios';
import md5 from "js-md5";

// Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

Vue.prototype.$post = function (param, callback) {
    let payload = JSON.stringify(param);
    let i = new Date().getTime().toString();
    let ak = md5(payload + i + "HNSUP.2018._.123");

    axios.post("http://10.19.0.52:8181/api/gwc", {
        ak: ak,
        i: i,
        payload: payload
    })
        .then(function (res) {
            if (callback) {
                callback(res, null);
            }
        })
        .catch(function (err) {
            if (callback) {
                callback(null, err);
            }
        });
}
