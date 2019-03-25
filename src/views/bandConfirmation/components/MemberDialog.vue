<template>
  <div class="member-dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="1070px"
      center>
      <div class="member-cont">
        <div class="dialog-close" @click="closeDialog">
          <i class="iconfont icon-plus"></i>
        </div>
        <div class="band-tit">乐队信息</div>
        <div class="band-name">
          <div class="band-name-text">
            {{this.bandInfo.basicInfo.name}}
          </div>
          <div class="band-figure">
            <img :src="`${qiniuImageUrl}/${this.bandInfo.basicInfo.logo}`" alt="">
          </div>
        </div>
        <div class="member-field">
          <div class="member-input clearfix">
            <div class="member-input-item fl">
              <h3>姓名<span>*为必填</span></h3>
              <h4>
                <input
                  type="text"
                  v-model="memberData.name"
                  placeholder="请输入成员姓名"
                  v-validate="'required'"
                  name="userName">
              </h4>
              <p class="field-error" v-show="errors.has('userName')">{{errors.first('userName')}}</p>
            </div>
            <div class="member-input-item fr">
              <h3>联系电话<span>*</span></h3>
              <h4>
                <input
                  v-model="memberData.telphone"
                  type="text"
                  placeholder="请输入手机号码"
                  v-validate="'required|telephone'"
                  name="telephone">
              </h4>
              <p class="field-error" v-show="errors.has('telephone')">{{errors.first('telephone')}}</p>
            </div>
          </div>
          <div class="member-input clearfix">
            <div class="member-input-item fl">
              <h3>对内身份</h3>
              <h4>
                <input type="text" placeholder="如鼓手、键盘" v-model="memberData.profession">
              </h4>
            </div>
            <div class="member-input-item fr">
              <h3>院校</h3>
              <h4>
                <input type="text" placeholder="请输入学校名称" v-model="memberData.highUnit">
              </h4>
            </div>
          </div>
          <div class="member-pic clearfix">
            <div class="member-pic-item fl">
              <h3>个人形象图片<span>*</span></h3>
              <el-upload
                class="member-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="function (res) {
                  handleImgSuccess('headImage', res);
                }"
                :before-upload="beforeImgUpload">
                <div class="visua-upload">
                    <span v-if="headImage" class="visua-band">
                      <img :src="headImage" alt="">
                      <span class="visua-text">修改照片</span>
                    </span>
                  <span v-else class="logo-plus">
                      <i class="iconfont icon-plus"></i>
                        <p>图片文件小于1MB</p>
                    </span>
                </div>
              </el-upload>
            </div>
            <div class="member-pic-item fr">
              <h3>学生认证</h3>
              <el-upload
                class="member-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="function (res) {
                  handleImgSuccess('studentCard', res);
                }"
                :before-upload="beforeImgUpload">
                <div class="visua-upload">
                    <span v-if="studentCard" class="visua-band">
                      <img :src="studentCard" alt="">
                      <span class="visua-text">修改照片</span>
                    </span>
                  <span v-else class="logo-plus">
                      <i class="iconfont icon-plus"></i>
                        <p>图片文件小于1MB</p>
                    </span>
                </div>
              </el-upload>
            </div>
          </div>
          <div class="ident">
            <h3>身份证号<span>*</span></h3>
            <h4>
              <input
                v-model="memberData.idcard"
                type="text"
                placeholder="请输入身份证号"
                v-validate="'required|idCard'"
                name="idCard">
            </h4>
            <p class="field-error" v-show="errors.has('idCard')">{{errors.first('idCard')}}</p>
          </div>
          <div class="ident-card clearfix">
            <div class="ident-name fl">
              身份证照片<span>*</span>
            </div>
            <div class="ident-img fr clearfix">
              <el-upload
                class="front-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="function (res) {
                  handleImgSuccess('idcardFace', res);
                }"
                :before-upload="beforeImgUpload">
                <div class="card-upload" :class="{active: idcardFace}">
                    <span v-if="idcardFace" class="upload-preview">
                      <img :src="idcardFace" class="avatar">
                      <span>修改照片</span>
                    </span>
                  <span v-else class="avatar-plus">
                      <img src="../../../assets/images/id1.png" alt="">
                    </span>
                </div>
              </el-upload>
              <el-upload
                class="front-uploader"
                action="http://upload-z1.qiniup.com/"
                :data="fileData"
                :show-file-list="false"
                :on-success="function (res) {
                  handleImgSuccess('idcareBack', res);
                }"
                :before-upload="beforeImgUpload">
                <div class="card-upload" :class="{active: idcareBack}">
                    <span v-if="idcareBack" class="upload-preview">
                      <img :src="idcareBack" class="avatar">
                      <span>修改图片</span>
                    </span>
                  <span v-else class="avatar-plus">
                      <img src="../../../assets/images/id2.png" alt="">
                    </span>
                </div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="member-info-btn">
          <span class="high" v-if="isMemberConfirm" @click="addMember">确定</span>
          <span v-else>确定</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { qiniuUrl } from '../../../config/env';
  import { mapGetters } from 'vuex';

  export default {
    name: 'MemberDialog',
    data () {
      return {
        qiniuImageUrl: '',
        fileData: {
          token: '',
          key: ''
        },
        headImage: '',
        idcardFace: '',
        idcareBack: '',
        studentCard: '',
        memberData: {
          name: '',
          telphone: '',
          headImage: '',
          profession: '',
          highUnit: '',
          idcard: '',
          idcardFace: '',
          idcareBack: '',
          studentCard: ''
        }
      };
    },
    props: ['dialogTitle', 'dialogVisible', 'memberInfo'],
    created () {
      this.qiniuImageUrl = qiniuUrl;
      this.fileData.token = this.qiniuKey;
      if (this.memberInfo && this.memberInfo.name) {
        Object.keys(this.memberData).forEach(key => {
          if (this.memberInfo[key]) {
            this.memberData[key] = this.memberInfo[key];
          }
        });
        this.memberData.highUnit = this.memberInfo.hignUnit ? this.memberInfo.hignUnit : '';
        this.headImage = this.memberInfo.headImage.indexOf('http://thirdwx.qlogo.cn/') > -1 ? this.memberInfo.headImage : `${this.qiniuImageUrl}/${this.memberInfo.headImage}`;
        this.studentCard = this.memberInfo.studentCard ? `${this.qiniuImageUrl}/${this.memberInfo.studentCard}` : '';
        this.idcardFace = this.memberInfo.idcardFace ? `${this.qiniuImageUrl}/${this.memberInfo.idcardFace}` : '';
        this.idcareBack = this.memberInfo.idcareBack ? `${this.qiniuImageUrl}/${this.memberInfo.idcareBack}` : '';
      }
    },
    computed: {
      ...mapGetters(['bandInfo', 'qiniuKey']),
      isMemberConfirm () {
        for (let key in this.memberData) {
          if (key === 'profession' || key === 'highUnit' || key === 'studentCard') {
            continue;
          }
          if (!this.memberData[key]) {
            return false;
          }
        }
        return true;
      }
    },
    methods: {
      beforeImgUpload (file) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        this.fileData.key = `${file.uid}.${type}`;
        const isJPG = file.type.indexOf('image/') > -1;
        const isLt2M = file.size / 1024 / 1024 < 1;
        const isGif = file.type !== 'image/gif';
        if (!isJPG) {
          this.$message.error('只能上传图片');
        }
        if (!isGif) {
          this.$message.error('不可以上传GIF格式！');
        }
        if (!isLt2M) {
          this.$message.error(`上传图片不能大于1MB!`);
        }
        return isJPG && isLt2M && isGif;
      },
      handleImgSuccess (text, res) {
        this.$set(this.memberData, text, res.key);
        this[text] = `${this.qiniuImageUrl}/${res.key}`;
      },
      closeDialog () {
        this.$emit('closeDialog', false);
      },
      addMember () {
        this.$validator.validateAll().then(result => {
          if (result) {
            let bandInfo = {
              id: this.bandInfo.basicInfo.id
            };
            let memberInfo = {
              name: this.memberData.name,
              telphone: this.memberData.telphone,
              headImage: this.memberData.headImage,
              profession: this.memberData.profession
            };
            let memberSubInfo = {
              idcard: this.memberData.idcard,
              idcardFace: this.memberData.idcardFace,
              idcareBack: this.memberData.idcareBack,
              highUnit: this.memberData.highUnit,
              studentCard: this.memberData.studentCard
            };
            this.$emit('getMemberInfo', {
              bandInfo,
              memberInfo,
              memberSubInfo
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .member-cont {
    position: relative;

    .dialog-close {
      position: absolute;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      right: -40px;
      top: -90px;
      transform: rotate(-45deg);
      cursor: pointer;

      .iconfont {
        font-size: 38px;
      }
    }
  }
</style>
