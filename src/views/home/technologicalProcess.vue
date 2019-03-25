<template>
  <div class="process-wrapper">
    <div class="detail-wrapper" :class="detailBackground">
      <button class="go-back pre" @click="goToHome"></button>
      <button class="num pre">
        {{num}}
      </button>
      <button class="go-next pre" :class="reduceNum" @click="goToNext"></button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      rollAgent: {
        type: Boolean
      },
      rollBand: {
        type: Boolean
      }
    },
    data () {
      return {
        num: 30
      };
    },
    updated () {
      if (this.rollAgent === true || this.rollBand === true) {
        if (this.num > 0 && this.num <= 30) {
          setTimeout(() => {
            this.num--;
          }, 1000);
        }
      };
    },
    watch: {
      num () {
        console.log(this.num);
      }
    },
    methods: {
      goToNext () {
        this.$router.push({
          path: '/real-name'
        });
      },
      goToHome () {
        window.location.reload();
      }
    },
    computed: {
      detailBackground () {
        if (this.rollAgent === true) {
          return 'process-wrapper-agent';
        } else if (this.rollBand === true) {
          return 'process-wrapper-band';
        };
      },
      reduceNum () {
        if (this.num <= 0) {
          return 'can-see';
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .process-wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: rgba(0,0,0, 0.7);
    .detail-wrapper {
      width: 1000px;
      height: 900px;
      position: relative;
      left: 50%;
      margin-left: -450px;
      top: 10%;
      .pre {
        width: 180px;
        height: 60px;
        border: transparent;
        border-radius: 15px;
        position: absolute;
      }
      .go-back {
        background-image: url(../../assets/images/broker/btn_back.png);
        background-size: 100% 100%;
        bottom: 160px;
        left: 500px;
      }
      .go-next {
        background-image: url(../../assets/images/broker/sign_Up.png);
        background-size: 100% 100%;
        bottom: 160px;
        left: 700px;
        display: none;
      }
      .can-see {
        display: block;
      }
      .num {
        background-image: url(../../assets/images/broker/loading.png);
        background-size: 100% 100%;
        font-size: 30px;
        color: #ffffff;
        bottom: 160px;
        left: 700px;
      }
    }
    .process-wrapper-agent {
      background-image: url(../../assets/images/broker/agent_detail.png);
      background-size: 100% 100%;
    }
    .process-wrapper-band {
      background-image: url(../../assets/images/broker/band-detail.png);
      background-size: 100% 100%;
    }
  }
</style>
