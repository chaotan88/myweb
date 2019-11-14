<template>
  <div class="fixedMeal-wrap">
    <div class="fixedMeal-content" v-infinite-scroll="loadMoreData" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <!--套餐类别-->
      <vue-scroll ref="optionalMealTypeBox" class="optionalMeal-type-box" id="optionalMealTypeBox">
        <div class="optionalMeal-type" id="optionalMeal-type">
          <div class="optionalMeal-type-wrap">
            <div class="optionalMeal-type-option" @click="mealDataIndex == index ? '' : columnTap($event, index)" v-for="(item,index) in mealDataList" :key="index" :class="mealDataIndex == index ? 'active' : ''">
              <img :src="item.columnLogo | filterImgUrl">
              <p>{{item.columnName}}</p>
            </div>
          </div>
        </div>
      </vue-scroll>
      <!--列表-->
      <ul class="fixedMeal-wrap-list" v-if="!noData">
        <li v-for="item in subclassDataList"  @click="$router.push({path: '/goodDetail', query: {goodsId: item.id}})">
          <div class='fixedMeal-wrap-list-l'>
            <img :src="item.mainImage | filterImgUrl">
          </div>
          <div class='fixedMeal-wrap-list-r'>
            <div class='fixedMeal-wrap-list-r-tit'>{{item.goodsName}}</div>
            <div class='fixedMeal-wrap-list-r-attr'>{{item.goodsAttribute}}</div>
            <div class='fixedMeal-wrap-list-r-b'>
              <div>¥{{item.goodsSkuList[0].goodsSpecialPrice && item.goodsSkuList[0].whetherSpecial ? item.goodsSkuList[0].goodsSpecialPrice : item.goodsSkuList[0].goodsPrice | moneyFilter}}</div>
              <div>x{{item.goodsNum}}</div>
            </div>
          </div>
        </li>
      </ul>
      <!--加载loading-->
      <load-more tip="数据加载中" v-if="showLoading"></load-more>
      <!--无数据-->
      <no-data-component v-if="noData"></no-data-component>
    </div>
    <!--底部-->
    <div class="optionalMeal-footer">
      <div>
        <p>应付金额: <span>¥{{totalPrice | moneyFilter(1)}}元</span></p>
        <p>赠送积分: <span>{{totalPoint}}个</span></p>
      </div>
      <div @click="goPay()">去下单</div>
    </div>
  </div>
