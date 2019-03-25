<template>
  <div>
    <Header></Header>
    <div class="progress-container">
      <div class="progress">
        <img v-if="agentData.memberSubInfo.auditStatus===1" src="../../assets/images/broker/broker_progress5.png"
             alt="">
        <img v-if="agentData.memberSubInfo.auditStatus===2" src="../../assets/images/broker/broker_progress4.png"
             alt="">
        <img v-if="agentData.memberSubInfo.auditStatus===3 || agentData.memberSubInfo.auditStatus===0" src="../../assets/images/broker/broker_progress3.png"
             alt="">
      </div>
    </div>
    <div class="agent-confirmation">
      <div class="band-agent" v-if="headImageUrl">
        <div class="band-agent-bg"></div>
        <div class="wrapper">
          <div class="image-bg">
            <img :src="headImageUrl" />
          </div>
          <div class="flex">
            <div class="image-head">
              <img :src="headImageUrl" />
            </div>
            <div class="text-info" v-if="agentData.memberSubInfo">
              <div class="flex">
                <h2 class="flex-item">{{agentData.memberSubInfo.name}}<span>年龄:{{agentData.memberSubInfo.age}}岁</span>
                </h2>
                <button
                  v-if="agentData.memberSubInfo.auditStatus===0"
                  class="orange-btn"
                  @click="checkDetail"
                  >
                  查看报名流程
                </button>
                <router-link
                  v-if="agentData.memberSubInfo.auditStatus===3"
                  to="agent-signUp" tag="button" class="orange-btn">
                  重新报名
                </router-link>
              </div>
              <h3 class="sub-title" style="color: #838383;">{{signStatus}}</h3>
              <h3 v-if="agentData.memberSubInfo.highUnit">{{agentData.memberSubInfo.highUnit}}
                <span v-if="agentData.memberSubInfo.weight">{{agentData.memberSubInfo.weight}}cm</span>
                <span v-if="agentData.memberSubInfo.height">{{agentData.memberSubInfo.height}}Kg</span>
              </h3>
              <p :title="agentData.memberSubInfo.introduction">
                {{agentData.memberSubInfo.introduction | textOverflow(125)}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <sn-connect v-if="this.userInfo.auditStatus === 0 || this.userInfo.auditStatus === 3"/>
      <agent-upload v-if="this.userInfo.auditStatus === 0 || this.userInfo.auditStatus === 3" :agentData="agentData" ref="uploadDetail"/>
      <div class="band-info" v-if="agentData.bandInfo">
        <div class="wrapper flex">
          <div class="text-box">
            <h2 class="flex">
              <span class="text">{{agentData.bandInfo.name}}</span>
            </h2>
            <h3><span class="sub-title">{{agentData.bandInfo.highPartner}}</span> <span>{{agentData.bandInfo.matchZoneName}}</span>
            </h3>
            <div class="type-box">
              <div class="tag-name" v-if="bandTagFlag">{{bandTagFlag}}</div>
            </div>
            <div class="like-info" v-if="agentData.bandLikes">
              <i class="icon like-icon"></i>
              {{agentData.bandLikes.likeCount}}
            </div>
          </div>
          <div class="image-box">
            <img :src="bandLogoImg" height="300" width="300"/>
          </div>
        </div>
      </div>
      <div class="video-works" v-if="(agentData.memberSubInfo.auditStatus === 1 || agentData.memberSubInfo.auditStatus === 2) && videoPlayUrl">
        <div class="wrapper">
          <h2 class="title">视频作品</h2>
          <div class="video-box">
            <video class="video-player" :src="videoPlayUrl" controls="controls"
                   controlsList="nodownload"></video>
          </div>
          <div class="info" v-if="agentData.signUpVideoList[0]">
            <p>{{agentData.signUpVideoList[0].title}}</p>
            <div class="btn-group">
              <a href="javascript:;" class="icon-btn watch-btn"></a>{{agentData.signUpVideoList[0].play_count}}
            </div>
            <div class="btn-group">
              <a href="javascript:;" class="icon-btn like-btn"></a>{{agentData.signUpVideoList[0].is_like}}
            </div>
          </div>
        </div>
      </div>
      <div class="gallery" v-if="(agentData.memberSubInfo.auditStatus === 1 || agentData.memberSubInfo.auditStatus === 2) && albumList.length">
        <div class="wrapper">
          <h2 class="title">相册</h2>
          <ul class="gallery-list">
            <li v-for="(item,index) in albumList" :key="index" :style="{backgroundImage:'url(' + item + ')'}"></li>
          </ul>
        </div>
      </div>
      <div class="btn-box"
        :class="agentSignUpDataTo === true ? 'active' : ''"
        v-if="agentData.memberSubInfo.auditStatus===0 || agentData.memberSubInfo.auditStatus===3">
        <span v-if="agentSignUpDataTo === false" class="btn-words">无视频作品，暂时无法报名</span>
        <span v-else class="btn-words">报名信息完整，可以报名</span>
        <button
          @click="submit"
          :class="agentSignUpDataTo === true ? 'red' : ''"
          class="block-btn"
          >
          <span v-if="signUpSuccess === false">先保存，稍后报名</span>
          <span v-else>确认报名</span>
        </button>
        <span class="btn-reject" @click="rejectBtn">放弃报名</span>
      </div>
    </div>
    <Footer></Footer>
    <div class="confirm-btn" v-show="confirmSuccess">
      <div class="confirm-detail">
        <p class="detail-title">确认报名</p>
        <p class="detail-warning">请再次确认所有报名信息</p>
        <p class="detail-warning">完整正确，并符合报名要求，否则客服</p>
        <p class="detail-warning">小姐姐审核不通过是会退回报名的！</p>
        <div class="btn-detail">
          <div class="btn-left" @click="closeConfirm">取消</div>
          <div class="btn-right" @click="goToNext">确认</div>
        </div>
      </div>
    </div>
    <div class="confirm-btn" v-show="confirmReject">
      <div class="confirm-detail">
        <p class="detail-title">放弃报名</p>
        <p class="detail-warning" style="font-weight:bold">放弃报名将不再保存您</p>
        <p class="detail-warning" style="font-weight:bold">以上传的报名资料，是否确认？</p>
        <div class="btn-detail">
          <div class="btn-left" @click="closeReject">再想想</div>
          <div class="btn-right" style="color:#BB4342" @click="goToHome">确认</div>
        </div>
      </div>
    </div>
    <div class="agent-detail-intro" v-show="agentDetailIntro">
      <div class="detail"></div>
      <button class="close-detail" @click="agentDetailIntroClose"></button>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {getBrokerInfo, submitAgentConfirmation, submitAgentInfo, rejectSignUp} from '../../server/index';
import {mapGetters, mapActions} from 'vuex';
import { qiniuUrl } from '../../config/env';
import snConnect from './snConnect';
import agentUpload from './agentUpload';

export default {
  name: 'index',
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5');
  },
  components: {
    Header,
    Footer,
    snConnect,
    agentUpload
  },
  mounted() {
    getBrokerInfo(`member/agentDetailForEdit/${this.userInfo.id}`, {}).then(res => {
      if (res.code === 0) {
        this.agentData = res.data;
        this.$store.dispatch('setBrokerInfo', this.agentData);
        this.$store.dispatch('GetUserInfo').then(res => {
        });
        if (this.agentData.memberSubInfo.auditReason && this.agentData.memberSubInfo.auditStatus === 3) {
          this.$message.error(`您的报名被驳回，请重新修改！驳回原因:${this.agentData.memberSubInfo.auditReason}`);
          this.$store.dispatch('setBrokerBandInfo', '');
        }
      }
      window.scroll(0, 0);
    });
  },
  updated () {
    this.agentColorChange = this.$refs.uploadDetail;
    console.log(this.agentColorChange);
  },
  computed: {
    ...mapGetters(['userInfo', 'brokerBandInfo', 'brokerInfo']),
    ...mapActions(['setBrokerInfo']),
    // 头像
    headImageUrl() {
      if (this.agentData.memberSubInfo.headImage) {
        return qiniuUrl + '/' + this.agentData.memberSubInfo.headImage;
      }
    },
    // 视频路径拼接
    videoPlayUrl() {
      if (this.agentData.signUpVideoList[0]) {
        return qiniuUrl + '/' + this.agentData.signUpVideoList[0].media_url;
      }
    },
    // 相册列表
    albumList() {
      var arr = [];
      this.agentData.album.forEach((v, i) => {
        let url = qiniuUrl + '/' + v.album_url;
        arr.push(url);
      });
      return arr;
    },
    // 报名状态
    signStatus() {
      let status = 0;
      if (this.agentData.memberSubInfo) {
        status = this.agentData.memberSubInfo.auditStatus;
        if (status === 0) {
          return '正在报名';
        } else if (status === 1) {
          return '正在审核';
        } else if (status === 2) {
          return '报名成功';
        } else if (status === 3) {
          return '驳回';
        }
      }
    },
    bandTagFlag() {
      if (this.agentData.bandInfo.tagFlag) {
        let arr = this.agentData.bandInfo.tagFlag.split(',');
        return arr[0];
      }
    },
    bandLogoImg() {
      if (this.agentData.bandInfo.logo) {
        return qiniuUrl + '/' + this.agentData.bandInfo.logo;
      }
    },
    agentSignUpDataTo () {
      if (this.agentColorChange) {
        if (this.agentColorChange.btnUpload && this.agentColorChange.albumList) {
          if (this.agentColorChange.btnUpload.video.mediaResolution !== '' && Object.keys(this.agentColorChange.albumList).length >= 3) {
            return true;
          } else {
            return false;
          }
        };
      };
    }
  },
  data() {
    return {
      signUpSuccess: false,
      confirmSuccess: false,
      confirmReject: false,
      agentDetailIntro: false,
      agentColorChange: {},
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        loop: true,
        loopFillGroupWithBlank: true,
        navigation: {
          nextEl: '.member-btn .left',
          prevEl: '.member-btn .right'
        }
      },
      agentData: {
        album: [],
        bandInfo: {},
        memberInfo: {},
        memberLikes: {},
        memberSubInfo: {},
        signUpVideoList: []
      }
    };
  },
  filters: {
    textOverflow(value, num) {
      if (!num) {
        num = 125;
      }
      if (value.length > num) {
        var str = value.substring(0, num);
        str += '...';
        return str;
      }
      return value;
    }
  },
  methods: {
    checkDetail () {
      this.agentDetailIntro = true;
    },
    agentDetailIntroClose () {
      this.agentDetailIntro = false;
    },
    rejectBtn () {
      this.confirmReject = true;
    },
    closeConfirm () {
      this.confirmSuccess = false;
    },
    closeReject () {
      this.confirmReject = false;
    },
    rejectToConfirm () {
      this.confirmReject = true;
    },
    submit() {
      let agentSignUpData = this.$refs.uploadDetail.btnUpload;
      let photosList = this.$refs.uploadDetail.albumList;
      agentSignUpData.memberSubInfo.matchZoneId = this.agentData.memberSubInfo.matchZoneId;
      agentSignUpData.memberInfo.id = this.userInfo.id;
      if (agentSignUpData.photos.length === 0) {
        for (let item in photosList) {
          if (photosList[item].response) {
            agentSignUpData.photos.push(photosList[item].response.key);
          } else {
            agentSignUpData.photos.push(photosList[item].name);
          };
        };
      };
      if (this.brokerBandInfo.snCode) {
        agentSignUpData.snCode = this.brokerBandInfo.snCode;
      };
      if (agentSignUpData.photos.length >= 3 &&
        agentSignUpData.video.mediaResolution !== '' &&
        agentSignUpData.video.mediaSize !== '' &&
        agentSignUpData.video.mediaTime !== '') {
        submitAgentInfo('/agent/signup', agentSignUpData).then(res => {
          if (res.code === 0) {
            this.signUpSuccess = true;
            this.confirmSuccess = true;
          }
        });
      }
    },
    goToNext () {
      submitAgentConfirmation(`/agent/confirmAgentSignUp/${this.userInfo.id}`, {}).then(res => {
        if (res.code === 0) {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'success',
            duration: 2000
          });
          window.location.reload();
        }
      });
    },
    goToHome () {
      rejectSignUp('/agent/clearSignup').then((res) => {
        if (res.code === 0) {
          this.$store.dispatch('setBrokerBandInfo', '');
          this.$store.dispatch('setBandInfo', '');
          this.$store.dispatch('GetUserInfo', '');
          this.$router.push({
            path: '/'
          });
          setTimeout(() => {
            window.location.reload();
          }, 500);
        };
      });
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
  .flex-item {
    flex: 1;
  }
}

