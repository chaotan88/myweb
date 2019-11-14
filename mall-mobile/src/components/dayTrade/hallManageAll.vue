<template>
  <div>
    <div class="my-earning" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="hallManage-all">
        <!--批发状态（1：待支付、2：已支付/未挂售、3：挂售中、4：已对账/已售卖 (不解析不显示)，5：已结算(对应tab已售出)、6：已提货、7：取消挂售 8:等待提货 ）-->
        <div class="for-loop" v-for="(item, index) in listData" :key="index" v-if="listData.length > 0">
          <!--等待挂售 2-->
          <div class="all-status" v-if="item.status === 2">
            <div class="all-status-left">等待挂售</div>
            <div class="all-status-right">
              <div class="wait-r-top">
                <span>{{item.purchaseDate | publicTimeNew}}</span>
                <span>批发成功</span>
              </div>
              <div class="wait-r-bot">
                预计:<span v-html="timeOutFn1(item.timeOut)"></span>
                <span>挂售</span>
              </div>
            </div>
          </div>

          <!--已挂售 3-->
          <div class="all-hall" v-show="item.status === 3">
            <div class="hall-left">已挂售</div>
            <div class="hall-right">
              <div class="hall-r-top">
                <!---挂售成功-->
                <span>{{item.hangSellDate | publicTimeNew}}</span>
                <span style="font-size: 0.25rem;">挂售成功</span>
              </div>
              <div class="hall-r-cen" v-if="item.timeOut > 0">
                剩余:<span v-html="timeOutFn2(item.timeOut)"></span>
                <span style="font-size: 0.22rem;">自动取货</span>
              </div>
              <div class="hall-r-bot">
                <div class="hall-cancel" @click="cancelMask(item)">
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

          <!--已结算(对应tab已售出) 5-->
          <div class="all-sold" v-if="item.status === 5">
            <div class="sold-left">已售出</div>
            <div class="sold-right">
              <div class="sold-r-top">
                <!---批发成功-->
                <span>{{item.purchaseDate | publicTimeNew}}</span>
                <span>商品售出</span>
              </div>
              <div class="sold-r-bot">
                获得收益:<span>{{item.profitAmount}}</span>元
              </div>
            </div>
          </div>

          <!--等待提货 8-->
          <div class="all-waitGoods" v-if="item.status === 8">
            <div class="waitGoods-left">等待提货</div>
            <div class="waitGoods-right">
              <div class="waitGoods-r-top">
                <span>{{item.hangAutoCarrySellTime | publicTimeNew}}</span>
                <span>挂售结束</span>
              </div>
              <div class="waitGoods-r-bot">
                <img :src="note"/>
                <span @click="toOrder(item)">我要提货</span>
              </div>
            </div>
          </div>

          <!--已提货6-->
          <div class="all-pickGoods" v-if="item.status === 6">
            <div class="pickGoods-left">已提货</div>
            <div class="pickGoods-right">
              <div class="pickGoods-r-top">
                <span>{{item.hangAutoCarrySellTime | publicTimeNew}}</span>
                <span>提货成功</span>
              </div>
              <div class="pickGoods-r-bot">
              </div>
            </div>
          </div>

          <!--挂售取消 7-->
          <div class="all-cancel" v-if="item.status === 7">
            <div class="cancel-left"><div>挂售</div><div>已取消</div></div>
            <div class="cancel-right">
              <div class="cancel-r-top">
                <span>{{item.hangSellDate | publicTimeNew}}</span>
                <span>挂售成功</span>
              </div>
              <div class="cancel-r-bot" @click="openRecord(item)">
                <img :src="rub"/>
                <span>删除</span>
              </div>
            </div>
          </div>
          <!--抵扣售出-->
          <div class="all-pickGoods" v-if="item.status === 11">
            <div class="pickGoods-left">抵扣售出</div>
            <div class="pickGoods-right">
              <div class="pickGoods-r-top">
                <span>{{item.updateTime | publicTimeNew}}</span>
                <span>抵扣售出</span>
              </div>
              <div class="pickGoods-r-bot">
              </div>
            </div>
          </div>
        </div >
        <div v-if="listData.length === 0" style="margin-top: 2.2rem;text-align: center;">
          <img src="../../assets/images/maker/noOrder.png" style="width: 4rem;height: 3.5rem;"/>
          <p>暂无相关订单</p>
        </div>
      </div>
      <load-more tip="数据加载中" v-if="showLoading"></load-more>
      <!--挂售取消弹框-->
      <cancel-sale :listData = "listDataItem" :showHadHall = "showHadHall" @closeMask="closeMask"></cancel-sale>
      <!--删除记录弹框-->
      <delSale :listData = "dataDel" :showDel = "showDel" @closeRecord="closeRecord"> </delSale>
      <!--提货弹框-->
      <extract :listData = "dataExtract" :showExtract = "showExtract" @closeExtract="closeExtract"> </extract>
    </div>
  </div>