</template>
<script>
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  import noDataComponent from '../../components/noData'    // 暂无数据
  import swipcss from 'swiper/dist/css/swiper.css'
  import { LoadMore } from 'vux'
  import { VclFacebook } from 'vue-content-loading'   // 加载骨架图
  import { setTimeout } from 'timers'
  export default {
    props: ['columnData', 'navIndex'],
    components: {
      swiper,
      swiperSlide,
      swipcss,
      noDataComponent,
      LoadMore,
      VclFacebook
    },
    data () {
      return {
        move: 0,
        skeletonLoading: false,                   // 骨架加载loading
        activeIndex: null,
        columnId: null,          // 栏目id
        mealDataList: [],        // 套餐滚动数据
        mealDataIndex: 0,        // 套餐索引
        subclassDataList: [],    // 下面列表数据
        cover: false,
        busy: false,
        showLoading: false,
        noData: false, // 是否有数据
        start: 1, // 当前页
        pageSize: 500, // 每页显示几条
        totalPage: 0, // 总页数
        totalPrice: 0, // 总价格
        totalPoint: 0  // 总积分
      }
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      }
    },
    watch: {
      'navIndex' () {
        this.start = 1
        this.cover = true
        this.mealDataIndex = 0
        this.$refs.optionalMealTypeBox.scrollTo({x: 0, y: 0})
        this.getColumnDatas()
      },
      'subclassDataList' () {
        this.totalPrice = 0
        this.totalPoint = 0
        this.subclassDataList.forEach((item) => {
          this.totalPoint += item.canGetPoint * item.goodsNum
          this.totalPrice += (item.goodsSpecialPrice ? item.goodsSpecialPrice : item.goodsPrice) * item.goodsNum
        })
      }
    },
    mounted: function () {
      this.getColumnDatas()
    },
    methods: {
      /**
       * 获取滚动的套餐类别
      */
      getColumnDatas () {
        this.mealDataList = this.columnData[this.navIndex].columnResList
        this.columnId = this.mealDataList[0].id
        this.getSubclassDataList(this.columnId)
      },
      /**
       * 获取下面列表数据
      */
      getSubclassDataList (columnId) {
        this.$vux.loading.show({
          text: '数据加载中'
        })
        this.skeletonLoading = true
        this.noData = false
        this.$http.post(this.api.getSetmealGoodsListByColumnId, {
          start: this.start,
          pageSize: this.pageSize,
          columnId: columnId
        }).then((res) => {
          this.busy = false // 重置busy状态
          this.showLoading = false
          this.$vux.loading.hide()
          if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
            this.noData = true
            return false
          }
          this.noData = res.data.data.list.length > 0 ? 0 : 1
          // 是否点击
          if (this.cover) {
            this.subclassDataList = res.data.data.list
          } else {
            this.subclassDataList = this.subclassDataList.concat(res.data.data.list)
          }
          // sku 列表id数据默认组合
          this.subclassDataList.forEach((item) => {
            if (item.goodsSkuList.length > 0) {
              // 默认瓶装id
              item.goodsSkuList.forEach((ite, index) => {
                if (ite.goodsSkuValList.length > 0) {
                  var standardIdArr = []        // standardId集合
                  var standardValIdArr = []     // standardValId集合
                  ite.goodsSkuValList.forEach((ites, ind) => {
                    standardIdArr.push(ites.standardId)
                    standardValIdArr.push(ites.standardValId)
                    this.$set(ite, 'standardIdArr', standardIdArr)
                    this.$set(ite, 'standardValIdArr', standardValIdArr)
                  })
                }
              })
              item.points = item.goodsSkuList[0].points
              item.goodsSpecialPrice = item.goodsSkuList[0].goodsSpecialPrice
              item.goodsPrice = item.goodsSkuList[0].goodsPrice
              this.$set(item, 'skuId', item.goodsSkuList[0].id)
              item.whetherPoints = item.goodsSkuList[0].whetherPoints ? 1 : 0
            }
            // 默认取第一个属性
            if (item.goodsStandardList.length > 0) {
              let goodsAttribute = []
              item.goodsStandardList.forEach((ite) => {
                ite.goodsStandarValList.forEach((its) => {
                  if (item.goodsSkuList[0].standardValIdArr) {
                    if (item.goodsSkuList[0].standardValIdArr.indexOf(its.id) > -1) {
                      goodsAttribute.push(ite.standardName + ': ' + its.standardValName)
                      this.$set(item, 'goodsAttribute', goodsAttribute.toString())
                    }
                  }
                })
              })
            }
          })
          this.start = this.start + 1             // 当前页数
          this.totalPage = res.data.data.pages                                // 总页数
        }).finally(() => {
          this.skeletonLoading = false
          this.$vux.loading.hide()
        })
      },
      /**
       * 套餐滑动点击
      */
      columnTap (event, index) {
        this.start = 1
        this.cover = true
        this.mealDataIndex = index
        this.columnId = this.mealDataList[index].id
        var elLeft = event.currentTarget.offsetLeft // 点击元素左边的距离
        var elWidth = event.currentTarget.offsetWidth // 点击元素的宽
        var wrapWidth = document.getElementById('optionalMealTypeBox').clientWidth  // 外层盒子的宽
        var center = elLeft + elWidth / 2
        this.activeIndex = index
        if (center < wrapWidth / 2) {
          this.$refs.optionalMealTypeBox.scrollTo({x: 0, y: 0})
        } else {
          var nowTlanslate = center - wrapWidth / 2
          this.$refs.optionalMealTypeBox.scrollTo({x: nowTlanslate, y: 0})
        }
        this.getSubclassDataList(this.columnId)
      },
      /**
       * 分页
      */
      loadMoreData () {
        this.cover = false
        this.busy = true // 加载状态
        if (!this.showLoading) {
          this.showLoading = true
          if (this.start > this.totalPage) {
            this.showLoading = false
            return
          }
        }
        this.getSubclassDataList(this.columnId) // 分页数据
      },
      /**
       * 判断库存是否够
      */
      judgeGoodsStock (fun) {
        var obj = {}
        var arr = []
        this.subclassDataList.forEach((item) => {
          obj = {
            goodsNum: item.goodsNum,
            skuId: item.skuId
          }
          arr.push(obj)
        })
        this.$http.post(`${this.api.judgeGoodsStock}`, arr).then((res) => {
          if (res.data.status !== this.api.ERR_OK) {
            this.$vux.toast.text(res.data.msg)
            return false
          }
          fun()
        })
      },
      /**
       * 去下单
      */
      goPay () {
        let selectList = []
        // let selectArrt = []
        // var obj = {}
        if (this.subclassDataList.length <= 0) {
          this.$vux.toast.text('请先选择商品')
          return false
        }
        this.judgeGoodsStock(() => {
          this.subclassDataList.forEach((item) => {
            this.$set(item, 'goodsId', item.id)
            item.whetherSpecial = item.goodsSkuList[0].whetherSpecial
            item.goodsPrice = item.goodsSkuList[0].goodsPrice
            item.goodsSpecialPrice = item.goodsSkuList[0].goodsSpecialPrice
            item.orderSource = 1       // 1:普通购物，2：分享订单
            selectList.push(item)
          })
          localStorage.setItem('confirmOrderInfo', JSON.stringify(selectList))
          this.$http.get(`${this.api.getMemberPoints}`, {
            params: {
              shopId: ''
            }
          }).then((res) => {
            if (res.data.status === this.api.ERR_OK) {
              setTimeout(() => {
                this.$router.replace({path: '/confirmOrder'})
              }, 100)
            }
          })
        })
      }
    }
  }
