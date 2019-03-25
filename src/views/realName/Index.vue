<template>
  <div class="real-container">
    <v-header></v-header>
    <div class="progress-container">
      <div v-if="role === 'band'" class="progress">
        <img src="../../assets/images/band/band_progress1.png" alt="">
      </div>
      <div v-else class="progress">
        <img src="../../assets/images/broker/broker_progress1.png" alt="">
      </div>
    </div>
    <div class="real-main">
      <div class="real">
        <div class="real-tit">
          报名前请{{role === 'band' ? '乐队队长' : '经纪人'}}先进行实名认证
        </div>
        <div class="real-field">
          <div class="field-item clearfix">
            <div class="filed-name fl">
              <div class="field-tit">姓名 <span class="form-error-msg">*为必填项</span></div>
              <div class="field-input">
                <input
                  v-validate="'required|userName'"
                  v-model="realData.name"
                  type="text"
                  placeholder="请输入姓名"
                  name="userName">
              </div>
              <p class="field-error" v-show="errors.has('userName')">{{errors.first('userName')}}</p>
            </div>
            <div class="field-gender fl">
              <div class="field-tit">性别 <span class="form-error-msg">*</span></div>
              <div class="field-input">
                <el-radio v-model="realData.sex" label="0">男</el-radio>
                <el-radio v-model="realData.sex" label="1">女</el-radio>
              </div>
            </div>
          </div>
          <div class="field-item">
            <div class="field-tit">身份证号 <span class="form-error-msg">*</span></div>
            <div class="field-card">
              <input
                v-model="realData.idcard"
                v-validate="'required|idCard'"
                type="text"
                placeholder="请输入身份证号"
                name="idCard">
            </div>
            <p class="field-error" v-show="errors.has('idCard')">{{errors.first('idCard')}}</p>
          </div>
          <div class="field-item">
            <div class="field-tit">身份证照片 <span class="form-error-msg">*</span></div>
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
                      <span>修改图片</span>
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
        <div class="real-btn">
          <span
            @click="submit"
            v-if="isPassValidate"
            class="real-light">提交</span>
          <span v-else class="real-low">提交</span>
        </div>
      </div>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import {getFileInfo} from '../../server';
import {qiniuUrl} from '../../config/env';

export default {
  name: 'RealName',
  data() {
    return {
      realData: {
        name: '',
        sex: '0',
        idcard: '',
        idcardFace: '',
        idcareBack: ''
      },
      fileData: {
        token: ''
      },
      frontImageUrl: '',
      backImageUrl: ''
    };
  },
  created() {
    this.fileData.token = this.qiniuKey;
    if (this.role === 'broker') {
      this.realData.sex = '1';
    }
  },
  computed: {
    ...mapGetters(['qiniuKey', 'role']),
    isPassValidate: function () {
      for (let key in this.realData) {
        if (!this.realData[key].toString()) {
          return false;
        }
      }
      return true;
    }
  },
  components: {
    'v-header': Header,
    'v-footer': Footer
  },
  methods: {
    handleFrontSuccess(res, file) {
      this.realData.idcardFace = res.key;
      this.frontImageUrl = `${qiniuUrl}/${res.key}`;
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
      this.realData.idcareBack = res.key;
      this.backImageUrl = `${qiniuUrl}/${res.key}`;
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
        this.$message.error(`上传图片不能大于20MB!`);
      }
      return isJPG && isLt2M && isGif;
    },
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          getFileInfo('member/subsidiary/realNameAuth', this.realData).then(res => {
            if (res.code === 0) {
              this.$store.dispatch('GetUserInfo').then(response => {
                if (this.role === 'band') {
                  this.$router.replace({
                    path: '/band-signUp'
                  });
                } else {
                  this.$router.replace({
                    path: '/agent-signUp'
                  });
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.real-container {
  background: #f5f5f5;

  .real-main {
    width: 1070px;
    margin: 35px auto 90px;
    box-shadow: 0 0 4px 4px #eee;
    background: #fff;
  }

  .real {
    padding: 40px 70px 70px;
  }

  .real-tit {
    padding-bottom: 30px;
    text-align: center;
    font-size: 30px;
    color: #5A5A5A;
    border-bottom: 1px solid #E2E3E7;
  }

  .real-field {
    padding: 65px 0 70px;
  }

  .filed-name {
    width: 300px;
    margin-right: 65px;

    .field-input {
      height: 46px;
      line-height: 46px;
      border: 1px solid #E2E3E7;
      border-radius: 5px;

      input {
        width: 280px;
        padding-left: 10px;
        border: none;
      }
    }
  }

  .field-gender {

    .field-input {
      height: 46px;
      line-height: 46px;
    }
  }

  .field-item {
    margin-bottom: 25px;
  }

  .field-error {
    padding: 10px 0 0 5px;
    font-size: 12px;
    color: #BB4342;
  }

  .field-tit {
    margin-bottom: 20px;
    font-size: 18px;
    color: #7A7A7A;
  }

  .field-card {
    width: 560px;
    height: 46px;
    line-height: 46px;
    border: 1px solid #E2E3E7;
    border-radius: 5px;

    input {
      width: 550px;
      padding-left: 10px;
      border: none;
    }
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

  .real-btn {
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
.form-error-msg {
  color: #BB4342;
  margin-top: 10px;
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
</style>
