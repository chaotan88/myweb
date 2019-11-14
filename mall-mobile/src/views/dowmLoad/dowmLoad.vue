<template>
  <div class="down-load">
    <div class="down-ban">
      <img src="../../assets/images/down/downLoadBan.png">
    </div>
    <div class="down-con">
      <img src="../../assets/images/down/downLoadBg.png">
      <h2>真芯天下<span></span>品质溯源</h2>
      <div class="down-con-btn" @click="downLoad">APP下载</div>
    </div>
    
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    mounted: function () {
    },
    methods: {
      /**
       * 下载
      */
      downLoad () {
        var u = navigator.userAgent
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isAndroid) {
          //
        } else if (isiOS) {
          //
        } else {
          //
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.down-load{
  width: 7.5rem;
  min-height: calc(100vh);
  background: #f23030;
  overflow-y: scroll;
  .down-ban{
    img{
      width: 100%;
    }
  }
  .down-con{
    width: 7.5rem;
    img{
      width: 100%;
    }
    h2{
      text-align: center;
      color: #fff;
      font-size: .46rem;
      margin-top: -1.7rem;
      span{
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #fff;
        border-radius: 5px;
        margin: 0 .3rem;
      }
    }
    .down-con-btn{
      width: 6.83rem;
      height: .74rem;
      background: #fff;
      border-radius: 5px;
      text-align: center;
      line-height: .74rem;
      color: #e22b2b;
      font-size: .28rem;
      margin: 0 auto;
      position: relative;
      margin-top: 1.25rem;
      margin-bottom: .7rem;
    }
  }
}
</style>
