<template>
  <div class="band-info-wrapper">
    <div class="image-banner">
      <img :src="`${qiniuImageUrl}/${bandInfo.basicInfo.imagePicture}`" alt="">
    </div>
    <div class="band-info">
      <div class="wrapper flex">
        <div class="image-box">
          <img :src="`${qiniuImageUrl}/${bandInfo.basicInfo.logo}`" height="300" width="300"/>
        </div>
        <div class="text-box">
          <h2 class="flex">
            <span class="text">{{bandInfo.basicInfo.name}}</span>
            <button
              @click="processState = true"
              v-if="bandInfo.basicInfo.auditStatus === 0"
              class="orange-btn"
            >
              查看报名流程
            </button>
            <button
              @click="onReEnroll"
              v-if="bandInfo.basicInfo.auditStatus === 3"
              class="orange-btn">
              重新报名
            </button>
          </h2>
          <h3 class="flex">
            <span class="sub-title">{{bandInfo.basicInfo.highPartner}}</span>
            <span>{{bandInfo.basicInfo.matchZoneName}}</span>
          </h3>
          <div class="state flex">
            <div class="sign-state">
              <span v-if="bandInfo.basicInfo.auditStatus === 2">报名成功</span>
              <span v-else-if="bandInfo.basicInfo.auditStatus === 3">报名驳回</span>
              <span v-else>正在报名...</span>
            </div>
            <div class="sn-code">SN码：<span>{{bandInfo.basicInfo.snCode}}</span></div>
          </div>
          <p>
            {{bandInfo.basicInfo.introduction | textOverflow(125)}}
          </p>
        </div>
      </div>
    </div>
    <div class="agent-detail-intro" v-show="processState">
      <div class="detail"></div>
      <button class="close-detail" @click="processState = false"></button>
    </div>
  </div>
</template>

<script>
  import { qiniuUrl } from '../../../config/env';
  import { mapGetters } from 'vuex';
  import textOverflow from '../../../mixin/textOverflow';

  export default {
    name: 'BandInfo',
    data () {
      return {
        qiniuImageUrl: '',
        processState: false
      };
    },
    created () {
      this.qiniuImageUrl = qiniuUrl;
    },
    computed: {
      ...mapGetters(['userInfo', 'bandInfo'])
    },
    mixins: [textOverflow],
    methods: {
      onReEnroll () {
        this.$router.push({
          path: '/band-signUp',
          query: {
            id: this.bandInfo.basicInfo.id
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .band-info-wrapper {
    .wrapper {
      position: relative;
      width: 1280px;
      margin: 0 auto;
    }

    .image-banner {
      width: 1280px;
      margin: 0 auto;
      text-align: center;

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }

    .flex {
      display: flex;
    }

    .band-info {
      background: url("../../../assets/images/band_confirmation/band_bg.png") top center no-repeat;
      height: 360px;
      margin-bottom: 132px;
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
        margin-left: 140px;
        margin-top: 22px;
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
        }
        .state {
          color: #A3A3A3;
          font-size: 20px;
          margin-bottom: 19px;

          span {
            color: #F4A45C;
          }
        }
        p {
          height: 125px;
          line-height: 30px;
          color: #7A7A7A;
          font-size: 20px;
        }
      }
      .orange-btn {
        font-size: 18px;
        padding: 0 15px;
        height: 40px;
        border-radius: 20px;
        background: #EEE;
        border: 1px solid #F4A45C;
        color: #F4A45C;
        outline: none;
        cursor: pointer;
        &:active {
          border: none;
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
        background-image: url('../../../assets/images/band-detail.png');
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
        background-image: url('../../../assets/images/broker/btn_back.png');
        background-size: 100% 100%;
        border-radius: 12px;
      }
    }
  }
</style>
