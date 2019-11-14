<!-- 通用积分流水表 -->
<template>
  <common-tpl class="currency-list-wrap" :footer="false">
    <!-- 主体 -->
    <template slot="main">

      <!-- 时间 -->
      <el-form ref="form"  :model="formData" label-position="right" class="search-form" label-width="110px">
        <el-form-item label="统计时间：" class="pos-r apply-date-wrap">
          <el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="formData.statisticsDate" :clearable="false" :picker-options="pickerOptions" @change="statisticsDateChange"></el-date-picker>
          <!--<el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="formData.statisticsDate" :default-time="['00:00:00', '23:59:59']" clearable :picker-options="pickerOptions" @change="statisticsDateChange"></el-date-picker>-->
        </el-form-item>
      </el-form>

      <!-- 统计 -->
      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span class="ta-c">{{statisticsData.beforeCashPointsTotal | filterEmpty}}</span>
            </h3>
            <h4 class="ta-c">统计周期前资金池总额</h4>
          </dd>
        </dl>

        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span class="ta-c">{{statisticsData.inCashPoints | filterEmpty}}</span>
            </h3>
            <h4 class="ta-c">统计周期内收入</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span class="ta-c">{{statisticsData.outCashPoints | filterEmpty}}</span>
            </h3>
            <h4 class="ta-c">统计周期内支出</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span class="ta-c">{{statisticsData.afterCashPointsTotal | filterEmpty}}</span>
            </h3>
            <h4 class="ta-c">统计周期后资金池总额</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-l">
            <h3>
              <span class="ta-c">{{statisticsData.todayCashPoints | filterEmpty}}</span>
            </h3>
            <h4 class="ta-c">今日实时数据</h4>
          </dd>
        </dl>
      </div>

      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="width: 150px;">
            <el-select class="full-w" v-model="formData.addSource" clearable placeholder="全部科目" @change="pageChange(1)">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in sourceList"></el-option>
            </el-select>
          </div>
          &nbsp;
          <div class="d-ib pos-r" style="width: 380px;">
            <el-input placeholder="输入会员姓名/手机号/ID号/交易单号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>

      <!-- 列表 -->
      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
       <el-table-column prop="" label="会员姓名">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="会员手机号" width="180">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="会员ID号" width="180">
          <template slot-scope="scope">{{scope.row.invitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易科目" width="120">
          <template slot-scope="scope">{{scope.row.addSource | filterSource}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易单号" width="220">
          <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="积分变动">
          <template slot-scope="scope">{{scope.row.propertyAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="通用积分结余" width="180">
          <template slot-scope="scope">{{scope.row.cashPointsRemain | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="交易时间" width="180">
          <template slot-scope="scope">{{scope.row.transactionTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
<!--                <el-dropdown-item>
                  <div @click="handleViewDetailed(scope.row)"><i class="icon el-icon-view"></i> 查看明细</div>
                </el-dropdown-item>-->
                <el-dropdown-item>
                  <div @click="handleViewDetails(scope.row)"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>
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

    <template slot="other">

    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      loading: false,                 // loading
      tableData: [],
      formData: {
        condition: '',
        addSource: '',
        statisticsDate: []
      },
      sourceList: [{
        label: '预付充值',
        value: 1
      }, {
        label: '平台充值',
        value: 5
      }, {
        label: '平台扣款',
        value: 6
      }, {
        label: '抢购商品',
        value: 2
      }, {
        label: '批发商品',
        value: 3
      }, {
        label: '批发售出',
        value: 7
      }, {
        label: '平台购物',
        value: 4
      }, {
        label: '提现',
        value: 8
      }, {
        label: '提现回退',
        value: 9
      }, {
        label: '积分转赠',
        value: 10
      }, {
        label: '好友赠送',
        value: 11
      }, {
        label: '直推奖',
        value: 12
      }, {
        label: '团队奖',
        value: 13
      }
      ],
      statisticsData: {},     // 统计数据
      pickerOptions: {                // 限制时间
        onPick: ({ maxDate, minDate }) => {
        //  console.log(111111111111111111111111111111)
        //  console.log('maxDAte：', this.$Utils.filterDate(maxDate))
        //  console.log('minDate：', this.$Utils.filterDate(minDate))
          // this.onPickDate = minDate
          this.onPickDate = minDate.getTime()
       //   if (maxDate) {
        //    this.onPickDate = ''
       //   }
        },
        disabledDate: (time) => {
          let date = new Date()
          let y = date.getFullYear()
          let m = date.getMonth()
          let d = date.getDate()
          // let lastDate = new Date(date.getTime())
          // let firstDate = new Date(date.getTime())
          let yst = new Date(new Date(y, m, d, 23, 59, 59) - 24 * 60 * 60 * 1000)
          if (this.onPickDate) {
            // ...
            //  console.log(this.$Utils.filterDate(this.onPickDate))
            const day30 = (30 + 1) * 24 * 3600 * 1000
            let maxTime = this.onPickDate - (-day30)
            let minTime = this.onPickDate - day30
          //  console.log(this.$Utils.filterDate(maxTime))
          //  console.log(this.$Utils.filterDate(minTime))
          //  console.log(this.$Utils.filterDate(yst))
          //  console.log(111111111)
            if (maxTime > yst) {
              maxTime = yst
            }
            // ...
            //   let mt = maxTime < yst ? maxTime : yst
            return time.getTime() < minTime || time.getTime() > maxTime
          } else {
            return time.getTime() > yst
          }
        }
      },
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.handleFilterDate()
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData(['/admin/report/currency/list', '/admin/report/currency/list/details'], (res) => {
      this.formData = res
    })
  //  if (this.$route.query.startTime) this.formData.statisticsDate[0] = this.$route.query.startTime
  //  if (this.$route.query.endTime) this.formData.statisticsDate[1] = this.$route.query.endTime

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getStatisticsData()
    this.getListData()
  },
  methods: {
    /**
     * 过滤时间
     */
    handleFilterDate () {
      let date = new Date(new Date() - 24 * 60 * 60 * 1000)
      let y = date.getFullYear()
      let m = date.getMonth()
      let d = date.getDate()
     // let lastDate = new Date(date.getTime())
     // let firstDate = new Date(date.getTime())
      this.formData.statisticsDate = [new Date(y, m, d, 0, 0), new Date(y, m, d, 23, 59, 59)]
     // console.log(this.formData.statisticsDate)
    },
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/buyAccountCashflowController/getAccountCashPointsFlowStatic', {
        startTime: this.$Utils.filterDate(this.formData.statisticsDate[0]),
        endTime: this.$Utils.filterDate(this.formData.statisticsDate[1])
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
        if (resData.data.data) {
          this.statisticsData = resData.data.data
        }
      })
    },

    /**
     * 时间改变
     */
    statisticsDateChange (value) {
      if (!value) this.onPickDate = ''
      if (value) {
        this.getStatisticsData()
        this.pageChange(1)
      }
    },

    /**
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buyAccountCashflowController/getAccountCashPointsFlowList'
        this.loading = true
      } else {
        url = 'buyAccountCashflowController/exportAccountCashPointsFlowList'
      }
      let data = {
        startTime: this.$Utils.filterDate(this.formData.statisticsDate[0]),
        endTime: this.$Utils.filterDate(this.formData.statisticsDate[1]),
        addSource: this.formData.addSource,
        condition: this.formData.condition,
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }
      if (!type) {
        this.$http.post(url, data).then((res) => {
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
          this.tableData = resData.data.list
          this.pageData.total = resData.data.total
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
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 查看明细
     */
    handleViewDetailed (row) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      localStorage.setItem(this.$global.SYSTEM + 'detailsData', JSON.stringify(row))
      this.$router.push('/admin/report/currency/account/detailed')
    },

    /**
     * 查看详情
     */
    handleViewDetails (row) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      localStorage.setItem(this.$global.SYSTEM + 'detailsData', JSON.stringify(row))
      this.$router.push({path: '/admin/report/currency/list/details', query: {'userId': row.userId}})
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
        this.$router.push({query: {page: this.pageData.currentPage, startTime: this.pageData.currentPage, endTime: this.pageData.currentPage}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
.currency-list-wrap{

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
      background: #c2e0fe url(../../../../assets/img/product-statistics-basic-bg.jpg);
      background-size: cover;
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
  }

}
</style>

<style lang="less">
.currency-list-wrap{

 /*------------高级搜索------*/
  .search-wrap{

    .search-head-wrap{
      padding: 0 !important;
      padding-bottom: 20px !important;
    }
  }
}
</style>
