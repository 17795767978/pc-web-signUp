<template>
  <div>
    <div class="agent-band" v-if="Object.keys(brokerBandInfo).length === 0">
        <div class="title" @click="btn123">
          {{ band }}
          <span class="select">选填</span>
        </div>
        <div class="sn-connect">
          <span class="sn-word">乐队SN码</span>
          <input type="text" class="sn-input" placeholder="请输入8位SN码" v-model="snCode" />
          <button class="check-out" :class="snCode.length === 8 ? 'active' : ''" @click="getSncodeDetail">查看乐队</button>
        </div>
        <div class="config" v-if="Object.keys(bandInfoDetail).length === 0">
          <p class="intro">{{ intro }}</p>
        </div>
        <div class="band-wrapper" v-if="Object.keys(bandInfoDetail).length !== 0">
          <div class="band-logo">
            <img :src="`${qiniuUrlForm}/${bandInfoDetail.logo}`" class="res-img">
          </div>
          <div class="band-detail">
            <p class="band-name">{{bandInfoDetail.name}}</p>
            <p class="captain-name">乐队队长：{{bandInfoDetail.createName}}</p>
            <p class="band-area">{{bandInfoDetail.matchZoneName}}</p>
          </div>
          <div class="band-btn">
            <button class="connect-band" @click="confirmBtn">关联乐队</button>
            <span class="iconfont icon-shanchu1" @click="closeBandWrapper"></span>
          </div>
        </div>
        <div class="color"></div>
        <div class="confirm-btn" v-show="warningShow">
          <div class="confirm-detail">
            <p class="detail-title">关联乐队</p>
            <p class="detail-warning">点击确认后，不可再修改</p>
            <p class="detail-warning">关联乐队，是否确认? </p>
            <div class="btn-detail">
              <div class="btn-left" @click="closeWarning">取消</div>
              <div class="btn-right" @click="goToNext">确认</div>
            </div>
          </div>
        </div>
    </div>
    <div class="band-info" v-else>
      <div class="empty"></div>
      <div class="text-box">
        <h2 class="flex">
          <span class="text">{{brokerBandInfo.name}}</span>
        </h2>
        <h3 class="sub"><span class="sub-title">{{brokerBandInfo.highPartner}}</span> <span>{{brokerBandInfo.matchZoneName}}</span>
        </h3>
        <div class="type-box">
          <div class="tag-name">{{brokerBandInfo.tagFlag}}</div>
        </div>
        <div class="like-info" v-if="brokerBandInfo.bandLikes">
          <i class="icon like-icon"></i>
          {{brokerBandInfo.bandLikes.likeCount}}
        </div>
      </div>
      <div class="image-box">
        <img :src="`${qiniuUrlForm}/${brokerBandInfo.logo}`" height="300" width="300" />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { setSncode } from '../../server/index';
