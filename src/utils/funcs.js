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

        Vue.prototype.$PreviewFile = function(fileUrl) {
            let div = document.createElement("div");
            div.style.position = "fixed";
            div.style.zIndex = "2005";
            div.style.left = "0";
            div.style.top = "0";
            div.style.bottom = "0";
            div.style.right = "0";
            div.style.margin = "0";
            div.style.width = "100%";
            div.style.height = "100%";
            div.style.background = "#fff";
            // div.style.minHeight = "100%";
            document.body.appendChild(div);

            let span = document.createElement("span");
            span.style.display = "inline-block";
            span.style.position = "absolute";
            span.style.zIndex = "100";
            div.appendChild(span);
            span.style.width = "68px";
            span.style.height = "40px";
            span.textContent = "关闭";
            span.style.top = "20px";
            span.style.right = "30px";
            span.style.border = "1px solid rgb(231,90,22)";
            span.style.textAlign = "center";
            span.style.lineHeight = "40px";
            span.style.verticalAlign = "middle";
            span.style.cursor = "pointer";
            span.style.color = "#fff";
            span.style.borderRadius = "20px";
            span.style.background = "rgb(231,90,22)";
            span.style.fontSize = "14px";
            span.onclick = () => {
                document.body.style.overflow = "auto";
                document.body.removeChild(div);
            };

            document.body.style.overflow = "hidden";

            let iframe = document.createElement("iframe");
            iframe.src =
                "http://erp20-mobiledoc.heneng.cn:16660/view/url?url=" + fileUrl;
            iframe.width = "100%";
            iframe.height = "100%";
            iframe.frameBorder = "0";
            div.appendChild(iframe);
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