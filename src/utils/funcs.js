import md5 from "js-md5";

export default {
    install(Vue, options) {
        // console.log(options)
        Vue.prototype.isPhone = function (phone) {
            if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(phone))) {
                return false;
            } else {
                return true;
            }
        };

        Vue.prototype.isEmptyObject = function (val) {
            if (!val) {
                return true;
            } else {
                return false;
            }
        };

        Vue.prototype.isEmptyString = function (val) {
            if (!val || val.length === 0) {
                return true;
            } else {
                return false;
            }
        };

        Vue.prototype.GetPassword = function (val) {
            if (!val) return null;

            return md5(val + "@H^N");//md5(val + ":hn.bid._2018..32");
        };

        Vue.prototype.$getToken = function () {
            // let date = new Date(localStorage.getItem('expire'));
            let tokenString = localStorage.getItem('token');
            if (!tokenString) {
                return null;
            }

            let arr = tokenString.split('#');
            let token = arr[0];
            let time = arr[1];

            time = new Date(time);
            if (_date1SmallerDate2(time, new Date())) {
                localStorage.removeItem('token');
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

    }
}