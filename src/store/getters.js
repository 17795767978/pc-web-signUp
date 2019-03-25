const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  role: state => state.user.role,
  qiniuKey: state => state.user.qiniuKey,
  bandId: state => state.band.bandId,
  bandInfo: state => state.band.bandInfo,
  videoPlayState: state => state.band.videoPlayState,
  audioPlayState: state => state.band.audioPlayState,
  brokerInfo: state => state.broker.brokerInfo,
  brokerBandInfo: state => state.broker.brokerBandInfo
};

export default getters;
