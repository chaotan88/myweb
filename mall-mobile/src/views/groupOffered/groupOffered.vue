<template>
  <div class="offered-wrap" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <!--头部分区 tab banner-->
    <div class="titleBanner">
        <tabBanner :type="9" @bannerBack="bannerBack"> </tabBanner>
    </div>
    <!--列表-->
    <div class="offered-list620">
      <ul>
        <li v-for="(item, index) in listDate" :key="index" @click="goPage('/goodDetail', item)">
          <!--商品图片-->
          <div class="goods-img">
            <img :src="item.img"/>
          </div>
          <!--商品名称-->
          <div class="goods-name">
            <p>{{item.goodsName}}</p>
          </div>
          <div class="goods-price">
            <!--商品价格 画线价-->
            <b>￥{{item.goodsPrice | moneyFilter}}</b><span>￥{{item.linePrice | moneyFilter}}</span>
          </div>
          <div class="goods-saleInfo">
            <div v-if="item.groupPeople > 0">已拼<span>{{item.groupPeople}}</span>人</div>
            <div v-else></div>
            <div v-show="!doningList[item.goodsId]">立即拼</div>
            <div v-show="doningList[item.goodsId]" class="errorGroup">拼团中</div>
          </div>
        </li>
      </ul>
    </div>
    <to-top class="topFixed" v-if="isNav"></to-top>
    <load-more tip="数据加载中" v-if="showLoading"></load-more>
  </div>
</template>
<script>
  import groupFooter from '../../components/groupBooking/groupFooter'
  import toTop from '../../components/groupBooking/goTop'
  import tabBanner from '../../components/Partition/banner'
  import {LoadMore} from 'vux'
  export default {
    name: 'groupOffered',
    components: {
      groupFooter,
      toTop,
      tabBanner,
      LoadMore
    },
    data () {
      return {
        start: 1,             // 分页 当前页面
        pageSize: 10,         // 分页 页面大小
        goodsGroupId: '',    // 分区id
        busy: '',            // 防止多次刷新接口
        showLoading: false, // 接口请求数据刷新蔗层
        testing03: require('../../assets/images/groupBooking/testing_03.png'),
        testing06: require('../../assets/images/groupBooking/testing_06.png'),
        isNav: false,
        doningList: {},       // 拼团种
        listDate: []         // 商品列表
      }
    },
    mounted: function () {
      // 登陆后检测是否拼团中
      this.checkLogin(() => {
        this.groupDoing()
      }, () => {})
      this.getSuperGroupGoodsList()
      window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
      /**
       * 检测是否登录
       */
      checkLogin (fun, err) {
        this.$http.get(`${this.api.ifLogin}`, {
        }).then((res) => {
          let resData = res.data
          this.isLogin = res.data
          if (parseInt(resData.data) !== parseInt(this.api.ERR_OK)) {
            err()
            return false
          }
          fun()
        })
      },
      /**
       * 再次开团是否灰色
       */
      groupDoing (v) {
        this.$http.get(`${this.api.etSuperGroupingGoodsId}`, {
          params: {goodsId: 0}
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) === parseInt(this.api.ERR_OK)) {
            var doning = {}
            for (let i in resData.data) {
              doning[resData.data[i]] = 1
            }
            console.log(doning)
            this.doningList = doning
          }
        })
      },
      // 滚动条事件
      handleScroll () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        var domTop = 270
