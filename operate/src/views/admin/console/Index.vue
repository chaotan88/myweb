<!-- 控制台首页 -->
<template>
  <div class="console-index-wrap">
    <div class="statistics-wrap">

      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dt class="d-ib va-m">
            <svg class="icon icon-dingdanzongjine" aria-hidden="true">
              <use xlink:href="#icon-dingdanzongjine"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="orderStatisticsData.totalOrderAmount">{{orderStatisticsData.totalOrderAmount | filterEmpty}}</span>
              <template v-else>--</template>
            </h3>
            <h4>订单总金额</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/order')">
          <dt class="d-ib va-m">
            <svg class="icon icon-jinrixinzengdingdanjine1" aria-hidden="true">
              <use xlink:href="#icon-jinrixinzengdingdanjine1"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="orderStatisticsData.todayOrderAmount">{{orderStatisticsData.todayOrderAmount | filterEmpty}}</span>
              <template v-else>{{'' | filterEmpty}}</template>
            </h3>
            <h4>今日新增订单金额</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/vip')">
          <dt class="d-ib va-m">
            <svg class="icon icon-huiyuanzongshu" aria-hidden="true">
              <use xlink:href="#icon-huiyuanzongshu"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="vipStatisticsData.totalMember">{{vipStatisticsData.totalMember | filterEmpty}}</span>
              <template v-else>{{'' | filterEmpty}}</template>
            </h3>
            <h4>会员总数</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p" @click="$router.push('/admin/vip')">
          <dt class="d-ib va-m">
            <svg class="icon icon-jinrizengchanghuiyuan" aria-hidden="true">
              <use xlink:href="#icon-jinrizengchanghuiyuan"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="vipStatisticsData.todayNewMember">{{vipStatisticsData.todayNewMember | filterEmpty}}</span>
              <template v-else>{{'' | filterEmpty}}</template>
            </h3>
            <h4>今日增长会员</h4>
          </dd>
        </dl>
      </div>
    </div>

    <div class="box-wrap">
      <!-- 近30天订单统计 -->
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>近30天订单</h2>
          <ul>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/delivery')">
              <span class="d-b">
                <img src="../../../assets/img/home-box01.png">
              </span>
              <h3 class="d-b">
                <span v-if="recentOrderStatisticsData.waitSendGoods">{{recentOrderStatisticsData.waitSendGoods | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">待发货</strong>
            </li>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/receipt')">
              <span class="d-b">
                <img src="../../../assets/img/home-box02.png">
              </span>
              <h3 class="d-b">
                <span v-if="recentOrderStatisticsData.waitReceiveGoods">{{recentOrderStatisticsData.waitReceiveGoods | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">待收货</strong>
            </li>
            <li class="ta-c fl-l cursor-p" @click="$router.push('/admin/order/self/complete')">
              <span class="d-b">
                <img src="../../../assets/img/home-box03.png">
              </span>
              <h3 class="d-b">
                <span  v-if="recentOrderStatisticsData.finished">{{recentOrderStatisticsData.finished | filterEmpty}}</span>
                <template v-else>{{'' | filterEmpty}}</template>
              </h3>
              <strong class="d-b">已完成</strong>
            </li>
          </ul>
          <div class="clear"></div>
        </div>
      </div>

      <!-- 近半年会员增长状况 -->
      <div class="box-cen fl-l">
        <div class="box-c pos-r">
          <h2>近半年会员增长状况</h2>
          <div class="echart-wrap" ref="vipEchart" v-show="vipIncreaseData.length"></div>
          <no-data style="padding-top: 170px;" v-if="!vipIncreaseData.length"></no-data>
        </div>
      </div>

      <!-- 最新通知 -->
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>最新通知</h2>
          <div class="latest-notice-wrap">
            <div class="pos-r notice-list" v-for="item in listData">
              <span class="d-ib truncate text">{{item.messageContent}}</span>
              <span class="d-ib pos-a time">{{item.operateTime}}</span>
            </div>
          </div>

          <!-- 分页 -->
          <div class="ta-c common-bottom-wrap handleup-b">
            <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :total="pageData.total" @current-change="pageChange" v-if="pageData.total"></el-pagination>
          </div>
        </div>
      </div>

      <!-- 快捷入口-->
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>快捷入口</h2>
          <div class="statistics-wrap">
            <div class="statistics-cen quick">
              <div class="ta-c fl-l cursor-p list-wrap" v-for="item in quickLinks" @click="$router.replace(item.url)">
                <dl>
                  <dt class="d-ib ta-c va-m pos-r">
                    <svg class="va-m icon" :class="item.icon" aria-hidden="true">
                      <use :xlink:href="'#' + item.icon"></use>
                    </svg>
                  </dt>
                  <dd class="d-ib va-t">{{item.title}}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="clear"><br><br></div>

    </div>
  </div>
</template>

<script>
const echarts = require('echarts')      // 引入echart插件
export default{
  data () {
    return {
      orderStatisticsData: {            // 订单统计数据
        todayOrderAmount: '',
        totalOrderAmount: ''
      },
      vipStatisticsData: {              // 会员统计数据
        todayNewMember: '',
        totalMember: ''
      },
      recentOrderStatisticsData: {      // 近30天订单统计数据
        finished: '',
        waitReceiveGoods: '',
        waitSendGoods: ''
      },
      listData: [],                     // 列表数据
      quickLinks: [
        {
          title: '商品列表',
          icon: 'icon-shangpinguanli',
          url: '/admin/goods/manage/all'
        },
        {
          title: '会员中心',
          icon: 'icon-huiyuan',
          url: '/admin/vip/center/'
        },
        {
          title: '订单管理',
          icon: 'icon-benbanzushengchandingdanguanli',
          url: '/admin/order/self/'
        },
        {
          title: '广告管理',
          icon: 'icon-lanmu-console',
          url: '/admin/operation/advertiManage/mobile'
        }
      ],
      vipIncreaseData: [],  // 近半年会员增长状况
      pageData: {
        currentPage: 1,     // 当前分页
        pageSize: 5,        // 显示条数，不写的话默认为10
        total: 0            // 列表总条数
      }
    }
  },

  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getOrderVipStatistics()
    this.getListData()
    this.getVipIncreaseData()
  },

  methods: {
    /**
     * 获取订单和会员统计
     */
    getOrderVipStatistics () {
      this.$http.get('@ROOT_API/homepage/getStaticData', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        this.orderStatisticsData = resData.data.orderStaticData
        this.vipStatisticsData = resData.data.memberStaticData
        this.recentOrderStatisticsData = resData.data.latest30daysOrder
      })
    },

    /**
     * 近半年会员增长情况
     */
    getVipIncreaseData () {
      this.$http.get('@ROOT_API/homepage/getLatestHalfYearMemberStatic').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) === 9999) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        let months = []
        let values = []
        for (let i = 0; i < 12; i++) {
          months[i] = ''
          values[i] = ''
        }
        resData.data.forEach((row) => {
          months[row.monthNum] = row.monthNum + '月'
          values[row.monthNum] = row.memberNum
        })
        this.vipIncreaseData = resData.data
        setTimeout(() => {
          this.createVipChart(months, values)
        }, 50)
      })
    },

    /**
     * 统计图
    */
    createVipChart (months, values) {
      let myChart = echarts.init(this.$refs.vipEchart)
      myChart.setOption({
        tooltip: {
          // trigger: 'axis'
        },
        grid: {
          left: '4%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          // splitLine: {
          //   show: false
          // },
          type: 'category',
          boundaryGap: false,
          data: months
          // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value',
          lineStyle: {
            normal: {
              width: 1
            }
          }
        },
        series: [
          {
            name: '会员增长',
            type: 'line',
            stack: '总量',
            symbolSize: 10,
            // symbol: 'circle',
            smooth: true,
            // showSymbol: false,
            animationDelay: 0,
            animationDuration: 1000,
            // hoverAnimation: false,
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: '#fff',
                shadowBlur: 2,
                shadowOffsetY: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(77, 149, 219, 1, [{
                  offset: 0,
                  color: 'rgba(77, 149, 219, 0.2)'
                }, {
                  offset: 0.8,
                  color: 'rgba(77, 149, 219, 0.2)'
                }], false)
              }
            },
            itemStyle: {
              normal: {
                color: '#4d95db',
                borderColor: '#4d95db',
                borderWidth: 3
              }
            },
            data: values
          }
        ]
      })
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    },

    /**
     * 获取最新通知
     */
    getListData () {
      this.$router.push({query: {page: this.pageData.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/homepage/getlatestNotice', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          // this.$message({
          //   message: resData.msg,
          //   type: 'error',
          //   duration: 1500
          // })
          return false
        }
        this.listData = resData.data.list
        this.pageData.total = resData.data.total        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
      })
    },

    /**
     * 分页改变
     */
    pageChange (page) {             // 执行当页面分页改变时候的方法
      this.pageData.currentPage = page       // 重置当前分页
      this.getListData()            // 获取列表数据
    }
  }
}
</script>

