import {
  loginByMobile,
  getUserInfo,
  getQiNiuCloudKey
} from '../../server';

import {
  getToken,
  setToken,
  removeToken
} from '../../utils/auth';

const user = {
  state: {
    role: '',
    token: getToken(),
    qiniuKey: '',
    userInfo: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_ROLE: (state, role) => {
      state.role = role;
    },
    SET_QINIUKEY: (state, key) => {
      state.qiniuKey = key;
    }
  },
  actions: {
    // 手机号登录
    LoginByMobile({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByMobile('member/telphone/login', {
          phone: userInfo.mobile,
          code: userInfo.code
        }).then(res => {
          if (res.code === 0) {
            commit('SET_TOKEN', res.data.token.token);
            setToken(res.data.token.token);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo('member/getUserInfoByToken').then(res => {
          commit('SET_USERINFO', res.data);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit }) {
      commit('SET_TOKEN', '');
      commit('SET_USERINFO', '');
      removeToken();
    },
    setRole ({commit}, role) {
      commit('SET_ROLE', role);
    },
    setQiniuKey ({commit}) {
      return new Promise((resolve, reject) => {
        getQiNiuCloudKey('upload/token').then(res => {
          commit('SET_QINIUKEY', res.data);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default user;
