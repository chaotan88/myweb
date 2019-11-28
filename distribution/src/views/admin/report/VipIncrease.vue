<!-- 推广大使增长表 -->
<template>
  <common-tpl class="vip-increase-wrap" :footer="false">
    <!-- 统计 -->
    <template slot="header">
      <div class="statistics-cen">
        <div class="date-and-chart-content">
          <div class="statistics-revenue-t">
            <!-- 时间 -->
            <!-- <el-form ref="form" label-position="right" class="search-form" label-width="110px">
              <div class="d-ib pos-a" style="width: 150px;">
                <el-select v-model="formData.chartYear" size="medium" class="year-box" placeholder="选择年份" @change="selectChartYear" clearable>
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in chartYearArr"></el-option>
                </el-select>
              </div>
              <el-form-item label="统计时间段：" class="pos-r apply-date-wrap" style="left: 200px">
                <el-date-picker v-model.trim="formData.chartStatisticsDate"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable @change="handleChartFilterDate"></el-date-picker>
              </el-form-item>
            </el-form> -->
            <date-select @dateChange="dateChange"></date-select>
          </div>
          <!-- <div class="statistics-revenue-c" v-if="!lineChartData || lineChartData.length === 0">
            <no-data style="padding: 100px 0;"></no-data>
          </div> -->
          <div id="line-chart-vip"></div>
        </div>
      </div>

      <div class="statistics-cen">
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-huiyuanzongshu" aria-hidden="true">
              <use xlink:href="#icon-huiyuanzongshu"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>
              <span v-if="statisticsData.memberTotal">{{statisticsData.memberTotal | filterEmpty}}</span>
              <template v-else>--</template>
            </h3>
            <h4>推广大使总数</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian1" aria-hidden="true">
              <use xlink:href="#icon-tian1"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowSeven || 0}}</h3>
            <h4>近7天新增</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian2" aria-hidden="true">
              <use xlink:href="#icon-tian2"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowThirty || 0}}</h3>
            <h4>近30天新增</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l">
          <dt class="d-ib va-m">
            <svg class="icon icon-tian" aria-hidden="true">
              <use xlink:href="#icon-tian"></use>
            </svg>
          </dt>
          <dd class="d-ib va-m ta-l">
            <h3>{{statisticsData.memberGrowNinety || 0}}</h3>
            <h4>近90天新增</h4>
          </dd>
        </dl>
      </div>

      <high-search :textVisible="false">
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <!-- 表单 -->
    <template slot="main">
      <div class="table-wrap">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column prop="disRuleName" label="推广大使等级">
            <template slot-scope="scope">
              <template v-if="!scope.row.rankId">总计</template>
              <template v-else>{{scope.row.rankName | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="" label="推广大使总数">
            <template slot-scope="scope">
              <template>{{scope.row.memberCount | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="" label="近7天">
            <el-table-column prop="" label="新增推广大使数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before7DayMemberCount}}</template>
                <template v-else>{{scope.row.before7DayMemberCount | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before7DayMemberRatio | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.before7DayMemberRatio | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="近30天">
            <el-table-column prop="" label="新增推广大使数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before30DayMemberCount}}</template>
                <template v-else>{{scope.row.before30DayMemberCount | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before30DayMemberRatio | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.before30DayMemberRatio | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="" label="近90天">
            <el-table-column prop="" label="新增推广大使数">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before90DayMemberCount}}</template>
                <template v-else>{{scope.row.before90DayMemberCount | filterEmpty}}</template>
              </template>
            </el-table-column>
            <el-table-column prop="" label="环比">
              <template slot-scope="scope">
                <template v-if="!scope.row.disRuleId">{{scope.row.before90DayMemberRatio | filterEmpty('%')}}</template>
                <template v-else>{{scope.row.before90DayMemberRatio | filterEmpty('%')}}</template>
              </template>
            </el-table-column>
          </el-table-column>

          <!-- 暂无数据 -->
          <template slot="empty">
            <no-data></no-data>
          </template>
        </el-table>
      </div>
    	<!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination>
    </template>
  </common-tpl>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
export default{
  data () {
    return {
      loading: false,           // 列表loading
      statisticsData: {},       // 统计数据
      tableData: [],            // 表格数据
      pageData: {               // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      userInfo: {},
      formData: {
        chartYear: '',
        chartDate: '',
        chartStatisticsDate: []
      },
      chartYearArr: [          // 选择年
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
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getListData()
  },

  methods: {

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/member/getMemberForRatio'
        this.loading = true
      } else {
        url = 'meal/exportMemberForRatioList'
      }
      if (!type) {
        this.$http.post(url, {
          timeout: 5000
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let { data } = resData
          let totalItem = data.filter(li => li.rankName === '总数')
          if (totalItem && totalItem.length > 0) {
            this.statisticsData.memberTotal = totalItem[0].memberCount
            this.statisticsData.memberGrowSeven = totalItem[0].before7DayMemberCount
            this.statisticsData.memberGrowThirty = totalItem[0].before30DayMemberCount
            this.statisticsData.memberGrowNinety = totalItem[0].before90DayMemberCount
          }
          this.tableData = data
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
        this.$router.go(0)
      }
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {userId: this.userId, page: this.pageData.currentPage}})
      }
    },
    getLineChartData () {
      this.$http.post('@ROOT_API/member/getMemberForMonth', {
        startTime: this.formData.statisticsDate[0],
        endTime: this.formData.statisticsDate[1]
      }).then((res) => {
        let { data } = res.data
        let newData = []
        data.forEach((da) => {
          newData.push({
            name: da.upgradeMonth,
            value: da.memberCount
          })
        })
        this.chartData = newData
        this.buildChart(newData)
      })
    },
    buildChart (data) {
      let chart = echarts.init(document.getElementById('line-chart-vip'))
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
    dateChange (params) {
      this.formData.statisticsDate = params
      this.getLineChartData()
    }
  }
}
</script>
<style lang="less">
.vip-increase-wrap{
  /*-------------统计----------*/
  .statistics-cen{
    display: flex;
    justify-content: space-between;

    dl{
      width: 25%;
      height: 140px;
      padding-top: 40px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #c2e0fe url(../../../assets/img/product-statistics-basic-bg.jpg) ;
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

    /*dl:nth-child(2){
      background: #7c55ca;
    }

    dl:nth-child(3){
      background: #e46737;
    }*/

    dl:last-child{
      /*background: #f39817;*/
      margin-right: 0;
    }
    .date-and-chart-content {
      width: 100%;
    }
    #line-chart-vip {
      height: 300px;
      width: 100%;
      background: #fff;
      div {
        height: 300px;
      }
    }
  }

  /*------------表单-----------*/
  .table-wrap{

  }
}
</style>