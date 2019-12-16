<!-- 控制台首页 -->
<template>
  <div class="console-index-wrap">
    <div class="statistics-wrap">

      <!-- 统计总数据 -->
      <statistics-component :statisticalData="statisticalData"></statistics-component>
    </div>

    <!-- 营业额增长趋势 -->
    <div class="statistics-revenue-wrap">
      <title-public title="营业额增长趋势"></title-public>
      <div class="pos-r statistics-revenue-cen">
        <date-select @dateChange="dateChange"></date-select>
        <!-- <div class="statistics-revenue-c" v-if="!lineChartData || lineChartData.length === 0">
          <no-data style="padding: 100px 0;"></no-data>
        </div> -->
        <div id="line-chart-id"></div>
        <!-- <div v-if="!chartData || chartData.length === 0" class="chart-no-data">
          <no-data></no-data>
        </div> -->
      </div>
    </div>

    <!-- 最新通知/快捷入口 -->
    <div class="box-wrap">

      <!-- 最新通知 -->
      <div class="box-cen fl-l">
        <div class="box-c">
          <h2>最新通知</h2>
          <div class="latest-notice-wrap">
            <!-- <no-data style="padding: 120px 0;"></no-data> -->
            <div class="pos-r notice-list" v-for="item in listData">
              <span class="d-ib truncate text">{{item.phone}}</span>
              <span class="d-ib truncate text">成为{{item.rankName}}</span>
              <span class="d-ib pos-a time">{{item.createTime | filterDate}}</span>
            </div>
          </div>

          <!-- 分页 -->
          <div class="ta-c common-bottom-wrap handleup-b">
            <el-pagination background layout="prev, pager, next"
            :current-page="pageData.currentPage" :total="pageData.total"
            @current-change="pageChange" v-if="pageData.total"></el-pagination>
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
  </div>
</template>

<script>
import StatisticsComponent from '@/components/admin/Statistics'
import TitlePublic from './TitlePublic'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
export default{
  components: {StatisticsComponent, TitlePublic},
  data () {
    return {
      listData: [],                     // 列表数据
      quickLinks: [
        {
          title: '套餐管理',
          icon: 'icon-icon',
          url: '/admin/business/package'
        },
        {
          title: '代金券管理',
          icon: 'icon-fukuan',
          url: '/admin/business/voucher'
        },
        {
          title: '套餐订单',
          icon: 'icon-daifukuan',
          url: '/admin/order/payment'
        },
        {
          title: '推广大使增长',
          icon: 'icon-jiedianhuiyuanfenzu',
          url: '/admin/report/vip/increase'
        }
      ],
      pageData: {
        currentPage: 1,     // 当前分页
        pageSize: 5,        // 显示条数，不写的话默认为10
        total: 0            // 列表总条数
      },
      queryDate: [],
      chartData: [],
      statisticalData: {
        memberCount: 0,
        setMealPriceSum: 0
      }
    }
  },

  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getTotalData()
    this.getListData()
    this.getLineChartData()
  },

  methods: {
    getTotalData () {
      this.$http.post('@ROOT_API/homePage/getHomePageStatistics', {}).then((res) => {
        let { data } = res.data
        if (data) {
          this.statisticalData.memberCount = data.memberCount
          this.statisticalData.setMealPriceSum = data.setMealPriceSum
        }
      })
    },

    getListData () {
      this.$http.post('@ROOT_API/member/getMemberUpgradeLog', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let { list, total } = res.data.data
        this.listData = list
        this.pageData.total = total
      })
    },
    getLineChartData () {
      this.$http.post('@ROOT_API/achievement/getOrderAchievementForMonth', {
        startTime: this.queryDate[0],
        endTime: this.queryDate[1]
      }).then((res) => {
        let { data } = res.data
        let newData = []
        // let startMonth = this.queryDate[0].getMonth()
        // let endMonth = this.queryDate[1].getMonth()
        // newData.push({
        //   name: this.$Utils.filterDate(data[0], 'YYYY年MM月')
        // })
        let i = 0
        let startYear = new Date(this.queryDate[0]).getFullYear()
        let startMonth = new Date(this.queryDate[0]).getMonth() + 1
        let endYear = new Date(this.queryDate[1]).getFullYear()
        let endMonth = new Date(this.queryDate[1]).getMonth() + 1
        while (true) {
          if (i > 36) break
          let date = new Date(`${endYear}-${endMonth}-01`).setMonth(new Date(`${endYear}-${endMonth}-01`).getMonth() - i)
          if (date >= new Date(`${startYear}-${startMonth}-01 00:00:00`).getTime()) {
            i++
            newData.push({
              name: date,
              value: 0
            })
          } else {
            break
          }
        }
        newData.sort((a, b) => (a.name - b.name))
        newData.forEach((nd) => {
          data.forEach((da) => {
            console.log(this.$Utils.filterDate(nd.name, 'YYYYMM'))
            if (this.$Utils.filterDate(nd.name, 'YYYYMM') === da.orderTimeMonth + '') {
              nd.value = da.orderAmountSum
            }
          })
          nd.name = this.$Utils.filterDate(new Date(nd.name), 'YYYY年MM月')
        })
        this.chartData = newData
        this.buildChart(newData)
      })
    },
    buildChart (data) {
      let chart = echarts.init(document.getElementById('line-chart-id'))
      let xData = data.map(da => da.name)
      let yData = data.map(da => da.value)
      chart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: yData,
          type: 'line'
        }]
      })
    },

    /**
     * 分页改变
     */
    pageChange (page) {             // 执行当页面分页改变时候的方法
      this.pageData.currentPage = page       // 重置当前分页
      this.getListData()            // 获取列表数据
    },
    dateChange (params) {
      this.queryDate = params
      this.getLineChartData()
    }
  }
}
</script>

<style lang='less' scoped>
.console-index-wrap{

  #line-chart-id {
    height: 300px;
    width: 100%;
    background: #fff;
    div {
      height: 300px;
    }
  }
  .chart-no-data {
    height: 200px;
    width: 100%;
    padding-top: 100px;
    background: #fff;
  }
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
            width: 180px;
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
