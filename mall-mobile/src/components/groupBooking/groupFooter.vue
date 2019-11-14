<template>
  <div id="group-wrap">
    <div style="height: .88rem;"></div>
    <div class="group-footer">
      <ul>
        <li>
          <router-link to="/groupOffered" >
            <img src="../../assets/images/groupBooking/ct.png">
            <img src="../../assets/images/groupBooking/ct_a.png">
            <div>参团</div>
          </router-link>
        </li>
        <li>
          <router-link to="/groupTrta">
            <img src="../../assets/images/groupBooking/ty.png">
            <img src="../../assets/images/groupBooking/ty_a.png">
            <div>团营</div>
          </router-link>
        </li>
        <li>
          <router-link to="/groupFound">
            <p>
              <img src="../../assets/images/groupBooking/fx.png">
              <img src="../../assets/images/groupBooking/fx_a.png">
            </p>
            <div>发现</div>
          </router-link>
        </li>
        <li>
          <router-link :to="{path:'/my',query: {isGruop: 2}}">
            <img src="../../assets/images/groupBooking/wd.png">
            <img src="../../assets/images/groupBooking/wd_a.png">
            <div>我的</div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
    },
    watch: {
    },
    mounted: function () {
    },
    methods: {
      go () {
        this.$route.meta.isShowFooter = 2
        console.log(this.$route.meta.isShowFooter)
      }
    }
  }
</script>
<style scoped lang="less">
.group-footer{
  width:100%;
  max-width:7.5rem;
  height: .88rem;
  background:#ffffff;
  font-size:.22rem;
  font-family:"微软雅黑";
  position:fixed;
  bottom:0;
  z-index:2000;
  box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
  -webkit-box-shadow: 0 0 10px 0 hsla(0,6%,58%,.6);
  ul{
    display:box;
    display:-webkit-box;
    display:-moz-box;
    display:-ms-box;
    display:-o-box;
    color:#fff;
    background:none;
    li{
      box-flex:1;
      -webkit-box-flex:1;
      -moz-box-flex:1;
      -ms-box-flex:1;
      -o-box-flex:1;
      text-align:center;
      list-style: none;
      a{
        color:#666666;
        display:block;
        img:nth-child(1){
          display: block;
        }
        img:nth-child(2){
          display: none;
        }
        &.active img:nth-child(1){
            display: none;
          }
        &.active img:nth-child(2){
          display: block;
        }
        &.active div{
          color: #f95a58;
        }
      }
      p{
        width:.45rem;
        height:.45rem;
        margin: 0 auto;
        position: relative;
        i{
          display: block;
          text-align: center;
          background: #fff;
          border: 1px solid #f23030;
          color: #f23030;
          font-size: .22rem;
          height: .26rem;
          line-height: .26rem;
          border-radius: .18rem;
          padding: 0 .07rem;
          background-clip: padding-box;
          position: absolute;
          top: 0;
          left: .3rem;
        }
      }
      img{
        width:.45rem;
        height:.45rem;
        margin: 0 auto;
        margin-top:.08rem;
        margin-bottom:1px;
        vertical-align:top;
      }
      @media screen and (max-width: 320px) {
        img{
          margin-bottom:0px;
        }
      }
      @media screen and (min-width:321px) and (max-width:375px) {
        img{
          margin-bottom:2px;
        }
      }
    }
  }
}
.footer_d{
  height:1.03rem;
}
</style>
