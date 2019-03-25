// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import NProgress from 'nprogress';
import VideoPlayer from 'vue-video-player';
import Toasted from 'vue-toasted';
import './utils/validate';
import './utils/plugins';
import { getToken } from './utils/auth';
import { getBandInfo } from './server/index';
import 'nprogress/nprogress.css';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/sass/index.scss';
import './assets/iconfont/iconfont.css';
import 'video.js/dist/video-js.css';

Vue.config.productionTip = false;

NProgress.configure({ showSpinner: false });

Vue.use(Toasted, {
  position: 'top-center',
  duration: 3000
});

Vue.use(VideoPlayer);

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (!store.getters.userInfo) {
      store.dispatch('GetUserInfo').then(res => {
        getBandInfo(`band/detailByUserId/${store.getters.userInfo.id}`, {
          memberId: store.getters.userInfo.id
        }).then(resultBand => {
          store.dispatch('setBandInfo', resultBand.data);
          if (resultBand.data.basicInfo && resultBand.data.basicInfo.id) {
            store.dispatch('setBandId', resultBand.data.basicInfo.id);
          }
          next({ ...to });
        });
      });
    } else {
      next();
    }
  } else {
    if (to.path !== '/home') {
      next('/home');
    } else {
      next();
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
