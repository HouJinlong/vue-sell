// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import router from './router/index.js';

import App from './App';
// ����ʵ��1px���ص�ȫ����ʽ
import './common/stylus/index.styl';

Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
});
