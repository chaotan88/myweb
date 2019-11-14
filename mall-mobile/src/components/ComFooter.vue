<template>
  <div id="foot-wrap">
    <div style="height: .88rem;"></div>
    <div class="footer">
      <ul>
        <li>
          <router-link to="/index" >
            <img src="../assets/images/home.png">
            <img src="../assets/images/my/home_active.png">
            <div>首页</div>
          </router-link>
        </li>
        <li>
          <router-link to="/classification">
            <img src="../assets/images/category.png">
            <img src="../assets/images/category_active.png">
            <div>分类</div>
          </router-link>
        </li>
        <li>
          <router-link to="/shopCart">
            <p>
              <img src="../assets/images/cart.png">
              <img src="../assets/images/cart_active.png">
              <i v-if="carListNums">{{carListNums}}</i>
            </p>
            <div>购物车</div>
          </router-link>
        </li>
        <li>
          <router-link to="/my">
            <img src="../assets/images/my/perCenter.png">
            <img src="../assets/images/my/perCenter_active.png">
            <div>我的</div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    props: ['route'],
    data () {
      return {
        carListNums: 0                           // 购物车总列表中的数量
      }
    },
    computed: {
      ...mapState(['cartSte'])
    },
    watch: {
      // 监听状态管理更新购物车数量
      cartSte: function () {
        this.getCartNum()
      }
    },
    mounted: function () {
      console.log(this.route)
      setTimeout(() => {
        this.getCartNum()    // 获取详情页信息
      }, 100)
    },
    methods: {
      /**
       * 获取购物车数量
      */
      getCartNum () {
        this.$http.post(`${this.api.getShopCartList}?noLogin=true`, {
        }).then((res) => {
          let resData = res.data
          if (resData.status !== this.api.ERR_OK || !res) return false
          this.carListNums = resData.data.total < 100 ? resData.data.total : '99+'
        })
      }
    }
  }
</script>
<style scoped lang="less">
.footer{
  width: 100%;
  max-width: 7.5rem;
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
