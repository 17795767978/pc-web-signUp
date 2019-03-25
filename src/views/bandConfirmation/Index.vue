<template>
  <div class="confirm-band">
    <Header></Header>
    <Progress></Progress>
    <div class="band-confirmation">
      <band-info></band-info>
      <band-member></band-member>
      <agent-info></agent-info>
      <band-video
        :serverVideoList="serverVideoList"
        @getVideoInfo="getVideoInfo">
      </band-video>
      <band-audio @getAudioInfo="getAudioInfo">
      </band-audio>
      <div
        v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3"
        class="band-enroll"
        :class="{'enroll-red': bandInfo.members.length > 1 && videoList.length > 0 && audioList.length > 0}">
        <div class="band-enroll-wrapper">
          <div class="band-enroll-text">
            <span v-if="bandInfo.members.length === 1 && videoList.length > 0 && audioList.length > 0">
              乐队内仅有1人，无法报名
            </span>
            <span v-if="bandInfo.members.length > 1 && videoList.length === 0 || audioList.length === 0">
              乐队内没有音视频作品，无法报名
            </span>
            <span v-if="bandInfo.members.length > 1 && videoList.length > 0 && audioList.length > 0">
             报名信息完整，可以报名
            </span>
          </div>
          <div class="band-enroll-btn">
            <span
              @click="confirmBandInfo"
              v-if="bandInfo.members.length > 1 && videoList.length > 0 && audioList.length > 0"
              class="band-enroll-swks">
              确认报名
            </span>
            <span
              @click="saveBandInfo"
              v-else
              class="band-enroll-swks">
              先保存，稍后报名
            </span>
            <span class="band-enroll-up" @click="giveUp">
              放弃报名
            </span>
          </div>
        </div>
      </div>
      <div class="dialog">
        <el-dialog
          :title="dialogTitle"
          width="560px"
          top="30vh"
          :visible.sync="dialogVisible"
          :show-close="false"
          :close-on-click-modal="false"
          center
        >
          <p>{{dialogCont}}</p>
          <span slot="footer" class="dialog-footer">
          <span class="dialog-cancel" @click="dialogVisible = false">取消</span>
          <span class="dialog-conf" @click="confirmEnroll">确认</span>
        </span>
        </el-dialog>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
  import Header from '../../components/header/Header';
  import Footer from '../../components/footer/Footer';
  import Progress from './components/Progress';
  import BandInfo from './components/BandInfo';
  import BandMember from './components/BandMember';
  import AgentInfo from './components/AgentInfo';
  import BandVideo from './components/BandVideo';
  import BandAudio from './components/BandAudio';
  import { mapGetters } from 'vuex';
  import { getBandInfo, modifyMedia, confirmBand, rejectSignUp } from '../../server';

  export default {
    name: 'bandConfirmation',
    components: {
      Header,
      Progress,
      BandInfo,
      BandMember,
      AgentInfo,
      BandVideo,
      BandAudio,
      Footer
    },
    data() {
      return {
        videoList: [],
        audioList: [],
        serverVideoList: [],
        dialogVisible: false,
        dialogTitle: '',
        dialogIndent: '',
        dialogCont: ''
      };
    },
    created () {
      if (this.bandInfo.basicInfo.auditStatus === 3 && this.bandInfo.basicInfo.auditReason) {
        this.$message.error('驳回原因:' + this.bandInfo.basicInfo.auditReason);
      }
      this.$store.dispatch('GetUserInfo');
      this.serverVideoList = this.bandInfo.signUpVideos;
      if (this.bandInfo.signUpVideos.length > 0) {
        this.videoList = [{
          id: this.bandInfo.signUpVideos[0].id,
          title: this.bandInfo.signUpVideos[0].title,
          mediaUrl: this.bandInfo.signUpVideos[0].mediaUrl,
          mediaSize: this.bandInfo.signUpVideos[0].mediaSize,
          mediaTime: this.bandInfo.signUpVideos[0].mediaTime,
          mediaResolution: this.bandInfo.signUpVideos[0].mediaResolution
        }];
      }
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
      ...mapGetters(['userInfo', 'bandInfo'])
    },
    methods: {
      getVideoInfo (videoList) {
        this.videoList = videoList;
      },
      getAudioInfo (audioList) {
        this.audioList = [];
        audioList.forEach(item => {
          if (item.title) {
            this.audioList.push(item);
          }
        });
      },
      submitBandInfo (text) {
        return new Promise((resolve, reject) => {
          let mediaObj = {};
          mediaObj.bandInfo = {};
          mediaObj.bandInfo.id = this.bandInfo.basicInfo.id;
          mediaObj.videoList = this.videoList;
          mediaObj.audioList = this.audioList;
          modifyMedia('activity/modifySignUpMedia', mediaObj).then(res => {
            getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
              memberId: this.userInfo.id
            }).then(resultBand => {
              this.$store.dispatch('setBandInfo', resultBand.data);
              this.serverVideoList = resultBand.data.signUpVideos;
              if (resultBand.data.basicInfo && resultBand.data.basicInfo.id) {
                this.$store.dispatch('setBandId', resultBand.data.basicInfo.id);
              }
              if (text) {
                this.$message.success('保存成功');
              }
              resolve();
            });
          });
        });
      },
      saveBandInfo () {
        this.submitBandInfo('保存');
      },
      confirmBandInfo () {
        this.dialogTitle = '确认报名';
        this.dialogVisible = true;
        this.dialogIndent = 'confirm';
        this.dialogCont = '请再次确认所有报名信息完整正确，并符合报名要求，否则客服小姐姐审核不通过是会退回报名的！';
      },
      giveUp () {
        this.dialogTitle = '放弃报名';
        this.dialogVisible = true;
        this.dialogIndent = 'giveUp';
        this.dialogCont = '放弃报名将不再保存您已上传的报名资料，是否确认？';
      },
      confirmEnroll () {
        if (this.dialogIndent === 'confirm') {
          this.submitBandInfo().then(() => {
            confirmBand(`activity/confirmBandSignUp/${this.bandInfo.basicInfo.id}`).then(res => {
              this.$store.dispatch('GetUserInfo');
              this.dialogVisible = false;
            });
          });
        } else {
          rejectSignUp('activity/clearSignup').then(res => {
            this.$store.dispatch('GetUserInfo').then(res => {
              this.$router.replace({
                path: '/home'
              });
            });
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .confirm-band {
    background: #f5f5f5;
    .band-enroll {
      margin-top: 200px;
      background: #F4AF75;
      .band-enroll-wrapper {
        height: 160px;
        display: flex;
        align-items: center;
        width: 995px;
        margin: 0 auto;
      }
      .band-enroll-text {
        margin-right: 30px;
        font-size: 30px;
        color: #fff;
      }
      .band-enroll-btn {
        display: flex;
        align-items: center;
      }
      .band-enroll-swks {
        width: 360px;
        height: 70px;
        line-height: 70px;
        margin-right: 30px;
        background: #fff;
        border-radius: 10px;
        text-align: center;
        font-size: 24px;
        color: #F4AF75;
        cursor: pointer;
      }
      .band-enroll-up {
        font-size: 30px;
        cursor: pointer;
        color: #fff;
        text-decoration: underline;
      }
    }
    .enroll-red {
      background: #B03332;
      .band-enroll-swks {
        color: #B03332;
      }
    }
  }
</style>
<style lang="scss">
  .band-confirmation {
    .el-dialog__title {
      font-size: 36px;
      color: #000;
    }
    .el-dialog__header {
      padding: 50px 0 27px;
    }
    .el-dialog__body {
      padding-bottom: 40px;
      padding-top: 0;
      border-bottom: 1px solid #D2D3D5;

      p {
        font-size: 28px;
        line-height: 40px;
        text-align: center;
      }
    }
    .el-dialog__footer {
      padding: 0;
      height: 100px;
      line-height: 100px;

      .dialog-footer {
        font-size: 0;
        span {
          display: inline-block;
          width: 50%;
          box-sizing: border-box;
          font-size: 34px;
          cursor: pointer;
        }
        .dialog-cancel {
          border-right: 1px solid #D2D3D5;
          color: #000;
        }
        .dialog-conf {
          color: #BB4342;
        }
      }
    }
  }
</style>