</template>

<script>
    import {Loading, LoadMore} from 'vux'
    import cancelSale from '../../components/dayTrade/cancelSale'
    import delSale from '../../components/dayTrade/delSale.vue'
    import extract from '../../components/dayTrade/extract.vue'
    export default {
      name: 'hallManageAll',
      data () {
        return {
          del: require('../../assets/images/shopLucky/del.png'),
          note: require('../../assets/images/shopLucky/note.png'),
          rub: require('../../assets/images/shopLucky/rub.png'),
          rul: require('../../assets/js/tsconfig.json'),
          timeEnd: false,
          timeC: 0,                     // 服务器和本机时间差
          listData: [],
          listDataItem: {},
          showAll: false,
          showHadHall: false,  // 取消售卖
          showDel: false,      // 删除记录弹框
          dataDel: {},         // 删除组件数据
          showExtract: false,  // 提货弹框
          dataExtract: {},     // 提货组件数据
          timer: null,
          delHangId: '',
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
      mounted: function () {
        this.goodsHangPage()
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
          // console.log('分頁')
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
          this.$http.post(`${this.api.goodsHangPage}`, {
//          this.$http.get('/src/assets/js/tsconfig.json', {
            start: this.start,
            pageSize: this.pageSize,
            goodsId: this.$route.query.goodsId,
            hangType: 1
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
                // 等待挂售出 倒计时计算
                if (index === 0) {
                  let T = new Date().getTime()
                  this.timeC = item.nowTime - T // 服务器与本机时间差,取一个就行
                }
                if (item.status === 2) {
                  time = item.hangSellDate - item.nowTime
                  if (time < 0) {
                    item.status = 3
                  }
//                  time = 5000
                }
                // statu s===== 1：待支付、2：已支付/未挂售、3：挂售中(商品提货)、4：已对账/已售卖，5：已结算、6：已提货、7：取消挂售 8: 等待提货(我要提货)
                if (item.status === 3 || item.status === 8) {
                   // (hangAutoCarrySellTime 最终提货时间) 当前时间大于最终提货时间 || 过滤最终提货时间为空
                  if (((item.hangAutoCarrySellTime || item.nowTime) - item.nowTime) <= 0 && item.hangAutoCarrySellStatus) {
                    // 挂售中 当前时间>最终提货时间 && 自动提货开启 ===> 挂售中 变更 等待提货
                    this.$set(
                      item, 'status', 8
                    )
                  } else {
                    if (item.hangAutoCarrySellStatus) {
                      time = (item.hangAutoCarrySellTime || item.nowTime) - item.nowTime
                    }
                    this.$set(item, 'status', 3)
                  }
                }
//                console.log(item)
                this.$set(
                  item, 'timeOut', time
                )
              })
              // 数据渲染
              this.noData = resData.data.list.length > 0 ? !!false : !!true
              this.listData = this.listData.concat(resData.data.list)
              this.totalPage = Math.ceil(resData.data.total / resData.data.pageSize)
              if (this.timer) {
                return
              }
              // 界面列表统一执行定时器
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
            // 换算当前服务器时间
            let nowTime = this.timeC + new Date().getTime()
            for (let i in this.listData) {
              // 计算下次倒计时时间戳
              if (this.listData[i].timeOut && this.listData[i].timeOut > 0) {
                // 计算下一次倒计时时间戳
                if (this.listData[i].status === 3 && this.listData[i].hangAutoCarrySellTime && this.listData[i].hangAutoCarrySellStatus) {
                  // 代售状态倒计时渲染处理
                  this.listData[i].timeOut = this.listData[i].hangAutoCarrySellTime - nowTime
//                  this.listData[i].timeOut -= 1000
                }
                if (this.listData[i].status === 2 && this.listData[i].hangSellDate) {
                  // 出售状态渲染处理
                  this.listData[i].timeOut = this.listData[i].hangSellDate - nowTime
//                  this.listData[i].timeOut -= 1000
                }
              }
              // 倒计时状态重写
              if (this.listData[i].timeOut <= 0) {
                // 过滤没有倒计时情况
                if (this.listData[i].timeOut !== '') {
                  // console.log('等待挂售状态变更', this.listData[i].timeOut)
                  if (this.listData[i].status === 2) {
                    // 区分挂售中有无自动取货
                    if (((this.listData[i].hangAutoCarrySellTime || nowTime) - nowTime) <= 0 && this.listData[i].hangAutoCarrySellStatus) {
                      // 挂售中 当前时间>最终提货时间 && 自动提货开启 ===> 挂售中 变更 等待提货
                      this.listData[i].status = 8
                      // 倒计时归零 方便下次过滤
                      this.listData[i].timeOut = ''
                    } else if (this.listData[i].hangAutoCarrySellStatus) {
                      this.listData[i].timeOut = (this.listData[i].hangAutoCarrySellTime || nowTime) - nowTime
//                      this.listData[i].timeOut = 5000
                      this.listData[i].status = 3
                    }
                    continue
                  } else if (this.listData[i].status === 3) {
                    this.listData[i].status = 8
                    this.listData[i].timeOut = ''
                    continue
                  }
                }
              }
            }
          }, 1000)
          console.log(this.listData)
        },
        /**
         * 取消挂售 关闭弹框回调
         */
        closeMask (v) {
          this.showHadHall = v.show
          // console.log(v, 'v')
          if (v.update) {
            // 刷新列表数据
            for (let i in this.listData) {
              if (this.listData[i].hangId === v.hangId) {
                this.listData[i].status = v.status
              }
            }
          }
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
            // console.log(res.data.status, this.api.ERR_OK)
            if (parseInt(res.data.status) === parseInt(this.api.ERR_OK)) {
              res.data.data.hangId = v.hangId
              this.listDataItem = res.data.data
              this.showHadHall = true
            }
          })
        },
        /**
         * 删除记录 弹框开启
         */
        openRecord (v) {
          this.dataDel = v
          this.showDel = true
        },
        /**
         * 删除记录 关闭弹框回调
         */
        closeRecord (v) {
          this.showDel = v.show
          // console.log(v)
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
         * 提取商品 关闭弹框回调
         */
        closeExtract (v) {
          this.showExtract = v
        },
        /**
         * 提取商品
         */
        toOrder (v) {
          this.dataExtract = v
          this.showExtract = true
        },
        /**
         * 挂售删除
         */
        hallDel () {
          this.$http.post(`${this.api.goodsPurchaseDelete}`, {
            hangId: ''  // 挂售商品主键
          }).then((res) => {
            // console.log(res)
          })
        },
        /**
         * 倒计时
         */
        timeOutFn1 (time) {
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
          var str = '<span class="djs-noday">' + H + '</span>' + '<span class="djs-haveday">' + '时' + '</span>' + '<span class="djs-noday">' + T + '</span>' + '<span class="djs-haveday">' + '分' + '</span>' + '<span class="djs-noday">' + S + '</span>' + '<span class="djs-haveday">' + '秒' + '</span>'
          if (D > 0) {
            str = '<span class="djs-noday">' + D + '</span>' + '<span class="djs-haveday">' + '天' + '</span>' + str
          }
          return str
        },
        timeOutFn2 (time) {
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
          var str = '<span class="djs-no">' + H + '</span>' + '<span class="djs-ha">' + '时' + '</span>' + '<span class="djs-no">' + T + '</span>' + '<span class="djs-ha">' + '分' + '</span>' + '<span class="djs-no">' + S + '</span>' + '<span class="djs-ha">' + '秒' + '</span>'
          if (D > 0) {
            str = '<span class="djs-no">' + D + '</span>' + '<span class="djs-ha">' + '天' + '</span>' + str
          }
          return str
        },
        pageUp () {

        }
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
        delSale,
        extract,
        LoadMore
      }
    }
