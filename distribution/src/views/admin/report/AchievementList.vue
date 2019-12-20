<!-- 业绩统计表 -->
<template>
  <common-tpl class="achievement-list-wrap" :footer="false">
    <!-- 主体 -->
    <template slot="main">
      <date-select @dateChange="dateChange"></date-select>

      <!-- 统计 -->
      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.grabTotalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">套餐总业绩</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>微信 &nbsp;{{statisticsData.grabWxPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: orange; margin-left: 15px;"></i>
              <span>支付宝 &nbsp;{{statisticsData.grabAliPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>

      </div>

      <div class="statistics-cen">
        <div class="date-and-chart-content">
        <div id="line-chart-achieve"></div>
      </div>
      </div>

      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">

          <!-- 输入手机可查找会员旗下业绩 -->
          <div class="d-ib pos-r" style="width: 380px;">
            <el-input placeholder="输入手机可查找推广大使旗下业绩" v-model.trim="formData.customerPhone" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
          &nbsp;

          <!-- 支付方式 -->
          <div class="d-ib" style="width: 150px;">
            <el-select class="full-w" v-model="formData.payType" @change="subTypehandle()" placeholder="全部支付方式">
              <el-option label="全部支付方式" value=""></el-option>
              <el-option label="微信支付" :value=1></el-option>
              <el-option label="支付宝支付" :value=2></el-option>
            </el-select>
          </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>

      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
       <el-table-column prop="" label="套餐名称">
          <template slot-scope="scope">{{scope.row.setMealName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="套餐金额">
          <template slot-scope="scope">{{scope.row.setMealPriceSum | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="" label="套餐成本">
          <template slot-scope="scope">{{scope.row.setMealCostPriceSum | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="" label="订购数量">
          <template slot-scope="scope">{{scope.row.setMealNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="实付金额">
          <template slot-scope="scope">{{scope.row.orderAmountSum | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="" label="订购总金额">
          <template slot-scope="scope">{{scope.row.orderTotalAmountSum | filterMoney}}</template>
        </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
     <!--  <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination> -->
    </template>

    <template slot="other">

    </template>
  </common-tpl>
</template>

<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')

export default {
  data () {
     // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback()
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    return {
      loading: false,                 // loading
      nowdatestr: '',           // 当前日期
      tableData: [],
      formData: {
        curYear: '',           // 选择日期
        statisticsDate: [],    // 日期
        customerPhone: '',     // 否 string  客户号码
        endDate: '',           // 统计时间结束: '',           // 否 string  结束时间
        payType: '',            // 否 int 支付方式（1：微信，2：支付宝，5：通用积分）
        chartYear: '',
        chartDate: '',
        chartStatisticsDate: []
      },
      statisticsData: {},     // 统计数据
      rules: {
        customerPhone: { validator: validatePhone, trigger: 'blur' }
      },
      pageData: {             // 分页
        currentPage: 3,
        pageSize: 10,
        total: 20
      }
    }
  },
  mounted () {
    // dt.setDate(dt.getDate() - 1)
    // console.log('dt.setDate: ', this.$Utils.filterDate(dt, 'YYYY-MM-DD'))

    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/giftGiving', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getApiData()
  },
  methods: {
    getApiData () {
      this.getStatisticsData()   // 获取统计数据
      this.getListData()         // 获取列表数据
    },
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/achievement/getOrderAchievementForPay', {
        ...this.handleDateArgs()
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
        let sum = 0
        data.forEach((da) => {
          if (da.payType === 1) {
            this.statisticsData.grabWxPayAmount = da.orderAmountSum
          } else if (da.payType === 2) {
            this.statisticsData.grabAliPayAmount = da.orderAmountSum
          }
          if (!isNaN(parseFloat(da.orderAmountSum))) {
            sum += parseFloat(da.orderAmountSum)
          }
        })
        this.statisticsData.grabTotalAmount = sum
      })
    },

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/achievement/getOrderAchievementForUmbrella'
        this.loading = true
      } else {
        url = 'achievement/exportOrderAchievementForUmbrella'
      }
      let data = {
        phone: this.formData.customerPhone,
        ...this.handleDateArgs(),
        payType: this.formData.payType,
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }
      if (!type) {
        this.tableData = []
        this.$http.post(url, data).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let { list, total } = resData.data
          this.tableData = list
          this.pageData.total = total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 时间方法
     */
    handleDateArgs () {
      let res = {
        startTime: '',
        endTime: ''
      }
      if (this.formData.statisticsDate) {
        res.startTime = this.$Utils.filterDate(this.formData.statisticsDate[0], 'YYYY-MM-DD')
        res.endTime = this.$Utils.filterDate(this.formData.statisticsDate[1], 'YYYY-MM-DD')
      }
      return res
    },

    getLineChartData () {
      this.$http.post('@ROOT_API/achievement/getOrderAchievementForMonth', {
        ...this.handleDateArgs()
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
        let { data } = res.data
        let newData = []
        let i = 0
        let startDate = this.handleDateArgs().startTime
        let endDate = this.handleDateArgs().endTime
        let startYear = new Date(startDate).getFullYear()
        let startMonth = new Date(startDate).getMonth() + 1
        let endYear = new Date(endDate).getFullYear()
        let endMonth = new Date(endDate).getMonth() + 1
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
      let chart = echarts.init(document.getElementById('line-chart-achieve'))
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
     * 选择支付方式
     */
    subTypehandle (val) {
      console.log('val: ', val)
      this.getListData()
    },

    /**
     * 选择账户
     */
    accountChange () {
      this.allSelection = false
      this.selectDefaultekey()
      this.getListData()
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.getStatisticsData()
      this.pageChange(1)
    },

    /**
     * 导出
     */
    exportData () {
      let url = 'pointsTransfer/exportPointsTransferGroup'
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'contentText=' + this.formData.contentText, '_blank')
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
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    },
    dateChange (params) {
      this.formData.statisticsDate = params
      this.getStatisticsData()
      this.getLineChartData()
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>
.achievement-list-wrap{

  /*-------------统计----------*/
  .statistics-cen{
    display: flex;
    justify-content: space-between;

    dl{
      width: 100%;
      height: 140px;
      padding-top: 40px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #c2e0fe url(../../../assets/img/product-statistics-basic-bg.jpg);
      background-size: cover;
      border-radius: 5px;
      margin-right: 20px;
      box-sizing: border-box;

      dt, dd{
        height: 60px;
      }
      
      /*dt{
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
      }*/

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

        .small-box-wrap{
          line-height: 20px;

          .small-box{
            width: 20px;
            height: 20px;
            background: green;
          }

          span{
            font-size: 14px;
          }
        }
      }
    }

    dl:last-child{
      margin-right: 0;
    }

    .date-and-chart-content {
      width: 100%;
    }
    #line-chart-achieve {
      height: 300px;
      width: 100%;
      background: #fff;
      div {
        height: 300px;
      }
    }
  }
  
}
</style>

<style lang="less">
.achievement-list-wrap{
 
 /*------------高级搜索------*/
  .search-wrap{
    .apply-date-wrap{
      left: 200px;
    }
    .search-head-wrap{
      padding: 0 !important;
      padding-bottom: 20px !important;
    }
  }
}
</style>
