import Vue from 'vue';
import axios from 'axios';
import md5 from "js-md5";

Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

Vue.prototype.$post = (param, callback) => {
    let payload = JSON.stringify(param);
    let i = new Date().getTime().toString();
    let ak = md5(payload + i + "HNSUP.2018._.123");

    axios.post("http://10.19.0.186:8181/api/gwc", {
        ak: ak,
        i: i,
        payload: payload
    })
        .then(function (res) {
            if (res.status == 200 || res.status == 201) {
                if (callback) {
                    callback(res.data);
                }
            } else {
                if (callback) {
                    callback({ code: 500, codemsg: '服务器出错' });
                }
            }

        })
        .catch(function (err) {
            // console.log(err);
            if (callback) {
                callback({ code: 500, codemsg: '服务器出错', error: err });
            }
        });
}
