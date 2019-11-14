<template>
  <div id="group-wrap">
    <div style="height: .88rem;"></div>
    <div class="group-footer">
      <ul>
        <li>
          <router-link to="/barterArea" >
            <img src="../assets/images/att/ATT_15.png">
            <img src="../assets/images/att/ATT_18.png">
            <div>易货区</div>
          </router-link>
        </li>
        <li class="release">
          <!--<router-link to="/release">-->
          <div @click="goRelease">
            <img src="../assets/images/att/ATT_17.png">
            <img src="../assets/images/att/ATT_17.png">
            <div class="text">发布</div>
          </div>
          <!--</router-link>-->
        </li>
        <li>
          <router-link to="/tradCenter">
            <p>
              <img src="../assets/images/att/ATT12.png">
              <img src="../assets/images/att/ATT_20.png">
            </p>
            <div>交易中心</div>
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
        this.$route.meta.isShowFooter = 3
        console.log(this.$route.meta.isShowFooter)
      },
      goRelease () {
        let bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
        if (bsbUserInfo && bsbUserInfo.token) {
          this.$router.push({path: '/release'})
        } else {
          localStorage.setItem('REDIRECT_URL', '/release')
          this.$router.push({
            path: '/login?attCode=' + 'A0001',
            query: {redirect: '/release'}
          })
        }
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
            color: #b56f24;
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
          width:.4rem;
          height:.4rem;
          margin: 0 auto;
          margin-top:.13rem;
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

      .release{
        height: 0.88rem;
        position: relative;
        img{
          position: absolute;
          top: 50%;
          left: 50%;
          width: .8rem;
          height: .8rem;
          margin-left: -.4rem;
          margin-top: -.8rem;
          border-radius: .5rem;
        }
        .text{
          position: absolute;
          top: 50%;
          left: 50%;
          width: .8rem;
          height: .8rem;
          margin-left: -.4rem;
          margin-top: .1rem;
          color: #666666;
        }
      }
    }
  }
  .footer_d{
    height:1.03rem;
  }
</style>
