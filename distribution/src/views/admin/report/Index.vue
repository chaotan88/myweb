<!-- 业绩表 -->
<template>
  <common-tpl class="finance-index-wrap" :footer="pageType === 2" :back="pageType === 2">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="pageType === 1" @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" class="search-form" label-width="110px">
            <el-form-item label="会员姓名：" prop="customerName">
              <el-input v-model.trim="formData.customerName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机：" prop="customerPhone">
              <el-input v-model.trim="formData.customerPhone" placeholder="会员手机" clearable></el-input>
            </el-form-item>
            <el-form-item label="统计时间段：" class="pos-r apply-date-wrap">
              <el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="formData.statisticsDate" clearable :picker-options="pickerOptions0" @change="statisticsDateChange"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="统计时间：" class="pos-r apply-date-wrap">
              <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.firstDate" clearable class="fl-l"></el-date-picker>
              <span class="d-ib ta-c" style="width: 30px; padding-left: 5px;">至</span>
              <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.endDate" clearable></el-date-picker>
            </el-form-item> -->
          </el-form>
          <div class="clear"></div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="customerPhone" label="会员姓名" min-width="100">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="disRuleName" label="会员手机号" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="dealWithStatus" label="当前等级" min-width="100">
          <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
        </el-table-column>
        <template v-if="pageType === 1">
          <el-table-column prop="withdrawalAmount" label="累计余额总计" min-width="150">
            <template slot-scope="scope">{{scope.row.totalBalance | filterMoney}}</template>
          </el-table-column>
        </template>
        <template v-if="pageType === 1">
          <el-table-column prop="withdrawalAmount" label="累计消费积分总计" min-width="140">
            <template slot-scope="scope">{{scope.row.totalBonusPoints | filterMoney}}</template>
          </el-table-column>
        </template>
        <template v-if="pageType === 1">
          <el-table-column prop="withdrawalAmount" label="累计通用积分总计" min-width="140">
            <template slot-scope="scope">{{scope.row.totalCashPoints | filterMoney}}</template>
          </el-table-column>
        </template>
        <template v-if="pageType === 2">
          <el-table-column prop="withdrawalAmount" label="累计余额">
            <template slot-scope="scope">{{scope.row.totalBalance | filterMoney}}</template>
          </el-table-column>
        </template>
        <template v-if="pageType === 2">
          <el-table-column prop="withdrawalAmount" label="累计消费积分" min-width="120">
            <template slot-scope="scope">{{scope.row.totalBonusPoints | filterMoney}}</template>
          </el-table-column>
        </template>
        <template v-if="pageType === 2">
          <el-table-column prop="withdrawalAmount" label="累计通用积分">
            <template slot-scope="scope">{{scope.row.totalCashPoints | filterMoney}}</template>
          </el-table-column>
        </template>
        <el-table-column prop="cashPoints" label="统计开始时间" min-width="160">
          <template slot-scope="scope">
            <template v-if="formData.statisticsDate[0]">{{formData.statisticsDate[0] | filterDate}}</template>
            <template v-else>{{firstDate | filterDate}}</template>
          </template>
        </el-table-column>
        <el-table-column prop="cashPoints" label="统计结束时间" min-width="160">
          <template slot-scope="scope">
            <template v-if="formData.statisticsDate[1]">{{formData.statisticsDate[1] | filterDate}}</template>
            <template v-else>{{endDate | filterDate}}</template>
          </template>
        </el-table-column>
        <template v-if="pageType === 1">
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleViewDetails(scope.row)"><i class="icon el-icon-view"></i> 查看明细</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
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
  </common-tpl>
</template>

<script>

