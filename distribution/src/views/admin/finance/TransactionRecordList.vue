<!-- 提现管理 -->
<template>
  <common-tpl class="finance-index-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r" style="width: 250px;">
            <el-input placeholder="输入推广大使手机号/姓名" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
        </div>
        <div slot="main" class="senior">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="140px" class="search-form">
            <el-form-item label="推广大使姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="推广大使手机号：" prop="customerPhone">
              <el-input v-model.trim="formData.customerPhone" placeholder="手机格式，限11个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model.trim="formData.idCard" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易内容：">
              <el-select v-model="formData.addSource" size="medium" placeholder="选择交易内容">
                <el-option label="全部" value=""></el-option>
                <el-option label="推荐奖" :value="101"></el-option>
                <el-option label="大使管理奖" :value="102"></el-option>
                <el-option label="区域管理奖" :value="103"></el-option>
                <el-option label="跨区管理奖" :value="105"></el-option>
                <el-option label="大使提货奖" :value="106"></el-option>
                <el-option label="运营提货奖" :value="107"></el-option>
                <el-option label="跨区提货奖" :value="109"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="orderNo" label="交易编号" min-width="200">
          <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="outOrderNo" label="订单编号" min-width="200">
          <template slot-scope="scope">{{scope.row.outOrderNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="推广大使手机" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="rankName" label="推广大使身份" min-width="120">
          <template slot-scope="scope">{{scope.row.rankName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="addTime" label="交易时间" min-width="100">
          <template slot-scope="scope">{{scope.row.addTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="propertyType" label="交易类型">
          <template slot-scope="scope">
            <!-- {{scope.row.propertyTypeVal | filterEmpty}} -->
            <!-- <span v-if="scope.row.propertyType === 1">消费积分</span> -->
            <span v-if="scope.row.propertyType === 2">余额</span>
            <span v-else-if="scope.row.propertyType === 3">现金</span>
            <!-- <span v-else-if="scope.row.propertyType === 4">服务积分</span> -->
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="addSource" label="交易内容" min-width="130">
          <template slot-scope="scope">
            {{scope.row.addSourceVal | filterEmpty}}
            <!-- <span v-if="scope.row.addSource === 1">购买商品</span>
            <span v-else-if="scope.row.addSource === 2">购买商品</span>
            <span v-else-if="scope.row.addSource === 3">推荐用户</span>
            <span v-else-if="scope.row.addSource === 4">支出积分</span>
            <span v-else-if="scope.row.addSource === 5">注册获取积分</span>
            <span v-else-if="scope.row.addSource === 6">每日登录获取积分</span>
            <span v-else-if="scope.row.addSource === 7">退回积分</span>
            <span v-else>--</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="propertyAmount" label="交易额（元）" min-width="150">
          <template slot-scope="scope">{{scope.row.propertyAmount | filterMoney}}</template>
        </el-table-column>
        <!-- <el-table-column prop="cashPoints" label="交易状态" min-width="160">
          <template slot-scope="scope">{{scope.row.cashPoints | filterEmpty}}</template>
        </el-table-column> -->
        <el-table-column prop="currentAmount" label="账户结余" min-width="160">
          <template slot-scope="scope">{{scope.row.currentAmount | filterMoney}}</template>
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
      <transaction-dialog :visible="showDetailVisible" :initData="detailData" @close="showDetailVisible = false" @success="handleSuccess"></transaction-dialog>
    </template>
  </common-tpl>
</template>

<script>
import TransactionDialog from './TransactionDialog'

export default{
  components: {TransactionDialog},
  data () {
     // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback()
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }
    return {
      loading: false,         // 加载loading
      pageType: '',            // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      formData: {             // 表单数据
        customerPhone: '',
        cardName: '',
        idCard: '',
        addSource: '',
        searchText: ''
      },
      detailData: {},        // 提现数据
      showDetailVisible: false,  // 提现弹窗
      tableData: [],          // 列表数据
      pageData: {             // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {},            // 用户信息
      rules: {
        cardName: { max: 20, trigger: 'blur', message: '限20个字符以内' },
        customerPhone: { validator: validatePhone, trigger: 'blur' },
        idCard: { validator: validateIdCard, trigger: 'blur' }
      },
      highSearchClose: true
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
        url = '@ROOT_API/salesLogManageController/getSalesLogList'
        this.loading = true
      } else {
        url = 'salesLogManageController/exportSalesLogList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        dealWithStatus: this.pageType,
        condition: this.formData.searchText,
        customerPhone: this.formData.customerPhone,
        cardName: this.formData.cardName,
        idCard: this.formData.idCard,
        addSource: this.formData.addSource,
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
      this.showDetailVisible = true
      this.detailData = row || {}
    },

    /**
     * 成功操作
     */
    handleSuccess () {
      this.showDetailVisible = false
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

