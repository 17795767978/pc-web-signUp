<template>
  <div class="band-music-wrapper">
    <div class="band-music">
      <span class="band-music-red"></span>
      <div class="wrapper">
        <div class="band-music-tit">
          音乐作品
          <span v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3">
            单曲小样（1~3首），（音频文件格式要求为: .wav 或 .mp3）
          </span>
        </div>
        <div v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3" class="band-music-info">
          <div class="band-music-item">
            <div class="band-music-name">
              <span>
                {{audioList[0] ? audioList[0]['title'] : ''}}
              </span>
              <span class="size">
                {{audioList[0] && audioList[0]['mediaSize'] ? Math.ceil(parseInt(audioList[0]['mediaSize']) / 1024 /1024) : 0}} / 10
              </span>
            </div>
            <div class="band-music-opear">
              <div
                @click="deleteAudio(0)"
                v-if="audioList[0] && audioList[0].title"
                class="opear-btn opear-delete">
                删除文件
              </div>
              <div class="opear-btn opear-select">
                <el-upload
                  class="audio-uploader"
                  action="http://upload-z1.qiniup.com/"
                  accept="audio/*"
                  :show-file-list="false"
                  :data="fileData"
                  :on-success="function(response, file) {
                      handleAudioSuccess(0, response, file);
                    }"
                  :before-upload="beforeAudioUpload"
                >
                  <span class="audio-uploader-text">选择文件</span>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="band-music-item">
            <div class="band-music-name">
              <span>
                {{audioList[1] ? audioList[1]['title'] : ''}}
              </span>
              <span class="size">
                {{audioList[1] && audioList[1]['mediaSize'] ? Math.ceil(parseInt(audioList[1]['mediaSize']) / 1024 /1024) : 0}} / 10
              </span>
            </div>
            <div class="band-music-opear">
              <div
                @click="deleteAudio(1)"
                v-if="audioList[1] && audioList[1].title"
                class="opear-btn opear-delete">
                删除文件
              </div>
              <div class="opear-btn opear-select">
                <el-upload
                  class="audio-uploader"
                  action="http://upload-z1.qiniup.com/"
                  accept="audio/*"
                  :show-file-list="false"
                  :data="fileData"
                  :on-success="function(response, file) {
                      handleAudioSuccess(1, response, file);
                    }"
                  :before-upload="beforeAudioUpload"
                >
                  <span class="audio-uploader-text">选择文件</span>
                </el-upload>
              </div>
            </div>
          </div>
          <div class="band-music-item">
            <div class="band-music-name">
              <span>
                {{audioList[2] ? audioList[2]['title'] : ''}}
              </span>
              <span class="size">
                {{audioList[2] && audioList[2]['mediaSize'] ? Math.ceil(parseInt(audioList[2]['mediaSize']) / 1024 / 1024) : 0}} / 10
              </span>
            </div>
            <div class="band-music-opear">
              <div
                @click="deleteAudio(2)"
                v-if="audioList[2] && audioList[2].title"
                class="opear-btn opear-delete">
                删除文件
              </div>
              <div class="opear-btn opear-select">
                <el-upload
                  class="audio-uploader"
                  action="http://upload-z1.qiniup.com/"
                  accept="audio/*"
                  :show-file-list="false"
                  :data="fileData"
                  :on-success="function(response, file) {
                      handleAudioSuccess(2, response, file);
                    }"
                  :before-upload="beforeAudioUpload"
                >
                  <span class="audio-uploader-text">选择文件</span>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="band-music-info">
          <ul class="music-list">
            <li v-for="(item, index) in bandInfo.signUpAudios" :key="item.id">
              <a
                href="javascript:;"
                @click="playAudio(item, index)"
                class="icon-btn play-btn"
                v-if="currentAudio !== index">
              </a>
              <a
                href="javascript:;"
                @click="pauseAudio(index)"
                class="icon-btn pause-btn"
                v-if="currentAudio === index">
              </a>
              <p>{{item.title}}</p>
              <div class="btn-group">
                <i class="icon-btn watch-btn"></i>
                <span>{{item.mediaTotal.playCount}}</span>
              </div>
              <div class="btn-group">
                <i class="icon-btn like-btn"></i>
                <span>{{item.mediaTotal.likeCount}}</span>
              </div>
            </li>
          </ul>
          <audio ref="audioPlayer" src=""></audio>
        </div>
        <div class="music-loading"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import axios from 'axios';
  import { Loading } from 'element-ui';
  import { qiniuUrl } from '../../../config/env';

  export default {
    name: 'BandAudio',
    data () {
      return {
        audioList: [{}, {}, {}],
        fileData: {
          token: '',
          key: ''
        },
        loadingInstance: null,
        currentAudio: -1
      };
    },
    created () {
      this.fileData.token = this.qiniuKey;
      if (this.bandInfo.signUpAudios.length > 0) {
        this.bandInfo.signUpAudios.forEach((item, index) => {
          this.$set(this.audioList, index, {
            id: item.id,
            title: item.title,
            mediaUrl: item.mediaUrl,
            mediaSize: item.mediaSize,
            mediaTime: item.mediaTime
          });
        });
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'qiniuKey', 'bandInfo', 'audioPlayState'])
    },
    watch: {
      audioPlayState (val) {
        if (val) {
          const ele = this.$refs.audioPlayer;
          ele.pause();
          this.currentAudio = -1;
        }
      }
    },
    methods: {
      beforeAudioUpload (file) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        this.fileData.key = `${file.uid}.${type}`;
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
          this.$message.error(`上传音频不能大于10MB!`);
        } else {
          this.loadingInstance = Loading.service({
            target: '.music-loading',
            text: '拼命加载中'
          });
        }
        return isLt2M;
      },
      handleAudioSuccess (index, res, file) {
        const instance = axios.create({
          baseURL: qiniuUrl
        });
        instance.post(`/${res.key}?avinfo`).then(response => {
          if (this.audioList[index] && this.audioList[index].id) {
            this.$set(this.audioList, index, {
              id: this.audioList[index].id,
              title: file.name.slice(0, -4),
              mediaUrl: res.key,
              mediaSize: response.data.format.size,
              mediaTime: Math.round(response.data.format.duration)
            });
          } else {
            this.$set(this.audioList, index, {
              title: file.name.slice(0, -4),
              mediaUrl: res.key,
              mediaSize: response.data.format.size,
              mediaTime: Math.round(response.data.format.duration)
            });
          }
          this.loadingInstance.close();
          this.$emit('getAudioInfo', this.audioList);
        });
      },
      deleteAudio (index) {
        this.$set(this.audioList, index, {});
        this.$emit('getAudioInfo', this.audioList);
        console.log(this.audioList);
      },
      playAudio(item, index) {
        const ele = this.$refs.audioPlayer;
        ele.setAttribute('src', `${qiniuUrl}/${item.mediaUrl}`);
        ele.load();
        ele.play();
        this.currentAudio = index;
        this.$store.dispatch('setVideoPlayState', true);
      },
      pauseAudio(index) {
        this.$store.dispatch('setVideoPlayState', false);
        const ele = this.$refs.audioPlayer;
        ele.pause();
        this.currentAudio = -1;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .band-music-wrapper {
    .wrapper {
      position: relative;
      width: 1280px;
      margin: 0 auto;
    }
    .band-music {
      position: relative;
      margin-top: 200px;
      margin-bottom: 100px;
      background: #EEEEEE;
      height: 468px;
      .music-loading {
        position: absolute;
        width: 100%;
        height: auto;
        left: 0;
        top: 300px;
      }
      .band-music-red {
        position: absolute;
        width: 40px;
        height: 160px;
        background: #BB4342;
        top: -80px;
        left: 100px;
      }
      .band-music-tit {
        padding-top: 40px;
        font-size: 40px;
        color: #1F1F1F;
        span {
          padding-left: 20px;
          font-size: 26px;
          color: #BB4342;
        }
      }
      .band-music-info {
        margin-top: 40px;
      }
      .band-music-item {
        display: flex;
        width: 1180px;
        height: 114px;
        padding: 30px;
        box-sizing: border-box;
        margin: 0 auto 30px;
        background: #fff;
        border-radius: 6px;
      }
      .band-music-name {
        flex: 7;
        height: 54px;
        line-height: 54px;
        margin-right: 30px;
        padding: 0 20px;
        background: #EEEEEE;
        border-radius: 4px;
        .size {
          float: right;
          font-size: 24px;
          color: #A3A3A3;
        }
      }
      .band-music-opear {
        display: flex;
        .opear-delete {
          margin-right: 30px;
        }
        .opear-btn {
          width: 120px;
          height: 54px;
          line-height: 54px;
          box-sizing: border-box;
          color: #E25958;
          border: 2px solid #E25958;
          border-radius: 6px;
          text-align: center;
          cursor: pointer;
        }
        .opear-select {
          border-color: #BFBFBF;
          color: #7A7A7A;
        }
        .audio-uploader-text {
          display: block;
          width: 120px;
        }
      }
    }
    .music-list {
      display: block;
      li {
        height: 84px;
        padding: 0 46px;
        display: flex;
        color: #7a7a7a;
        font-size: 24px;
        align-items: center;
        background: rgba(255, 255, 255, 1);
        border-radius: 6px;
        margin-bottom: 36px;
        p {
          flex: 1;
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
    }
  }
</style>