export default{
  data () {
    // 会员姓名
    let validateCardName = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback()
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    return {
      loading: false,                 // 加载loading
      pageType: 1,                    // 页面类型 [1、业绩表 2、业绩明细]
      firstDate: '',                  // 统计时间开始
      endDate: '',                    // 统计时间结束
      formData: {                     // 表单数据
        condition: '',                // 会员姓名/手机号
        customerName: '',             // 会员姓名
        customerPhone: '',            // 会员手机号
        disRuleName: '',              // 当前等级
        totalBonusPoints: '',         // 累计消费积分
        totalCashPoints: '',          // 累计通用积分
        statisticsDate: [],           // 统计时间段
        firstDate: '',                // 统计时间开始
        endDate: ''                   // 统计时间结束
      },
      highSearchClose: true,          // 高级搜索开/关
      reflectData: {},                // 提现数据
      reflectVisible: false,          // 提现弹窗
      tableData: [],                  // 列表数据
      pageData: {                     // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      all: 0,
      userInfo: {},            // 用户信息
      rules: {
        // 查询条件
        condition: { validator: validatePhone, trigger: 'blur' },
        // 会员姓名
        customerName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        customerPhone: { validator: validatePhone, trigger: 'blur' }
      },
      userId: '',                      // 用户id
      pickerOptions0: {                // 限制时间
        onPick: ({ maxDate, minDate }) => {
          this.onPickDate = minDate
        },
        disabledDate: (time) => {
          if (this.onPickDate) {
            let date = this.onPickDate
            let y = date.getFullYear()
            let m = date.getMonth()
            let firstDay = new Date(y, m, 1)
            let lastDay = new Date(y, m + 2, 0)
            return time.getTime() < firstDay || time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000) || time.getTime() > lastDay
          } else {
            return time.getTime() > new Date(new Date() - 24 * 60 * 60 * 1000)
          }
        }
      }
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.userId = parseInt(this.$route.query.userId) || ''
    if (this.$route.path.match(/details/)) this.pageType = 2
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/report/list/all', (res) => {
      this.formData = res
    })
    if (this.$route.query.startTime) this.formData.statisticsDate[0] = this.$route.query.startTime
    if (this.$route.query.endTime) this.formData.statisticsDate[1] = this.$route.query.endTime
    this.copyCheckForm = this.$Utils.deepCopy(this.checkForm)
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.handleFilterDate()
    this.getListData()
  },

  methods: {
   /**
     * 时间改变
     */
    statisticsDateChange (value) {
      if (!value) this.onPickDate = ''
    },

    /**
     * 过滤时间
     */
    handleFilterDate () {
      // 起始日期过滤
      let firstDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      this.firstDate = this.$Utils.filterDate(firstDate)

      let date = new Date()
      let day = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
      let endDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, day)

      this.endDate = this.$Utils.filterDate(endDate.getTime() + (24 * 60 * 60 * 1000 - 1))
    },

    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = this.pageType === 2 ? '@ROOT_API/disReportManageController/getUserDetailPoints' : '@ROOT_API/disReportManageController/getUserPoints'
        this.loading = true
      } else {
        url = this.pageType === 2 ? 'disReportManageController/exportUserDetailPointsList' : 'disReportManageController/exportUserPointsList'
      }
      // 业绩明细
      // if (this.pageType === 2) {
      //   url = '@ROOT_API/disReportManageController/getUserDetailPoints'
      //   this.loading = true
      // }
      // 起始日期过滤
      // let firstDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
      // let date = new Date()
      // let day = new Date(date.getFullYear(), date.getMonth(), 0).getDate()
      // let endDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, day)
      // let startTime = this.formData.firstDate ? this.$Utils.filterDate(this.formData.firstDate) : this.firstDate
      // let endTime = this.formData.endDate ? this.$Utils.filterDate(this.formData.endDate) : this.endDate
      let endTime = ''
      if (this.pageType === 2) {
        endTime = this.formData.statisticsDate[1] ? this.formData.statisticsDate[1] : this.endDate
      } else {
        endTime = this.formData.statisticsDate[1] ? this.$Utils.filterDate(new Date(this.formData.statisticsDate[1]).getTime()) : this.endDate
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        startTime: this.formData.statisticsDate[0] ? this.$Utils.filterDate(this.formData.statisticsDate[0]) : this.firstDate,
        endTime,
        condition: this.formData.condition,
        customerName: this.formData.customerName,        // 会员姓名
        customerPhone: this.formData.customerPhone,      // 会员手机
        userId: this.userId
      }
      if (!type) {
        this.$http.post(url, data, {timeout: 5 * 600 * 1000}).then((res) => {
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
     * 高级搜索
     */
    highSearch (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.highSearchClose = true
        this.pageChange(1)
        this.getListData()
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.getListData()
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
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

    /**
     * 查看详情
     */
    handleViewDetails (item) {
      let startTime = this.formData.statisticsDate[0] ? this.$Utils.filterDate(this.formData.statisticsDate[0]) : this.firstDate
      let endTime = this.formData.statisticsDate[1] ? this.$Utils.filterDate(new Date(this.formData.statisticsDate[1]).getTime()) : this.endDate
      this.$router.push({path: '/admin/report/list/details', query: {'userId': item.userId, startTime, endTime}})
    }
  }
}
</script>

<style lang='less'>
.finance-index-wrap{
  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }

  .el-form-item{
    .el-input{
      width: 320px !important;
    }
  }

  .apply-date-wrap{

    .el-date-editor{
      width: 320px !important;
    }
  }

  .el-col-2{
    width: 6.3333%;
  }

  /* -------------------- { msg } -------------------- */

}
</style>

