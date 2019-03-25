<template>
  <div>
    <Header></Header>
    <div class="progress-container">
      <div class="progress">
        <img src="../../assets/images/band/band_progress3.png" alt="">
      </div>
    </div>
    <div class="wrapper">
      <div class="page-wrapper">
        <h2 class="page-title">完善乐队成员信息</h2>
        <div class="flex">
          <div class="info-left-wrapper">
            <div class="input-group flex">
              <div class="input-item block">
                <div class="label-text">姓名  <span class="form-error-msg">*为必填项</span></div>
                <div class="input-box">
                  <input
                    v-validate="'required'"
                    v-model="memberInfo.name"
                    class="input-ele"
                    type="text"
                    name="userName"
                    placeholder="请输入姓名">
                  <p class="field-error" v-show="errors.has('userName')">{{errors.first('userName')}}</p>
                </div>
              </div>
            </div>
            <div class="input-group flex">
              <div class="input-item block">
                <div class="label-text">队内身份 （如鼓手） <span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <input
                    v-validate="'required'"
                    class="input-ele"
                    v-model="memberSubInfo.teamIdentity"
                    type="text"
                    name="identity"
                    placeholder="请输入队内身份">
                  <p class="field-error" v-show="errors.has('identity')">{{errors.first('identity')}}</p>
                </div>
              </div>
            </div>
            <div class="input-group flex">
              <div class="input-item block">
                <div class="label-text">联系电话  <span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <input
                    v-validate="'required|telephone'"
                    v-model="memberInfo.telphone"
                    class="input-ele"
                    type="text"
                    placeholder="请输入手机号"
                    name="telephone">
                  <p class="field-error" v-show="errors.has('telephone')">{{errors.first('telephone')}}</p>
                </div>
              </div>
            </div>
            <div class="input-group flex">
              <div class="input-item block">
                <div class="label-text">身份证号  <span class="form-error-msg">*</span></div>
                <div class="input-box">
                  <input
                    v-validate="'required|idCard'"
                    v-model="memberSubInfo.idcard"
                    class="input-ele"
                    type="text"
                    placeholder="请输入身份证号"
                    name="idCard">
                  <p class="field-error" v-show="errors.has('idCard')">{{errors.first('idCard')}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="info-right-wrapper">
            <div class="label-text">个人形象展示  <span class="form-error-msg">*</span></div>
            <div class="member-image">
              <el-upload
                class="visua-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="handleVisuaSuccess"
                :before-upload="beforeVisuaUpload">
                <div class="visua-upload">
                  <span v-if="visuaImageUrl" class="visua-band">
                    <img :src="visuaImageUrl" alt="">
                    <span class="visua-text">修改照片</span>
                  </span>
                  <span v-else class="logo-plus">
                    <i class="iconfont icon-plus"></i>
                  </span>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="input-group flex">
          <div class="field-item">
            <div class="field-tit">身份证照片  <span class="form-error-msg">*</span></div>
            <div class="field-image clearfix">
              <div class="front-image fl">
                <el-upload
                  class="front-uploader"
                  action="http://upload-z1.qiniup.com/"
                  :data="fileData"
                  :show-file-list="false"
                  :on-success="handleFrontSuccess"
                  :before-upload="beforeFrontUpload">
                  <div class="card-upload" :class="{active: frontImageUrl}">
                    <span v-if="frontImageUrl" class="upload-preview">
                      <img :src="frontImageUrl" class="avatar">
                      <span>修改照片</span>
                    </span>
                    <span v-else class="avatar-plus">
                      <img src="../../assets/images/id1.png" alt="">
                    </span>
                  </div>
                </el-upload>
              </div>
              <div class="back-image fl">
                <el-upload
                  class="front-uploader"
                  action="http://upload-z1.qiniup.com/"
                  :data="fileData"
                  :show-file-list="false"
                  :on-success="handleBackSuccess"
                  :before-upload="beforeBackUpload">
                  <div class="card-upload" :class="{active: backImageUrl}">
                    <span v-if="backImageUrl" class="upload-preview">
                      <img :src="backImageUrl" class="avatar">
                      <span>修改照片</span>
                    </span>
                    <span v-else class="avatar-plus">
                      <img src="../../assets/images/id2.png" alt="">
                    </span>
                  </div>
                </el-upload>
              </div>
            </div>
          </div>
        </div>
        <div class="input-group flex">
          <div class="input-item">
            <div class="label-text">院校（选填）</div>
            <div class="input-box">
              <input v-model="memberSubInfo.highUnit" class="input-ele" type="text" placeholder="请输入院校">
            </div>
          </div>
          <div class="input-item">
            <div class="label-text">学生证</div>
            <div class="student-card">
              <el-upload
                class="student-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="handleStudentSuccess"
                :before-upload="beforeStudentUpload">
                <div class="student-upload">
                  <span v-if="studentImageUrl" class="student-band">
                    <img :src="studentImageUrl" alt="">
                    <span class="student-text">修改照片</span>
                  </span>
                  <span v-else class="logo-plus">
                    <i class="iconfont icon-plus"></i>
                  </span>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="real-btn">
          <span
            @click="submit"
            v-if="isPassValidate"
            class="real-light">提交</span>
          <span v-else class="real-low">提交</span>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {mapGetters} from 'vuex';
import {addBandMember, getBandInfo} from '../../server';
import {qiniuUrl} from '../../config/env';

export default {
  name: 'addMemberInfo',
  data() {
    return {
      bandInfo: {
        id: ''
      },
      memberInfo: {
        name: '',
        telphone: '',
        headImage: ''
      },
      memberSubInfo: {
        idcard: '',
        idcardFace: '',
        idcareBack: '',
        highUnit: '',
        studentCard: '',
        introduction: '',
        auditRole: 2,
        teamIdentity: ''
      },
      visuaImageUrl: '',
      frontImageUrl: '',
      backImageUrl: '',
      studentImageUrl: '',
      fileData: {
        token: ''
      },
      bandMemberInfo: {}
    };
  },
  created() {
    this.fileData.token = this.qiniuKey;
    getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
      memberId: this.userInfo.id
    }).then(res => {
      this.bandInfo.id = res.data.basicInfo.id;
    });
    // this.bandInfo.id = this.bandId;
    if (this.memberState === 'edit') {
      if (this.$route.query.member === 'captain') {
        this.memberSubInfo.auditRole = 1;
      }
      this.$store.getters.bandInfo.members.forEach(item => {
        if (Number(item.id) === Number(this.$route.query.id)) {
          this.bandMemberInfo = item;
        }
      });
      Object.keys(this.memberInfo).forEach(key => {
        this.memberInfo[key] = this.bandMemberInfo[key];
      });
      Object.keys(this.memberSubInfo).forEach(key => {
        this.memberSubInfo[key] = this.bandMemberInfo[key];
      });
      this.memberInfo.id = this.memberSubInfo.id = this.bandMemberInfo.id;
      // this.memberSubInfo['introduction'] = '';
      this.memberSubInfo['highUnit'] = this.bandMemberInfo['hignUnit'] ? this.bandMemberInfo['hignUnit'] : '';
      this.visuaImageUrl = this.bandMemberInfo['headImage'].indexOf('http://thirdwx.qlogo.cn/') > -1 ? `${this.bandMemberInfo['headImage']}` : `${qiniuUrl}/${this.bandMemberInfo['headImage']}`;
      this.frontImageUrl = `${qiniuUrl}/${this.bandMemberInfo['idcardFace']}`;
      this.backImageUrl = `${qiniuUrl}/${this.bandMemberInfo['idcareBack']}`;
      this.studentImageUrl = `${qiniuUrl}/${this.bandMemberInfo['studentCard']}`;
    }
  },
  computed: {
    ...mapGetters(['qiniuKey', 'bandId', 'userInfo', 'memberState']),
    isPassValidate() {
      for (let key in this.memberInfo) {
        if (!this.memberInfo[key]) {
          return false;
        }
      }
      for (let key in this.memberSubInfo) {
        if (key === 'highUnit' || key === 'introduction' || key === 'studentCard') {
          continue;
        }
        if (!this.memberSubInfo[key]) {
          return false;
        }
      }
      return true;
    }
  },
  components: {
    Header,
    Footer
  },
  methods: {
    handleVisuaSuccess(res, file) {
      this.visuaImageUrl = `${qiniuUrl}/${res.key}`;
      this.memberInfo.headImage = res.key;
    },
    beforeVisuaUpload(file) {
      const isJPG = file.type.indexOf('image/') > -1;
      const isLt2M = file.size / 1024 / 1024 < 200;
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
    handleFrontSuccess(res, file) {
      this.frontImageUrl = `${qiniuUrl}/${res.key}`;
      this.memberSubInfo.idcardFace = res.key;
    },
    beforeFrontUpload(file) {
      const isJPG = file.type.indexOf('image/') > -1;
      const isLt2M = file.size / 1024 / 1024 < 200;
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
    handleBackSuccess(res, file) {
      this.backImageUrl = `${qiniuUrl}/${res.key}`;
      this.memberSubInfo.idcareBack = res.key;
    },
    beforeBackUpload(file) {
      const isJPG = file.type.indexOf('image/') > -1;
      const isLt2M = file.size / 1024 / 1024 < 200;
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
    handleStudentSuccess(res, file) {
      this.studentImageUrl = `${qiniuUrl}/${res.key}`;
      this.memberSubInfo.studentCard = res.key;
    },
    beforeStudentUpload(file) {
      const isJPG = file.type.indexOf('image/') > -1;
      const isLt2M = file.size / 1024 / 1024 < 200;
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
    submit() {
      const payload = {};
      this.$validator.validateAll().then(result => {
        if (result) {
          payload.bandInfo = this.bandInfo;
          payload.memberInfo = this.memberInfo;
          payload.memberSubInfo = this.memberSubInfo;
          addBandMember('member/saveOrUpdate', payload).then(res => {
            getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
              memberId: this.userInfo.id
            }).then(res => {
              this.$store.dispatch('setBandInfo', res.data);
              this.$router.replace({
                path: '/band-confirmation'
              });
            });
          });
        }
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

.progress-container {
  padding: 46px 0 37px;
  background: #fff;
  box-shadow: 0 4px 4px #eee;

  .progress {
    width: 1119px;
    margin: 0 auto;
  }
}

.wrapper {
  width: 1070px;
  margin: 0 auto;
  .page-wrapper {
    box-sizing: border-box;
    margin-top: 35px;
    margin-bottom: 58px;
    padding: 0 70px 90px 70px;
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
    .label-text {
      color: #7A7A7A;
      margin-bottom: 22px;
      &.band-text {
        margin-right: 20px;
        margin-top: 261px;
      }
    }
    .field-error {
      padding: 10px 0 0 5px;
      font-size: 12px;
      color: #BB4342;
    }
    .input-group {
      justify-content: space-between;
      margin-bottom: 26px;
      .input-item {
        width: 446px;
        &.block {
          width: 100%;
        }
        .input-box {
          .input-ele {
            box-sizing: border-box;
            width: 100%;
            padding: 0 15px;
            height: 46px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(226, 227, 231, 1);
            border-radius: 6px;
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
    }
    .student-image {
      width: 430px;
      height: 280px;
      background-color: #F1F1F1;
    }
    .btn-box {
      padding-bottom: 100px;
    }
    .real-btn {
      margin-top: 100px;
      text-align: center;

      span {
        display: inline-block;
        width: 300px;
        height: 60px;
        line-height: 60px;
        font-size: 24px;
        color: #fff;
        border-radius: 10px;
        cursor: pointer;

        &.real-light {
          background: #BB4342;
        }

        &.real-low {
          background: #ccc;
        }
      }
    }
  }

  .field-tit {
    margin-bottom: 20px;
    font-size: 16px;
    color: #7A7A7A;
  }
  .front-image {
    margin-right: 34px;
  }

  .card-upload {
    width: 446px;
    height: 279px;
    line-height: 279px;

    &.active {
      border: 1px solid #ccc;
      border-radius: 12px;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
      border-radius: 10px;
    }
  }

  .upload-preview {
    position: relative;
    display: block;
    height: 100%;

    span {
      position: absolute;
      width: 134px;
      height: 134px;
      line-height: 134px;
      left: 50%;
      top: 50%;
      margin-left: -67px;
      margin-top: -67px;
      background: rgba(0, 0, 0, 0.3);
      text-align: center;
      font-size: 20px;
      color: #fff;
      border-radius: 50%;
    }
  }
}

.student-uploader {
  position: relative;
  height: 280px;
  line-height: 280px;
}

.student-upload {
  img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }

  .icon-plus {
    color: #828282;
    font-size: 64px;
  }

  .student-text {
    position: absolute;
    width: 134px;
    height: 134px;
    line-height: 134px;
    left: 50%;
    top: 50%;
    margin-left: -67px;
    margin-top: -67px;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-radius: 50%;
  }
}

.student-upload {
  width: 440px;
  height: 280px;
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
  }
}

.visua-upload {
  position: relative;
  width: 280px;
  height: 280px;
  overflow: hidden;
  line-height: 280px;

  .icon-plus {
    color: #828282;
    font-size: 64px;
  }

  img {
    max-width: 100%;
    max-height: 100%;
  }

  .visua-text {
    position: absolute;
    width: 134px;
    height: 134px;
    line-height: 134px;
    left: 50%;
    top: 50%;
    margin-left: -67px;
    margin-top: -67px;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-radius: 50%;
  }
}

.student-card {
  width: 440px;
  height: 280px;
  background: #f1f1f1;
  border-radius: 6px;
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

.flex {
  display: flex;
}

.form-error-msg {
  color: #BB4342;
}

</style>
