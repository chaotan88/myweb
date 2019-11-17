<!-- 控制台首页 -->
<template>
  <div class="console-index-wrap">
    <div class="statistics-wrap">

      <!-- 统计总数据 -->
      <statistics-component></statistics-component>
    </div>

    <!-- 统计数据 -->
    <div class="pos-r statistics-data-wrap">

      <!-- 产品收益分布 -->
      <div class="pos-a piechart-wrap">
        <title-public title="产品收益分布"></title-public>
        <div class="common-shadow-wrap piechart-cen">
          <template v-if="profitPieChartData.length">
            <div class="piechart-chart" ref="piechart"></div>
          </template>
          <div class="ta-c no-data-wrap" v-else>
            <svg class="icon icon-no-data" aria-hidden="true">
              <use xlink:href="#icon-no-data"></use>
            </svg>
            <p>暂无数据！</p>
          </div>
        </div>
      </div>

      <!-- 近半年会员增长状况 -->
      <div class="statistics-data-cen">
        <title-public title="近半年会员增长状况"></title-public>
        <div class="pos-r statistics-data-c">
          <no-data style="padding: 100px 0;"></no-data>
          <!-- <div class="echart" ref="statisticsEchart"></div> -->
        </div>
      </div>
    </div>

    <!-- 营收趋势分析 -->
    <div class="statistics-revenue-wrap">
      <title-public title="营收趋势分析"></title-public>
      <div class="pos-r statistics-revenue-cen">
        <div class="statistics-revenue-t">
          <!-- <screen-public @change="revenueScreenChange"></screen-public> -->
        </div>
        <div class="statistics-revenue-c">
          <no-data style="padding: 100px 0;"></no-data>
          <!-- <div class="EchartOne" ref="EchartOne"></div> -->
        </div>
      </div>
    </div>

    <!-- 最新通知/快捷入口 -->
    <div class="box-wrap">

      <!-- 最新通知 -->
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>最新通知</h2>
          <div class="latest-notice-wrap">
            <no-data style="padding: 120px 0;"></no-data>
            <!-- <div class="pos-r notice-list" v-for="item in listData">
              <span class="d-ib truncate text">{{item.messageContent}}</span>
              <span class="d-ib truncate text">{{item.identity}}</span>
              <span class="d-ib pos-a time">{{item.operateTime}}</span>
            </div> -->
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
    </div>

    <br>
    <br>
  </div>
</template>

