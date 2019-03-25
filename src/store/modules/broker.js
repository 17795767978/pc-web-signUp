const broker = {
  state: {
    brokerInfo: {},
    brokerBandInfo: {}
  },
  mutations: {
    SET_BROKERINFO (state, info) {
      state.brokerInfo = info;
    },
    SET_BROKERBANDINFO (state, info) {
      state.brokerBandInfo = info;
    }
  },
  actions: {
    setBrokerInfo ({commit}, info) {
      commit('SET_BROKERINFO', info);
    },
    setBrokerBandInfo ({commit}, info) {
      commit('SET_BROKERBANDINFO', info);
    }
  }
};

export default broker;