import { qiniuUrl } from '../../config/env';
import { mapGetters } from 'vuex';
export default {
  data () {
    return {
        band: '乐队合作',
        snCode: '',
        intro: '若您作为经纪人已经与已报名乐队达成合作，请向乐队队长索要乐队SN码，并填写至报名资料中；若您未能提前与乐队达成合作，可等待组委会为您匹配乐队；也可邮件至官方邮箱',
        bandShow: false,
        warningShow: false,
        bandInfoConfirm: false,
        bandInfoDetail: {},
        qiniuUrlForm: '',
        status: Number
    };
  },
  created () {
    this.qiniuUrlForm = qiniuUrl;
    console.log(this.brokerInfo);
  },
  computed: {
    ...mapGetters(['brokerBandInfo', 'brokerInfo'])
  },
  methods: {
    confirmBtn () {
      this.warningShow = true;
    },
    closeWarning () {
      this.warningShow = false;
    },
    getSncodeDetail () {
      if (this.snCode.length === 8) {
        setSncode(`agent/checkBandBySn/${this.snCode}`).then((res) => {
          if (res.code === 0) {
            this.bandInfoDetail = res.data.bandInfo;
          };
        });
      } else {
        this.$message.error('请输入正确的sn码');
      };
    },
    closeBandWrapper () {
      this.snCode = '';
      this.bandInfoDetail = '';
    },
    btn123 () {
      console.log(this.bandInfoDetail);
    },
    goToNext () {
      this.bandInfoConfirm = true;
      this.warningShow = false;
      if (this.bandInfoDetail) {
        this.$store.dispatch('setBrokerBandInfo', this.bandInfoDetail);
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.agent-band {
  min-width: 1366px;
  height: 364px;
  position: relative;
  background: #eee;
  padding: 0 280px;
  box-sizing: border-box;
  margin-bottom: 180px;
  .title {
    position: absolute;
    font-size: 40px;
    color: #1f1f1f;
    font-weight: bolder;
    left: 280px;
    top: 42px;
    .select {
      font-size: 26px;
      color: #9F9F9F;
      font-weight: 500;
    }
  }
  .color {
    width: 160px;
    height: 40px;
    background-color: #F4A45C;
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -20px;
  }
  .sn-connect {
    position: absolute;
    right: 290px;
    height: 60px;
    top: 22px;
    display: flex;
    line-height: 60px;
    .sn-word {
      color: #7A7A7A;
      font-size: 24px;
      flex: 0 0 120px;
    }
    .sn-input {
      width: 420px;
      height: 60px;
      background: #fff;
      outline: none;
      border-radius: 6px;
      border: 0;
      padding-left: 16px;
      box-sizing: border-box;
      font-size: 26px;
    }
    .check-out {
      width: 130px;
      height: 60px;
      background-color: #C9C9C9;
      color: #ffffff;
      font-size: 22px;
      text-align: center;
      line-height: 60px;
      border-radius: 6px;
      outline: none;
      border: 0;
      margin-left: 24px;
    }
    .active {
      background-color: #E87D82;
    }
  }
  .config {
    width: 1280px;
    height: 70px;
    position: absolute;
    top: 160px;
    left: 50%;
    margin-left: -640px;
    .intro {
      width: 100%;
      font-size: 24px;
      color: #7a7a7a;
      line-height: 1.2;
      text-indent: 2em;
    }
  }
  .band-wrapper {
    width: 1280px;
    height: 296px;
    background-color: #FFFFFF;
    position: absolute;
    left: 50%;
    margin-left: -640px;
    top: 150px;
    border-radius: 6px;
    display: flex;
    padding: 50px;
    box-sizing: border-box;
    .band-logo {
      flex: 0 0 200px;
      height: 200px;
      background-color: #eee;
      position: relative;
      .res-img {
        width: 100%;
        height: 100%;
      }
    }
    .band-detail {
      width: 100%;
      height: 200px;
      margin: 0 36px;
      .band-name {
        margin-top: 10px;
        font-size: 36px;
        color: #2F2C2C;
        margin-bottom: 26px;
        font-weight: bold;
      }
      .captain-name {
        font-size: 24px;
        color: #7A7A7A;
        margin-bottom: 26px;
      }
      .band-area {
        font-size: 24px;
        color: #7A7A7A;
      }
    }
    .band-btn {
      flex: 0 0 130px;
      position: relative;
      .connect-band {
        width: 100%;
        height: 60px;
        background-color: #E87D82;
        color: #ffffff;
        font-size: 22px;
        text-align: center;
        line-height: 60px;
        border-radius: 6px;
        outline: none;
        border: 0;
      }
      .icon-shanchu1 {
        position: absolute;
        font-size: 40px;
        background-color: #FFFFFF;
        color: #B1B1B1;
        bottom: 0;
        left: 50%;
        margin-left: -20px;
      }
    }
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
        margin-top: 20px;
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
}
.band-info {
  padding-right: 278px;
  box-sizing: border-box;
  background: url("../../assets/images/agent_confirmation/band_bg.png") top center no-repeat;
  height: 340px;
  margin-bottom: 134px;
  display: flex;
  .empty {
    width: 100%;
  }
  .text-box {
    flex: 0 0 300px;
    height: 260px;
    margin-top: 40px;
    margin-right: 280px;
    text-align: right;
    .flex {
      font-size: 36px;
      font-weight: bolder;
      margin-top: 36px;
    }
    .sub {
      margin-top: 36px;
      font-size: 24px;
      color: #7A7A7A;
      .sub-title {
        margin-right: 32px;
      }
    }
    .tag-name {
      margin-top: 36px;
      width: 88px;
      height: 36px;
      background-color: #fff;
      border: 2px solid #BB4342;
      border-radius: 6px;
      color: #BB4342;
      text-align: center;
      line-height: 36px;
      float: right;
    }
  }
}
</style>
