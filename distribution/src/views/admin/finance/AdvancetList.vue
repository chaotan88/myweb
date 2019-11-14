<!-- 预付充值 -->
<template>
  <common-tpl class="finance-index-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号" v-model.trim="formData.queryParm" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" class="search-form" label-width="160px">
            <el-form-item label="会员姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机：" prop="phone">
              <el-input v-model.trim="formData.phone" placeholder="会员手机" clearable></el-input>
            </el-form-item>
            <el-form-item label="充值时间：" class="pos-r apply-date-wrap">
              <el-col :span="6">
                <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.rechargeTimeStart" style="width: 100%;" clearable></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="6">
                <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.rechargeTimeEnd" style="width: 100%;" clearable></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item label="充值方式：" v-if="pageType === ''">
              <el-select v-model.trim="formData.payType" placeholder="选择充值方式" clearable>
                <el-option label="支付宝充值" :value="2"></el-option>
                <el-option label="微信充值" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="第三方支付单号：" prop="transactionId">
              <el-input v-model.trim="formData.transactionId" placeholder="请输入第三方充值单号" clearable></el-input>
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
        <el-table-column prop="phone" label="会员姓名">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="disRuleName" label="会员手机号">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="dealWithStatus" label="当前等级">
          <template slot-scope="scope">{{scope.row.ruleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalAmount" label="充值金额">
          <template slot-scope="scope">{{scope.row.amount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="withdrawalFees" label="赠送消费积分（个）">
          <template slot-scope="scope">{{scope.row.bonusPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="cashPoints" label="充值时间" min-width="120">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <!-- <div @click="$router.push({path: '/admin/finance/advancet/details'})">详情</div> -->
                  <div @click="handleReflectBefore(scope.row)"><i class="icon el-icon-view"></i>详情</div>
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

  </common-tpl>
</template>

<script>
import ReflectDialog from './ReflectDialog'

export default{
  components: {ReflectDialog},
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

    // 第三方充值单号
    let validateOdd = (rule, value, callback) => {
      if (value && value.length > 30) return callback(new Error('30个字符以内'))
      callback()
    }
    return {
      loading: false,            // 加载loading
      pageType: '',              // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      formData: {                // 表单数据
        queryParm: '',           // 会员姓名/手机号
        cardName: '',            // 会员姓名
        phone: '',               // 会员手机
        rechargeTimeStart: '',   // 充值开始时间
        rechargeTimeEnd: '',     // 充值结束时间
        payType: '',             // 充值方式
        transactionId: ''        // 第三方充值单号
      },
      highSearchClose: true,     // 高级搜索开/关
      tableData: [],             // 列表数据
      pageData: {                // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {},            // 用户信息
      rules: {
        // 查询条件
        condition: { validator: validatePhone, trigger: 'blur' },
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        phone: { validator: validatePhone, trigger: 'blur' },
        // 第三方充值单号
        transactionId: { validator: validateOdd, trigger: 'blur' }
      }
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
    this.$Utils.filterSearchData('/admin/finance/reflect', (res) => {
      if (getPagetype && parseInt(getPagetype) === this.pageType || getPagetype === this.pageType) this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.copyFormData = this.$Utils.deepCopy(this.formData)
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
        url = '@ROOT_API/recharge/getRechargeList'
        this.loading = true
      } else {
        url = 'recharge/exportRechargeList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        queryParm: this.formData.queryParm,
        phone: this.formData.phone,
        cardName: this.formData.cardName,
        transactionId: this.formData.transactionId,
        payType: this.formData.payType,
        rechargeTimeStart: this.$Utils.filterDate(this.formData.rechargeTimeStart),
        rechargeTimeEnd: this.$Utils.completionEndDate(this.formData.rechargeTimeEnd),
        dealWithStatus: this.pageType
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
          let keys = ['start', 'pageSize', 'dealWithStatus']
          if (keys.indexOf(key) === -1) filterParams.push(key + '=' + data[key])
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
      this.getListData()
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
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    },

    /**
     * 点击详情前操作
     */
    handleReflectBefore (row) {
      localStorage.setItem(this.$global.SYSTEM + 'AdvancetDetails', JSON.stringify(row))
      this.$router.push('/admin/finance/advancet/advancetlist/details')
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

  .el-col-2{
    width: 6.3333%;
  }

  /* -------------------- { msg } -------------------- */

}
</style>

