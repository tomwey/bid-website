import Vue from 'vue';
import axios from 'axios';
import md5 from "js-md5";
import store from '../store';
import router from '../router';

Vue.prototype.$axios = axios;
// axios.defaults.withCredentials = true;

function post(param, callback) {
    let payload = JSON.stringify(param);
    let i = new Date().getTime().toString();
    let ak = md5(payload + i + "HNSUP.2018._.123");

    axios.post("http://10.19.0.191:8181/api/gwc", {
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

Vue.prototype.$post = post;

axios.interceptors.response.use(resp => {
    // console.log(resp);
    if (resp.data && (resp.data.code === "401" || resp.data.code === "404")) {
        store.commit("logout");
        router.replace({
            path: '/',
            query: { redirect: router.currentRoute.fullPath }
        })
        let msg = resp.data.code === "401" ? "账号登录已过期，请重新登录" : "非法操作";
        return Promise.reject(msg);
    } else {
        return resp;
    }
}, error => {
    // console.log(error);
    if (error.response) {
        switch (error.response.status) {
            case 401:
                store.commit("logout");
                router.replace({
                    path: '/',
                    query: { redirect: router.currentRoute.fullPath }
                })
        }
    }
    return Promise.reject(error.response.data)
});

export default post;
