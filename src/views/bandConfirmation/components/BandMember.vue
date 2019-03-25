<template>
  <div class="band-member-wrapper">
    <div class="band-member">
        <span class="band-member-block">
        </span>
      <span class="band-member-band">
          <img src="../../../assets/images/haoyuedui.png" alt="">
        </span>
      <div class="wrapper member-wrapper">
        <div class="band-member-tit">
          乐队成员<span>至少有2人才可以报名</span>
        </div>
        <div class="member-swiper flex">
          <div class="member-btn">
            <button class="left"></button>
            <button class="right"></button>
          </div>
          <div class="member-list">
            <swiper :options="swiperOption">
              <swiper-slide
                v-for="item in memberList"
                :key="item.id"
                class="slide-item">
                <div
                  v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3"
                  class="list-item">
                  <div class="img-box">
                    <img v-if="item.headImage.indexOf('http://thirdwx.qlogo.cn/') > -1" :src="`${item.headImage}`" alt="">
                    <img v-else :src="`${qiniuImageUrl}/${item.headImage}`" alt="">
                  </div>
                  <div class="text-info">
                    <div class="text-info-wrapper">
                      <h2>{{item.name}}</h2>
                      <h3>
                        <span v-if="item.auditRole === 1">队长</span>
                        <span>{{item.profession}}</span>
                      </h3>
                      <h3 v-if="item.hignUnit" class="text">{{item.hignUnit}}</h3>
                    </div>
                    <h4 @click="handleEditMember(item.id)">修改{{item.auditRole === 1 ? '队长' : '成员'}}资料</h4>
                  </div>
                </div>
                <div v-else class="list-item">
                  <div class="img-box">
                    <img v-if="item.headImage.indexOf('http://thirdwx.qlogo.cn/') > -1" :src="`${item.headImage}`" alt="">
                    <img v-else :src="`${qiniuImageUrl}/${item.headImage}`" alt="">
                  </div>
                  <div class="text-info">
                    <div class="text-info-wrapper">
                      <h2>{{item.name}}</h2>
                      <h3>
                        <span v-if="item.auditRole === 1">队长</span>
                        <span>{{item.profession}}</span>
                      </h3>
                      <div v-if="item.hignUnit" class="text">{{item.hignUnit}}</div>
                    </div>
                  </div>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
        <div
          v-if="userInfo.auditStatus === 0 || userInfo.auditStatus === 3"
          class="member-add"
          @click="openDialog">
          <h3>
            <i class="iconfont icon-plus"></i>
          </h3>
          <p>添加乐队成员</p>
        </div>
      </div>
    </div>
    <member-dialog
      v-if="dialogVisible"
      :dialogTitle="dialogTitle"
      :dialogVisible="dialogVisible"
      :memberInfo="signMemberInfo"
      @closeDialog="closeDialog"
      @getMemberInfo="getMemberInfo"
    ></member-dialog>
    <captin-dialog
      v-if="captinDialog"
      :dialogTitle="dialogTitle"
      :captinDialog="captinDialog"
      :memberInfo="signMemberInfo"
      @closeDialog="closeDialog"
      @getMemberInfo="getMemberInfo"
    >
    </captin-dialog>
  </div>
</template>

