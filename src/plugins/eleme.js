import Vue from 'vue';
import {
    DatePicker, Loading, Message, MessageBox, Table, TableColumn, Button, Form, FormItem,
    Input, Select, Option, RadioGroup, Radio, CheckboxGroup, Checkbox, Switch, TimeSelect,
    Upload, Progress, Dialog, Row, Col, Tag, Pagination, Breadcrumb, BreadcrumbItem, Steps, Step,
    Badge, Tabs, TabPane
} from 'element-ui';

Vue.use(DatePicker);
Vue.use(Loading);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Switch);
Vue.use(TimeSelect);
Vue.use(Upload);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Badge);
Vue.use(Tabs);
Vue.use(TabPane);
// Vue.use(Popover);
// Vue.use(DatePicker);
// Vue.use(Message);
// Vue.use(MessageBox);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;