<template>
  <div class="progress-container">
    <div v-if="userInfo.auditStatus === 2" class="progress">
      <img src="../../../assets/images/band/band_progress5.png" alt="">
    </div>
    <div v-if="userInfo.auditStatus === 1" class="progress">
      <img src="../../../assets/images/band/band_progress4.png" alt="">
    </div>
    <div v-if="userInfo.auditStatus === 3 || userInfo.auditStatus === 0" class="progress">
      <img src="../../../assets/images/band/band_progress3.png" alt="">
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'Progress',
    computed: {
      ...mapGetters(['userInfo'])
    }
  };
</script>

<style lang="scss" scoped>
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
