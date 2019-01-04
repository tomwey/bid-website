import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        supinfo: {},
        token: null,
        title: ''
    },
    mutations: {
        getToken: (state) => {
            const token = _getToken();
            state.token = token;
        },
        login: (state, data) => {
            // localStorage.token = data;
            _saveToken(data);
            state.token = data.token;
        },
        logout: (state) => {
            // console.log(123);
            localStorage.removeItem('token');
            state.token = null;
            state.supinfo = {};
        },
        title: (state, data) => {
            state.title = data;
        },
        updatesupinfo: (state, data) => {
            state.supinfo = data;
        }
    }
})

function _saveToken(data) {
    var date = new Date();
    date.setDate(date.getDate() + data.days);
    localStorage.setItem('token', `${data.token}#${date.toString()}`);
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