</script>
<style scoped lang=less>
  .fixedMeal-wrap{
    /**nav栏目**/
    .optionalMeal-nav{
      height: .78rem;
      background: linear-gradient(to right, #f05033, #fe8d33);
      ul{
        overflow: hidden;
        overflow-x: scroll;
        white-space: nowrap;
        line-height: .78rem;
        &::-webkit-scrollbar {
          height: 0px;
        }
        li{
          display: inline-block;
          margin: 0 .27rem;
          font-size: .28rem;
          color: rgba(255,255,255,0.7);
          position: relative;
          &.active{
            color: #fff;
            font-weight: bold;
            span{
              &::after{
                content: '';
                height: .06rem;
                background: #f6be99;
                display: block;
                position: absolute;
                left: 0;
                right: 0;
                margin: auto;
                bottom: .08rem;
                border-radius: 5px;
              }
            }
          }
        }
      }
    }
    .fixedMeal-content{
      height: calc(~"100vh - .78rem - 1rem ");
      overflow-y: scroll;
    }
    /**套餐类别**/
    .optionalMeal-type-box{
      width:7.5rem;
      height: initial !important;
      overflow-x: scroll;
      border-bottom: .2rem solid #eeeeee;
    }
    ::-webkit-scrollbar {
      height: 0px;
    }
    .optionalMeal-type {
      /* width:100%; */
      height: 4.3rem;
      white-space: nowrap;
      background: #fff;
      margin: 0 auto;
      padding: .5rem .2rem;
      padding-bottom: .1rem;
      color: #fff;
      box-sizing: border-box;
      -webkit-box-sizing: border-box;
      overflow: hidden;
      transition: 0.3s ease-in-out;
      .swiper-container-3d{
        height: 100%;
      }
      .optionalMeal-type-wrap{
        /* position: absolute;
        transition: 0.3s ease-in-out; */
      }
      .optionalMeal-type-option{
        display: inline-block;
        width: 2.16rem;
        /* height: 3.12rem; */
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        box-shadow: 0 0 .26rem rgba(0, 0, 0, 0.09);
        margin-bottom: .26rem;
        margin-right: .3rem;
        transition: all 0.5s;
        &.active{
          transform: scale(1.1);
        }
        &:last-child{
          margin-right: 0;
        }
        img{
          width: 2.16rem;
          height: 2.31rem;
          border-top-left-radius: 7px;
          border-top-right-radius: 7px;
          display: block;
        }
        p{
          font-size: .26rem;
          color: #333333;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          background: #fff;
          padding: .2rem 0;
          border-bottom-left-radius: 7px;
          border-bottom-right-radius: 7px;
        }
      }
    }
    /**列表**/
    .fixedMeal-wrap-list{
      height: 100%;
      li{
        display: flex;
        align-items: center;
        padding: .25rem 0;
        border-bottom: 1px solid #dddddd;
        padding-right: .4rem;
        margin-left: .2rem;
        &:last-child{
          border-bottom: none;
        }
        .fixedMeal-wrap-list-l{
          width: 1.6rem;
          height: 1.6rem;
          margin-right: .3rem;
          img{
            width: 100%;
            height: 100%;
          }
        }     
        .fixedMeal-wrap-list-r{
          flex:1;
          overflow: hidden;
          .fixedMeal-wrap-list-r-tit{
            display: -webkit-box;
            display: -moz-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #333333;
            font-size: .24rem;
          }
          .fixedMeal-wrap-list-r-attr{
            color: #999999;
            font-size: .22rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: .1rem 0;
          }
          .fixedMeal-wrap-list-r-b{
            display: flex;
            div:nth-child(1){
              flex: 1;
              color: #f23030;
            }
            div:nth-child(2){
              font-size: .2rem;
              color: #333333;
            }
          }
        }   
      }
    }
    /**底部**/
    .optionalMeal-footer{
      display: flex;
      width: 7.5rem;
      height: 1rem;
      background: #fff;
      padding-left: .4rem;
      align-items: center;
      box-sizing: border-box;
      -webkit-box-shadow: 0 0 10px 0 rgba(154, 141, 141, 0.6);
      position: relative;
      div:nth-child(1) {
        flex: 1;
        p{
          font-size: .24rem;
          color: #666666;
          span{
            color: #f23030;
            font-size: .28rem;
          }
        }
      }
      div:nth-child(2) {
        width: 1.9rem;
        height: 1rem;
        background: #f23030;
        text-align: center;
        line-height: 1rem;
        font-size: .3rem;
        color: #fff;
      }
    }
  }
</style>