<template>
  <div class="footer-container">
    <div class="footer commonWidth">
      <div class="footer-activity">
        <div class="activity-item">
          <router-link to="/">线下84场live house 演出</router-link>
          <router-link to="/">现场投票PK</router-link>
        </div>
        <div class="activity-item">
          <router-link to="/">由乐团顶级权威到时层层选拔</router-link>
          <router-link to="/">盛大颁奖典礼</router-link>
        </div>
        <div class="activity-item">
          <router-link to="/">南北同期启动音乐节</router-link>
          <router-link to="/">带你玩转音乐世界</router-link>
        </div>
      </div>
      <div class="footer-copy">@北京好乐互娱文化传媒有限公司</div>
      <div class="footer-logo">
        <img src="../../assets/images/bottom_logo.png" alt="">
      </div>
      <div class="footer-qrcode">
        <h3>
          <img src="../../assets/images/qrcode.png" alt="">
        </h3>
        <p>关注微信公众号</p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Footer'
    };
</script>

<style lang="scss" scoped>
  .footer-container {
    background: #BB4342;

    .footer {
      position: relative;
      padding: 56px 0 35px;
    }

    .footer-activity {
      margin-bottom: 70px;
    }

    .activity-item {
      line-height: 40px;

      a {
        display: inline-block;
        min-width: 260px;
        color: #fff;
      }
    }

    .footer-copy {
      color: #fff;
      font-size: 22px;
    }

    .footer-logo {
      position: absolute;
      width: 175px;
      height: 56px;
      left: 0;
      top: -17px;
    }

    .footer-qrcode {
      position: absolute;
      width: 268px;
      height: auto;
      right: -40px;
      top: -20px;

      p {
        margin-top: 25px;
        text-align: center;
        color: #fff;
        font-size: 20px;
      }
    }
  }
</style>
