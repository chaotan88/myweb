
<template>
  <div class='list-box'>
    <template v-for="(item, index) in AllColumnList">
      <div class="list-title">
        <div class="list-title-t">
          <div class="list-title-t-txt" :class="index % 2 == 0 ? 'Fontblue' : 'Fontred'">
            <div class="list-title-lbg">
              <img src="../assets/images/spliceOder/list-title-lbg.png" v-if="index % 2 == 0">
              <img src="../assets/images/coulm-title-lbg.png" v-else>
            </div>
            <!--title-->
            <template v-if="goodsTypes == 'cart'">
              <span>为 / 你 / 推 / 荐</span>
            </template>
            <template v-else-if="goodsTypes == 'my'">
              <span>推 / 荐 / 商 / 品</span>
            </template>
            <template v-else>
              <span>{{item.columnNameStr}}</span>
            </template>
            <div class="list-title-rbg">
              <img src="../assets/images/spliceOder/list-title-rbg.png" v-if="index % 2 == 0">
              <img src="../assets/images/coulm-title-rbg.png" v-else>
            </div>
          </div>
          <!--是否显示更多按钮-->
          <template v-if="isShowMore">
            <div class="list-title-t-more" @click="goGoodsList(item)" :class="index % 2 == 0 ? 'Fontblue' : 'Fontred'">
              <span>更多</span>
              <x-icon type="ios-arrow-right" size=".3rem"></x-icon>
            </div>
          </template>
        </div>
        <img :src='item.mainImage | filterImgUrl' class="list-title-img" v-if="item.mainImage">
      </div>
      <div class='list'>
        <div class='list-lis' v-for="ite in item.goodsList">
        <router-link :to="{path:'/goodDetail',query: {goodsId: ite.id}}">
          <div class="list-lis-box">
            <div class="list-img">
              <img v-lazy="ite.mainImage" :data-srcset="ite.mainImage | filterImgUrl">
            </div>
            <div class='list-tit'>{{ite.goodsName}}</div>
            <div class='list-bot'>
              <div class='list-bot-lef'>
                <div>¥ {{ite.whetherSpecial && ite.goodsSpecialPrice ? ite.goodsSpecialPrice : ite.goodsPrice | moneyFilter}}</div>
                <!-- <div>¥ {{ite.goodsPrice}}</div> -->
              </div>
              <div class="list-bot-rig"><img src='../assets/images/join-cart.png'></div>
            </div>
          </div>
        </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
  export default {
    /**
     * @isShowMore   是否显示更多按钮
     * @isShowBanner 是否显示banner
     * @goodsTypes   列表类型
    */
    props: {
      isShowMore: {
        type: Boolean,
        default: true
      },
      isShowBanner: {
        type: Boolean,
        default: true
      },
      goodsTypes: {
        type: String,
        default: 'home'
      }
    },
    data () {
      return {
        noColumn: false,                     // 无栏目
        AllColumnList: []                    // 栏目及栏目列表
      }
    },
    mounted: function () {
      this.getAllColumnList()                // 获取栏目
    },
    methods: {
      /**
       * 获取栏目及栏目列表
      */
      getAllColumnList () {
        this.$http.get(this.api.getAllColumnList, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== parseInt(this.api.ERR_OK)) {
            this.noColumn = 1
            return false
          }
          this.noColumn = resData.data.length > 0 ? 0 : 1
          // 购物车、我的页面推荐商品取栏目中的第一个
          if (this.goodsTypes !== 'home') {
            var firstData = resData.data.filter((row) => row.goodsList.length > 0)  // 过滤列表为零的情况
            this.AllColumnList = [firstData[0]]
          } else {
            this.AllColumnList = resData.data.filter((row, index) => index > 0 && row.goodsList.length > 0)  // 过滤列表为零的情况
          }
          this.AllColumnList.forEach((item, index) => {
            this.$set(item, 'columnNameStr', '')
            if (item.columnName) {
              var columnName = item.columnName.split('')
              columnName.forEach((ite, ind) => {
                item.columnNameStr += item.columnName[ind] + ' / '
              })
              item.columnNameStr = item.columnNameStr.substring(0, item.columnNameStr.length - 2)
            }
          })
          this.$nextTick(() => {
            this.$emit('getListData', resData.data)      // 传递数据
          })
        })
      },
      /**
       * 跳到商品列表页
      */
      goGoodsList (v) {
        localStorage.setItem('CoumnBanner', v.mainImage) // 存储栏目主图
        localStorage.setItem('navCoumnName', v.columnName) // 存储栏目名称 方便列表页更新页面title
        this.$router.push({path: '/goodList', query: { searchType: 2, columnId: v.columnId }})
      }
    }
  }
