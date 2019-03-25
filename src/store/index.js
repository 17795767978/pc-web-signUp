import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import user from './modules/user';
import band from './modules/band';
import broker from './modules/broker';
import getters from './getters';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
});

const store = new Vuex.Store({
  modules: {
    user,
    band,
    broker
  },
  getters,
  plugins: [vuexLocal.plugin]
});

export default store;
