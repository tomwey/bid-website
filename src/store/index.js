import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        supinfo: {},
        supprofile: {},
        token: null,
        title: '',
        has_draft_alert: false,
    },
    mutations: {
        getToken: (state) => {
            const token = _getToken();
            state.token = token;
            state.supinfo.accountid = localStorage.getItem("uid");
            state.supinfo.loginname = localStorage.getItem("uname");
        },
        login: (state, data) => {
            // localStorage.token = data;
            _saveToken(data);
            state.token = data.token;
        },
        register: (state, data) => {
            _saveToken(data);
            state.token = data.token;
            state.supinfo.accountid = data.uid;
            state.supinfo.loginname = data.loginname;
        },
        logout: (state) => {
            // console.log(123);
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            localStorage.removeItem('uname');
            state.token = null;
            state.supinfo = {};
        },
        title: (state, data) => {
            state.title = data;
        },
        updatesupinfo: (state, data) => {
            state.supinfo = data;
            localStorage.setItem('uname', data.loginname);
        },
        updatesupprofile: (state, data) => {
            state.supprofile = data;
        },
        updateloginname: (state, data) => {
            state.supinfo.loginname = data;
            localStorage.setItem('uname', data);
        },
        updatemobile: (state, data) => {
            state.supinfo.telephone = data;
        },
        changeeditstate: (state, data) => {
            state.supinfo.canedit = data;
        },
        set_draft_alert: (state, value) => {
            state.has_draft_alert = value;
        }
    },
})

function _saveToken(data) {
    var date = new Date();
    date.setDate(date.getDate() + data.days);
    localStorage.setItem('token', `${data.token}#${date.toString()}`);
    localStorage.setItem('uid', data.uid);
    localStorage.setItem('uname', data.loginname);
}

function _getToken() {
    let tokenString = localStorage.getItem('token');
    // console.log(tokenString);

    if (!tokenString) {
        return null;
    }

    let arr = tokenString.split('#');
    let token = arr[0];
    let time = arr[1];

    // console.log(token);

    time = new Date(time);
    if (_date1SmallerDate2(time, new Date())) {
        store.commit("logout");
        return null;
    }
    return token;
}

function _date1SmallerDate2(d1, d2) {
    const y1 = d1.getFullYear();
    const m1 = d1.getMonth();
    const date1 = d1.getDate();

    const y2 = d2.getFullYear();
    const m2 = d2.getMonth();
    const date2 = d2.getDate();

    if (y1 < y2) return true;
    if (y1 > y2) return false;

    if (m1 < m2) return true;
    if (m1 > m2) return false;

    if (date1 < date2) return true;
    return false;
}

export default store;