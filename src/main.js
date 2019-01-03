import Vue from 'vue'
import App from './App.vue'
import router from './router';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/styles/main.scss';
import 'vue-awesome/icons';
import "@/utils/ajax";
import "@/utils/funcs";

// import '@babel/polyfill';

import Icon from 'vue-awesome/components/Icon';
import funcs from './utils/funcs';
import { nextTick } from 'q';

Vue.component('v-icon', Icon);

Vue.use(funcs);

Vue.use(BootstrapVue);

Vue.config.productionTip = false

Vue.prototype.$nextTick = function (fn) {
  return nextTick(fn, this);// 设置nextTick回调函数的上下文环境是当前Vue实例
};

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
