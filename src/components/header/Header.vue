<template>
  <div class="top-container">
    <div class="top clearfix">
      <div class="top-logo fl" @click="goToHome">
        <img src="../../assets/images/haoyuedui_logo.png" alt="">
      </div>
      <div v-if="userInfo.nickname" class="top-user fr">
        <div class="username">
          <img v-if="userInfo.headImage.indexOf('http://thirdwx.qlogo.cn/') > -1" :src="`${userInfo.headImage}`" alt="">
            <img v-else :src="`${qiuniuImageUrl}/${userInfo.headImage}`" alt="">
          <span>{{userInfo.name ? userInfo.name : userInfo.nickname}}</span>
          <i></i>
        </div>
        <div class="user-detail">
          <h3>
            <img @click="goToDetail" v-if="userInfo.headImage.indexOf('http://thirdwx.qlogo.cn/') > -1" :src="`${userInfo.headImage}`" alt="">
            <img @click="goToDetail" v-else :src="`${qiuniuImageUrl}/${userInfo.headImage}`" alt="">
          </h3>
          <h4>{{userInfo.name ? userInfo.name : userInfo.nickname}}</h4>
          <p @click="logOut">退出登录</p>
        </div>
      </div>
      <div v-if="!userInfo.nickname" class="top-login fr">
        <span @click="loginAction">登录</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { qiniuUrl } from '../../config/env';

  export default {
    name: 'Header',
    data () {
      return {
        qiuniuImageUrl: ''
      };
    },
    created () {
      this.qiuniuImageUrl = qiniuUrl;
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      loginAction () {
        this.$emit('loginModelEvent');
      },
      logOut () {
        this.$store.dispatch('LogOut');
        this.$router.replace({
          path: '/home'
        });
      },
      goToHome () {
        this.$router.push({
          path: '/'
        });
      },
      goToDetail () {
        if (this.userInfo.auditRole && this.userInfo.auditRole === 1) {
          this.$router.push('/band-confirmation');
        } else if (this.userInfo.auditRole && this.userInfo.auditRole === 3) {
          this.$router.push('/agent-confirmation');
        };
      }
    }
  };
</script>

<style lang="scss" scoped>
  .top-container {
    position: relative;
    height: 56px;
    line-height: 56px;
    z-index: 1;
    background: #BB4342;
    .top {
      width: 1000px;
      margin: 0 auto;
    }

    .top-user {
      position: relative;
      padding: 0 10px;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        .user-detail {
          display: block;
        }
      }

      .username {
        font-size: 0;

        img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }

        span {
          display: inline-block;
          padding: 0 10px;
          font-size: 20px;
          color: #fff;
          vertical-align: middle;
        }

        i {
          display: inline-block;
          margin-top: 5px;
          width:0;
          height:0;
          border:5px solid;
          border-color:#fff transparent transparent transparent;
          vertical-align: middle;
        }
      }

      .user-detail {
        display: none;
        position: absolute;
        width: 114px;
        height: auto;
        line-height: normal;
        padding: 0 10px;
        top: 56px;
        right: 0;
        background: #fff;
        text-align: center;

        h3 {
          padding: 10px 0;
        }

        h4 {
          padding-bottom: 10px;
        }

        p {
          margin: 0 -10px;
          padding: 10px 0;
          border-top: 1px solid #F5F5F5;
          cursor: pointer;
        }
      }
    }

    .user-detail {
      img {
        width: 50px;
        height: 50px;
      }
    }

    .top-logo {
      img {
        vertical-align: middle;
      }
    }

    .top-login {
      span {
        display: inline-block;
        width: 110px;
        height: 38px;
        line-height: 38px;
        background: #9b2625;
        border-radius: 38px;
        vertical-align: middle;
        cursor: pointer;
        font-size: 16px;
        color: #fff;
        text-align: center;
      }
    }
  }
</style>
