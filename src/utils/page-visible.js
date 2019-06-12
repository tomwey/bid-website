import { MessageBox } from 'element-ui';
import router from '@/router';
import store from '@/store';

var state, visibilityChange;
if (typeof document.hidden !== "undefined") {
    // hidden = "hidden";
    visibilityChange = "visibilitychange";
    state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
    // hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
    state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
    // hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
    state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
    // hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
    state = "webkitVisibilityState";
}
// 添加监听器，在title里显示状态变化
document.addEventListener(visibilityChange, () => {
    if (document[state] == 'visible') {
        // r.meta.requireAuth
        if (router.currentRoute.meta && router.currentRoute.meta.requireAuth) {
            store.commit("getToken");
            if (!store.state.token) {
                MessageBox("您的登录信息已过期，请重新登录！", "登录过期提示", 'alert')
                    .then(() => {
                        router.push({ path: '/' });
                    })
                    .catch(() => {
                        router.push({ path: '/' });
                    });
            }
        }

    }
}, false);