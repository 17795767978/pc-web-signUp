import api from './api';

// 获取上传文件信息
export function getBandInfo (url, params) {
  return api.post(url, params);
}