<style lang='less' scoped>
.console-index-wrap{

  /*--------头部统计------*/
  .statistics-wrap{

    .statistics-cen{
      display: flex;
      justify-content: space-between;

      dl{
        width: 25%;
        height: 170px;
        padding-top: 50px;
        margin-right: 20px;
        background: #40a42a;
        border-radius: 5px;
        margin-right: 20px;
        box-sizing: border-box;

        dt, dd{
          height: 60px;
        }

        dt{
          width: 60px;
          height: 50px;
          line-height: 50px;
          margin-right: 5px;
          left: 0;

          .icon{
            fill: #fff;
            width: 100%;
            height: 100%;
          }
        }

        dd{
          top: 0;
          left: 0;
          color: #fff;

          h3{
            font-size: 30px;
            line-height: 35px;
          }

          h4{
            font-size: 16px;
          }
        }
      }

      dl:nth-child(2){
        background: #7c55ca;
      }

      dl:nth-child(3){
        background: #e46737;
      }

      dl:last-child{
        background: #f39817;
        margin-right: 0;
      }

    }
  }

  /*-------中间主体--------*/
  .box-wrap{
    overflow: hidden;

    /*-------中间主体--------*/
    .box-cen{
      width: 50%;
      margin-top: 20px;
      box-sizing: border-box;

      .box-c{
        height: 100%;
        background: #fff;
        border-radius: 5px;
      }

      .echart-wrap{
        height: 440px;
        margin: 0 20px;
      }

      h2{
        color: #333;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 30px;
        border-bottom: 1px solid #f0f0f0;
      }

      li{
        width: 33.33%;
        margin: 150px 0 110px 0;
        padding: 0 10px;
        box-sizing: border-box;

        h3{
          color: #40a42a;
          font-size: 44px;
          line-height: 90px;
        }

        strong{
          color: #c8c8c8;
          font-size: 16px;
        }

        img{
          max-width: 100%;
        }
      }

      li:nth-child(2){
        h3{
          color: #7c55ca;
        }
      }

      li:nth-child(3){
        h3{
          color: #e46737;
        }
      }

      /*--------最新通知-------*/

      .latest-notice-wrap{
        padding: 30px;

        .notice-list{
          height: 56px;
          line-height: 56px;
          border: 1px solid #ddd;
          margin-top: -1px;
          padding-right: 140px;
          z-index: 1;
          box-sizing: border-box;

          .text{
            padding: 0 15px;
          }

          .time{
            width: 95px;
            padding: 0 10px;
            right: 0;
            top: 0;
          }
        }

        .notice-list:hover{
          border-color: #33719b;
          z-index: 5;
        }
      }

      /*-------快捷入口---------*/
      .statistics-wrap{
        padding: 30px;
        margin: 0;
        .quick{
          display: block !important;
          overflow: hidden;

          .list-wrap{
            width: 50%;
            margin-bottom: 20px;
            box-sizing: border-box;
          }

          dl{
            width: 100%;
            height: 150px;
            border: 1px solid #ddd;
            margin-bottom: 0;
            background: none;
            border-radius: 3px;

            dt, dd{
              height: 50px;
              line-height: 50px;
            }

            dt{
              .icon{
                width: 100%;
                height: 100%;
              }

              .icon-shangpinguanli{
                fill: red;
              }

              .icon-benbanzushengchandingdanguanli{
                fill: red;
                width: 50px;
                height: 40px;
              }

              .icon-huiyuan{
                fill: #e46737;
              }
            }

            dd{
              color: #666;
              font-size: 16px;
            }
          }

          .list-wrap:nth-child(odd){
            padding-right: 10px;
          }

          .list-wrap:nth-child(even){
            padding-left: 10px;
          }

          .list-wrap:hover{
            dd{
              color: #333;
            }
          }
        }
      }
    }

    .box-cen:nth-child(odd) {
      padding-right: 10px;
    }

    .box-cen:nth-child(even) {
      padding-left: 10px;
    }

    .box-cen:nth-child(1), .box-cen:nth-child(2) {
      height: 490px;
      overflow: hidden;
    }

    .box-cen:nth-child(3), .box-cen:nth-child(4) {
      height: 460px;
      overflow: hidden;
    }

  }
}

@media screen and (max-width: 1200px) {
  .console-index-wrap{

    .statistics-wrap{
      dl{
        dt{
          width: 50px !important;
          height: 40px !important;
        }

        dd{
          h3{
            font-size: 26px !important;
          }
        }
      }
    }

    .box-wrap{

      .box-cen{
        li{
          h3{
            font-size: 40px;
          }
        }
      }
    }
  }
}
</style>