</script>

<style lang="less" scoped>
  .hallManage-all{
    padding: 0.2rem;
    /*等待挂售*/
    .all-status{
      background: linear-gradient(to right,#b88669 , #e1b89b);
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      display: flex;
      margin-top: .2rem;
      /*justify-content: space-around;*/
      font-size: 0.24rem;
      .all-status-left{
        width: 1.68rem;
        height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.3rem;
        background: #fff;
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #af7b5e;
      }
      .all-status-right{
        color: #fff;
        margin-left: 0.2rem;
        .wait-r-top{

        }
        .wait-r-bot{
          margin-top: 0.36rem;
        }
      }
    }
    /*已售出*/
    .all-sold{
      background: #fde2bb;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.28rem 0.2rem;
      display: flex;
      /*justify-content: space-around;*/
      margin-top: 0.24rem;
      font-size: 0.24rem;
      .sold-left{
        width: 1.68rem;
        height: 0.86rem;
        line-height: 0.86rem;
        line-height: 0.86rem;
        font-size: 0.3rem;
        background: #fff;
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #af7b5e;
      }
      .sold-right{
        color: #a56341;
        margin-left: 0.2rem;
        .sold-r-top{

        }
        .sold-r-bot{
        }
      }
    }
    /*已挂售*/
    .all-hall{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.28rem 0.2rem;
      display: flex;
      /*justify-content: space-around;*/
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
          img{
            width: 0.54rem;
            height: 0.54rem;
            vertical-align: middle;
          }
          .hall-cancel{
            display: flex;
            align-items: center;
            margin-right: 0.2rem;
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
    /*挂售取消*/
    .all-cancel{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      display: flex;
      /*justify-content: space-around;*/
      margin-top: 0.24rem;
      font-size: 0.24rem;
      .cancel-left{
        width: 1.68rem;
        height: 1.02rem;
        font-size: 0.3rem;
        background: linear-gradient(to bottom,#b27e61 , #dbb093);
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #fff;
        div:nth-of-type(1){
          margin-top: 0.05rem;
        }
      }
      .cancel-right{
        color: #a56341;
        margin-left: 0.2rem;
        .cancel-r-top{

        }
        .cancel-r-bot{
          display: flex;
          align-items: center;
          margin-top: 0.15rem;
          img{
            width: 0.54rem;
            height: 0.54rem;
            vertical-align: middle;
            margin-right: 0.1rem;
          }
        }
      }
    }
    /*等待提货*/
    .all-waitGoods{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      display: flex;
      /*justify-content: space-around;*/
      margin-top: 0.24rem;
      font-size: 0.24rem;
      .waitGoods-left{
        width: 1.68rem;
        height: 1.02rem;
        line-height: 1.02rem;
        font-size: 0.3rem;
        background: linear-gradient(to bottom,#b27e61 , #dbb093);
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #fff;
        display: flex;
        flex-direction: column;
      }
      .waitGoods-right{
        color: #a56341;
        margin-left: 0.2rem;
        .waitGoods-r-top{

        }
        .waitGoods-r-bot{
          display: flex;
          align-items: center;
          margin-top: 0.15rem;
          img{
            width: 0.54rem;
            height: 0.54rem;
            margin-right: 0.1rem;
          }
        }
      }
    }
    /*已提货*/
    .all-pickGoods{
      background: #fff;
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      display: flex;
      /*justify-content: space-around;*/
      margin-top: 0.24rem;
      align-items: center;
      font-size: 0.24rem;
      .pickGoods-left{
        width: 1.68rem;
        height: 1.02rem;
        line-height: 1.02rem;
        font-size: 0.3rem;
        background: linear-gradient(to bottom,#b27e61 , #dbb093);
        text-align: center;
        -webkit-border-radius: 0.1rem;
        -moz-border-radius: 0.1rem;
        border-radius: 0.1rem;
        color: #fff;
        display: flex;
        flex-direction: column;
      }
      .pickGoods-right{
        color: #a56341;
        margin-left: 0.2rem;
        .pickGoods-r-top{

        }
        .pickGoods-r-bot{
          img{
            width: 0.54rem;
            height: 0.54rem;
            vertical-align: middle;
          }
          /*margin-top: 0.24rem;*/
        }
      }
    }
  }
</style>
<style lang="less">
  .djs-noday{
    background: #fff;
    color: #af7b5e;
    padding: 0.14rem 0.07rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.07rem;
    font-size: 0.24rem;
  }
  .djs-haveday{
    font-size: 0.24rem;
    position: relative;
    top: 0.1rem;
  }
  .djs-no{
    background: #a56341;
    color: #fff;
    padding: 0.14rem 0.07rem;
    -webkit-border-radius: 0.1rem;
    -moz-border-radius: 0.1rem;
    border-radius: 0.1rem;
    margin: 0 0.07rem;
    font-size: 0.24rem;
  }
  .djs-ha{
    font-size: 0.24rem;
    position: relative;
    top: 0.1rem;
  }
</style>
