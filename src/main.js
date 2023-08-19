import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import "@/common/css/common.scss";
import "./theme/index.css"

import './common/js/flexible'
import {service} from "@/config";

import '@/common/js/drag.js' //引入拖曳组件

Vue.config.productionTip = false
Vue.prototype.axios = service;

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
