const band = {
  state: {
    bandInfo: {},
    bandId: '',
    videoPlayState: false,
    audioPlayState: false
  },
  mutations: {
    SET_BANDINFO (state, info) {
      state.bandInfo = info;
    },
    SET_BANDID (state, id) {
      state.bandId = id;
    },
    SET_VIDEOPLAYSTATE (state, status) {
      state.videoPlayState = status;
    },
    SET_AUDIOPLAYSTATE (state, status) {
      state.audioPlayState = status;
    }
  },
  actions: {
    setBandInfo ({commit}, info) {
      commit('SET_BANDINFO', info);
    },
    setBandId ({commit}, id) {
      commit('SET_BANDID', id);
    },
    setVideoPlayState ({commit}, status) {
      commit('SET_VIDEOPLAYSTATE', status);
    },
    setAudioPlayState ({commit}, status) {
      commit('SET_AUDIOPLAYSTATE', status);
    }
  }
};

export default band;
