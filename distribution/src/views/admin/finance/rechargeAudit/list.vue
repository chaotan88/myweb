<!-- 线下支付审核 -->
<template>
  <common-tpl class="offline-recharge-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会员姓名/手机号/ID号" v-model.trim="formData.queryParm" @keyup.enter.native="searchHandle" style="width: 220px;"></el-input>
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
              <el-col :span="10">
                <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.rechargeTimeStart" style="width: 100%;" clearable></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="10">
                <el-date-picker type="date" placeholder="年/月/日" v-model.trim="formData.rechargeTimeEnd" style="width: 100%;" clearable></el-date-picker>
              </el-col>
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
        <el-table-column prop="cardName" label="会员姓名">
          <template slot-scope="scope">{{scope.row.cardName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="phone" label="会员手机号">
          <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="invitationCode" label="会员ID号">
          <template slot-scope="scope">{{scope.row.invitationCode | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="amount" label="充值金额">
          <template slot-scope="scope">{{scope.row.amount | filterMoney}}</template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="状态">
          <template slot-scope="scope">{{scope.row.auditStatus | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="orderTime" label="充值时间" min-width="120">
          <template slot-scope="scope">{{scope.row.orderTime | filterDate}}</template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="scope.row.auditStatus === '待审核'">
                  <div @click="handleAuditBefore(scope.row)"><i class="icon el-icon-edit"></i>审核</div>
                </el-dropdown-item>
                <el-dropdown-item>
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

    <template slot="other">
      <el-dialog title="线下支付审核" :visible.sync="visible" width="50%" class="dialog-form">
        <el-form label-position="right" label-width="220px" class="ta-l" :model="auditFormData" ref="auditFormData">
          <el-form-item label="支付金额：" class="full-w" prop="amount">
            <span>{{auditFormData.amount | filterEmpty}}</span>
          </el-form-item>
          <el-form-item label="支付时间：" class="" prop="payTime">
            <span>{{auditFormData.payTime | filterDate | filterEmpty}}</span>
          </el-form-item>
       <!--   <el-form-item label="参考号：" class="" prop="rechargeBalance">
            <span>{{formData.a | filterEmpty}}</span>
          </el-form-item>
          <el-form-item label="银行卡号后四位：" class="" prop="rechargeBalance">
            <span>{{formData.a | filterEmpty}}</span>
          </el-form-item>-->
          <el-form-item label="付款凭证：" class="full-w" prop="paymentVoucher">
            <template v-if="auditFormData.paymentVoucher">
              <a :href="auditFormData.paymentVoucher | filterImgUrl" target="_blank" >
                <img class="preview-wrap" :src="auditFormData.paymentVoucher | filterImgUrl" style="width: 70px;height: 70px;">
              </a>
            </template>
            <template v-else>--</template>
          </el-form-item>
          <el-form-item label="审核结果：" class="" style="margin-bottom: 20px;" prop="auditStatus">
            <el-radio-group v-model="auditFormData.auditStatus">
              <el-radio label="2">通过</el-radio>
              <el-radio label="3">不通过</el-radio>
            </el-radio-group>
            <el-form-item label="" class="" prop="payAuditInfo" label-width="0" v-if="auditFormData.auditStatus === '3'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input type="textarea" :rows="4" maxLength="100" placeholder="填写不通过原因（100个字符以内）" v-model="auditFormData.payAuditInfo" class="d-b examine-msg" style="width: 80%"></el-input>
              <span style="color: #999; margin-left: 5px;">({{auditFormData.payAuditInfo.length}}/100)</span>
            </el-form-item>
          </el-form-item>
        </el-form>
        <div class="ta-c btns-wrap">
          <el-button @click="visible = false">取 消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" :loading="confirmLoading" @click="handleExamine('auditFormData')">确 定</el-button>
        </div>
      </el-dialog>
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

    // 第三方充值单号
    let validateOdd = (rule, value, callback) => {
      if (value && value.length > 30) return callback(new Error('30个字符以内'))
      callback()
    }
    return {
      confirmLoading: false,     // 加载loading
      loading: false,            // 加载loading
      visible: false,            // 加载loading
      pageType: '',              // 页面类型 [0、全部 1、待处理 2、已处理 3、回退]
      formData: {                // 表单数据
        queryParm: '',           // 会员姓名/手机号
        cardName: '',            // 会员姓名
        phone: '',               // 会员手机
        rechargeTimeStart: '',   // 充值开始时间
        rechargeTimeEnd: '',     // 充值结束时间
        payType: '3',             // 充值方式
        payStatus: null,             // 支付方式
        auditStatus: ''           // 审核状态（1：待审核，2：审核通过，3：审核不通过）
       // transactionId: '',        // 第三方充值单号
      },
      highSearchClose: true,     // 高级搜索开/关
      tableData: [],             // 列表数据
      pageData: {                // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userInfo: {},            // 用户信息
      auditFormData: {},       // 审核信息
      keyData: '',             //  --
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
    if (this.$route.path.match(/pass/gi)) this.pageType = 2
    if (this.$route.path.match(/reject/gi)) this.pageType = 3

    this.formData.auditStatus = this.pageType + ''

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/rechargeAudit', (res) => {
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
        auditStatus: this.formData.auditStatus,
        // transactionId: this.formData.transactionId,
        payType: this.formData.payType,
        payStatus: this.formData.payStatus,
        rechargeTimeStart: this.$Utils.filterDate(this.formData.rechargeTimeStart),
        rechargeTimeEnd: this.$Utils.completionEndDate(this.formData.rechargeTimeEnd)
        // dealWithStatus: this.pageType
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
      localStorage.setItem(this.$global.SYSTEM + 'rechargeDetails', JSON.stringify(row))
      this.$router.push('/admin/finance/rechargeAudit/details')
    },
    /**
     * 点击审核前操作
     */
    handleAuditBefore (row) {
      this.visible = true
      this.auditFormData.paymentVoucher = row.paymentVoucher
      this.auditFormData.amount = row.amount
      this.auditFormData.id = row.id
      this.auditFormData.payTime = row.payTime
      this.$set(this.auditFormData, 'auditStatus', '2')
      this.$set(this.auditFormData, 'payAuditInfo', '')
    },
    /**
     * 审核操作
     */
    handleExamine (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.keyData = new Date().getTime()
          this.confirmLoading = true
          this.$http.post('@ROOT_API/recharge/auditRecharge', {
            id: this.auditFormData.id,                      // 是 int 申请ID
            auditStatus: this.auditFormData.auditStatus,    // 审核通过：2 不通过：3
            payAuditInfo: this.auditFormData.payAuditInfo   // 否 Sting 审核不通过原因
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
            this.$message({
              message: resData.msg,
              type: 'success',
              duration: 1000
            })
            this.visible = false
            this.getListData()
          }).finally(() => {
            setTimeout(() => {
              this.confirmLoading = false
            }, 1000)
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.offline-recharge-wrap{
  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }
  .el-col-2{
    width: 6.3333%;
  }
  .mb-20{
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
  .offline-recharge-wrap{
    .el-dialog{
      .el-form-item{
        margin-bottom: 0;
      }
    }
  }
</style>

