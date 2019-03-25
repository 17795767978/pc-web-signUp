<template>
  <div class="bind-band">
    <Header></Header>
    <div class="progress-container">
      <div class="progress">
        <img src="../../assets/images/band/band_progress2.png" alt="">
      </div>
    </div>
    <div class="wrapper">
      <div class="page-wrapper">
        <h2 class="page-title">填写乐队基本信息 </h2>
        <h3 class="band-word">乐队信息</h3>
        <div class="image-upload-box flex">
          <div class="label-text band-text">乐队LOGO <span class="form-error-msg">*</span></div>
          <div class="band-logo">
            <el-upload
              class="logo-uploader"
              action="http://upload-z1.qiniup.com/"
              :data="fileData"
              :show-file-list="false"
              :on-success="handleLogoSuccess"
              :before-upload="beforeLogoUpload">
              <div class="logo-upload">
                <span v-if="logoImageUrl" class="logo-band">
                  <img :src="logoImageUrl" alt="">
                  <span class="logo-text">修改照片</span>
                </span>
                <span v-else class="logo-plus">
                  <i class="iconfont icon-plus"></i>
                </span>
              </div>
            </el-upload>
          </div>
          <div class="label-text band-text">乐队形象 <span class="form-error-msg">*</span></div>
          <div class="band-image">
            <el-upload
              class="figure-uploader"
              action="http://upload-z1.qiniup.com/"
              :data="fileData"
              :show-file-list="false"
              :on-success="handleFigureSuccess"
              :before-upload="beforeFigureUpload">
              <div class="figure-upload">
                <span v-if="figureImageUrl" class="figure-band">
                  <img :src="figureImageUrl" alt="">
                  <span class="figure-text">修改照片</span>
                </span>
                <span v-else class="figure-plus">
                  <i class="iconfont icon-plus"></i>
                </span>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="input-group flex">
          <div class="input-item">
            <div class="label-text">乐队名称 <span class="form-error-msg">*为必填项</span></div>
            <div class="input-box">
              <input
                v-validate="'required'"
                v-model="bandData.name"
                class="input-ele"
                name="bandName"
                type="text"
                placeholder="请输入乐队名称">
              <p class="field-error" v-show="errors.has('bandName')">{{errors.first('bandName')}}</p>
            </div>
          </div>
          <div class="input-item">
            <div class="label-text">报名赛区 <span class="form-error-msg">*</span></div>
            <div class="input-box">
              <el-select
                @visible-change="handleRaceArea"
                v-model="bandData.matchZoneId"
                placeholder="请选择">
                <el-option
                  v-for="item in raceAreaOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <p class="field-error" v-show="validateStatus.raceAreaIsEmpty">请选择报名赛区</p>
            </div>
          </div>
        </div>
        <div class="input-group flex">
          <div class="input-item">
            <div class="label-text">队长姓名 <span class="form-error-msg">*</span></div>
            <div class="input-box">
              <input
                v-validate="'required'"
                class="input-ele"
                type="text"
                v-model="leaderName"
                name="leaderName"
                placeholder="请输入队长姓名">
              <p class="field-error" v-show="errors.has('leaderName')">{{errors.first('leaderName')}}</p>
            </div>
          </div>
          <div class="input-item">
            <div class="label-text">所属院校 <span class="form-error-msg">*</span></div>
            <div class="input-box">
              <input
                v-validate="'required'"
                class="input-ele"
                type="text"
                v-model="bandData.highPartner"
                name="academy"
                placeholder="请输入院校名字">
              <p class="field-error" v-show="errors.has('academy')">{{errors.first('academy')}}</p>
            </div>
          </div>
        </div>
        <div class="input-group flex">
          <div class="input-item">
            <div class="label-text">常驻城市 <span class="form-error-msg">*</span></div>
            <div class="input-box">
              <el-cascader
                size="large"
                @blur="handleProvinceAndCityState"
                @change="handleProvinceAndCityChange"
                :options="provinceAndCityOptions"
                v-model="selectedProvinceAndCityOptions">
              </el-cascader>
              <p class="field-error" v-show="validateStatus.provinceAndCity">请选择常驻城市</p>
            </div>
          </div>
        </div>
        <div class="band-style">
          <div class="label-text">乐队风格 <span class="form-error-msg">*</span></div>
          <div class="style">
            <el-radio-group
              v-model="checkboxGroup"
              @change="handleChangeStyle">
              <el-radio-button
                v-for="item in checkboxOption"
                :label="item.name"
                :key="item.id">
              </el-radio-button>
            </el-radio-group>
            <p class="field-error" v-show="validateStatus.bandStyle">请选择乐队风格</p>
          </div>
        </div>
        <div class="band-intro">
          <div class="label-text">乐队简介（{{bandData.introduction.length}}/200） <span class="form-error-msg">*</span></div>
          <div class="intro">
            <textarea
              v-model="bandData.introduction"
              v-validate="'required|max:200'"
              maxlength="300"
              name="summary">
            </textarea>
            <p class="field-error" v-show="errors.has('summary')">{{errors.first('summary')}}</p>
          </div>
        </div>
        <div v-if="isPassValidate" class="band-submit band-red">
          <div class="band-complete clearfix">
            <div class="complete-text fl">
              乐队基本信息已填写完整
            </div>
            <div class="complete-btn fr">
              <span class="band-save" @click="dialogVisible = true">保存信息</span>
            </div>
          </div>
        </div>
        <div v-else class="band-submit">
          <div class="band-uncomplete clearfix">
            <div class="complete-text fl">
              乐队基本信息未填写完整
            </div>
            <div class="complete-btn fr">
              <span class="band-save">无法保存</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <div class="dialog">
      <el-dialog
        title="确认提交"
        width="560px"
        top="30vh"
        :visible.sync="dialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        center
      >
        <p>基本信息填写完整并确认</p>
        <p>提交后不可再修改，是否确认？</p>
        <span slot="footer" class="dialog-footer">
          <span class="dialog-cancel" @click="dialogVisible = false">取消</span>
          <span class="dialog-conf" @click="confirmSubmit">确认</span>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Header from '../../components/header/Header';
  import Footer from '../../components/footer/Footer';
  import {raceArea} from '../../constant';
  import {provinceAndCityData} from 'element-china-area-data';
  import {submitBandInfo, getBandTags} from '../../server';
  import {qiniuUrl} from '../../config/env';

  export default {
    name: 'bandSignUp',
    data() {
      return {
        bandData: {
          name: '',
          highPartner: '',
          logo: '',
          imagePicture: '',
          tagFlag: '',
          matchId: 1,
          matchZoneId: '',
          introduction: '',
          provinceId: '',
          cityId: ''
        },
        leaderName: '',
        fileData: {
          token: '',
          key: ''
        },
        checkboxGroup: '',
        checkboxOption: [],
        logoImageUrl: '',
        figureImageUrl: '',
        raceAreaOptions: [],
        provinceAndCityOptions: provinceAndCityData,
        selectedProvinceAndCityOptions: [],
        validateStatus: {
          raceAreaIsEmpty: false,
          provinceAndCity: false,
          bandStyle: false
        },
        dialogVisible: false
      };
    },
    created() {
      this.fileData.token = this.qiniuKey;
      this.raceAreaOptions = raceArea;
      if (this.$route.query.id) {
        this.bandData.id = this.$route.query.id;
        Object.keys(this.bandData).forEach((key) => {
          if (this.bandInfo.basicInfo.hasOwnProperty(key)) {
            this.bandData[key] = this.bandInfo.basicInfo[key];
          }
        });
        this.logoImageUrl = `${qiniuUrl}/${this.bandInfo.basicInfo.logo}`;
        this.figureImageUrl = `${qiniuUrl}/${this.bandInfo.basicInfo.imagePicture}`;
        this.selectedProvinceAndCityOptions = [this.bandInfo.basicInfo.provinceId, this.bandInfo.basicInfo.cityId];
        this.checkboxGroup = this.bandInfo.basicInfo.tagFlag;
        this.leaderName = this.bandInfo.memberInfo.name;
        getBandTags('tag/getBandTags').then(res => {
          res.data.forEach(item => {
            if (item.name === this.bandInfo.basicInfo.tagFlag) {
              this.bandData.tagFlag = item.id;
            }
          });
        });
      } else {
        getBandTags('tag/getBandTags').then(res => {
          this.checkboxOption = res.data;
        });
      }
    },
    computed: {
      ...mapGetters(['qiniuKey', 'bandInfo', 'userInfo']),
      isPassValidate() {
        if (!this.leaderName) {
          return false;
        }
        for (let key in this.bandData) {
          if (!this.bandData[key]) {
            return false;
          }
        }
        return true;
      }
    },
    watch: {
      selectedProvinceAndCityOptions(newVal) {
        if (newVal.length > 0) {
          this.validateStatus.provinceAndCity = false;
        } else {
          this.validateStatus.provinceAndCity = true;
        }
      }
    },
    components: {
      Header,
      Footer
    },
    methods: {
      handleChangeStyle(value) {
        this.checkboxOption.forEach(item => {
          if (item.name === value) {
            this.bandData.tagFlag = item.id;
          }
        });
      },
      handleProvinceAndCityChange(value) {
        this.bandData.provinceId = value[0];
        this.bandData.cityId = value[1];
      },
      handleLogoSuccess(res, file) {
        this.logoImageUrl = `${qiniuUrl}/${res.key}`;
        this.bandData.logo = res.key;
      },
      beforeLogoUpload(file) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        this.fileData.key = `${file.uid}.${type}`;
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
      handleFigureSuccess(res, file) {
        this.figureImageUrl = `${qiniuUrl}/${res.key}`;
        this.bandData.imagePicture = res.key;
      },
      beforeFigureUpload(file) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        this.fileData.key = `${file.uid}.${type}`;
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
      handleRaceArea(value) {
        if (!value) {
          if (this.bandData.matchZoneId) {
            this.validateStatus.raceAreaIsEmpty = false;
          } else {
            this.validateStatus.raceAreaIsEmpty = true;
          }
        }
      },
      handleProvinceAndCityState() {
        if (this.selectedProvinceAndCityOptions.length > 0) {
          this.validateStatus.provinceAndCity = false;
        } else {
          this.validateStatus.provinceAndCity = true;
        }
      },
      confirmSubmit() {
        this.dialogVisible = false;
        let bandInfo = {};
        for (let key in this.bandData) {
          bandInfo[key] = this.bandData[key];
        }
        submitBandInfo('activity/signup', {
          bandInfo: bandInfo,
          leaderName: this.leaderName
        }).then(res => {
          this.$router.replace({
            path: '/band-confirmation'
          });
          /* this.$store.dispatch('GetUserInfo').then(userRes => {
            this.$store.dispatch('setBandId', res.data.bandId);
            getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
              memberId: this.userInfo.id
            }).then(response => {
              this.$store.dispatch('setBandInfo', response.data);
              this.$router.replace({
                path: '/band-confirmation'
              });
            });
          }); */
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
      margin-bottom: 58px;
      padding: 0 70px 0 70px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 0 32px rgba(0, 0, 0, 0.09);
      .image-upload-box {
        margin-bottom: 60px;
        .logo-upload {
          width: 160px;
          height: 160px;
          line-height: 160px;
          margin-top: 45px;
          margin-right: 120px;
          overflow: hidden;
          border-radius: 50%;
          background-color: #eee;
        }
        .logo-upload {
          position: relative;
          overflow: hidden;
          .logo-plus {
            vertical-align: middle;

            .icon-plus {
              color: #828282;
              font-size: 64px;
            }
          }
          .logo-band {
            img {
              max-width: 100%;
              max-height: 100%;
            }
            .logo-text {
              position: absolute;
              width: 160px;
              height: 44px;
              line-height: 44px;
              text-align: center;
              left: 0;
              bottom: 0;
              color: #fff;
              font-size: 20px;
              background: rgba(0, 0, 0, 0.5);
            }
          }
        }
        .band-image {
          width: 430px;
          height: 280px;
          background-color: #eee;
          border-radius: 6px;
        }
        .figure-upload {
          position: relative;
          overflow: hidden;
          width: 430px;
          height: 280px;
          line-height: 280px;
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
      }
      .page-title {
        padding: 36px 0;
        margin-bottom: 30px;
        text-align: center;
        font-size: 30px;
        font-weight: 600;
        color: #5A5A5A;
        border-bottom: 2px solid #E2E3E7;
      }
      .label-text {
        color: #7A7A7A;
        margin-bottom: 22px;
        &.band-text {
          margin-right: 20px;
        }
      }
      .input-group {
        justify-content: space-between;
        margin-bottom: 26px;
        .input-item {
          width: 446px;
          .input-box {
            .input-ele {
              box-sizing: border-box;
              width: 100%;
              padding: 0 15px;
              height: 46px;
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(226, 227, 231, 1);
              border-radius: 5px;
            }
            .input-disabled {
              background: #f5f7fa;
              color: #c0c4cc;
            }
          }
        }
      }
      .band-style {
        margin-bottom: 28px;
      }
      .band-intro {
        margin-bottom: 50px;
        .intro {
          textarea {
            box-sizing: border-box;
            width: 100%;
            height: 156px;
            padding: 20px;
            border-color: #E2E3E7;
            border-radius: 6px;
            resize: none;
            font-size: 24px;
            color: #5A5A5A;
          }
        }
      }
      .works-upload {
        height: 330px;
        .line {
          width: 0;
          height: 100%;
          border-left: 2px dashed #E2E3E7;
        }
        .item {
          flex: 1;
          &.audios {
            margin-left: 32px;
          }
        }
        .video-upload {
          width: 430px;
          height: 244px;
          border-radius: 6px;
        }
      }
    }
  }

  .music-edit-plus {
    margin-bottom: 15px;
  }

  .video-area {
    position: relative;
    width: 432px;
    height: 244px;
    line-height: 280px;
    background: #f1f1f1;
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

  .band-submit {
    margin: 0 -70px;
    padding: 50px 70px;
    background: #F4AF75;

    .complete-text {
      line-height: 60px;
      font-size: 24px;
      color: #fff;
    }

    .complete-btn {
      font-size: 0;

      span {
        display: inline-block;
        cursor: pointer;
      }

      .band-save {
        width: 300px;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #F6F6F6;
        border-radius: 6px;
        font-size: 24px;
        color: #BEBEBE;
      }

      .band-dis {
        margin-left: 20px;
        line-height: 60px;
        color: #fff;
        font-size: 30px;
        text-decoration: underline;
      }
    }
  }

  .band-red {
    background: #B84241;
    .band-save {
      color: #B84241 !important;
    }
  }

  .opus-logo {
    width: 160px;
    height: 160px;
    line-height: 160px;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 45px;
    background: #eee;

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .audios-music {
    margin-bottom: 15px;
  }

  .audio-uploader {
    width: 100%;
  }

  .video-player {
    line-height: normal;
  }

  .music-area {
    width: 450px;
    height: 50px;
    line-height: 50px;
    background: #F1F1F1;
    border-radius: 6px;
  }

  .band-word {
    margin-bottom: 20px;
    font-size: 16px;
    color: #7A7A7A;
  }

  .musci-info {
    position: relative;
    width: 430px;
    text-align: left;

    h3 {
      width: 418px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    span {
      position: absolute;
      width: auto;
      height: auto;
      padding: 5px 10px;
      right: 10px;
      bottom: 10px;
      background: #DCDCDC;
      border-radius: 2px;
      font-size: 14px;
      color: #7A7A7A;
    }

    i {
      position: static !important;
      padding-right: 5px;
      vertical-align: middle;
      font-size: 14px !important;
      color: #7A7A7A !important;
    }
  }

  .music-item,
  .musci-info {
    position: relative;
    height: 82px;
    padding: 9px;
    margin-bottom: 15px;
    background: #F1F1F1;
    border-radius: 6px;

    h3 {
      width: 356px;
      padding-left: 10px;
      height: 48px;
      line-height: 48px;
      background: #fff;
      border-radius: 4px;
      font-size: 18px;
      color: #535353;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    p {
      width: 300px;
      padding-left: 10px;
      margin-top: 12px;
      font-size: 16px;
      color: #7A7A7A;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    i {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 35px;
      right: 20px;
      font-size: 20px;
      cursor: pointer;
      color: #D2D3D5;
    }
  }

  .music-add {
    .icon-plus {
      font-size: 22px;
      color: #828282;
    }

    span {
      padding-left: 10px;
      font-size: 18px;
      color: #828282;
    }
  }

  .field-error {
    padding: 10px 0 0 10px;
    font-size: 12px;
    color: #BB4342;
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

  .flex {
    display: flex;
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

  .band-visualize {
    width: 430px;
    height: 280px;
    line-height: 280px;

    img {
      max-width: 100%;
      max-height: 100%;
      vertical-align: middle;
    }
  }

  .disable-style {
    li {
      float: left;
      width: 136px;
      height: 44px;
      line-height: 44px;
      margin-right: 20px;
      background-color: #BB4342;
      border: 1px solid #E2E3E7;
      border-radius: 44px;
      color: #fff;
      font-size: 14px;
      text-align: center;
    }
  }

  .form-error-msg {
    color: #BB4342;
  }

</style>
<style lang="scss">
  .el-radio-button {
    width: 138px;
    height: 46px;
    margin-right: 20px;
  }

  .el-radio-button__inner:hover {
    color: #BB4342;
  }

  .el-radio-button__inner {
    width: 138px;
    height: 46px;
    background-color: #fff;
    padding: 15px 20px;
    border: 1px solid #E2E3E7;
    border-radius: 46px;
  }

  .el-radio-button.is-focus .el-radio-button__inner {
    border-color: #BB4342;
  }

  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 46px;
  }

  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 46px;
  }

  .el-radio-button.is-checked .el-radio-button__inner {
    color: #fff;
    background-color: #BB4342;
    border-color: #BB4342;
    -webkit-box-shadow: -1px 0 0 0 #bb8c90;
    box-shadow: -1px 0 0 0 #bb8c90;
  }

  .el-radio-button.is-checked:first-child .el-radio-button__inner {
    border-color: #BB4342;
  }

  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    border: 1px solid #BB4342;
    background: #BB4342;
  }

  .input-box {
    .el-select,
    .el-cascader {
      width: 100%;
      line-height: 46px;
    }
    .el-input__inner {
      height: 46px;
    }
  }
  .bind-band {
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