.orange-btn {
  color: #fff;
  font-size: 18px;
  padding: 0 15px;
  height: 40px;
  background: transparent;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  border: 1px solid rgba(244, 164, 92, 1);
  color: rgba(244, 164, 92, 1);
  outline: none;
  cursor: pointer;
  &:active {
    border: none;
  }
}

.image-banner {
  width: 1280px;
  height: 820px;
  margin: 0 auto;
  -webkit-background-size: cover;
  background-size: cover;
  background-position: center center;
}

.band-info {
  background: url("../../assets/images/agent_confirmation/band_bg.png") top center no-repeat;
  height: 360px;
  margin-bottom: 80px;
  .image-box {
    width: 300px;
    height: 300px;
    background-color: #fff;
    overflow: hidden;
    img {
      width: 300px;
    }
  }
  .text-box {
    margin-right: 240px;
    text-align: right;
    margin-top: 80px;
    flex: 1;
    h2 {
      color: RGBA(31, 31, 31, 1);
      font-size: 36px;
      margin-bottom: 15px;
      .text {
        flex: 1;
      }
    }
    h3 {
      color: RGBA(122, 122, 122, 1);
      font-size: 24px;
      margin-bottom: 12px;
    }
    .sub-title, .sign-state {
      width: 184px;
      margin-right: 30px;
    }
    .type-box {
      margin-bottom: 25px;
      .tag-name {
        border: 1px solid rgb(187, 67, 66);
        border-radius: 6px;
        background-color: rgb(255, 255, 255);
        height: 34px;
        line-height: 34px;
        padding: 0 15px;
        display: inline-block;
        font-size: 20px;
        color: rgb(187, 67, 66);
      }
    }
    .like-info {
      color: rgb(187, 67, 66);
      font-size: 24px;
      i.icon {
        width: 30px;
        height: 30px;
        display: inline-block;
        &.like-icon {
          background: url("../../assets/images/agent_confirmation/icon/like_icon.png") top center no-repeat;
        }
      }
    }
  }
}

