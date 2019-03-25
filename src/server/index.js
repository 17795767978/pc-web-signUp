import api from './api';

// 获取验证码
export function getCaptcha(url, params) {
  return api.post(url, params);
}

// 登录
export function loginByMobile(url, params) {
  return api.post(url, params);
}

// 获取用户信息
export function getUserInfo(url, params) {
  return api.post(url, params);
}

// 获取七牛云key
export function getQiNiuCloudKey(url, params) {
  return api.post(url, params);
}

// 获取上传文件信息
export function getFileInfo (url, params) {
  return api.post(url, params);
}

// 获取视频信息
export function getVideoInfo (url, params) {
  return api.post(url, params);
}

// 提交乐队信息
export function submitBandInfo (url, params) {
  return api.post(url, params);
}

// 提交经纪人信息
export function submitAgentInfo (url, params) {
  return api.post(url, params);
}

// 获取乐队信息
export function getBandInfo (url, params) {
  return api.post(url, params);
}

// 获取经纪人信息
export function getBrokerInfo (url, params) {
  return api.post(url, params);
}

// 新增乐队成员
export function addBandMember (url, params) {
  return api.post(url, params);
}

// 修改多媒体数据
export function modifyMedia (url, params) {
  return api.post(url, params);
}

// 乐队确认报名
export function confirmBand (url, params) {
  return api.post(url, params);
}

// 经纪人确认报名
export function submitAgentConfirmation (url, params) {
  return api.post(url, params);
}

// 获取乐队风格
export function getBandTags (url, params) {
  return api.post(url, params);
}

// 通过snCode判断乐队
export function setSncode (url, params) {
  return api.post(url, params);
}

// 放弃报名
export function rejectSignUp (url, params) {
  return api.post(url, params);
}
