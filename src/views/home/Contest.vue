<template>
  <div class="contest-container">
    <div class="contest commonWidth">
      <div class="contest-time">
        <h3>
          <img src="../../assets/images/icon/date_icon.png" alt="">
          <span>报名时间 <i>2018年10月7日-摸金赛结束</i></span>
        </h3>
        <p>报名期间，所有观众可以在此网站中在线<span>点赞支持</span>各个乐队，每个赛区按<span>人气排名</span>取前若干名入围比赛。<br/>每场比赛前一周，选出所在大区单场入围乐队，并入围乐队停止投票，其余未入围乐队继续投票。</p>
        <h4>
          <img src="../../assets/images/icon/like_icon.png" alt="">
          <span>请各乐队、经纪人加油为乐队积攒人气！</span>
        </h4>
      </div>
      <div class="contest-pop clearfix">
        <div class="pop-item fl">
          <span class="pop-area color-o">西南赛区</span>
          <span class="pop-rank">人气前 <i>96</i>名入围比赛</span>
        </div>
        <div class="pop-item fl">
          <span class="pop-area color-t">东北赛区</span>
          <span class="pop-rank">人气前 <i>32</i>名入围比赛</span>
        </div>
        <div class="pop-item fl">
          <span class="pop-area color-e">华北赛区</span>
          <span class="pop-rank">人气前 <i>32</i>名入围比赛</span>
        </div>
        <div class="pop-item fl">
          <span class="pop-area color-d">西北赛区</span>
          <span class="pop-rank">人气前 <i>32</i>名入围比赛</span>
        </div>
        <div class="pop-item fl">
          <span class="pop-area color-f">华东赛区</span>
          <span class="pop-rank">人气前 <i>32</i>名入围比赛</span>
        </div>
        <div class="pop-item fl">
          <span class="pop-area color-b">华南赛区</span>
          <span class="pop-rank">人气前 <i>32</i>名入围比赛</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'contest'
    };
</script>

<style lang="scss" scoped>
  .contest {
    padding-bottom: 90px;

    .contest-time {
      padding: 0 52px;

      h3 {
        margin-bottom: 10px;
        color: #D4AA70;

        span {
          padding-left: 40px;
          font-size: 36px;
          vertical-align: middle;
        }

        i {
          padding-left: 22px;
          font-size: 34px;
        }
      }

      p {
        padding-left: 92px;
        line-height: 48px;
        font-size: 25px;
        color: #2D2B2B;
      }

      h4 {
        margin-top: 45px;
        font-size: 36px;

        span {
          padding-left: 35px;
          vertical-align: middle;
          color: #EA888C;
        }
      }
    }

    .contest-pop {
      margin-top: 50px;
      padding: 60px 0;
      background: #665C80;

      .pop-item {
        width: 476px;
        margin: 0 90px 73px;
        font-size: 0;

        &:nth-of-type(5),
        &:nth-of-type(6) {
          margin-bottom: 0;
        }

        span {
          display: inline-block;
        }

        .pop-area {
          width: 44px;
          padding: 20px;
          font-size: 22px;
          background: #43395E;
          vertical-align: middle;
          border-radius: 50%;

          &.color-o {
            color: #8FC8CA;
          }

          &.color-t {
            color: #5CD7D0;
          }

          &.color-e {
            color: #E7B163;
          }

          &.color-d {
            color: #4CBBF2;
          }

          &.color-f {
            color: #F04ED4;
          }

          &.color-b {
            color: #F75A6A;
          }
        }

        .pop-rank {
          padding-left: 40px;
          vertical-align: middle;
          font-size: 26px;
          color: #fff;

          i {
            padding: 0 20px 0 15px;
            font-size: 54px;
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>
