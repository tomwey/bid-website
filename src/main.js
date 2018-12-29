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
Vue.component('v-icon', Icon);

Vue.use(funcs);

Vue.use(BootstrapVue);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
