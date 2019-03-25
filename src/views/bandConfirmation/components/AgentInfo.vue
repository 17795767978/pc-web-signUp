<template>
  <div class="agent-info-wrapper">
    <div v-if="bandInfo.basicInfo.agent" class="band-agent">
      <div class="band-agent-bg"></div>
      <div class="wrapper">
        <div class="image-bg">
          <img :src="`${qiniuImageUrl}/${bandInfo.agent.headImage}`"/>
        </div>
        <div class="flex">
          <div class="image-head">
            <img :src="`${qiniuImageUrl}/${bandInfo.agent.headImage}`"/>
          </div>
          <div class="text-info">
            <h2>{{bandInfo.agent.name}}<span>经纪人</span></h2>
            <h3>{{bandInfo.agent.highUnit}}</h3>
            <p>{{bandInfo.agent.introduction|textOverflow(125)}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import textOverflow from '../../../mixin/textOverflow';

  export default {
    name: 'AgentInfo',
    computed: {
      ...mapGetters(['bandInfo'])
    },
    mixins: [textOverflow]
  };
</script>

<style lang="scss" scoped>
  .agent-info-wrapper {
    .band-agent-bg {
      height: 100%;
      width: 100%;
      position: absolute;
      z-index: 1;
      background: url("../../../assets/images/band_confirmation/agent_bg.png") top center no-repeat;
    }

    .band-agent {
      position: relative;
      padding-bottom: 158px;
      .wrapper {
        position: relative;
      }
      .image-bg {
        z-index: 0;
        position: absolute;
        margin-top: 60px;
        width: 300px;
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
        margin-top: 110px;
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
        margin-top: 110px;
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
          line-height: 1.5;
        }
      }
    }
  }
</style>
