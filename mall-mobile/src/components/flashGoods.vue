<template>
    <div class="flashPage">
      <ul>
        <li>
          <div class="goodsImg"></div>
          <div class="goodsDetail">
            <p class="goodsDec">发送到发送到发实打实大叔大婶asdasd大所大所大所多大师大师大师的</p>
            <span class="quotaNum">限购10件<i class="triangle-topleft"></i></span>
            <p class="dateRate">限时价：<b>￥258.00</b><span class="pre_rate">￥958.00</span></p>
            <div class="goodsDetailFoot">
              <div class="speed-List">
                <span class="leaveNum">{{leaveNum}}</span>
                <div class="progressBar" :style="{ width: progressLength}"></div>
              </div>
              <span class="speed-nowGet">马上抢</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
  import { Rater, LoadMore } from 'vux'
  export default {
    components: {
      Rater,
      loading: LoadMore
    },
    data () {
      return {
        leaveNum: '仅仅剩200件',
        progressLength: '55.5%'
      }
    },
    mounted: function () {
    },
    methods: {
      /**
       * 分页
       */
      loadMore () {
      }
    }
  }
</script>

<style lang="less" scoped>
.flashPage{
  width: 7.5rem;
  height: auto;
  ul{
    li{
      margin-top: 0.17rem;
      background: #fbeee8;
      padding: 0.24rem;
      display: flex;
      .goodsImg{
        width: 2.7rem;
        height: 2.7rem;
        background: #fff;
        margin-right: 0.24rem;
      }
      .goodsDetail{
        flex: 1;
        .goodsDec{
          width: 3rem;
          height: 1rem;
          line-height: 0.5rem;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #3e3e3e;
          font-size: 0.3rem;
          font-weight: 600;
        }
        .quotaNum{
          display: inline-block;
          background: #fc2f53;
          color: #fff;
          margin-top: 0.01rem;
          position: relative;
          border-top-left-radius: 0.05rem;
          border-top-right-radius: 0.05rem;
          border-bottom-right-radius: 0.05rem;
          .triangle-topleft {
            width: 0;
            height: 0;
            border-top: 0.2rem solid #fc2f53;
            border-right: 0.2rem solid transparent;
            position: absolute;
            bottom: -0.15rem;
            left: 0rem;
          }
        }
        .dateRate{
          margin-top: 0.12rem;
          b{
            font-size: 0.28rem;
            color: #bf3f47;
            font-weight: 600;
          }
          .pre_rate{
            font-size: 0.18rem;
            color: #a6a6a6;
            text-decoration: line-through;
          }
        }
        .goodsDetailFoot{
          display: flex;
          margin-top: 0.04rem;
          .speed-List{
            width: 2.1rem;
            height: 0.3rem;
            line-height: 0.3rem;
            background: #fbeee8;
            border-radius: 20px;
            margin-right: 0.3rem;
            border: 1px solid #a19e8f;
            position: relative;
            bottom: -0.2rem;
            font-size: 0.12rem;
            text-align: center;
            color: #bb9360;
            .progressBar{
              max-width: 100%;
              height: 0.3rem;
              background: #fad7ba;
              border-radius: 20px;
              position: absolute;
              left: 0;
              top: 0;
              opacity: 0.5;
            }
          }
          .speed-nowGet{
            width: 1.6rem;
            height: 0.56rem;
            line-height: 0.56rem;
            border-radius: 0.1rem;
            background: #fc334d;
            color: #fff;
            font-size: 0.26rem;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
