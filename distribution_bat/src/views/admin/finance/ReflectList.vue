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
              <el-option label="提现到支付宝账户" value="2"></el-option>
              <el-option label="提现到银行卡" value="1"></el-option>
            </el-select>
          </div>
          &nbsp;
          <div class="d-ib pos-r" style="width: 250px;">
            <el-input placeholder="输入会员姓名/手机号/身份证号" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <!-- <div class="pos-r" slot="search">
          <div class="d-ib" style="width: 120px;">
            <el-select class="full-w" v-model="formData.topNum">
              <el-option label="Top10" value="ten"></el-option>
              <el-option label="Top50" value="fifty"></el-option>
              <el-option label="Top100" value="hundred"></el-option>
              <el-option label="Top200" value="twoHundred"></el-option>
              <el-option label="所有" value="all"></el-option>
            </el-select>
          </div>
           <div class="d-ib pos-r">
          </div>
        </div> -->
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="cardName" label="会员姓名" min-width="100">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="会员手机" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="会员ID">
          <template slot-scope="scope">{{scope.row.invitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="disRuleName" label="会员身份" min-width="100">
          <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="dealWithStatus" label="状态">
          <template slot-scope="scope">{{scope.row.dealWithStatus | filterdealwithStatus}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalAmount" label="提现金额（元）" min-width="130">
          <template slot-scope="scope">{{scope.row.withdrawalAmount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalFees" label="提现手续费（元）" min-width="150">
          <template slot-scope="scope">{{scope.row.withdrawalFees | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="cashPoints" label="通用积分结余（个）" min-width="160">
          <template slot-scope="scope">{{scope.row.cashPoints | filterEmpty}}</template>
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
                  <div @click="handleReflectBefore(scope.row)"><i class="icon" :class="{'el-icon-edit': scope.row.dealWithStatus === 1, 'el-icon-view': scope.row.dealWithStatus === 2 || scope.row.dealWithStatus === 3}"></i>{{scope.row.dealWithStatus === 1 ? '打款' : '详情'}}</div>
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

      <reflect-dialog :visible="reflectVisible" :initData="reflectData" @close="reflectVisible = false" @success="handleSuccess"></reflect-dialog>

    </template>
  </common-tpl>
</template>

<script>
import ReflectDialog from './ReflectDialog'

export default{
  components: {ReflectDialog},
  data () {
    return {
      loading: false,         // 加载loading
      pageType: '',            // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      formData: {             // 表单数据
        accountType: '',      // 账户类型（1：银行卡、2：支付宝）
        searchText: ''        // 会员姓名/手机号
      },
      reflectData: {},        // 提现数据
      reflectVisible: false,  // 提现弹窗
      tableData: [],          // 列表数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {}            // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    if (this.$route.path.match(/all/gi)) this.pageType = ''
    if (this.$route.path.match(/index/gi)) this.pageType = 1
    if (this.$route.path.match(/processed/gi)) this.pageType = 2
    if (this.$route.path.match(/back/gi)) this.pageType = 3

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
        accountType: this.formData.accountType
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

    /**
     * 提现前操作
     */
    handleReflectBefore (row) {
      this.reflectVisible = true
      this.reflectData = row || {}
    },

    /**
     * 成功操作
     */
    handleSuccess () {
      this.reflectVisible = false
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

