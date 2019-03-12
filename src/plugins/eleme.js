import Vue from 'vue';
import {
    DatePicker, Loading, Message, MessageBox,
} from 'element-ui';

Vue.use(DatePicker);
Vue.use(Loading);
// Vue.use(Message);
// Vue.use(MessageBox);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;