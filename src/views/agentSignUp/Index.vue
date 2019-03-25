<template>
  <div>
    <Header></Header>
    <div class="progress-container">
      <div class="progress">
        <img src="../../assets/images/broker/broker_progress2.png" alt="">
      </div>
    </div>
    <div class="wrapper">
      <div class="page-wrapper">
        <h2 class="page-title">完善个人信息及报名作品</h2>
        <div class="personal-msg">
          <div class="msg-left">
            <p class="msg-name">姓名</p>
            <input
              disabled
              class="input-name"
              name="userName"
              type="text"
              v-model="sendData.memberSubInfo.name"
              v-validate="'required|userName'">
            <p class="form-error-msg" v-show="errors.has('userName')">{{errors.first('userName')}}</p>
          </div>
          <div class="msg-right">
            <p class="msg-name">身份证号</p>
            <input
              disabled
              class="input-name"
              name="idCard"
              type="text"
              v-model="sendData.memberSubInfo.idcard"
              v-validate="'required|idCard'">
            <p class="form-error-msg" v-show="errors.has('idCard')">{{errors.first('idCard')}}</p>
          </div>
        </div>
        <div class="flex">
          <div class="info-left-wrapper">
            <div class="input-group flex">
              <!-- <div class="input-item">
                <div class="label-text">SN码</div>
                <div class="input-box">
                  <input class="input-ele"
                         name="snCode"
                         type="text"
                         v-model="sendData.snCode">
                </div>
              </div> -->
              <div class="input-item block">
                <div class="label-text">报名赛区 <span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <el-select
                    :disabled="noEdit"
                    @visible-change="handleRaceArea"
                    v-model="sendData.memberSubInfo.matchZoneId"
                    placeholder="请选择">
                    <el-option
                      v-for="item in raceAreaOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <p class="form-error-msg" v-show="validateStatus.raceAreaIsEmpty">请选择报名赛区</p>
                </div>
              </div>
            </div>
            <div class="input-group flex">
              <div class="input-item">
                <div class="label-text">身高（cm）<span class="form-error-msg">*为必填项</span></div>
                <div class="input-box">
                  <input
                    :disabled="noEdit"
                    class="input-ele"
                    name="weight"
                    type="text"
                    v-model="sendData.memberSubInfo.weight"
                    v-validate="'required|weight'">
                  <p class="form-error-msg" v-show="errors.has('weight')">{{errors.first('weight')}}</p>
                </div>
              </div>
              <div class="input-item">
                <div class="label-text">体重（Kg）<span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <input
                    :disabled="noEdit"
                    class="input-ele"
                    name="height"
                    type="text"
                    v-model="sendData.memberSubInfo.height"
                    v-validate="'required|height'">
                  <p class="form-error-msg" v-show="errors.has('height')">{{errors.first('height')}}</p>
                </div>
              </div>
            </div>
            <div class="input-group flex">
              <div class="input-item block">
                <div class="label-text">联系电话 <span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <input
                    disabled
                    class="input-ele"
                    name="telephone"
                    type="text"
                    v-model="sendData.memberInfo.telphone"
                    v-validate="'required|telephone'">
                  <p class="form-error-msg" v-show="errors.has('telephone')">{{errors.first('telephone')}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="info-right-wrapper">
            <div class="label-text">个人头像 <span class="form-error-msg">*</span></div>
            <div class="member-image">
              <div v-if="noEdit" class="showbox" :style="{backgroundImage:'url(' + headImageShow + ')'}"></div>
              <el-upload
                class="figure-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="handleFigureSuccess"
                :before-upload="beforePhotosUpload">
                <div class="figure-upload member-image">
                <span v-if="figureImageUrl" class="figure-band">
                  <img :src="figureImageUrl" alt="">
                  <span class="figure-text">修改照片</span>
                </span>
                  <span v-else class="add-btn-plus">
                    <div class="icon-box"><i class="iconfont icon-plus"></i></div>
                  </span>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="student-info flex">
          <div class="input-group">
            <div class="input-item collage">
              <div class="label-text">院校 <span class="form-error-msg">*</span></div>
              <div class="input-box">
                <input
                  :disabled="noEdit"
                  class="input-ele"
                  name="highUnit"
                  type="text"
                  v-validate="'required'"
                  v-model="sendData.memberSubInfo.highUnit">
                <p class="form-error-msg" v-show="errors.has('highUnit')">{{errors.first('highUnit')}}</p>
              </div>
            </div>
            <div class="input-item block">
              <div class="label-text">个人简介 <span class="form-error-msg">*</span></div>
              <div class="input-box">
                <textarea
                  maxlength="300"
                  :disabled="noEdit"
                  class="input-ele"
                  name="introduction"
                  v-model="sendData.memberSubInfo.introduction"
                  v-validate="'required|max:300'"></textarea>
                <p class="form-error-msg" v-show="errors.has('introduction')">{{errors.first('introduction')}}</p>
              </div>
            </div>
          </div>
          <!-- <div class="student-image-group">
            <div class="label-text">学生证</div>
            <div>
              <div class="student-image">
                <img v-if="noEdit" class="student-img" :src="studentImageShow" alt="">
                <el-upload
                  v-else
                  class="figure-uploader"
                  action="http://upload-z1.qiniup.com/"
                  :data="fileData"
                  :show-file-list="false"
                  :on-success="handleStudentSuccess"
                  :before-upload="beforePhotosUpload">
                  <div class="figure-upload student-image">
                <span v-if="studentImageUrl" class="figure-band">
                  <img :src="studentImageUrl" alt="">
                  <span class="figure-text">修改照片</span>
                </span>
                    <span v-else class="add-btn-plus">
                    <div class="icon-box"><i class="iconfont icon-plus"></i></div>
                  </span>
                  </div>
                </el-upload>
              </div>
            </div>
          </div> -->
        </div>
        <!-- <div class="works-upload flex">
          <div class="item">
            <div class="label-text">视频作品 <span class="form-error-msg">*</span></div>
            <el-upload
              class="video-uploader"
              action="http://upload-z1.qiniup.com/"
              accept="video/mp4"
              :file-list="fileList"
              :data="fileData"
              :show-file-list="isFileList"
              :on-success="handleVideoSuccess"
              :before-upload="beforeVideoUpload">
              <div class="video-area">
                <div v-if="videoCover" class="video-player">
                  <img :src="videoCover" alt="">
                </div>
                <div v-else class="video-plus">
                  <i class="iconfont icon-plus"></i>
                  <p>添加视频</p>
                </div>
              </div>
            </el-upload>
          </div>
          <div class="line"></div>
          <div class="item photos">
            <div class="label-text">相册（请上传4~9张）<span class="form-error-msg">*</span></div>
            <div class="photo-list">
              <el-upload
                action="http://upload-z1.qiniup.com/"
                list-type="picture-card"
                :file-list="albumList"
                :data="fileData"
                :limit="9"
                :on-exceed="handlePhotosMax"
                :on-preview="handlePhotosCardPreview"
                :on-success="handlePhotosSuccess"
                :before-upload="beforePhotosUpload"
                :on-remove="handlePhotosRemove">
                <div class="item">
                  <a href="javascript:;" class="add-btn-plus">
                    <div class="icon-box"><i class="iconfont icon-plus"></i>
                      <p>添加照片</p></div>
                  </a>
                </div>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </div>
          </div>
        </div> -->
      </div>
      <div class="agent-btn" :style="isPassValidate === true ? bgColor : ''">
        <span class="warning-word">乐队基本信息未填写完整</span>
        <button
          v-if="isPassValidate"
          @click="submit"
          class="agent-light btn-roll">保存信息</button>
        <button v-else class="agent-low btn-roll">无法保存</button>
        <span class="reject-btn" v-if="isPassValidate !== true" @click="rejectToHome">放弃报名</span>
      </div>
    </div>
    <div class="confirm-btn" v-show="warningShow">
      <div class="confirm-detail">
        <p class="detail-title">确认提交</p>
        <p class="detail-warning">基本信息填写完整并确认</p>
        <p class="detail-warning">提交后不可再修改，是否确认？</p>
        <div class="btn-detail">
          <div class="btn-left" @click="closeWarning">取消</div>
          <div class="btn-right" @click="goToNext">确认</div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
// import axios from 'axios';
import {raceArea} from '../../constant';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {videoPlayer} from 'vue-video-player';
import {submitAgentInfo} from '../../server';
import {qiniuUrl} from '../../config/env';

export default {
  name: 'agentSignUp',
  beforeCreate() {
    document.querySelector('body').setAttribute('style', 'background-color:#f5f5f5');
  },
  mounted() {
    this.fileData.token = this.qiniuKey;
    this.sendData.memberSubInfo.name = this.userInfo.name;
    this.sendData.memberSubInfo.idcard = this.userInfo.idcard;
    let raceAreaCopy = [];
    raceArea.forEach((v, i) => {
      if (v.label !== '西南赛区') {
        raceAreaCopy.push(v);
      }
    });
    this.raceAreaOptions = raceAreaCopy;
    this.editDataInit();
    if (this.brokerInfo.memberSubInfo && this.brokerInfo.memberSubInfo.auditStatus === 3) {
      this.figureImageUrl = `${qiniuUrl}/${this.brokerInfo.memberSubInfo.headImage}`;
      this.studentImageUrl = `${qiniuUrl}/${this.brokerInfo.memberSubInfo.studentCard}`;
    }
  },
  data() {
    return {
      figureImageUrl: '',
      studentImageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      bgColor: {
        backgroundColor: '#BB4342'
      },
      fileData: {
        token: ''
      },
      raceArea: '',
      raceAreaOptions: [],
      validateStatus: {
        raceAreaIsEmpty: false,
        PhotosLength: false
      },
      fileList: [],
      isFileList: true,
      playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [],
        poster: '', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
//        controlBar: {
//          timeDivider: true,
//          durationDisplay: true,
//          remainingTimeDisplay: false,
//          fullscreenToggle: true  //全屏按钮
//        }
      },
      noEdit: false,
      warningShow: false,
      videoCover: '',
      sendData: {
        memberInfo: {
          id: '',
          logo: '',
          telphone: '',
          imagePicture: '',
          headImage: ''
        },
        memberSubInfo: {
          name: '',
          idcard: '',
          highUnit: '',
          weight: '',
          height: '',
          matchId: 1,
          matchZoneId: '',
          studentCard: '',
          introduction: ''
        }
        // video: {
        //   title: '',
        //   mediaUrl: '',
        //   mediaSize: '',
        //   mediaTime: '',
        //   mediaResolution: ''
        // },
        // snCode: '',
        // photos: []
      }
    };
  },
  components: {
    Header,
    Footer,
    videoPlayer
  },
  /*
  watch: {
      sendData: {
        deep: true,
        handler: function () {
          console.log('nn', this.sendData.memberInfo.headImage);
          console.log('video', this.sendData.video.mediaUrl);
          console.log(this.sendData.memberSubInfo.weight,
            this.sendData.memberSubInfo.height,
            this.sendData.memberSubInfo.highUnit,
            this.sendData.memberInfo.telphone,
            this.sendData.memberSubInfo.matchZoneId,
            this.sendData.memberSubInfo.introduction,
            this.sendData.memberInfo.headImage,
            this.validateStatus.PhotosLength,
            this.videoCover);
        }
      }
    },
    */
  computed: {
    ...mapGetters(['qiniuKey', 'brokerInfo', 'userInfo']),
    isPassValidate() {
      if (
        this.sendData.memberSubInfo.weight &&
        this.sendData.memberSubInfo.height &&
        this.sendData.memberSubInfo.highUnit &&
        this.sendData.memberInfo.telphone &&
        this.sendData.memberSubInfo.matchZoneId &&
        this.sendData.memberSubInfo.introduction &&
        this.sendData.memberInfo.headImage
      ) {
        return true;
      }
      return false;
    },
    headImageShow() {
      if (this.brokerInfo.memberSubInfo.headImage) {
        return qiniuUrl + '/' + this.brokerInfo.memberSubInfo.headImage;
      } else {
        return false;
      }
    }
    // studentImageShow() {
    //   if (this.brokerInfo.memberSubInfo.studentCard) {
    //     return qiniuUrl + '/' + this.brokerInfo.memberSubInfo.studentCard;
    //   }
    // },
    // 相册列表
    // albumList() {
    //   var arr = [];
    //   if (this.brokerInfo.album) {
    //     this.brokerInfo.album.forEach((v, i) => {
    //       let url = qiniuUrl + v.album_url;
    //       arr.push({
    //         id: v.id,
    //         key: v.album_url,
    //         url: url
    //       });
    //     });
    //   }
    //   return arr;
    // }
  },
  methods: {
    handleFigureSuccess(res, file) {
      this.figureImageUrl = `${qiniuUrl}/${res.key}`;
      this.sendData.memberInfo.headImage = res.key;
    },
    handleStudentSuccess(res, file) {
      this.studentImageUrl = `${qiniuUrl}/${res.key}`;
      this.sendData.memberSubInfo.studentCard = res.key;
    },
    handleRaceArea(value) {
      if (!value) {
        if (this.sendData.memberSubInfo.matchZoneId) {
          this.validateStatus.raceAreaIsEmpty = false;
        } else {
          this.validateStatus.raceAreaIsEmpty = true;
        }
      }
    },
    closeWarning () {
      this.warningShow = false;
    },
    goToNext () {
      submitAgentInfo('/agent/signup', this.sendData).then(res => {
        if (res.code === 0) {
          this.$router.push({
            path: 'agent-confirmation'
          });
        }
      });
      this.warningShow = false;
    },
    // handleVideoSuccess(res, file) {
    //   this.videoCover = `http://pg85njce3.bkt.clouddn.com/${res.key}?vframe/jpg/offset/1/w/432/h/244`;
    //   const instance = axios.create({
    //     baseURL: 'http://pg85njce3.bkt.clouddn.com'
    //   });
    //   instance.post(`/${res.key}?avinfo`).then(response => {
    //     this.sendData.video.title = file.name.slice(0, -4);
    //     this.sendData.video.mediaUrl = res.key;
    //     this.sendData.video.mediaSize = response.data.format.size;
    //     this.sendData.video.mediaTime = Math.round(response.data.format.duration);
    //     this.sendData.video.mediaResolution = `${response.data.streams[0].coded_width}*${response.data.streams[0].coded_height}`;
    //   });
    //   setTimeout(() => {
    //     this.isFileList = false;
    //     this.fileList = [];
    //   }, 1000);
    // },
    // beforeVideoUpload(file) {
    //   this.isFileList = true;
    //   return true;
    // },
    // handlePhotosSuccess(res, file, fileList) {
    //   this.dialogImageUrl = `http://pg85njce3.bkt.clouddn.com/${res.key}`;
    //   this.sendData.photos.push(res.key);
    //   this.handlePhotosMax();
    // },
    // handlePhotosCardPreview(file) {
    //   this.dialogImageUrl = file.url;
    //   this.dialogVisible = true;
    // },
    beforePhotosUpload(file) {
      const isJPG = file.type.indexOf('image/') > -1;
      const isLt2M = file.size / 1024 / 1024 < 2;
      const isGif = file.type !== 'image/gif';
      if (!isJPG) {
        this.$message.error('只能上传图片');
      }
      if (!isGif) {
        this.$message.error('不可以上传GIF格式！');
      }
      if (!isLt2M) {
        this.$message.error(`上传图片不能大于2MB!`);
      }
      return isJPG && isLt2M && isGif;
    },
    handlePhotosRemove(file, fileList) {
      let arr = this.sendData.photos;
      if (file.key === undefined && file.response.key === undefined) {
        return false;
      }
      if (file.key || file.response.key) {
        let key = file.key || file.response.key;
        arr.splice(arr.findIndex(item => item === key), 1);
        this.sendData.photos = arr;
        // this.handlePhotosMax();
      }
      // this.handlePhotosMax();
    },
    // 看上传照片收否符合数量
    // handlePhotosMax() {
    //   if (this.sendData.photos.length <= 9 && this.sendData.photos.length >= 4) {
    //     this.validateStatus.PhotosLength = true;
    //   } else {
    //     this.validateStatus.PhotosLength = false;
    //   }
    // },
    editDataInit() {
      if (this.userInfo.realFlag === 1 && this.userInfo.auditStatus === null) {
        this.$store.dispatch('setBrokerInfo', {});
        this.sendData.memberInfo.telphone = this.userInfo.telphone;
      }
      if (this.brokerInfo.memberSubInfo) {
        this.sendData.memberSubInfo.weight = this.brokerInfo.memberSubInfo.weight;
        this.sendData.memberSubInfo.height = this.brokerInfo.memberSubInfo.height;
        this.sendData.memberInfo.telphone = this.brokerInfo.memberInfo.telphone;
        if (this.brokerInfo.bandInfo) {
          this.sendData.snCode = this.brokerInfo.bandInfo.snCode;
        }
        if (this.brokerInfo.memberSubInfo) {
          this.sendData.memberSubInfo.matchZoneId = this.brokerInfo.memberSubInfo.matchZoneId;
        }
        this.sendData.memberSubInfo.highUnit = this.brokerInfo.memberSubInfo.highUnit;
        this.sendData.memberSubInfo.introduction = this.brokerInfo.memberSubInfo.introduction;
        // this.brokerInfo.album.forEach((v, i) => {
        //   this.sendData.photos.push(v.album_url);
        // });
        // this.handlePhotosMax();
        this.sendData.memberInfo.headImage = this.brokerInfo.memberSubInfo.headImage;
        if (this.sendData.memberInfo.studentCard) {
          this.sendData.memberInfo.studentCard = this.brokerInfo.memberSubInfo.studentCard;
        }
        if (this.brokerInfo.memberSubInfo.auditStatus === 0 || this.brokerInfo.memberSubInfo.auditStatus === 1) {
          this.noEdit = true;
        } else if (this.brokerInfo.memberSubInfo.auditStatus === 2) {
          this.$router.replace({
            path: '/'
          });
        } else if (this.brokerInfo.memberSubInfo.auditStatus === 3 || this.brokerInfo.memberSubInfo.auditStatus == null) {
          this.noEdit = false;
        }
        if (this.brokerInfo.signUpVideoList[0]) {
          this.videoCover = `${qiniuUrl}/${this.brokerInfo.signUpVideoList[0].media_url}?vframe/jpg/offset/2/w/432/h/244`;
        }
      }
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.warningShow = true;
          // submitAgentInfo('/agent/signup', this.sendData).then(res => {
          //   if (res.code === 0) {
          //     this.$router.push({
          //       path: 'agent-confirmation'
          //     });
          //   }
          // });
        } else {
          this.$message.error('输入有误请检查！');
        }
      });
    },
    rejectToHome () {
      this.$router.push({
        path: '/'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
hr {
  border: none;
  border-top: 2px solid #E2E3E7;
  margin: 40px 0;
}

.wrapper {
  width: 1070px;
  margin: 0 auto;
  .page-wrapper {
    box-sizing: border-box;
    margin-top: 35px;
    padding: 0 70px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.09);
    .page-title {
      padding: 36px 0;
      margin-bottom: 30px;
      text-align: center;
      font-size: 30px;
      color: #5A5A5A;
      border-bottom: 2px solid #E2E3E7;
    }
    .personal-msg {
      width: 100%;
      height: 120px;
      display: flex;
      padding-bottom: 22px;
      box-sizing: border-box;
      .msg-left {
        width: 50%;
        padding-right: 52px;
        box-sizing: border-box;
        .msg-name {
          margin-bottom: 22px;
          color: #7A7A7A;
        }
        .input-name {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px;
          height: 46px;
          background: white;
          border: 2px solid #e2e3e7;
          border-radius: 6px;
          font-size: 18px;
          color: #5A5A5A;
        }
        .form-error-msg {
          margin-bottom: 10px;
        }
      }
      .msg-right  {
        width: 50%;
        padding-right: 52px;
        box-sizing: border-box;
        .msg-name {
          margin-bottom: 22px;
          color: #7A7A7A;
        }
        .input-name {
          box-sizing: border-box;
          width: 100%;
          padding: 0 15px;
          height: 46px;
          background: white;
          border: 2px solid #e2e3e7;
          border-radius: 6px;
          font-size: 18px;
          color: #5A5A5A;
        }
        .form-error-msg {
          margin-bottom: 10px;
        }
      }
    }
    .label-text {
      color: #7A7A7A;
      margin-bottom: 22px;
      &.band-text {
        margin-right: 20px;
        margin-top: 261px;
      }
    }
    .input-group {
      justify-content: space-between;
      margin-bottom: 26px;
      .input-item {
        width: 250px;
        &.block {
          width: 100%;
        }
        &.collage {
          width: 60.5%;
        }
        .input-box {
          .input-ele {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
            height: 46px;
            background: rgba(255, 255, 255, 1);
            border: 2px solid rgba(226, 227, 231, 1);
            border-radius: 6px;
            font-size: 18px;
            color: #5A5A5A;
          }
          .input-ele:disabled {
            background-color: #f1f1f1;
          }
          textarea.input-ele {
            box-sizing: border-box;
            padding: 15px;
            resize: none;
            height: 160px;
          }
        }
      }
    }
    .info-left-wrapper {
      flex: 1;
      margin-right: 88px;
    }
    .member-image {
      width: 280px;
      height: 280px;
      background: rgba(241, 241, 241, 1);
      border-radius: 6px;
      overflow: hidden;
      text-align: center;
      .showbox {
        width: 100%;
        height: 100%;
        background-size: cover;
        display: block;
      }
    }
    .student-info {
      margin-top: 10px;
      .student-image-group {
        margin-left: 56px;
      }
      .student-image {
        width: 430px;
        height: 280px;
        img {
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
      }
      .input-group {
        flex: 1;
        .input-item {
          margin-bottom: 28px;
        }
      }
    }
    .works-upload {

      padding-bottom: 100px;
      .line {
        width: 0;
        height: 330px;
        border-left: 2px dashed #E2E3E7;
      }
      .item {
        flex: 1;
        &.photos {
          margin-left: 32px;
          .photo-list {
            .item {
              width: 136px !important;
              height: 136px !important;
              i {
                color: #828282;
                font-size: 32px;
                margin-bottom: 20px;
              }
              p {
                padding-bottom: 20px;
              }
            }
          }
        }
      }
      .video-uploader {
        width: 430px;
        height: 280px;
        border-radius: 6px;
        .video-area {
          position: relative;
          width: 432px;
          height: 244px;
          line-height: 280px;
          background: #f1f1f1;
          img {
            display: block;
          }
          .video-plus {
            display: inline-block;
            line-height: normal;
            vertical-align: middle;
            .icon-plus {
              color: #828282;
              font-size: 64px;
            }

            p {
              padding-top: 10px;
              color: #7A7A7A;
              font-size: 18px;
            }
          }
        }
      }
    }

    .btn-box {
      padding-bottom: 100px;
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
.add-btn-plus {
  background-color: #f1f1f1;
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
  .icon-box {
    height: 64px;
    width: 64px;
    margin: auto;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    i {
      color: #828282;
      font-size: 64px;
    }
    p {
      padding-top: 10px;
      color: #828282;
    }
  ;
  }
}

.btn-block {
  width: 100%;
  height: 60px;
  background: rgba(241, 241, 241, 1);
  border-radius: 6px;
  font-size: 18px;
  color: #7A7A7A;
  border: none;
  outline: none;
  cursor: pointer;
  i {
    font-size: 22px;
    margin-right: 10px;
  }
}

.progress-container {
  padding: 46px 0 37px;
  background: #fff;
  box-shadow: 0 4px 4px #eee;

  .progress {
    width: 1119px;
    margin: 0 auto;
  }
}

.figure-upload {
  position: relative;
  overflow: hidden;
  width: 430px;
  height: 280px;
  .icon-plus {
    color: #828282;
    font-size: 64px;
  }
  .figure-band {
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .figure-text {
    position: absolute;
    width: 134px;
    height: 134px;
    left: 50%;
    top: 50%;
    margin-left: -67px;
    margin-top: -67px;
    line-height: 134px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 134px;
  }
}

.form-error-msg {
  color: #BB4342;
  margin-top: 10px;
}

.flex {
  display: flex;
}
.agent-btn {
  width: 1070px;
  height: 148px;
  padding: 0 68px;
  margin-bottom: 50px;
  box-sizing: border-box;
  background-color: #F4AF75;
  position: relative;
  line-height: 148px;
  .warning-word {
    font-size: 24px;
    color: #ffffff;
    margin-right: 200px;
  }
  .btn-roll {
    width: 300px;
    height: 60px;
    background-color: #ffffff;
    color: #BEBEBE;
    font-size: 24px;
    border: transparent;
    border-radius: 6px;
  }
  .agent-light {
    color: #BB4342;
  }
  .reject-btn {
    font-size: 24px;
    color: #ffffff;
    text-decoration: underline;
    margin-left: 20px;
  }
}
</style>
