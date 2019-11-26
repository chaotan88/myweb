<!-- 付款审核 -->
<template>
  <common-tpl class="sale-payment-list-wrap">
     <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入手机号码" v-model.trim=formData.condition @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="orderNo" label="订单编号" min-width="220">
          <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="setMealName" label="套餐名称" min-width="150">
          <template slot-scope="scope">{{scope.row.setMealName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="setMealNumber" label="套餐编号" width="220">
          <template slot-scope="scope">{{scope.row.setMealNumber | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">{{scope.row.orderStatus | filterOrderStatus}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="买家手机号" width="150">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="customerName" label="收货人姓名" width="150">
          <template slot-scope="scope">{{scope.row.customerName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态">
          <template slot-scope="scope">{{scope.row.payStatus | filterPayStatus(scope.row.payType)}}</template>
        </el-table-column>
        <el-table-column prop="orderAmount" label="实收款">
          <template slot-scope="scope">{{scope.row.orderAmount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间" width="220">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><!-- v-if="parseInt(scope.row.orderStatus) === 2"-->
                  <div @click="$router.push({path: '/admin/order/payment/details', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>发货</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/order/payment/details', query: {id: scope.row.id}})"><i class="icon el-icon-view"></i>详情</div>
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
import PaymentExamine from './PaymentExamine'
export default {
  components: {PaymentExamine},
  data () {
    // 验证会员姓名
    let validateCardName = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    // 验证手机
    let validatePhone = (rule, value, callback) => {
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }

    // 身份证号
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }

    // 代理费
    let validateAgent = (rule, value, callback) => {
      let reg = /^[0-9]{1,8}([.][0-9]{1,2})?$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入10个字符的代理费，限2位小数'))
      callback()
    }
    return {
      loading: false,           // loading
      highSearchClose: true,    // 高级搜索开/关
      pageType: null,           // 页面类型［null/全部，1／付款审核中，2／已审核］
      // 列表数据
      tableData: [],
      formData: {
        condition: '',
        customerPhone: '',      // 输入交易编号/手机号
        applyNo: '',            // 申请编号
        agencyFeeStart: '',     // 应付金额开始值
        agencyFeeEnd: '',       // 应付金额结束值
        cardName: '',           // 会员姓名
        phone: '',              // 会员手机
        idCard: '',             // 身份证号
        applyTimeStart: '',     // 申请开始时间
        applyTimeEnd: '',       // 申请结束时间
        payStatus: ''           // 支付状态
      },
      payTypes: [              // 付款方式
        {label: '微信支付', value: 1},
        {label: '支付宝支付', value: 2},
        {label: '线下支付', value: 3},
        {label: '余额支付', value: 4}
      ],
      payStatuss: [              // 支付状态
        {label: '支付成功', value: 1},
        {label: '付款审核中', value: 2},
        {label: '支付失败', value: 3}
      ],
      copyFormData: '',
      pageData: {                  // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        phone: { validator: validatePhone, trigger: 'blur' },
        // 身份证号
        idCard: { validator: validateIdCard, trigger: 'blur' },
        // 会员身份
        applyStart: { validator: validateAgent, trigger: 'blur' },

        // 代理费开始值
        agencyFeeStart: { validator: validateAgent, trigger: 'blur' },

        // 代理费结束值
        agencyFeeEnd: { validator: validateAgent, trigger: 'blur' }
      },
      userInfo: {}              // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    let pathType = this.$route.path.match(/all|examine|pass|reject/gi)[0]
    switch (pathType) {
      case 'all':
        this.pageType = ''
        break
      case 'examine':
        this.pageType = 1
        break
      case 'pass':
        this.pageType = 2
        break
      case 'reject':
        this.pageType = 3
        break
      case 'finished':
        this.pageType = 5
        break
    }
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/sale/payment/', (res) => {
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
      this.tableData = [{}]
      let url = ''
      if (!type) {
        url = '@ROOT_API/meal/getSetMealOrderList'
        this.loading = true
      } else {
        url = 'meal/exportSetMealOrderList'
      }
      let data = {
        start: type ? 1 : this.pageData.currentPage,
        pageSize: type ? this.pageData.total : this.pageData.pageSize,
        condition: this.formData.condition,
        phone: this.formData.phone,
        orderStatus: this.pageType || this.formData.payStatus
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
          let results = resData.data
          this.pageData.total = results.total
          // results.list.forEach((row) => {
          //   row.paymentVoucher = row.paymentVoucher ? row.paymentVoucher.split(',') : row.paymentVoucher ? [row.paymentVoucher] : []
          // })
          this.tableData = results.list
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
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
    },

    /**
     * 点击审核/详情存储本地列表
     */
    saveHandle (item) {
      localStorage.setItem('OPEN_STORE', JSON.stringify(item))
      item.shopStatus === '1' ? this.$router.push('/admin/mall/manage/check') : this.$router.push('/admin/mall/manage/details')
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
     * 清空重置搜索
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    }
  }
}
</script>

<style lang="less" scoped>
.sale-payment-list-wrap{

  .admin-gray-title{
    margin-bottom: 0;
  }

  .search-form{

    .apply-fee, .apply-time{
      .el-input{
        width: 100%;
      }
    }
  }
}
</style>

<style lang="less">
.sale-payment-list-wrap{
  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }

  .apply-date-wrap{
    .el-col-5{
      width: 130px;
    }

    .el-col-2{
      width: 41px;
    }

    .el-input--prefix{
      .el-input__inner{
        padding-right: 15px;
      }
    }
  }

  .apply-fee-label{
    .el-form-item__content{
      margin-left: 27px !important;
    }
  }
}
</style>

