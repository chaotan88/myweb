<template>
  <div v-infinite-scroll="loadMore"  infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
    <div class="hallManage-hadHall" >
      <div class="all-hall" v-for="(item, index) in listData" :key="index" v-if="listData.length > 0">
        <div class="hall-left">已挂售</div>
        <div class="hall-right">
          <div class="hall-r-top">
            <span>{{item.purchaseDate | publicTimeNew}}</span>
            <span>挂售成功</span>
          </div>
          <div class="hall-r-cen" v-if="item.timeOut > 0">
            剩余:<span v-html="timeOutFn(item.timeOut)"></span>
            <span>自动取货</span>
          </div>
          <div class="hall-r-bot">
            <div class="hall-cancel" @click="cancelMask(item)" v-show="item.status == 3">
              <img :src="del"/>
              取消挂售
            </div>
            <div class="hall-extract" @click="toOrder(item)">
              <img :src="note"/>
              我要提货
            </div>
          </div>
        </div>
      </div>
      <div v-if="listData.length === 0" style="margin-top: 2.2rem;text-align: center;">
        <img src="../../assets/images/maker/noOrder.png" style="width: 4rem;height: 3.5rem;"/>
        <p>暂无相关订单</p>
      </div>
    </div>
    <load-more tip="数据加载中" v-if="showLoading"></load-more>
    <!--挂售取消弹框-->
    <cancel-sale :listData = "listDataItem" :showHadHall = "showHadHall" @closeMask="closeMask"></cancel-sale>
    <!--提货弹框-->
    <extract :listData = "dataExtract" :showExtract = "showExtract" @closeExtract="closeExtract"> </extract>
  </div>
</template>

