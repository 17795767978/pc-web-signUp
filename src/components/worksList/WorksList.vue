<template>
  <div class="works-bg">
    <div class="wrapper">
      <h2 class="title">
        <slot></slot>
      </h2>
      <ul class="music-list">
        <li v-for="(item, index) in music" :key="item.id">
          <a
            href="javascript:;"
            @click="playAudio(item,index)"
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
            <i class="icon-btn watch-btn"></i>{{item.mediaTotal.playCount}}
          </div>
          <div class="btn-group">
            <i class="icon-btn like-btn"></i>{{item.mediaTotal.likeCount}}
          </div>
        </li>
      </ul>
      <audio ref="audioPlayer" src=""></audio>
      <ul class="video-list">
        <li v-for="item in video" :key="item.id">
          <div class="video-box">
            <video
              class="video-player"
              :src="`${qiniuUrl}/${item.mediaUrl}`"
              controls="controls"
              controlsList="nodownload">
            </video>
          </div>
          <div class="info">
            <p>{{item.title}}</p>
            <div class="btn-group">
              <i class="icon-btn watch-btn"></i>{{item.mediaTotal.playCount}}
            </div>
            <div class="btn-group">
              <i class="icon-btn like-btn"></i>{{item.mediaTotal.likeCount}}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { qiniuUrl } from '../../config/env';

  export default {
    name: 'WorksList',
    data() {
      return {
        currentAudio: -1,
        qiniuUrl: qiniuUrl,
        music: [],
        video: []
      };
    },
    props: ['bandInfo'],
    created () {
      this.$nextTick(() => {
        this.music = this.bandInfo.signUpAudios;
        this.video = this.bandInfo.signUpVideos;
      });
    },
    methods: {
      playAudio(item, index) {
        const ele = this.$refs.audioPlayer;
        ele.setAttribute('src', `${qiniuUrl}/${item.mediaUrl}`);
        ele.load();
        ele.play();
        this.currentAudio = index;
      },
      pauseAudio(index) {
        const ele = this.$refs.audioPlayer;
        ele.pause();
        this.currentAudio = -1;
      }
    }
  };
</script>

<style lang="scss" scoped>

.wrapper {
  width: 1280px;
  margin: 0 auto;
}

.flex {
  display: flex;
}

.works-bg {
  background: url("../../assets/images/works/works_bg.png") top center no-repeat;
  min-height: 400px;
  padding-top: 225px;
}

.title {
  font-size: 60px;
  font-weight: 900;
  margin-bottom: 80px;
}

.music-list {
  display: block;
  li {
    height: 84px;
    padding-left: 46px;
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
      width: 40px;
      height: 40px;
      margin-right: 24px;
      display: block;
      &.play-btn {
        background: url("../../assets/images/works/icon/play_icon.png") center center no-repeat;
      }
      &.pause-btn {
        background: url("../../assets/images/works/icon/pause_icon.png") center center no-repeat;
      }
      &.watch-btn {
        background: url("../../assets/images/works/icon/eye_icon.png") center center no-repeat;
      }
      &.like-btn {
        background: url("../../assets/images/works/icon/heart_icon.png") center center no-repeat;
      }
    }
    .btn-group {
      width: 180px;
      color: #7A7A7A;
      font-size: 24px;
      display: flex;
      align-items: center;
    }
  }
}

.video-list {
  margin-bottom: 80px;
  li {
    height: 860px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
    .video-box {
      height: 746px;
      background-color: #eee;
      .video-player {
        width: 100%;
        height: 746px;
        background-color: #000;
      }
    }
    .info {
      display: flex;
      align-items: center;
      height: 114px;
      margin-left: 22px;
      font-size: 30px;
      color: #A3A3A3;
      p {
        flex: 1;
      }
      .icon-btn {
        width: 40px;
        height: 40px;
        margin-right: 24px;
        display: block;
        &.watch-btn {
          background: url("../../assets/images/works/icon/eye_icon.png") center center no-repeat;
        }
        &.like-btn {
          background: url("../../assets/images/works/icon/heart_icon.png") center center no-repeat;
        }
      }
      .btn-group {
        width: 180px;
        color: #7A7A7A;
        font-size: 24px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
