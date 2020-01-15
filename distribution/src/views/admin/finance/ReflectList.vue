<!-- 提现管理 -->
<template>
  <common-tpl class="finance-index-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <div class="d-ib" style="width: 160px;">
            <el-select class="full-w" v-model="formData.accountType">
              <el-option label="全部" value=""></el-option>
              <el-option label="银行卡" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
            </el-select>
          </div>
          &nbsp;
          <el-date-picker v-model.trim="formData.queryDate"  type="daterange"
            style="width: 300px; padding-top: 0px;"
            range-separator="至" start-placeholder="申请开始日期" end-placeholder="申请结束日期"
            clearable @change="searchHandle"
            format="yyyy-MM-dd">
          </el-date-picker>
          &nbsp;
          <div class="d-ib pos-r" style="width: 250px;">
            <el-input placeholder="输入会员姓名/手机号/身份证号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="customerPhone" label="推广大使手机" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="推广大使身份" min-width="120">
          <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="dealWithStatus" label="状态">
          <template slot-scope="scope">{{scope.row.dealWithStatus | filterdealwithStatus}}</template>
        </el-table-column>
        <el-table-column prop="accountType" label="提现方式">
          <template slot-scope="scope">
            {{scope.row.accountType | filterAccountType}}
          </template>
        </el-table-column>
        <el-table-column prop="cashPoints" label="提现前余额（元）" min-width="130">
          <template slot-scope="scope">{{scope.row.cashPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalAmount" label="提现金额（元）" min-width="130">
          <template slot-scope="scope">{{scope.row.withdrawalAmount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalFees" label="提现手续费（元）" min-width="150">
          <template slot-scope="scope">{{scope.row.withdrawalFees | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalAmount" label="提现应付金额（元）" min-width="150">
          <template slot-scope="scope">
            {{(parseFloat(scope.row.withdrawalAmount * 1000) - parseFloat(scope.row.withdrawalFees * 1000)) / 1000 | filterMoney | filterEmpty()}}
          </template>
        </el-table-column>
        <el-table-column prop="afterCashPoints" label="账户结余（元）" min-width="150">
          <template slot-scope="scope">{{scope.row.afterCashPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="applyTime" label="提现申请时间" min-width="160">
          <template slot-scope="scope">{{scope.row.applyTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleReflectBefore(scope.row)" v-if="scope.row.dealWithStatus === 1">
                    <i class="icon el-icon-edit"></i>打款</div>
                  <div @click="handleDetailBefore(scope.row)" v-else-if="scope.row.dealWithStatus === 2">
                    <i class="icon el-icon-view"></i>详情</div>
                  <div @click="handleDetailBefore(scope.row)" v-else-if="scope.row.dealWithStatus === 3">
                    <i class="icon el-icon-view"></i>回退详情</div>
                  <div @click="handleReflectBefore(scope.row)" v-else-if="scope.row.dealWithStatus === 4">
                    <i class="icon el-icon-edit"></i>继续打款</div>
                  <div @click="handleDetailBefore(scope.row)" v-else-if="scope.row.dealWithStatus === 5">
                    <i class="icon el-icon-view"></i>打款详情</div>
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

      <reflect-dialog :visible="reflectVisible" :initData="reflectData" @close="reflectVisible = false"
        @success="handleSuccess" @error="showErrorMsg"></reflect-dialog>
      <reflect-detail :visible="detailVisible" :initData="reflectData" @close="detailVisible = false"
        @success="handleSuccess"></reflect-detail>
      <el-dialog
        title="提示"
        :visible.sync="msgVisible"
        width="30%">
        <div class="message-content">
          <div>{{errorMsg}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="msgVisible = false">确 定</el-button>
        </span>
      </el-dialog>

    </template>
  </common-tpl>
</template>

<script>
import ReflectDialog from './ReflectDialog'
import ReflectDetail from './ReflectDetail'

export default{
  components: { ReflectDialog, ReflectDetail },
  data () {
    return {
      loading: false,         // 加载loading
      pageType: '',            // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      formData: {             // 表单数据
        accountType: '',      // 账户类型（1：银行卡、2：支付宝）
        searchText: '',        // 会员姓名/手机号
        queryDate: []
      },
      reflectData: {},        // 提现数据
      reflectVisible: false,  // 提现弹窗
      tableData: [],          // 列表数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {},            // 用户信息
      msgVisible: false,
      errorMsg: '',
      detailVisible: false
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.$route.path.match(/all/gi)) this.pageType = ''
    if (this.$route.path.match(/index/gi)) this.pageType = 1
    if (this.$route.path.match(/processed/gi)) this.pageType = 2
    if (this.$route.path.match(/back/gi)) this.pageType = 3
    if (this.$route.path.match(/exception/gi)) this.pageType = 4
    if (this.$route.path.match(/transfer/gi)) this.pageType = 5

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/vip/upgrade/audit/index', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/withdrawalManageController/getWithdrawalList'
        this.loading = true
      } else {
        url = 'withdrawalManageController/exportWithdrawalList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        dealWithStatus: this.pageType,
        condition: this.formData.searchText,
        accountType: this.formData.accountType,
        ...this.getQueryDate()
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
    getQueryDate () {
      let startTime = ''
      let endTime = ''
      if (this.formData.queryDate && this.formData.queryDate.length > 1) {
        startTime = this.$Utils.filterDate(this.formData.queryDate[0], 'YYYY-MM-DD 00:00:00')
        endTime = this.$Utils.filterDate(this.formData.queryDate[1], 'YYYY-MM-DD 23:59:59')
      }
      return {
        startTime: startTime,
        endTime: endTime
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
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
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

    showErrorMsg (msg) {
      this.errorMsg = msg
      this.msgVisible = true
      this.reflectVisible = false
      this.getListData()
    },
    /**
     * 提现前操作
     */
    handleReflectBefore (row) {
      this.reflectVisible = true
      this.reflectData = row || {}
    },

    handleDetailBefore (row) {
      this.detailVisible = true
      this.reflectData = row || {}
    },
    /**
     * 成功操作
     */
    handleSuccess () {
      this.reflectVisible = false
      this.detailVisible = false
      this.getListData()
    },

    /**
     * 查看详情
     */
    handleViewDetails (row) {
      if (!row) return false
      localStorage.setItem('mallAdminRechargeDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/reflect/details', query: {'customerId': row.customerId}})
      }, 30)
    }
  }
}
</script>

<style lang='less'>
.finance-index-wrap{
  .search-head-wrap{
    /*.w150{
      width: 150px !important;
    }
    .el-input__inner{
      width: 250px;
    }*/
  }

  /* -------------------- { msg } -------------------- */

}
</style>

