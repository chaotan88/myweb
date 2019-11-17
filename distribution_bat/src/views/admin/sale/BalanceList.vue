<!-- 结算管理列表 -->
<template>
  <common-tpl class="balance-list-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号/身份证号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle">
          </el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :rules="rules" :model="formData" label-position="right" class="search-form" label-width="160px">
            <el-form-item label="会员姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机：" prop="customerPhone">
              <el-input v-model.trim="formData.customerPhone" placeholder="会员手机" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model.trim="formData.idCard" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员身份：">
              <el-select v-model="formData.disRuleId" placeholder="选择会员身份" clearable>
                <el-option
                  v-for="item in payTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="customerPhone" label="会员手机" min-width="120">
          <template slot-scope="scope">{{scope.row.customerPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="disRuleName" label="会员身份" min-width="100">
          <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180">
          <template slot-scope="scope">{{scope.row.registerTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="balance" label="账户余额结余（元）" min-width="160">
          <template slot-scope="scope">{{scope.row.balance | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="bonusPoints" label="消费积分结余（个）" min-width="160">
          <template slot-scope="scope">{{scope.row.bonusPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="cashPoints" label="通用积分结余（个）" min-width="160">
          <template slot-scope="scope">{{scope.row.cashPoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="servicePoints" label="服务积分结余（个）" min-width="160">
          <template slot-scope="scope">{{scope.row.servicePoints | filterMoney}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleManage(scope.row)"><i class="icon el-icon-setting"></i>管理</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleLink(scope.row)"><i class="icon el-icon-view"></i>结算记录</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <!-- 暂无数据 -->
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
      <!-- 付款审核 -->
      <!-- <el-dialog title="付款审核" :visible.sync="rejectVisible" width="600px">
        <div class="pay-check ta-l">
          <el-form :model="checkForm" height="130" class="check-form">
            <el-form-item label="应付金额：">50,000元</el-form-item>
            <el-form-item label="付款方式：">线下支付</el-form-item>
            <el-form-item label="支付状态：">付款审核中</el-form-item>
            <el-form-item label="付款凭证："></el-form-item>
            <el-form-item>
              <el-radio-group v-model="checkForm.checkResult" class="fl-l">
                <el-radio :label="1">支付成功</el-radio>
                <el-radio :label="2">支付失败</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="checkForm.checkResult === 2">
              <el-input type="textarea" :rows="3" placeholder="填写失败原因" v-model="checkForm.failDiscription"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectVisible = false">取 消</el-button>
          <el-button type="primary" @click="rejectVisible = false">确 定</el-button>
        </span>
      </el-dialog> -->
    </template>
  </common-tpl>
</template>

<script>
export default {
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

    // 身份证号
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }

    // 验证代理费
    let validateAgentFee = (rule, value, callback) => {
      if (!value) return callback()
      let reg = /^(0|[1-9]\d*)\.\d{2}$/gi
      if (value.toString().length > 11 || !value.toString().match(reg)) callback(new Error('请输入正确的代理费用，限10个字符'))
      callback()
    }

    // 验证代理费
    let validateNumber = (rule, value, callback) => {
      if (!value) return callback()
      let reg = /^[0-9]*$/gi
      if (value.toString().length > 10 || !value.toString().match(reg)) callback(new Error('请输入正确的消费积分，限10位正整数'))
      callback()
    }
    return {
      loading: false,            // 加载loading
      highSearchClose: true,     // 高级搜索开/关
      // 列表数据
      tableData: [],
      formData: {
        condition: null,         // 查询条件
        cardName: '',            // 会员姓名
        customerPhone: null,     // 会员手机
        idCard: '',              // 身份证号
        registerTimeStart: '',
        registerTimeEnd: '',
        balanceStart: null,
        balanceEnd: null,
        bonusPointsStart: null,
        bonusPointsEnd: null,
        cashPointsStart: null,
        cashPointsEnd: null,
        disRuleId: null          // 会员身份
      },
      payTypes: [],
      checkForm: {
        checkResult: 1,
        failDiscription: ''
      },
      copyFormData: '',
      rejectVisible: false,       // 弹框
      rejectId: '',               // 不通过id
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 查询条件
        condition: { validator: validatePhone, trigger: 'blur' },
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 会员手机
        customerPhone: { validator: validatePhone, trigger: 'blur' },
        // 身份证号
        idCard: { validator: validateIdCard, trigger: 'blur' },
        // 会员身份

        // 账户余额结余(低)
        balanceStart: { validator: validateAgentFee, trigger: 'blur' },

        // 账户余额结余(高)
        balanceEnd: { validator: validateAgentFee, trigger: 'blur' },

        // 消费积分（低）
        bonusPointsStart: { validator: validateNumber, trigger: 'blur' },

        // 消费积分（高）
        bonusPointsEnd: { validator: validateNumber, trigger: 'blur' },

        // 通用积分（低）
        cashPointsStart: { validator: validateNumber, trigger: 'blur' },

        // 通用积分（高）
        cashPointsEnd: { validator: validateNumber, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/sale/balance', (res) => {
      this.formData = res
    })
    this.$Utils.filterSearchData('/admin/sale/balance/list/manage', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
    this.getPartnerList()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$router.push({query: {page: this.pageData.currentPage}})
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$http.post('@ROOT_API/settleManageController/getSettleManageList', Object.assign(this.formData, {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        condition: this.formData.condition,
        cardName: this.formData.cardName,           // 否 Sting 会员姓名
        customerPhone: this.formData.customerPhone, // 否 string 会员手机
        idCard: this.formData.idCard,               // 否 Sting 身份证号
        disRuleId: this.formData.disRuleId,         // 否 string 会员身份
        registerTimeStart: this.formData.registerTimeStart ? this.$Utils.filterDate(this.formData.registerTimeStart, 'YYYY-MM-DD') : '',
        registerTimeEnd: this.formData.registerTimeEnd ? this.$Utils.filterDate(this.formData.registerTimeEnd, 'YYYY-MM-DD') : ''
      })).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        // success...
        // 分页数
        this.pageData.total = resData.data.total
        // 列表数据
        this.tableData = resData.data.list
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取会员数据
     */
    getPartnerList () {
      this.$http.post('@ROOT_API/settleManageController/getDisRuleList', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          if (resData.status !== '9998') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
          }
          this.tableData = []
          this.pageData.total = 0
          return false
        }
        // success...
        // 分页数
        resData.data.map(item => {
          this.payTypes.push({label: item.ruleName, value: item.id})
        })
      })
    },

    /**
     * 管理操作
     */
    handleManage (row) {
      localStorage.setItem('distributionBalanceManageData', JSON.stringify(row))
      this.$router.push('/admin/sale/balance/list/manage')
    },

    /**
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
    },

    /**
     * 事件blur
     */
    handelBlur (obj) {
      if (isNaN(obj.applyStart) || isNaN(obj.applyEnd)) return
      this.$Utils.blurAutoCompletion(obj, 'applyStart')
      this.$Utils.blurAutoCompletion(obj, 'applyEnd')
    },

    /**
     * 点击审核/详情存储本地列表
     */
    saveHandle (item) {
      localStorage.setItem('OPEN_STORE', JSON.stringify(item))
      item.shopStatus === '1' ? this.$router.push('/admin/mall/manage/check') : this.$router.push('/admin/mall/manage/details')
    },

    /**
     * 高级搜索时间类型选择
     */
    commandHandle (command) {
      this.formData.timeType = command
      this.formData.timeTypeMsg = parseInt(command) === 1 ? '新增时间' : '上下架时间'
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
     * 主营业务select
     */
    attributeSelect (val) {
      this.formData.attributeTypeId = parseInt(val.id)
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
     * 跳转链接
     */
    handleLink (row) {
      localStorage.setItem(this.$global.SYSTEM + 'SaleCustomerId', row.customerId)
      setTimeout(() => {
        this.$router.push('/admin/sale/balance/record')
      }, 10)
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
.balance-list-wrap{
  .search-form{

    .apply-fee{
      width: 320px;
      margin-right: 0;

      .el-input{
        width: 210px
      }
    }

    .apply-fee:last-child{
      width: 230px;
    }

    .apply-fee-label{
      width: 66px;
      margin-right: 0;
    }
  }
}
</style>
<style lang="less">
.balance-list-wrap{

  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }

  .apply-fee-label{
    .el-form-item__content{
      margin-left: 45px !important;
    }
  }

  .search-form{
    .label-el-form-item__label{
      width: 100px;
    }
    .apply-fee{
      .label-el-form-item__label{
        width: 160px;
      }
    }
  }

  .w50{
    width: 50%;
    .el-form-item{
      width: 100% !important;
    }

    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }
  }
}
</style>
