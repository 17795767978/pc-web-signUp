<template>
  <div class="home">
    <v-header @loginModelEvent="showLoginModal"></v-header>
    <div class="banner-container">
      <img src="../../assets/images/banner.png" alt="">
      <div class="enrollment">
        <span class="enrollment-band" @click="enroll('band')"></span>
        <span class="enrollment-broker" @click="enroll('broker')"></span>
      </div>
    </div>
    <duel></duel>
    <div class="wave-container">
      <img src="../../assets/images/pc_homebg_wave.png" alt="">
    </div>
    <contest></contest>
    <v-footer></v-footer>
    <div v-if="loginModalState" class="login-container">
      <div class="login-mask"></div>
      <div class="login-box">
        <div class="login-close" @click="closeLogin">
          <img src="../../assets/images/icon/del_icon.png" alt="">
        </div>
        <div v-if="registerState" class="login-wrapper">
          <div class="login-input">
            <div class="login-icon">
              <img src="../../assets/images/icon/iphone_icon.png" alt="">
            </div>
            <div class="login-field">
              <input
                v-model="loginModel.mobile"
                v-validate="'required|telephone'"
                type="text"
                name="telephone"
                placeholder="请输入手机号">
            </div>
            <p v-show="errors.has('telephone')">{{errors.first('telephone')}}</p>
          </div>
          <div class="login-input">
            <div class="login-icon">
              <img src="../../assets/images/icon/code_icon.png" alt="">
            </div>
            <div class="login-field">
              <input
                v-model="loginModel.code"
                v-validate="'required|captcha'"
                type="text"
                name="captcha"
                placeholder="请输入验证码">
              <button @click="getCode" :disabled="!captchaBtnState">
                <span v-if="captchaBtnState" class="s-light">获取验证码</span>
                <span v-else class="s-low">{{count}}s</span>
              </button>
            </div>
            <p v-show="errors.has('captcha')">{{errors.first('captcha')}}</p>
          </div>
          <div class="login-btn" @click="submit">
            <span>登录</span>
          </div>
        </div>
        <div v-else class="login-scan">
          <h3>打开微信扫一扫 关注“好乐互娱”公众号<br/>点击<span>校园摸金赛</span>注册</h3>
          <h4>
            <img src="../../assets/images/login-qrcode.png" alt="">
          </h4>
          <p @click="registerState = true">返回登录</p>
        </div>
      </div>
    </div>
    <technological-process
      :rollAgent="rollAgent"
      :rollBand="rollBand"
      v-show="this.rollAgent === true || this.rollBand === true"/>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Header from '../../components/header/Header';
  import Duel from './Duel';
  import Contest from './Contest';
  import Footer from '../../components/footer/Footer';
  import technologicalProcess from './technologicalProcess';
  import { getCaptcha, getBandInfo, getBrokerInfo } from '../../server';

  const TIME_COUNT = 60;

  export default {
    name: 'Home',
    data () {
      return {
        loginModalState: false,
        captchaBtnState: true,
        registerState: true,
        rollAgent: false,
        rollBand: false,
        count: 0,
        timer: null,
        loginModel: {
          mobile: '',
          code: ''
        }
      };
    },
    computed: {
      ...mapGetters(['userInfo', 'bandInfo'])
    },
    components: {
      'v-header': Header,
      'v-footer': Footer,
      Duel,
      Contest,
      technologicalProcess
    },
    methods: {
      showLoginModal (param) {
        this.loginModalState = true;
      },
      getCode () {
        this.$validator.validate('telephone').then((result) => {
          if (result) {
            if (!this.timer) {
              this.count = TIME_COUNT;
              this.captchaBtnState = false;
              this.timer = setInterval(() => {
                if (this.count > 0 && this.count <= TIME_COUNT) {
                  this.count--;
                } else {
                  this.captchaBtnState = true;
                  clearInterval(this.timer);
                  this.timer = null;
                }
              }, 1000);
              getCaptcha('sms/login/', {
                phone: this.loginModel.mobile
              });
            }
          }
        });
      },
      closeLogin () {
        this.loginModalState = false;
        if (this.timer) {
          this.captchaBtnState = true;
          clearInterval(this.timer);
          this.timer = null;
        }
      },
      submit () {
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$store.dispatch('LoginByMobile', this.loginModel).then((response) => {
              if (response.code === 1001) {
                this.registerState = false;
              } else {
                this.$store.dispatch('GetUserInfo').then(result => {
                  this.loginModalState = false;
                  this.$store.dispatch('setQiniuKey');
                  if (this.userInfo.auditRole) {
                    getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
                      memberId: this.userInfo.id
                    }).then(resultBand => {
                      this.$store.dispatch('setBandInfo', resultBand.data);
                      if (resultBand.data.basicInfo && resultBand.data.basicInfo.id) {
                        this.$store.dispatch('setBandId', resultBand.data.basicInfo.id);
                      }
                    });
                    getBrokerInfo(`member/agentDetailForEdit/${this.userInfo.id}`, {}).then(resultBroker => {
                      this.$store.dispatch('setBrokerInfo', resultBroker.data);
                    });
                  }
                });
              }
            });
          }
        });
      },
      enroll (param) {
        if (!this.userInfo.nickname) {
          this.$toasted.show('您还没有登录，请登录');
          return false;
        }
        this.$store.dispatch('setRole', param);
        if (param === 'band') {
          if (this.userInfo.auditRole === 3) {
            this.$toasted.show('你正在报名经纪人，不能再报名乐队');
            return false;
          }
        } else {
          if (this.userInfo.auditRole === 1) {
            this.$toasted.show('你正在报名乐队，不能再报名经纪人');
            return false;
          }
        }
        if (this.userInfo.realFlag === 0) {
          if (param === 'broker') {
            this.rollAgent = true;
          } else if (param === 'band') {
            this.rollBand = true;
          }
          // this.$router.push({
          //   path: '/real-name'
          // });
        } else {
          if (param === 'band') {
            if (this.userInfo.auditStatus === null) {
              this.$router.push({
                path: '/band-signup'
              });
            } else {
              this.$router.push({
                path: '/band-confirmation'
              });
            }
          } else {
            if (this.userInfo.auditStatus === null) {
              this.$router.push({
                path: '/agent-SignUp'
              });
            } else {
              this.$router.push({
                path: '/agent-confirmation'
              });
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "../../assets/sass/mixin";

  .home {

    .banner-container {
      position: relative;
      min-width: 1366px;

      img {
        width: 100%;
      }

      .enrollment {
        position: absolute;
        width: 592px;
        height: 66px;
        left: 50%;
        top: 27.5%;
        margin-left: -296px;
        font-size: 0;

        span {
          display: inline-block;
          width: 260px;
          height: 81px;
          cursor: pointer;
        }

        .enrollment-band {
          margin-right: 35px;
          background: url("../../assets/images/band_bnnt.png") no-repeat center;

          &:hover {
            background: url("../../assets/images/band_bnnt_selected.png") no-repeat center;
          }
        }

        .enrollment-broker {
          margin-left: 35px;
          background: url("../../assets/images/broker_bnnt.png") no-repeat center;

          &:hover {
            background: url("../../assets/images/broker_bnnt_selected.png") no-repeat center;
          }
        }
      }
    }

    .wave-container {
      min-width: 1366px;

      img {
        width: 100%;
      }
    }

    .login-container {
      position: fixed;
      @include cover;

      .login-mask {
        position: absolute;
        @include cover;
        background: rgba(0, 0, 0, 0.6);
      }

      .login-box {
        position: absolute;
        width: 382px;
        height: 452px;
        left: 50%;
        top: 50%;
        margin-left: -191px;
        margin-top: -225px;
        border-radius: 20px;
        background: url("../../assets/images/login_bg.png") no-repeat center;
      }

      .login-close {
        position: absolute;
        width: 18px;
        height: 18px;
        top: 15px;
        right: 19px;
        cursor: pointer;
      }

      .login-wrapper {
        padding: 180px 45px 0;
      }

      .login-input {
        position: relative;
        margin-bottom: 40px;
        font-size: 0;

        p {
          position: absolute;
          width: auto;
          height: auto;
          left: 38px;
          top: 65px;
          font-size: 12px;
          color: #BB4342;
        }
      }

      .login-icon,
      .login-field {
        display: inline-block;
        vertical-align: middle;
      }

      .login-icon {
        width: 22px;
        margin-right: 10px;
        text-align: center;
      }

      .login-field {
        width: 260px;
        border-bottom: 1px solid #ccc;
        font-size: 0;

        button {
          background: none;
          border: none;
          padding: 0;
        }

        input {
          box-sizing: border-box;
          display: inline-block;
          width: 162px;
          height: 50px;
          line-height: 50px;
          padding-left: 5px;
          font-size: 16px;
          border: none;
          background: #f7f5fb;
          vertical-align: middle;
        }

        span {
          display: inline-block;
          width: 92px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          vertical-align: middle;
          text-align: center;
          border-radius: 28px;
          color: #fff;
          cursor: pointer;

          &.s-light {
            background: #BB4342;
          }

          &.s-low {
            background: #A0A0A0;
          }
        }
      }

      .login-btn {
        margin-top: 20px;

        span {
          display: block;
          height: 44px;
          line-height: 44px;
          font-size: 20px;
          border: 2px solid #BB4342;
          border-radius: 44px;
          text-align: center;
          cursor: pointer;
          color: #BB4342;
        }
      }
    }

    .login-scan {
      padding-top: 150px;
      text-align: center;

      h3 {
        padding-bottom: 10px;
        line-height: 24px;
        font-size: 18px;

        span {
          font-size: 20px;
          font-weight: bold;
        }
      }

      h4 {
        padding-bottom: 10px;
      }

      p {
        font-size: 18px;
        color: #BB4342;
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
</style>
