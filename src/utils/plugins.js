import Vue from 'vue';
import {
  Upload,
  Radio,
  Message,
  CheckboxButton,
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  RadioButton,
  Select,
  Option,
  Cascader,
  Dialog,
  Table
} from 'element-ui';

Vue.use(Upload);
Vue.use(Radio);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Dialog);
Vue.use(Table);

Vue.prototype.$message = Message;
