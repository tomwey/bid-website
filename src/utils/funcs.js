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

            return md5(val + ":hn.bid._2018..32");
        }
    }
}