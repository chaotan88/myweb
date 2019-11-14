<template>
    <div class="cartcontrol">
      <ul class="cartcontrol-box">
        <!--减-->
        <li class="cart-decrease" @click.stop.prevent="decreaseFun">
          <x-icon type="ios-minus-empty" size="20"></x-icon>
        </li>
        <li class="cart-count">{{count}}</li>
        <!--加-->
        <li class="cart-add" @click.stop.prevent="addFun">
          <x-icon type="ios-plus-empty" size="20"></x-icon>
        </li>
      </ul>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    // props: ['good', 'ind', 'index', 'goodsNum'],
    props: {
      value: {
        validator (value) {
          if (typeof value === 'number') {
            return true
          } else if (typeof value === 'string') {
            return value === ''
          }
          return false
        },
        default: 1
      }
    },
    data () {
      return {
        count: 1 // 总数
      }
    },
    mounted: function () {
      // 将接口中的数量显示出来
      if (this.$route.path === '/shopCart') {   // 购物车列表页
        this.count = this.value
      }
    },
    methods: {
      // 减
      decreaseFun () {
        if (this.count > 1) {
          this.count--
          this.$emit('countFun')
        }
      },
      // 加
      addFun () {
        this.count++
        this.$emit('countFun')
      },
      // 更新购物车数量
      updateGoodsNumToShopCartFun (shopCartId, goodsNum) {
        this.$http.post(this.api.updateGoodsNumToShopCart, {
          id: shopCartId,
          goodsNum: goodsNum
        }).then((res) => {
          // 成功
        })
      }
    },
    computed: {
      ...mapState(['cartSte'])
    }
    // watch: {
    //   count (v, oldVal) {
    //     if (this.$route.path === '/goodDetail') {       // 商品详情页
    //       this.$emit('countFun', v)
    //     } else if (this.$route.path === '/shopCart') {  // 购物车列表页
    //       this.good[this.ind].list[this.index].goodsNum = this.count
    //       this.updateGoodsNumToShopCartFun(this.good[this.ind].list[this.index].id, this.good[this.ind].list[this.index].goodsNum)
    //       this.$emit('countFun', v)
    //     }
    //   },
    //   // 监听状态管理更新购物车数量
    //   cartSte: function () {
    //     this.count = this.good[this.ind].list[this.index].goodsNum
    //   }
    // }    // watch: {
    //   count (v, oldVal) {
    //     if (this.$route.path === '/goodDetail') {       // 商品详情页
    //       this.$emit('countFun', v)
    //     } else if (this.$route.path === '/shopCart') {  // 购物车列表页
    //       this.good[this.ind].list[this.index].goodsNum = this.count
    //       this.updateGoodsNumToShopCartFun(this.good[this.ind].list[this.index].id, this.good[this.ind].list[this.index].goodsNum)
    //       this.$emit('countFun', v)
    //     }
    //   },
    //   // 监听状态管理更新购物车数量
    //   cartSte: function () {
    //     this.count = this.good[this.ind].list[this.index].goodsNum
    //   }
    // }
  }
</script>

<style scoped lang=less>
    .cartcontrol {
      .cartcontrol-box{
        width:1.8rem;
        height: 0.5rem;
        line-height: 0.5rem;
        border:1px solid #eee;
        border-radius: 0.05rem;
        li{
          float: left;
          height: 0.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /*减*/
        .cart-decrease{
          width: 0.5rem;
        }
        .cart-count{
          width: 0.75rem;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
          color:#333;
        }
        /*加*/
        .cart-add{
          width:0.5rem;
        }
        .vux-x-icon {
          fill: #333;
        }
      }
      &:after{
        display: block;
        content: ".";
        height: 0;
        line-height: 0;
        clear: both;
        visibility: hidden;
      }
    }
</style>
