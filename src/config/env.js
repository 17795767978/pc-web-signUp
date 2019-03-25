let baseUrl = '/';
let qiniuUrl = '';

if (process.env.NODE_ENV === 'development') {
  baseUrl = '/';
  qiniuUrl = 'http://phr3nastp.bkt.clouddn.com';
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://apitest.haoyuehuyu.com/';
  qiniuUrl = 'http://phr3nastp.bkt.clouddn.com';
}

export {
  baseUrl,
  qiniuUrl
};
