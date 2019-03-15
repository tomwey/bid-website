import Vue from 'vue';
import {
    DatePicker, Loading, Message, MessageBox, Table, TableColumn, Button
} from 'element-ui';

Vue.use(DatePicker);
Vue.use(Loading);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
// Vue.use(Message);
// Vue.use(MessageBox);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;