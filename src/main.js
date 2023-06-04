import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import "@/common/css/common.scss";

import './common/js/flexible'
import {service} from "@/config";

Vue.config.productionTip = false
Vue.prototype.axios = service;

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