<script>
  import 'swiper/dist/css/swiper.css';
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import MemberDialog from './MemberDialog';
  import CaptinDialog from './CaptinDialog';
  import { mapGetters } from 'vuex';
  import { qiniuUrl } from '../../../config/env';
  import { getBandInfo, addBandMember } from '../../../server';

  export default {
    name: 'BandMember',
    data () {
      return {
        qiniuImageUrl: '',
        memberList: [],
        memberId: '',
        signMemberInfo: {},
        swiperOption: {
          slidesPerView: 3,
          spaceBetween: 30,
          navigation: {
            nextEl: '.member-btn .left',
            prevEl: '.member-btn .right'
          }
        },
        dialogTitle: '',
        dialogVisible: false,
        captinDialog: false
      };
    },
    created () {
      this.qiniuImageUrl = qiniuUrl;
      getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
        memberId: this.userInfo.id
      }).then(res => {
        this.$store.dispatch('setBandInfo', res.data);
        if (res.data.basicInfo.id) {
          this.$store.dispatch('setBandId', res.data.basicInfo.id);
        }
        this.bandInfo.members.forEach(item => {
          this.memberList.push(item);
        });
      });
    },
    computed: {
      ...mapGetters(['userInfo', 'bandInfo'])
    },
    components: {
      swiper,
      swiperSlide,
      MemberDialog,
      CaptinDialog
    },
    methods: {
      openDialog () {
        this.dialogVisible = true;
        this.dialogTitle = '添加乐队成员';
        this.memberId = '';
        this.signMemberInfo = {};
      },
      closeDialog () {
        this.dialogVisible = false;
        this.captinDialog = false;
      },
      getMemberInfo (params) {
        let memberData = params;
        if (this.memberId) {
          memberData.memberInfo.id = this.memberId;
        }
        addBandMember('member/saveOrUpdate', memberData).then(res => {
          if (res.code === 0) {
            if (this.memberId) {
              this.$message.success('修改成员成功');
            } else {
              this.$message.success('添加成员成功');
            }
            this.dialogVisible = this.captinDialog = false;
            getBandInfo(`band/detailByUserId/${this.userInfo.id}`, {
              memberId: this.userInfo.id
            }).then(resultBand => {
              this.$store.dispatch('setBandInfo', resultBand.data);
              this.memberList = this.bandInfo.members;
              if (resultBand.data.basicInfo && resultBand.data.basicInfo.id) {
                this.$store.dispatch('setBandId', resultBand.data.basicInfo.id);
              }
            });
          }
        });
      },
      handleEditMember (id) {
        this.dialogVisible = true;
        this.dialogTitle = '修改乐队成员';
        this.memberId = id;
        this.bandInfo.members.forEach((item) => {
          if (item.id === id) {
            if (item.auditRole === 1) {
              this.dialogVisible = false;
              this.captinDialog = true;
            }
            this.signMemberInfo = item;
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .band-member-wrapper {
    .wrapper {
      position: relative;
      width: 1280px;
      margin: 0 auto;
    }
    .flex {
      display: flex;
    }
    .band-member {
      height: 612px;
    }
    .member-add {
      position: absolute;
      width: 236px;
      height: 60px;
      line-height: 60px;
      background: #fff;
      top: 30px;
      right: 0;
      cursor: pointer;
      border-radius: 6px;
      text-align: center;
      h3 {
        display: inline-block;
        text-align: center;
        .icon-plus,
        .icon-tihuantupian {
          color: #828282;
          font-size: 22px;
        }
      }
      p {
        display: inline-block;
        padding-left: 10px;
        text-align: center;
        font-size: 24px;
        color: #828282;
      }
    }
    .band-member-tit {
      padding: 42px 0 50px;
      font-size: 40px;
      color: #1F1F1F;

      span {
        padding-left: 20px;
        font-size: 26px;
        color: #BB4342;
      }
    }
    .band-member {
      position: relative;
      background: #eee;
      margin-bottom: 220px;
      .captain-box {
        margin-bottom: 199px;
        .captain-info {
          flex: 1;
          .card {
            position: relative;
            box-sizing: border-box;
            margin-top: 199px;
            background: rgba(242, 242, 242, 1);
            height: 200px;
            box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.08);
            padding-top: 32px;
            padding-left: 336px;
            .captain-btn {
              position: absolute;
              top: 25px;
              right: 20px;
            }
            h2 {
              color: #1F1F1F;
              font-size: 36px;
              margin-bottom: 26px;
              span {
                color: #7A7A7A;
                font-size: 24px;
              }
            }
            .text {
              color: #7A7A7A;
              font-size: 24px;
              margin-bottom: 23px;
            }
          }
        }
        .captain-img {
          width: 400px;
          height: 400px;
          background-color: #fff;
          overflow: hidden;
          img {
            width: 400px;
          }
        }
      }
      .member-swiper {
        position: relative;
        left: -76px;
        .member-btn {
          margin-right: 15px;
          margin-top: 310px;
          button {
            background: none;
            border: none;
            outline: none;
            width: 60px;
            height: 60px;
            cursor: pointer;
            display: block;
            margin-bottom: 2px;
            &.left {
              background: url("../../../assets/images/icon/btn_left.png") top left no-repeat;
            }
            &.right {
              background: url("../../../assets/images/icon/btn_right.png") top left no-repeat;
            }
          }
        }
        .member-list {
          width: 1118px;
          .list-item {
            width: 340px;
            margin: 0 16px;
            float: left;
            .img-box {
              height: 340px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .text-info {
              box-sizing: border-box;
              text-align: left;
              background-color: #fff;
              padding: 30px 50px;
              .text-info-wrapper {
                height: 142px;
              }
              h2 {
                margin-bottom: 20px;
                font-size: 34px;
                color: #1f1f1f;
                span {
                  font-size: 24px;
                  color: #7a7a7a;
                }
              }
              h3 {
                margin-bottom: 20px;
                font-size: 24px;
                color: #7A7A7A;
              }
              h4 {
                width: 236px;
                height: 60px;
                line-height: 60px;
                border-radius: 6px;
                background: #eee;
                font-size: 24px;
                text-align: center;
                color: #7A7A7A;
                cursor: pointer;
              }
              .text {
                font-size: 24px;
                color: #7a7a7a;
                margin-top: 18px;
              }
            }
          }
        }
      }
    }
    .band-member-block {
      position: absolute;
      width: 144px;
      height: 40px;
      background: #F4A45C;
      left: 0;
      top: -20px;
    }
    .band-member-band {
      position: absolute;
      width: 54px;
      height: 570px;
      right: 200px;
      top: -117px;
    }
  }
</style>
