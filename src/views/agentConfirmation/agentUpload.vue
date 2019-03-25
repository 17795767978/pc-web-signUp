<template>
  <div class="wuyang">
    <div class="upload-video-wrapper"
      :class="btnUpload.video.mediaUrl.length !== 0 ? 'active' : ''"
    >
      <div class="code">HAOYUEDUI</div>
      <div class="title-upload">
        <div class="video-left">
          <span class="video-word">视频作品</span>
          <span class="video-warning">视频文件150M以内</span>
        </div>
        <div class="video-right">
          <el-upload
            action="http://upload-z1.qiniup.com/"
            accept="video/mp4"
            :file-list="videoList"
            :data="fileData"
            :before-upload="beforeVideoUpload"
            :on-success="handleVideoSuccess"
            >
              <div class="video-area">
                <div class="video-plus">
                  <i v-if="btnUpload.video.mediaUrl.length === 0" class="iconfont icon-plus"></i>
                  <i v-else class="iconfont icon-tihuantupian"></i>
                  <span v-if="btnUpload.video.mediaUrl.length === 0" class="video-word">添加视频</span>
                  <span v-else class="video-word">修改视频</span>
                </div>
              </div>
          </el-upload>
        </div>
      </div>
      <div class="video-file" v-if="btnUpload.video.mediaUrl.length !== 0">
        <div class="video-play">
          <img src="../../assets/images/broker/loading.gif" class="res-img" width="100%">
          <p class="res-word">视频加载中。。。</p>
          <video
            class="res-video"
            controls
            :src="`${qiniuUrlForm}/${this.btnUpload.video.mediaUrl}`"
            >
          </video>
        </div>
        <div class="video-detail">
          <span class="detail-left">{{btnUpload.video.title}}</span>
          <span class="detail-right">{{videoSize}}/150</span>
        </div>
      </div>
    </div>
    <div
      class="upload-photo-wrapper"
      :class="albumList.length > 7 ? 'height-two' : 'height-one'"
      ref="uploadPhotoWrapper">
      <span class="photo-title">相册</span>
      <span class="photo-warning">上传照片（3~9张）</span>
      <div class="photo-wrapper">
        <el-upload
          class="upload-image"
          ref="elUpload"
          action="http://upload-z1.qiniup.com/"
          list-type="picture-card"
          :file-list="albumListTo"
          :data="fileData"
          :limit="9"
          :on-exceed="handlePhotosMax"
          :on-preview="handlePhotosCardPreview"
          :on-success="handlePhotosSuccess"
          :before-upload="beforePhotosUpload"
          :on-remove="handlePhotosRemove">
          <div class="item">
            <a href="javascript:;" class="add-btn-plus">
            <div class="icon-box">
              <i class="iconfont icon-plus"></i>
              <p class="words">添加照片</p>
            </div>
            </a>
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';
import { qiniuUrl } from '../../config/env';
import axios from 'axios';
export default {
  props: {
    agentData: Object
  },
  data () {
    return {
      fileData: {},
      albumList: [],
      videoList: [],
      status: Number,
      kobe: {},
      videoSize: '',
      btnUpload: {
        memberInfo: {
          id: Number
        },
        memberSubInfo: {
          matchId: 1,
          matchZoneId: Number
        },
        photos: [],
        video: {
          mediaUrl: '',
          title: '',
          mediaSize: '',
          mediaTime: '',
          mediaResolution: ''
        },
        snCode: ''
      },
      qiniuUrlForm: ''
    };
  },
  computed: {
    ...mapGetters(['qiniuKey', 'brokerInfo', 'userInfo']),
    albumListTo () {
      let arr = [];
      if (this.brokerInfo) {
        if (this.brokerInfo.album) {
          this.brokerInfo.album.forEach((photo, index) => {
            arr[index] = {
              name: photo.album_url,
              url: `${qiniuUrl}/${photo.album_url}`
            };
          });
        }
      }
      return arr;
    }
  },
  watch: {
    albumList () {
      if (this.albumList.length > 3 && this.albumList.length < 8) {
        this.$refs.uploadPhotoWrapper.style.marginBottom = `300px`;
        this.$refs.elUpload.$children[1].$el.style.display = 'inline-block';
      } else if (this.albumList.length === 8) {
        this.$refs.uploadPhotoWrapper.style.marginBottom = `600px`;
        this.$refs.elUpload.$children[1].$el.style.display = 'inline-block';
      } else if (this.albumList.length === 9) {
        this.$refs.elUpload.$children[1].$el.style.display = 'none';
      }
    }
  },
  created () {
    this.qiniuUrlForm = qiniuUrl;
    setTimeout(() => {
      if (this.brokerInfo.memberSubInfo.auditStatus === 3 || this.brokerInfo.memberSubInfo.auditStatus === 0) {
        if (Object.keys(this.brokerInfo.signUpVideoList).length !== 0) {
          this.btnUpload.video.mediaUrl = this.brokerInfo.signUpVideoList[0].media_url;
          this.btnUpload.video.title = this.brokerInfo.signUpVideoList[0].title;
          this.btnUpload.video.mediaSize = this.brokerInfo.signUpVideoList[0].media_size;
          this.btnUpload.video.mediaTime = this.brokerInfo.signUpVideoList[0].media_time;
          this.btnUpload.video.mediaResolution = this.brokerInfo.signUpVideoList[0].media_resolution;
        }
        if (this.brokerInfo) {
          this.brokerInfo.album.forEach((photo, index) => {
            this.albumList[index] = {
              name: photo.album_url,
              url: `${qiniuUrl}/${photo.album_url}`
            };
          });
        };
        if (this.btnUpload.video.mediaSize) {
            this.videoSize = Math.round(this.btnUpload.video.mediaSize / 1024 / 1024);
        };
      }
    }, 300);
  },
  methods: {
    handlePhotosRemove (file, albumList) {
      this.albumList = albumList;
    },
    handlePhotosCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforePhotosUpload (file) {
      this.fileData.key = file.uid + file.name;
      this.fileData.token = this.qiniuKey;
    },
    handlePhotosMax (files, fileList) {
      this.$message.warning('最多只能上传九张照片');
    },
    handlePhotosSuccess (response, file, albumList) {
      console.log(albumList);
      this.albumList = albumList;
    },
    handleVideoSuccess (response, file, fileList) {
      let parent = document.getElementsByClassName('upload-video-wrapper')[0];
      let items = parent.getElementsByClassName('el-upload-list__item');
      for (let key = 0; key < items.length; key++) {
        items[key].style.display = 'none';
      };
      this.btnUpload.video.mediaUrl = response.key;
      this.btnUpload.video.title = file.name.slice(0, -4);
      if (response) {
        axios.post(`${qiniuUrl}/${response.key}?avinfo`).then((res) => {
          this.btnUpload.video.mediaSize = res.data.format.size;
          this.btnUpload.video.mediaTime = Math.round(res.data.format.duration);
          this.btnUpload.video.mediaResolution = `${res.data.streams[0].width}*${res.data.streams[0].height}`;
        });
      }
    },
    beforeVideoUpload (file) {
      this.fileData.key = file.uid + file.name;
      this.fileData.token = this.qiniuKey;
      this.videoSize = Math.round(file.size / 1024 / 1024);
      if (this.videoSize > 150) {
        this.$message.error('上传视频不能超过150MB!');
        return false;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-video-wrapper {
  min-width: 1366px;
  height: 462px;
  background-color: #EEEEEE;
  position: relative;
  margin-bottom: 188px;
  .code {
    width: 570px;
    height: 54px;
    position: absolute;
    top: 163px;
    right: -130px;
    white-space: normal;
    font-size: 72px;
    font-weight: bolder;
    color: #CCCCCC;
    letter-spacing: 15px;
    font-style: italic;
    transform: rotate(90deg)
  }
  .title-upload {
    width: 72%;
    height: 60px;
    position: absolute;
    top: 38px;
    margin-left: -36.5%;
    left: 50%;
    display: flex;
    .video-left {
      width: 100%;
      .video-word {
        font-size: 40px;
        font-weight: bolder;
      }
      .video-warning {
        font-size: 26px;
        font-weight: 400;
        color: #BB4342;
        margin-left: 18px;
      }
    }
    .video-right {
      flex: 0 0 236px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border: transparent;
      outline: none;
      background-color: #FFFFFF;
      border-radius: 6px;
      .icon-plus {
        font-size: 24px;
        color: #7a7a7a;
      }
      .icon-tihuantupian {
        font-size: 24px;
        color: #7a7a7a;
      }
      .video-word {
        font-size: 24px;
        color: #7a7a7a;
        margin-left: 22px;
      }
    }
  }
  .video-file {
    width: 1280px;
    position: relative;
    height: 800px;
    top: 152px;
    left: 50%;
    margin-left: -640px;
    .video-play {
      width: 100%;
      height: 720px;
      position: absolute;
      background-color: #000;
      .res-img {
        width: 50px;
        height: 50px;
        position: absolute;
        left: 50%;
        top: 35%;
        margin-left: -25px;
        margin-top: -25px;
      }
      .res-word {
        text-align: center;
        font-size: 20px;
        color: #fff;
        margin-top: 310px;
      }
      .res-video {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 999;
        top: 0;
        left: 0;
      }
    }
    .video-detail {
      width: 100%;
      height: 86px;
      line-height: 86px;
      background-color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 30px;
      box-sizing: border-box;
      .detail-left {
        float: left;
        font-size: 28px;
        color: #A3A3A3;
      }
      .detail-right {
        float: right;
        font-size: 28px;
        color: #A3A3A3;
      }
    }
  }
}
.active {
  margin-bottom: 600px;
}
.upload-photo-wrapper {
  min-width: 1366px;
  height: 490px;
  background-color: #EEEEEE;
  position: relative;
  margin-bottom: 188px;
  padding: 44px 278px;
  box-sizing: border-box;
  .photo-title {
    font-size: 40px;
    font-weight: bolder;
    margin-right: 22px;
  }
  .photo-warning {
    font-size: 26px;
    color: #BB4342;
  }
  .photo-wrapper {
    width: 100%;
    margin-top: 30px;
  }
}
.height-one {
  margin-bottom: 300px;
}
.height-two {
  margin-bottom: 600px;
}
</style>

<style lang="scss">
  .upload-image .el-upload--picture-card {
    width: 300px !important;
    height: 300px !important;
    position: relative;
    .icon-plus {
      font-size: 60px;
      position: absolute;
      display: block;
      top: 30%;
      margin-top: -30px;
      left: 50%;
      margin-left: -30px;
    }
    .words {
      font-size: 22px;
      color: #7A7A7A;
      margin-top: 150px;
    }
  }
  .el-upload-list__item {
    width: 300px !important;
    height: 300px !important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 300px !important;
    height: 300px !important;
  }
  .el-upload-list__item-preview .el-icon-zoom-in{
    display: none;
  }
</style>