.band-agent-bg {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1;
  background: url("../../assets/images/agent_confirmation/agent_bg.png") top center no-repeat;
}

.band-agent {
  position: relative;
  padding-bottom: 158px;
  margin-top: 20px;
  .wrapper {
    position: relative;
  }
  .image-bg {
    z-index: 0;
    position: absolute;
    margin-top: -20px;
    margin-left: -5px;
    width: 300px;
    height: 300px;
    overflow: hidden;
    background-color: #fff;
    img {
      opacity: .5;
      width: 100%;
    }
  }
  .image-head {
    width: 200px;
    height: 200px;
    margin-left: 198px;
    margin-top: 32px;
    overflow: hidden;
    position: relative;
    z-index: 2;
    img {
      width: 100%;
    }
  }
  .text-info {
    margin-left: 40px;
    position: relative;
    z-index: 2;
    margin-top: 32px;
    height: 200px;
    flex: 1;
    h2 {
      color: #BB4342;
      font-size: 36px;
      margin-bottom: 15px;
      span {
        margin-left: 25px;
        font-size: 24px;
      }
    }
    h3 {
      color: #BB4342;
      font-size: 22px;
      margin-bottom: 19px;
    }
    p {
      font-size: 20px;
      color: #7a7a7a;
      line-height: 1.2;
      height: 72px;
      overflow: hidden;
    }
  }
}