<script>
import StatisticsComponent from '@/components/admin/Statistics'
import TitlePublic from './TitlePublic'
export default{
  components: {StatisticsComponent, TitlePublic},
  data () {
    return {
      formData: {
        revenueSection: '',             // 营收趋势时间筛选区间
        revenueStartDate: '',           // 营收趋势开始时间
        revenueEndDate: ''              // 营收趋势结束时间
      },
      vipPieChartData: [{value: 100, name: '会员分布'}],
      agentPieChartData: [{value: 100, name: '代理分布'}],
      revenuePieChartData: [{value: 100, name: '营收分布'}],
      revenueTrendNum: [],              // 趋势分析数字
      revenueTrendMonth: [],             // 趋势分析月份
      statisticalData: {
        memberNum: 2322,
        agentNum: 320034,
        orderAmount: 82
      },                                // 统计数据
      noticeListData: [],               // 最新消息列表数据
      profitPieChartData: [],           // 产品收益分布
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
      listData: [
        {
          messageContent: '13576738373',               // 会员手机
          identity: '申请成为钻石会员',                // 会员身份
          operateTime: '2018.9.3  6:53:00'             // 申请时间
        },
        {
          messageContent: '13576738373',               // 会员手机
          identity: '申请成为钻石会员',                // 会员身份
          operateTime: '2018.9.3  6:53:00'             // 申请时间
        },
        {
          messageContent: '13576738373',               // 会员手机
          identity: '申请成为钻石会员',                // 会员身份
          operateTime: '2018.9.3  6:53:00'             // 申请时间
        },
        {
          messageContent: '13576738373',               // 会员手机
          identity: '申请成为钻石会员',                // 会员身份
          operateTime: '2018.9.3  6:53:00'             // 申请时间
        },
        {
          messageContent: '13576738373',               // 会员手机
          identity: '申请成为钻石会员',                // 会员身份
          operateTime: '2018.9.3  6:53:00'             // 申请时间
        }
      ],                     // 列表数据
      quickLinks: [
        {
          title: '会员申请',
          icon: 'icon-icon',
          url: '/admin/distribution/apply/all'
        },
        {
          title: '付款审核',
          icon: 'icon-daifukuan',
          url: '/admin/sale/payment/all'
        },
        {
          title: '结算管理',
          icon: 'icon-fukuan',
          url: '/admin/sale/balance/list'
        },
        {
          title: '会员统计',
          icon: 'icon-jiedianhuiyuanfenzu',
          url: '/admin/vip/center/index'
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
    // this.getOrderVipStatistics()
    // this.getListData()
  },

  methods: {

    /**
     * 获取营收趋势分析数据
     */
    getRevenueTrendData (startDate, endDate, section) {
      this.$http.post('@ROOT_API/product/revenueTrend', {
        beginTime: startDate,
        endTime: endDate,
        timeSection: section
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = this.sortByKey(resData.data, 'monthNum')
        this.revenueTrendNum = []
        this.revenueTrendMonth = []
        results.forEach((row) => {
          this.revenueTrendNum.push(row.orderAmount)
          this.revenueTrendMonth.push(row.monthNum)
        })
        this.initChart()
      })
    },

    /**
     * json排序
     */
    sortByKey (array, key) {
      return array.sort((a, b) => {
        let x = a[key]
        let y = b[key]
        return ((x < y) ? -1 : ((x > y) ? 1 : 0))
      })
    },

    /**
     * 获取饼图数据
     */
    getPieChartData (beginTime, endTime, timeSection, graphType) {
      this.$http.get('@ROOT_API/product/distributionGraph', {
        params: {
          beginTime,        // 开始时间
          endTime,          // 结束时间
          timeSection,      // 时间区间：3个月，6个月，12个月
          graphType         // 图表类型 1.会员分布，2.代理分布，3.营收分布
        }
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          if (graphType === 1) this.vipPieChartData = []
          if (graphType === 2) this.agentPieChartData = []
          if (graphType === 3) this.revenuePieChartData = []
          return false
        }
        let results = [
          {value: resData.data.productRate, name: resData.data.productName}
        ]
        switch (graphType) {
          case 1:
            this.vipPieChartData = results
            this.createPieChart('vipPieChart', results)
            break
          case 2:
            this.agentPieChartData = results
            this.createPieChart('agentPieChart', results)
            break
          case 3:
            this.revenuePieChartData = results
            this.createPieChart('revenuePieChart', results)
            break
        }
      })
    },

    /**
     * 获取订单和会员统计
     */
    getOrderVipStatistics () {
      this.$http.get('@ROOT_API/', {
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
    * 获取最新通知
    */
    getListData () {
      this.$router.push({query: {page: this.pageData.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      this.$http.post('@ROOT_API/', {
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

  /* -------------------- { 统计数据 } -------------------- */
  .statistics-data-wrap{
    margin-top: 20px;
    padding-left: 10px;

    .piechart-wrap, .statistics-data-cen{
      width: 50%;
    }

    .piechart-cen, .statistics-data-c{
      height: 295px;
      background: #fff;
      border-radius: 5px;
    }

    /* -------------------- { 产品收益分布 } -------------------- */
    .piechart-wrap{
      width: 50%;
      border: 1px solid #eee;
      padding-right: 10px;
      box-sizing: border-box;
      top: 0;
      left: 0;

      .piechart-cen{

        .piechart-chart{
          width: 100%;
          height: 100%;
        }
      }

      .no-data-wrap{
        color: #999;
        font-size: 15px;
        padding: 90px 0;
      }
    }

    .statistics-data-cen{
      border: 1px solid #eee;
      padding-left: 50%;

      .statistics-data-c{
        box-sizing: border-box;

        .echart{
          width: 100%;
          height: 100%;
        }
        
        .gradient-wrap{
          width: 100px;
          padding-top: 65px;
          right: 30px;
          top: 0;

          .gradient-line{
            color: #fff;
            width: 100%;
            height: 22px;
            line-height: 22px;
            font-size: 12px;
            margin-bottom: 20px;
            border-radius: 11px;
          }

          .gradient-line:last-child{
            margin-top: 10px;
          }
        }

        .gradient-province{
          background: linear-gradient(to right, #9ae86d, #98eae3);
        }

        .gradient-city{
          background: linear-gradient(to right, #21e2ae, #08afe9);
        }

        .gradient-area{
          background: linear-gradient(to right, #fe8795, #f1f374);
        }

        .gradient-child{
          background: linear-gradient(to right, #d881f1, #707cff);
        }

      }
    }
  }

  /* -------------------- { 营收趋势分析 } -------------------- */
  .statistics-revenue-wrap{
    margin-top: 20px;
    
    .statistics-revenue-cen{
      border: 1px solid #e8ebed;
      border-radius: 5px;
    }

    .statistics-revenue-t{
      border-bottom: 1px solid #f6f8fa;
      padding: 13px 30px;
      background: #fbfbfb;
    }

    .statistics-revenue-c{
      height: 290px;
      padding: 0 180px 10px 50px;
      background: #fff;
      box-sizing: border-box;

      .EchartOne{
        width: 100%;
        height: 100%;
      }
    }

    .gradient-line-wrap{
      width: 130px;
      right: 50px;
      top: 90px;

      .gradient-line{
        color: #fff;
        width: 100%;
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        margin-top: 30px;
        border-radius: 11px;
      }

      .gradient-green{
        background: linear-gradient(90deg, #9fe974, #98eae3)
      }

      .gradient-blue{
        background: linear-gradient(90deg, #21e2ae, #08afe9)
      }

      .gradient-violet{
        background: linear-gradient(90deg, #d881f1, #707cff)
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
            width: 145px;
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
            box-sizing: border-box;

            dt, dd{
              height: 50px;
              line-height: 120px;
            }

            dt{
              .icon{
                fill: #56ade8;
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
