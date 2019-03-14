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
import store from "@/store/index";

import './plugins/eleme';
import '@/assets/styles/theme-variables.scss';

import '@babel/polyfill';

import Icon from 'vue-awesome/components/Icon';
import funcs from './utils/funcs';

Vue.component('v-icon', Icon);

Vue.use(funcs);

Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router,
  store: store,
}).$mount('#app')