.video-works {
  h2.title {
    font-size: 24px;
    color: #7a7a7a;
    margin-bottom: 25px;
  }
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
    background-color: #ffffff;
    display: flex;
    align-items: center;
    height: 114px;
    padding-left: 22px;
    font-size: 30px;
    margin-bottom: 40px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
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

.gallery {
  margin-bottom: 80px;
  h2.title {
    font-size: 24px;
    color: #7a7a7a;
    margin-bottom: 25px;
  }
  .gallery-list {
    overflow: hidden;
    li {
      width: 300px;
      height: 300px;
      overflow: hidden;
      float: left;
      margin-right: 26px;
      margin-bottom: 26px;
      background-size: cover;
      background-position: center center;
      &:nth-child(4n) {
        margin-right: 0;
      }
      img {
        width: 100%;
      }
    }
  }
}

.progress-container {
  padding: 46px 0 37px;
  background: #fff;
  box-shadow: 0 4px 4px #eee;
  margin-bottom: 60px;
  .progress {
    width: 1119px;
    margin: 0 auto;
  }
}

.btn-box {
  min-width: 1366px;
  height: 160px;
  line-height: 160px;
  padding: 0 500px;
  box-sizing: border-box;
  background: #F4AF75;
  position: relative;
}

.active {
  background-color: #B03332;
}

.block-btn {
  width: 260px;
  height: 70px;
  color: #F4AF75;
  font-size: 24px;
  background: #ffffff;
  border: transparent;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
  border-radius: 6px;
  outline: none;
  position: absolute;
  top: 50%;
  margin-top: -35px;
  right: 700px;
}
.red {
  color: #B03332;
}
.btn-words {
  font-size: 30px;
  color: #ffffff;
}
.btn-reject {
  font-size: 30px;
  color: #ffffff;
  float: right;
  text-decoration: underline;
  cursor: pointer;
}
.confirm-btn {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  .confirm-detail {
    width: 450px;
    height: 260px;
    position: relative;
    left: 50%;
    margin-left: -225px;
    top: 50%;
    margin-top: -130px;
    background-color: #ffffff;
    padding-top: 20px;
    box-sizing: border-box;
    border-radius: 6px;
    .detail-title {
      width: 100%;
      font-size: 30px;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }
    .detail-warning {
      width: 100%;
      font-size: 20px;
      text-align: center;
      margin-top: 10px;
      color: #7a7a7a;
    }
    .btn-detail {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      border-top: 1px solid #eee;
      .btn-left {
        width: 50%;
        border-right: 1px solid #eee;
        box-sizing: border-box;
        line-height: 80px;
        text-align: center;
        font-size: 24px;
        cursor: pointer;
      }
      .btn-right {
        width: 50%;
        border-right: 1px solid #eee;
        box-sizing: border-box;
        line-height: 80px;
        text-align: center;
        font-size: 24px;
        cursor: pointer;
      }
    }
  }
}
.agent-detail-intro {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  .detail {
    width: 900px;
    height: 760px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -400px;
    margin-top: -400px;
    background-image: url('../../assets/images/broker/agent_detail.png');
    background-size: 100% 100%;
  }
  .close-detail {
    width: 150px;
    height: 50px;
    position: absolute;
    bottom: 100px;
    left: 50%;
    margin-left: -75px;
    border: transparent;
    background-image: url('../../assets/images/broker/btn_back.png');
    background-size: 100% 100%;
    border-radius: 12px;
  }
}
</style>
