<template>
  <div class="band-video-wrapper">
    <div class="band-video" :class="{videohigh: playerOptions.poster}">
      <div class="wrapper">
        <div class="band-video-tit clearfix">
          <div class="band-video-txt fl">
            视频作品
            <span v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3">
              视频文件150M以内
            </span>
          </div>
          <div v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3" class="member-add">
            <el-upload
              action="http://upload-z1.qiniup.com/"
              accept="video/*"
              :file-list="fileList"
              :data="fileData"
              :show-file-list="isFileList"
              :on-success="handleVideoSuccess"
              :before-upload="beforeVideoUpload"
            >
              <h3>
                <i class="iconfont" :class="{'icon-plus': !playerOptions.poster, 'icon-tihuantupian': playerOptions.poster}"></i>
              </h3>
              <p>{{playerOptions.poster ? '替换' : '上传'}}视频作品</p>
            </el-upload>
          </div>
        </div>
        <div class="band-video-cont">
          <div v-if="playerOptions.poster" class="video-matro">
            <div class="video-matro-vsds">
              <video-player
                class="video-player-box"
                ref="videoPlayer"
                @play="onPlayerPlay($event)"
                @pause="onPlayerPause($event)"
                :options="playerOptions"
              >
              </video-player>
            </div>
            <div class="video-matro-info clearfix">
              <div class="fl">{{videoList[0].title}}</div>
              <div v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3" class="fr">
                {{Math.ceil(videoList[0].mediaSize / 1024 / 1024)}}/150
              </div>
              <div v-else class="fr laud">
                <div class="btn-group">
                  <i class="icon-btn watch-btn"></i><span>{{serverVideoList[0].mediaTotal.playCount}}</span>
                </div>
                <div class="btn-group">
                  <i class="icon-btn like-btn"></i><span>{{serverVideoList[0].mediaTotal.likeCount}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { qiniuUrl } from '../../../config/env';
  import axios from 'axios';

  export default {
    name: 'BandVideo',
    data () {
      return {
        isFileList: true,
        fileList: [],
        videoList: [],
        fileData: {
          token: '',
          key: ''
        },
        playerOptions: {
          sources: [],
          poster: '',
          width: '1280',
          height: '746'
        }
      };
    },
    created () {
      this.fileData.token = this.qiniuKey;
      if (this.serverVideoList.length > 0) {
        this.videoList = [{
          id: this.serverVideoList[0].id,
          title: this.serverVideoList[0].title,
          mediaUrl: this.serverVideoList[0].mediaUrl,
          mediaSize: this.serverVideoList[0].mediaSize,
          mediaTime: this.serverVideoList[0].mediaTime,
          mediaResolution: this.serverVideoList[0].mediaResolution
        }];
        this.playerOptions.poster = `${qiniuUrl}/${this.serverVideoList[0].mediaUrl}?vframe/jpg/offset/1/w/432/h/244`;
        this.playerOptions.sources = [{
          type: 'video/mp4',
          src: `${qiniuUrl}/${this.serverVideoList[0].mediaUrl}`
        }];
      }
    },
    props: ['serverVideoList'],
    computed: {
      ...mapGetters(['qiniuKey', 'userInfo', 'videoPlayState']),
      player () {
        return this.$refs.videoPlayer.player;
      }
    },
    watch: {
      videoPlayState (val) {
        console.log(val);
        if (val) {
          this.player.pause();
        }
      }
    },
    methods: {
      beforeVideoUpload (file) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        this.fileData.key = `${file.uid}.${type}`;
        const isLt2M = file.size / 1024 / 1024 < 150;
        if (!isLt2M) {
          this.$message.error(`上传视频不能大于150MB!`);
        }
        return isLt2M;
      },
      handleVideoSuccess (res, file) {
        this.playerOptions.sources = [{
          type: 'video/mp4',
          src: `${qiniuUrl}/${res.key}`
        }];
        const instance = axios.create({
          baseURL: qiniuUrl
        });
        instance.post(`/${res.key}?avinfo`).then(response => {
          this.playerOptions.poster = `${qiniuUrl}/${res.key}?vframe/jpg/offset/1/w/432/h/244`;
          if (this.serverVideoList.length > 0 && this.serverVideoList[0].id) {
            this.videoList = [{
              id: this.serverVideoList[0].id,
              title: file.name.slice(0, -4),
              mediaUrl: res.key,
              mediaSize: response.data.format.size,
              mediaTime: Math.round(response.data.format.duration),
              mediaResolution: `${response.data.streams[0].coded_width}*${response.data.streams[0].coded_height}`
            }];
          } else {
            this.videoList = [{
              title: file.name.slice(0, -4),
              mediaUrl: res.key,
              mediaSize: response.data.format.size,
              mediaTime: Math.round(response.data.format.duration),
              mediaResolution: `${response.data.streams[0].coded_width}*${response.data.streams[0].coded_height}`
            }];
          }
          this.$emit('getVideoInfo', this.videoList);
        });
        setTimeout(() => {
          this.fileList = [];
        }, 1000);
      },
      onPlayerPlay (player) {
        this.$store.dispatch('setAudioPlayState', true);
        this.$store.dispatch('setVideoPlayState', false);
      },
      onPlayerPause(player) {
        this.$store.dispatch('setAudioPlayState', false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .band-video-wrapper {
    .wrapper {
      position: relative;
      width: 1280px;
      margin: 0 auto;
    }
    .band-video {
      min-height: 420px;
      padding-top: 38px;
      background: #eeeeee;
      .video-matro {
        margin-top: 68px;
      }

      .video-matro-info {
        height: 100px;
        line-height: 100px;
        padding: 0 30px;
        background: #fff;

        div {
          font-size: 28px;
          color: #A3A3A3;
        }
      }
      &.videohigh {
        height: 810px;
      }
      .band-video-tit {
        position: relative;
        .band-video-txt {
          font-size: 40px;
          color: #1F1F1F;
          span {
            padding-left: 20px;
            font-size: 26px;
            color: #BB4342;
          }
        }
        .member-add {
          position: absolute;
          width: 236px;
          height: 60px;
          line-height: 60px;
          background: #fff;
          top: 0;
          right: 0;
          cursor: pointer;
          border-radius: 6px;
          text-align: center;
          h3 {
            display: inline-block;
            text-align: center;
            .icon-plus,
            .icon-tihuantupian {
              color: #828282;
              font-size: 22px;
            }
          }
          p {
            display: inline-block;
            padding-left: 10px;
            text-align: center;
            font-size: 24px;
            color: #828282;
          }
        }
      }
    }
    .icon-btn {
      display: inline-block;
      width: 40px;
      height: 40px;
      padding-right: 24px;
      vertical-align: middle;
      &.play-btn {
        background: url("../../../assets/images/works/icon/play_icon.png") center center no-repeat;
      }
      &.pause-btn {
        background: url("../../../assets/images/works/icon/pause_icon.png") center center no-repeat;
      }
      &.watch-btn {
        background: url("../../../assets/images/works/icon/eye_icon.png") center center no-repeat;
      }
      &.like-btn {
        background: url("../../../assets/images/works/icon/heart_icon.png") center center no-repeat;
      }
    }
    .btn-group {
      display: inline-block;
      color: #7A7A7A;
      font-size: 24px;
      align-items: center;
      span {
        vertical-align: middle;
      }
    }
  }
</style>
