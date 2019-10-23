import Vue from 'vue';
import axios from 'axios';
import md5 from "js-md5";
import store from '../store';
import router from '../router';

Vue.prototype.$axios = axios;
// axios.defaults.withCredentials = true;

const HN_HOST = "http://10.19.0.124:16791";//"http://vendor.heneng.cn:16791";
const HT_HOST = "http://ht.heneng.cn:16791";

const isHN = true;

const API_HOST = isHN ? HN_HOST : HT_HOST;

function printParams(param) {
    let temp = [];
    for (const key in param) {
        if (param.hasOwnProperty(key)) {
            if (key != 'action') {
                temp.push(key);
            }
        }
    }
    temp = temp.sort();
    let values = [];
    temp.forEach(ele => {
        values.push(`'${param[ele]}'`);
    });
    console.log(`exec ${param.action} ${values.join(',')}`);
}

function post(param, callback) {
    let payload = JSON.stringify(param);
    let i = new Date().getTime().toString();
    let ak = md5(payload + i + "HNSUP.2018._.123");

    printParams(param);

    axios.post(API_HOST + "/api/gwc", {
        ak: ak,
        i: i,
        payload: payload
    })
        .then(function (res) {
            // console.log(res);
            if (res.status == 200 || res.status == 201) {
                if (callback) {
                    callback(res.data);
                }
            } else {
                if (callback) {
                    callback({ code: 500, codemsg: res.codemsg });
                }
            }

        })
        .catch(function (err) {
            // console.log(err);
            if (callback) {
                callback({ code: 500, codemsg: err, error: err });
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
        let msg = resp.data.code === "401" ? "账号登录已过期，请重新登录" : "用户不存在";
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
