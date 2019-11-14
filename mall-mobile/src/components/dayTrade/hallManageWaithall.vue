<template>
  <div>
    <div class="hallManage-wait" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="all-wait" v-for="(item, index) in listData" :key="index" v-if="listData.length > 0 && item.status === 2">
        <div class="wait-left">等待挂售</div>
        <div class="wait-right">
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
      <div v-if="listData.length === 0" style="margin-top: 2.2rem;text-align: center;">
        <img src="../../assets/images/maker/noOrder.png" style="width: 4rem;height: 3.5rem;"/>
        <p>暂无相关订单</p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'hallManageWaithall',
      data () {
        return {
          listData: [],
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
          this.$http.post(`${this.api.goodsHangPage}`, {
//          this.$http.get('/src/assets/js/tsconfig.json', {
            start: this.start,
            pageSize: this.pageSize,
            goodsId: this.$route.query.goodsId,
            hangType: 2
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
              resData.data.list.forEach((item, index) => {
                let time = ''
                if (index === 0) {
                  let T = new Date().getTime()
                  this.timeC = item.nowTime - T // 服务器与本机时间差,取一个就行
                }
                time = item.hangSellDate - item.nowTime
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
        }
      },
      mounted: function () {
        this.goodsHangPage()
      },
      created () {
      },
      components: {
      },
      beforeDestroy () {
        // 清除定时器
        clearInterval(this.timer)
      }
    }
</script>

<style lang="less" scoped>
  .hallManage-wait{
    padding: 0.2rem;
    .all-wait{
      background: linear-gradient(to right,#b88669 , #e1b89b);
      -webkit-border-radius: 0.2rem;
      -moz-border-radius: 0.2rem;
      border-radius: 0.2rem;
      padding: 0.4rem 0.2rem;
      display: flex;
      justify-content: space-around;
      margin-top: .2rem;
      .wait-left{
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
      .wait-right{
        color: #fff;
        .wait-r-top{

        }
        .wait-r-bot{
          margin-top: 0.36rem;
        }
      }
    }
  }
</style>
