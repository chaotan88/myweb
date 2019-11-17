<!-- 统计 - 销售积分列表 -->
<template>
  <common-tpl class="count-sale">
    <template slot="main">

      <!-- 统计销售总数据 -->
      <div class="statistics-basic-wrap">
        <div class="items">
          <dl class="pos-r">
            <dt class="d-b pos-a dt2">
              <!-- <svg class="icon icon-jiankang va-m" aria-hidden="true">
                <use xlink:href="#icon-jiankang"></use>
              </svg> -->
            </dt>
            <dd>
              <strong class="fw-n d-b">{{statisticalData.agentNum | filterMoney}}</strong>
              <p>产品代理商数</p>
            </dd>
          </dl>
        </div>
        <div class="items">
          <dl class="pos-r">
            <dt class="d-b pos-a dt3"></dt>
            <dd>
              <strong class="fw-n d-b">{{statisticalData.orderAmount | filterMoney}}</strong>
              <p>产品总营收</p>
            </dd>
          </dl>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="statistics-data-wrap">

        <!-- 产品收益分布 -->
        <div class="pos-a piechart-wrap">
          <!-- <title-public title="产品收益分布"></title-public> -->
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
          <!-- <title-public title="近半年会员增长状况"></title-public> -->
          <div class="pos-r statistics-data-c">
            <div class="echart" ref="statisticsEchart"></div>
          </div>
        </div>
      </div>

      <!-- 营收趋势分析 -->
      <div class="statistics-revenue-wrap">
        <h2 class="fw-l title">营收趋势分析</h2>
        <div class="pos-r statistics-revenue-cen">
          <div class="statistics-revenue-t">
            <screen-public @change="revenueScreenChange"></screen-public>
          </div>
          <div class="statistics-revenue-c">
            <div class="EchartOne" ref="EchartOne"></div>
          </div>
        </div>
      </div>

      <!-- 表格数据 -->
      <div class="table-box">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="phone" label="会员手机">
            <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="tradType" label="交易类型" width="120">
            <template slot-scope="scope">{{scope.row.tradType | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="applyTime" label="成交日期">
            <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="turnover" label="成交额">
            <template slot-scope="scope">{{scope.row.turnover | filterEmpty}}</template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="ta-c">
          <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total"@current-change="pageChange" v-if="pageData.total">
          </el-pagination>
        </div>
      </div>
    </template>
  </common-tpl>
</template>

<script>
  import TitlePublicComponent from './TitlePublic'
  export default {
    components: {TitlePublicComponent},
    data () {
      return {
        loading: false,           // 加载loading
        profitPieChartData: [],   // 产品收益分布
        statisticalData: {
          memberNum: 2322,
          agentNum: 320034,
          orderAmount: 82
        },                                      // 统计数据
        tableData: [{
          phone: '13576738373',                 // 会员手机
          tradType: '成为服务中心',             // 交易类型
          applyTime: '2018.9.3 6:53:00',        // 成交日期
          turnover: '44534,45.00'               // 成交额
        }, {
          phone: '13576738373',                 // 会员手机
          tradType: '成为服务中心',             // 交易类型
          applyTime: '2018.9.3 6:53:00',        // 成交日期
          turnover: '44534,45.00'               // 成交额
        }, {
          phone: '13576738373',                 // 会员手机
          tradType: '成为服务中心',             // 交易类型
          applyTime: '2018.9.3 6:53:00',        // 成交日期
          turnover: '44534,45.00'               // 成交额
        }, {
          phone: '13576738373',                 // 会员手机
          tradType: '成为服务中心',             // 交易类型
          applyTime: '2018.9.3 6:53:00',        // 成交日期
          turnover: '44534,45.00'               // 成交额
        }],
        pageData: {                          // 分页
          currentPage: 1,
          pageSize: 10,
          total: 20
        }
      }
    },
    mounted () {
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.loading = true
        this.$http.post('@ROOT_API/', {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          phone: this.tableData.phone,             // 会员手机
          tradType: this.tableData.tradType,       // 交易类型
          applyTime: this.tableData.applyTime ? this.Utils.filterDate(this.tableData.applyTime, 'YYYY-MM-DD') : '',   // 成交日期
          turnover: this.tableData.turnover        // 成交额
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          // 分页数
          this.pageData.total = resData.data.total
          // 列表数据
          this.tableData = resData.data.list
        }).finally(() => {
          this.loading = false
        })
      },

      /**
       * 分页操作
       */
      pageChange (page) {
        if (this.pageData.currentPage === page) {
          this.getListData()
        } else {
          this.pageData.currentPage = page
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
.count-sale{

  /* -------------------- { 统计销售总数据 } -------------------- */
  .statistics-basic-wrap{
    height: 140px;
    overflow: hidden;
    display: flex;
    justify-content: space-between;

    .items{
      width: 50%;
      height: 100%;
      margin-right: 25px;
      overflow: hidden;
      background: url(../../../assets/img/product-statistics-basic-bg.jpg) no-repeat center center;
      background-size: cover;
      border-radius: 5px;

      dl{
        color: #fff;
        margin-top: 45px;
        margin-left: 35%;
        padding-left: 85px;

        dt{
          width: 70px;
          height: 80px;
          background-image: url(../../../assets/img/product-statistics-sole-ico.png);
          background-repeat: no-repeat;
          left: 0;
          top: 0;
        }

        .dt2{
          background-position: 0 0;
        }

        .dt3{
          background-position: -70px 0;
        }

        dd{
          strong{
            height: 28px;
            line-height: 28px;
            font-size: 28px;
            margin-bottom: 12px;  
          }
        }
      }
    }

    .items:last-child{
      margin-right: 0;
    }
  }

  /* -------------------- { 统计数据 } -------------------- */
  .statistics-data-wrap{
    margin-top: 10px;
    padding-left: 50%;
    margin-left: 10px;

    .piechart-cen, .statistics-data-c{
      height: 295px;
      background: #fff;
      border-radius: 5px;
    }

    /* -------------------- { 产品收益分布 } -------------------- */
    .piechart-wrap{
      width: 45%;
      left: 70px;
      border: 1px solid #eee;
      margin-right: 20px;

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

    h2{
      font-size: 18px;
    }
    
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

  /* -------------------- { 表格数据 } -------------------- */
  .table-box{
    margin-top: 20px;
    padding-bottom: 40px;
    background: #fff;

    .el-pagination{
      margin-top: 20px;
    }
  }
}
</style>