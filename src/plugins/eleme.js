import Vue from 'vue';
import {
    DatePicker, Loading, Message
} from 'element-ui';

Vue.use(DatePicker);
Vue.use(Loading);
// Vue.use(Message);

Vue.prototype.$message = Message;