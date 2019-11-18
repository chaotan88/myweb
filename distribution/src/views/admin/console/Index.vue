<!-- 控制台首页 -->
<template>
  <div class="console-index-wrap">
    <div class="statistics-wrap">

      <!-- 统计总数据 -->
      <statistics-component></statistics-component>
    </div>

    <!-- 营业额增长趋势 -->
    <div class="statistics-revenue-wrap">
      <title-public title="营业额增长趋势"></title-public>
      <div class="pos-r statistics-revenue-cen">
        <div class="statistics-revenue-t">
          <!-- 时间 -->
          <el-form ref="form" :model="formData.data" label-position="right" class="search-form" label-width="110px">
            <div class="d-ib pos-a" style="width: 150px;">
              <el-select v-model="formData.curYear" size="medium" class="year-box" placeholder="选择年份" @change="selectYear" clearable>
                <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in yearArr"></el-option>
              </el-select>
            </div>
            <el-form-item label="统计时间段：" class="pos-r apply-date-wrap" style="left: 200px">
              <el-date-picker v-model.trim="formData.statisticsDate"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable @change="handleFilterDate"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="statistics-revenue-c" v-if="!lineChartData || lineChartData.length === 0">
          <no-data style="padding: 100px 0;"></no-data>
        </div> -->
        <div id="line-chart-id"></div>
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
              <span class="d-ib truncate text">{{item.messageContent}}</span>
              <span class="d-ib truncate text">{{item.identity}}</span>
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
    </div>

    <br>
    <br>
  </div>
</template>

<script>
import StatisticsComponent from '@/components/admin/Statistics'
import TitlePublic from './TitlePublic'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
export default{
  components: {StatisticsComponent, TitlePublic},
  data () {
    return {
      formData: {
        curYear: '',           // 选择日期
        statisticsDate: [],    // 日期
        endDate: ''            // 统计时间结束: '',           // 否 string  结束时间
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
          title: '推广大使申请',
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
          title: '推广大使统计',
          icon: 'icon-jiedianhuiyuanfenzu',
          url: '/admin/vip/center/index'
        }
      ],
      pageData: {
        currentPage: 1,     // 当前分页
        pageSize: 5,        // 显示条数，不写的话默认为10
        total: 0            // 列表总条数
      },
      yearArr: [              // 选择年
        {
          label: '近三个月',
          value: 3
        },
        {
          label: '近半年',
          value: 6
        },
        {
          label: '近一年',
          value: 12
        }
      ]
    }
  },

  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
  },

  methods: {

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

    getLineChartData () {
      let data = [
        {
          name: '1月',
          value: 10000
        },
        {
          name: '2月',
          value: 15000
        },
        {
          name: '3月',
          value: 18000
        },
        {
          name: '4月',
          value: 20000
        },
        {
          name: '5月',
          value: 25000
        },
        {
          name: '6月',
          value: 28000
        }
      ]
      this.buildChart(data)
    },
    buildChart (data) {
      let chart = echarts.init(document.getElementById('line-chart-id'))
      let xData = data.map(da => da.name)
      let yData = data.map(da => da.value)
      chart.setOption({
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
     * 过滤选择时间
     */
    handleFilterDate (data) {
      this.formData.curYear = ''
      this.getLineChartData()
    },

    /**
     * 时间改变
     */
    selectYear (value) {
      if (!value) return false
      var dt = new Date()
      switch (value) {
        case 3:
          dt.setMonth(dt.getMonth() - 3)
          break
        case 6:
          dt.setMonth(dt.getMonth() - 6)
          break
        case 12:
          dt.setMonth(dt.getMonth() - 12)
          break
      }
      this.formData.statisticsDate = [dt, new Date()]
      this.getLineChartData()
    },
  /**
    * 获取最新通知
    */
    getListData () {
      // this.$router.push({query: {page: this.pageData.currentPage}})    // 地址栏追加当前分页（当你刷新的时候不会回到第一页）
      // this.$http.post('@ROOT_API/', {
      //   start: this.pageData.currentPage,
      //   pageSize: this.pageData.pageSize
      // }).then((res) => {
      //   let resData = res.data
      //   if (parseInt(resData.status) !== 1) {
      //     return false
      //   }
      //   this.listData = resData.data.list
      //   this.pageData.total = resData.data.total        // 自定义好的列表总条数为0，需要传值给后台数据，循环后台传回来的数据
      // })
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

  #line-chart-id {
    height: 300px;
    width: 100%;
    background: #fff;
    div {
      height: 300px;
    }
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