</script>
<style  lang=less>
  /**列表**/
  .list-box{
    /* height: 100%; */
    background:#f1f2f6;
    padding-bottom: .5rem;
    /* overflow: hidden; */
    /* border-bottom: .32rem solid #eee; */
    &:last-child{
      border-bottom: none;
    }
    .Discount{
      width: .86rem;
      height: .86rem;
      background: #f4918d;
      border-radius: 50%;
      position: absolute;
      top: .19rem;
      left: .3rem;
      color: #fff;
      font-size: .22rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
      div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
    .list{
      padding:0 .2rem;
      height: 100%;
      overflow: hidden;
      /* padding-bottom: .4rem; */
      .list-lis{
        /* width: 3.53rem; */
        height: 5.38rem;
        overflow: hidden;
        /* margin-right: .04rem;
        float: left;
        margin-bottom: .04rem; */
        box-sizing: border-box;
        /* background:#fff; */
        float: left;
        width: 50%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding-bottom: 4px;
        position: relative;
        &:nth-child(odd) {
          padding-right: 2px;
        }
        &:nth-child(2n){
          padding-left: 2px;
          border-right: none;
        }
        a{
          display: block;
          height: 100%;
        }
        .list-lis-box{
          height: 100%;
          background: #fff;
          border-radius: 7px;
        }
        .list-img{
          width:100%;
          height: 3.69rem;
          display: block;
          img{
            width: 100%;
            height: 100%;
            border-top-left-radius:7px;
            border-top-right-radius:7px;
          }
        }
        .list-tit{
          display: -webkit-box;
          display: -moz-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp:2;
          font-size: .24rem;
          color: #909090;
          margin: .12rem .23rem;
        }
        .list-bot{
          display: flex;
          align-items: center;
          position: absolute;
          bottom: .23rem;
          width: auto;
          left: .23rem;
          right: .23rem;
        }
        .list-bot-lef{
          overflow: hidden;
          margin-right: .05rem;
          flex: 1;
          div{
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:nth-child(1){
              font-size: .28rem;
              color: #f74d4d;
            }
            &:nth-child(2){
              font-size: .24rem;
              color: #b8b8b8;
              text-decoration: line-through;
            }
          }
        }
        .list-bot-rig{
          width: .93rem;
          height: .46rem;
          border:1px solid #d4d4d4;
          border-radius:3px;
          margin-right: .1rem;
          text-align: center;
          line-height: .46rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            width: .34rem;
            height: .34rem;
            display: inline-block;
          }
        }
      }
    }
  }
  /**列表标题**/
  .list-title{
    .list-title-t{
      height: .8rem;
      width:7.5rem;
      position:relative;
      display:flex;
      align-items:center;
      justify-content: flex-end;
      .list-title-t-txt{
        overflow:hidden;
        display:flex;
        align-items: center;
        justify-content: center;
        margin:0 auto;
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin: auto;
        &.Fontblue{
          span{
            color: #6738ff;
          }
        }
        &.Fontred{
          span{
            color: #ff57c1;
          }
        }
        span{
          display:block;
          max-width:3rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color:#6738ff;
        }
        .list-title-lbg{
          width:.62rem;
        }
        .list-title-rbg{
          width:.77rem;
        }
        img{
          width:100%
        }
      }
      .list-title-t-more{
        padding: .1rem .24rem;
        display: flex;
        justify-content: flex-end;
        color: #666666;
        font-size: .26rem;
        align-items: center;
        position:relative;
        z-index:300;
        .vux-x-icon{
          fill: #fff;
          background: #8f65e8;
          border-radius: 50%;
          margin-left: .1rem;
        }
        &.Fontblue{
          .vux-x-icon{
            background: #6738ff;
          }
        }
        &.Fontred{
          .vux-x-icon{
            background: #ff57c1;
          }
        }
      }
    }
    .list-title-img{
      width:7.1rem;
      height:2.29rem;
      border-radius:7px;
      display:block;
      margin:0 auto;
      margin-bottom:.23rem;
    }
  }
</style>