<script>
    import {Loading, LoadMore} from 'vux'
    import cancelSale from '../../components/dayTrade/cancelSale'
    import extract from '../../components/dayTrade/extract'
    export default {
      name: 'hallManageHadhall',
      data () {
        return {
          note: require('../../assets/images/shopLucky/note.png'),
          del: require('../../assets/images/shopLucky/del.png'),
          timeEnd: false,
          listData: [],
          listDataItem: {},
          timeC: 0,               // 本地服务器时间差
          time: '',
          timer: null, // 定时器
          showHadHall: false,
          showExtract: false,  // 提货弹框
          dataExtract: {},     // 提货组件数据
          busy: false,
          showLoading: false,                   // 是否显示加载loading
          noData: false,                         // 列表是否有数据
          start: 1,                             // 当前页数
          pageSize: 10,                         // 每页显示10条
          totalPage: 0                          // 总页数
        }
      },
      watch: {
      },
      methods: {
        loadMore () {
          this.busy = true // 加载状态
          if (!this.showLoading) {
            this.showLoading = true
            if (parseInt(this.start) > parseInt(this.totalPage)) {
              this.showLoading = false
              return
            }
          }
          console.log('分頁')
          this.start = this.start + 1 // 当前页数
          this.goodsHangPage() // 分页数据
        },
        /**
         * 获取挂售管理列表
         * hangType(1：全部 2:等待挂售 3:已挂售 4:已售出 5:等待提货 6:已提货)
         */
        goodsHangPage () {
          this.$vux.loading.show({
            text: 'Loading'
          })
//            `${this.api.goodsHangPage}`
          this.$http.post(`${this.api.goodsHangPage}`, {
//          this.$http.get('/src/assets/js/tsconfig.json', {
            start: this.start,
            pageSize: this.pageSize,
            goodsId: this.$route.query.goodsId,
            hangType: 3
          }).then((res) => {
            let resData = res.data
            this.$vux.loading.hide()
            this.busy = false // 重置busy状态
            this.showLoading = false
            if (parseInt(res.data.status) !== parseInt(this.api.ERR_OK)) {
              this.noData = true
              return false
            }
            if (resData.status === '1') {
              // console.log(this.listData)
              resData.data.list.forEach((item, index) => {
                let time = ''
                if (index === 0) {
                  let T = new Date().getTime()
                  this.timeC = item.nowTime - T // 服务器与本机时间差,取一个就行
                }
                if (((item.hangAutoCarrySellTime || item.nowTime) - item.nowTime) <= 0 && item.hangAutoCarrySellStatus) {
                  // 挂售中 当前时间>最终提货时间 && 自动提货开启 ===> 挂售中 变更 等待提货
                  this.$set(
                    item, 'status', 8
                  )
                } else if (item.hangAutoCarrySellStatus) {
                  time = (item.hangAutoCarrySellTime || item.nowTime) - item.nowTime
                }
                console.log(time)
                this.$set(
                  item, 'timeOut', time
                )
              })
              this.noData = resData.data.list.length > 0 ? !!false : !!true
              this.listData = this.listData.concat(resData.data.list)
              this.totalPage = Math.ceil(resData.data.total / resData.data.pageSize)
              if (this.timer) {
                return
              }
              this.timeOutFnDoing2()
            }
          })
        },
        /****
         * 定时刷新列表定时器
         * ****/
        timeOutFnDoing2 () {
          // 界面列表统一执行定时器
          this.timer = setInterval(() => {
            for (let i in this.listData) {
              // 计算下次倒计时时间戳
              if (this.listData[i].timeOut && this.listData[i].timeOut > 0) {
                // 计算下一次倒计时时间戳
                if (this.listData[i].status === 3 && this.listData[i].hangAutoCarrySellTime && this.listData[i].hangAutoCarrySellStatus) {
                  // 代售状态倒计时渲染处理
                  this.listData[i].timeOut = this.listData[i].hangAutoCarrySellTime - (this.timeC + new Date().getTime())
                }
                if (this.listData[i].status === 2 && this.listData[i].hangSellDate) {
                  // 出售状态渲染处理
                  this.listData[i].timeOut = this.listData[i].hangSellDate - (this.timeC + new Date().getTime())
                }
              }
              // 倒计时状态重写
              if (this.listData[i].timeOut <= 0) {
                // 过滤没有倒计时情况
                if (this.listData[i].timeOut !== '') {
                  // console.log('状态变更2', this.listData[i].timeOut)
                  this.listData[i].timeOut = ''
                  if (this.listData[i].status === 2) {
                    this.listData[i].status = 3
                    continue
                  } else if (this.listData[i].status === 3) {
                    this.listData[i].status = 8
                    continue
                  }
                }
              }
            }
          }, 1000)
        },
        /**
         * 取消挂售
         */
        closeMask (v) {
          this.showHadHall = v.show
          if (v.update) {
            // 刷新列表数据
            for (let i in this.listData) {
              if (this.listData[i].hangId === v.hangId) {
                this.listData.splice(i, 1)
              }
            }
          }
        },
        /**
         * 提货商品
         */
        toOrder (v) {
          this.dataExtract = v
          this.showExtract = true
        },
        /**
         * 取消挂售弹框开启
         */
        cancelMask (v) {
          this.$vux.loading.show({
            text: 'Loading'
          })
          this.$http.get(this.api.getGoodsPurchaseOrderPayDetail, {
            params: {hangId: v.hangId}
          }).then((res) => {
            this.$vux.loading.hide()
            console.log(res.data.status, this.api.ERR_OK)
            if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
              res.data.data.hangId = v.hangId
              this.listDataItem = res.data.data
              this.showHadHall = true
            }
          })
        },
        /**
         * 提取商品 关闭弹框回调
         */
        closeExtract (v) {
          this.showExtract = v
        },
        /**
         * 倒计时
         */
        timeOutFn (time) {
          if (time < 0 || time === undefined) {
            return ''
          }
          if (time === 0) {
            return '00小时 00分 00秒'
          }
          var D = parseInt(time / 86400000)                                // 天
          var H = parseInt((time % 86400000) / 3600000)                   // 小时
          var T = parseInt(((time % 86400000) % 3600000) / 60000)           // 小时
          var S = parseInt((((time % 86400000) % 3600000) % 60000) / 1000)  // 秒
          if (D < 10 && D > 0) {
            D = '0' + D
          }
          if (H < 10) {
            H = '0' + H
          }
          if (T < 10) {
            T = '0' + T
          }
          if (S < 10) {
            S = '0' + S
          }
          var str = '<span class="had1">' + H + '</span>' + '<span class="had11">' + '时' + '</span>' + '<span class="had1">' + T + '</span>' + '<span class="had11">' + '分' + '</span>' + '<span class="had1">' + S + '</span>' + '<span class="had11">' + '秒' + '</span>'
          if (D > 0) {
            str = '<span class="had1">' + D + '</span>' + '<span class="had11">' + '天' + '</span>' + str
          }
          return str
        }
      },
      mounted: function () {
        this.goodsHangPage()
      },
      created () {
      },
      beforeDestroy () {
        // 清除定时器
        clearInterval(this.timer)
      },
      components: {
        cancelSale,
        Loading,
        extract,
        LoadMore
      }
    }
</script>

<style lang="less" scoped>
  .hallManage-hadHall{
    padding: 0.2rem;
    .all-hall{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.28rem 0.2rem;
      display: flex;
      justify-content: space-around;
      margin-top: 0.24rem;
      font-size: 0.24rem;
      .hall-left{
        width: 1.68rem;
        font-size: 0.3rem;
        background: linear-gradient(to bottom,#b27e61 , #dbb093);
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .hall-right{
        color: #a56341;
        margin-left: 0.2rem;
        .hall-r-top{

        }
        .hall-r-cen{
          margin-top: 0.32rem;
          span:nth-of-type(1){

          }
          span:nth-of-type(2){
            color: #e5966d;
          }
        }
        .hall-r-bot{
          margin-top: 0.3rem;
          display: flex;
          align-items: center;
          /*justify-content: space-around;*/
          margin-right: 0.2rem;
          img{
            width: 0.54rem;
            height: 0.54rem;
            vertical-align: middle;
          }
          .hall-cancel{
            display: flex;
            align-items: center;
            margin-right: 0.1rem;
            img{
              margin-right: 0.1rem;
            }
          }
          .hall-extract{
            display: flex;
            align-items: center;
            img{
              margin-right: 0.1rem;
            }
          }
        }
      }
    }
  }
</style>
<style>
  .had1{
    background: #a56341;
    color: #fff;
    padding: 0.14rem 0.07rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.07rem;
    font-size: 0.24rem;
  }
  .had11{
    font-size: 0.24rem;
    position: relative;
    top: 0.1rem;
  }
</style>