//        console.log(document.getElementById('topBox'), 'domTop')
        // 按钮漂浮
        if (scrollTop >= domTop) {
          this.isNav = true
        } else {
          this.isNav = false
        }
      },
      // 分页
      loadMore () {
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (parseInt(this.start) > parseInt(this.totalPage)) {
            this.showLoading = false
            return
          }
        }
        // console.log('分頁')
        this.start = this.start + 1 // 当前页数
        this.getSuperGroupGoodsList() // 分页数据
      },
      /**
       *Banner导航切换
       * */
      bannerBack (res) {
//        console.log(res)
        this.goodsGroupId = res.goodsGroupId
        this.listDate = []
        this.start = 1
        this.getSuperGroupGoodsList()
      },
      /**
       *拼团商品列表
       * @item.goodsId       商品id
       * @item.img            商品图片
       * @item.goodsPrice    商品价格(拼团价格)
       * @item.linePrice     商品划线价格(销售价格)
       * @item.groupPeople   商品id(购买人数)
       * */
      getSuperGroupGoodsList () {
//         '/src/assets/js/tsconfig.json'
        this.$http.post(`${this.api.getSuperGroupGoodsList}`, {
          goodsGroupId: this.goodsGroupId,
          start: this.start,
          pageSize: this.pageSize
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          let resDate = res.data.data
          let list = resDate.list
          let resList = []
          for (let i in list) {
            let item = {
              goodsId: list[i].goodsId,
              img: list[i].mainImage,
              goodsName: list[i].goodsName,
              goodsPrice: list[i].goodsGroupPrice,
              linePrice: list[i].goodsPrice,
              groupPeople: list[i].hasGroupPeople
            }
            resList.push(item)
          }
          this.noData = res.data.data.list.length > 0 ? !!false : !!true
          this.listDate = this.listDate.concat(resList)
          this.totalPage = Math.ceil(res.data.data.total / res.data.data.pageSize)
        })
      },
      /**
       *拼团商品列表
       * @param.path          路径
       * @v.id                 商品id
       * @item.goodsPrice    商品价格(拼团价格)
       * @item.linePrice     商品划线价格(销售价格)
       * @item.groupPeople   商品id(购买人数)
       * */
      goPage (path, v) {
        this.$router.push({path: path, query: {goodsId: v.goodsId, goodsGroupId: this.goodsGroupId, pageType: 12}})
      }
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)   // 离开页面清除（移除）滚轮滚动事件
    }
  }
</script>
<style scoped lang=less>
  .offered-wrap{
    padding-top: .75rem;
    min-height: 92vh;
    background: #f1f2f5;
    .offered-titleTab {
      display: flex;
      flex-direction:row;
      justify-content: space-between;
      width: 100%;
      max-width: 7.5rem;
      height: .75rem;
      overflow: hidden;
      /*box-shadow:0px 4px 8px #d1d1d1;*/
      background: #fff;
      position: fixed;
      top: 0px;
      left: 0px;
      z-index: 5000;
      .offered-box{
        overflow-x: scroll;
        height: .75rem;
        line-height: .75rem;
        &::-webkit-scrollbar {/*隐藏滚轮*/
          display: none;
        }
        .box{
          display: flex;
          flex-direction:row;
          line-height: .7rem;
          display: -webkit-box;
        }
        .item-tab{
          margin-left: .4rem;
          margin-right: .4rem;
          font-size: .28rem;
          color: #535353;
        }
        .tabMarkCss{
          color: #f82828;
          border-bottom: 3px solid #f82828;
        }
      }
    }
    .offered-banner340{
      width: 100%;
      height: 3.4rem;
      background: #ccc;
    }
    .offered-list620{
      width: 7.5rem;
      height: auto;
      background: #f1f2f5;
      ul{
        display: flex;
        flex-wrap: wrap;
        width: 7.1rem;
        padding: 0.2rem;
        li{
          width: 3.1rem;
          background: #fff;
          padding: 0.2rem;
          -webkit-border-radius: 0.1rem;
          -moz-border-radius: 0.1rem;
          border-radius: 0.1rem;
          margin-bottom: 0.1rem;
          &:nth-of-type(2n) {
            margin-left: 0.05rem;
          }
          &:nth-of-type(2n+1) {
            margin-right: 0.05rem;
          }
          .goods-img{
            width: 100%;
            height: 3.23rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .goods-name{
            width: 2.89rem;
            height: 0.63rem;
            color: #333;
            margin-top: 0.12rem;
            font-size: 0.26rem;
            white-space: normal;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            p{
              line-height: 0.35rem;
            }
          }
          .goods-price{
            margin-top: 0.12rem;
            b{
              color: #f82828;
              font-size: 0.28rem;
            }
            span{
              color: #bfbfbf;
              font-size: 0.18rem;
              margin-left: 0.1rem;
              text-decoration: line-through;
            }
          }
          .goods-saleInfo{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0.4rem 0 0.31rem 0;
            div{
              &:nth-of-type(1) {
                color: #999999;
                font-size: 0.22rem;
              }
              &:nth-of-type(2) {
                width: 1.44rem;
                height: 0.54rem;
                line-height: 0.54rem;
                text-align: center;
                -webkit-border-radius: 0.08rem;
                -moz-border-radius: 0.08rem;
                border-radius: 0.08rem;
                background: #f82828;
                color: #fff;
              }
            }
            .errorGroup{
              width: 1.44rem;
              height: 0.54rem;
              line-height: 0.54rem;
              text-align: center;
              -webkit-border-radius: 0.08rem;
              -moz-border-radius: 0.08rem;
              border-radius: 0.08rem;
              background: #999;
              color: white;
            }
          }
        }
      }
    }
  }
  .topFixed{
    position: fixed;
    right: 0;
    bottom: 3.54rem;
  }
</style>

