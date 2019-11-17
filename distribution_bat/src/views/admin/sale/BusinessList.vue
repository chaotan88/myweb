<!-- 交易记录 -->
<template>
  <common-tpl class="business-list-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <el-form ref="form" :rules="rules" :model="formData" label-position="right" label-width="140px" class="search-form">
        <high-search @search="searchHandle('form')">
          <div class="pos-r" slot="search">
            <el-form-item prop="condition">
              <el-input placeholder="输入会员姓名/手机号/身份证号" v-model.trim="formData.condition" @keyup.enter.native="searchHandle('form')"></el-input>
              <i class="ta-c pos-a el-icon-search" @click="searchHandle('form')"></i>
            </el-form-item>
          </div>
          <div slot="edit">
            <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
          </div>
          <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
          <div slot="main">
            <el-form-item label="会员姓名：" prop="cardName">
              <el-input v-model.trim="formData.cardName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="会员手机号：" prop="phone">
              <el-input v-model.trim="formData.phone" placeholder="手机格式，限11个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard">
              <el-input v-model.trim="formData.idCard" placeholder="仅限输入数字和字母，20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易内容：">
              <el-select v-model="formData.addSource" placeholder="选择交易内容">
                <el-option label="购买商品" value="1"></el-option>
                <el-option label="推荐用户" value="3"></el-option>
                <el-option label="兑换商品" value="4"></el-option>
                <el-option label="注册获取积分" value="5"></el-option>
                <el-option label="登录" value="6"></el-option>
                <el-option label="退回积分" value="7"></el-option>
                <el-option label="充值升级" value="8"></el-option>
                <el-option label="支出余额" value="9"></el-option>
                <el-option label="分销派送" value="10"></el-option>
                <el-option label="提现" value="15"></el-option>
                <el-option label="商品消费" value="16"></el-option>
                <el-option label="升级" value="17"></el-option>
                <el-option label="扣款（对账调整（不计入业绩））" value="18"></el-option>
                <el-option label="预付充值" value="20"></el-option>
                <el-option label="兑换通证" value="21"></el-option>
                <el-option label="购票" value="22"></el-option>
                <el-option label="分享" value="23"></el-option>
                <el-option label="购票分佣" value="26"></el-option>
                <el-option label="管理奖" value="27"></el-option>
                <el-option label="店补" value="28"></el-option>
                <el-option label="签到" value="29"></el-option>
                <el-option label="浏览" value="30"></el-option>
                <el-option label="评价" value="32"></el-option>
                <el-option label="扣款（兑换通正（不计入业绩）" value="33"></el-option>
                <el-option label="扣款（对账调账（计入业绩）" value="34"></el-option>
                <el-option label="充值（商品消费（计入业绩）" value="35"></el-option>
                <el-option label="充值（对账调账（不计入业绩）" value="36"></el-option>
                <el-option label="充值（对账调账（计入业绩）" value="37"></el-option>
                <el-option label="充值（商城退款（不计入业绩）" value="38"></el-option>
                <el-option label="大转盘抽奖" value="39"></el-option>
                <el-option label="提现退回" value="41"></el-option>
                <el-option label="转赠" value="42"></el-option>
                <el-option label="好友赠送" value="43"></el-option>
                <el-option label="交易所兑换" value="44"></el-option>
              </el-select>
            </el-form-item>
            <div class="clear"></div>
          </div>
        </high-search>
      </el-form>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <!-- <el-table-column prop="tradeNo" label="交易编号"></el-table-column> -->
        <el-table-column prop="customerPhone" label="会员手机"></el-table-column>
        <el-table-column prop="addTime" label="交易时间" width="200">
          <template slot-scope="scope">{{scope.row.addTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="propertyType" label="交易类型">
          <template slot-scope="scope">{{scope.row.propertyType | filterIntegralType}}</template>
        </el-table-column>
        <el-table-column prop="addSource" label="交易内容">
          <template slot-scope="scope">{{scope.row.addSource | filterAddSource}}</template>
        </el-table-column>
        <el-table-column prop="propertyAmount" label="交易额">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.addSource !== 4 && scope.row.addSource !== 9 && scope.row.propertyAmount !== 0 && scope.row.propertyAmount && scope.row.propertyAmount[0] !== '-'">+</span> -->
            <span v-if="scope.row.propertyAmount && scope.row.propertyAmount.toString().slice(0, 1) !== '-'">+</span>
            {{scope.row.propertyAmount | filterMoney}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="tradeStatus" label="交易状态">
          <template slot-scope="scope">{{scope.row.tradeStatus}}</template>
        </el-table-column> -->
        <el-table-column prop="currentAmount" label="账户结余">
          <template slot-scope="scope">{{(scope.row.currentAmount + scope.row.propertyAmount) | filterMoney | numToFixed}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="detailsBefore(scope.row)"><i class="icon el-icon-view"></i>详情</div>
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
      <!-- 详情 -->
      <el-dialog title="交易记录" :visible.sync="detailsVisible" width="600px">
        <div class="trade-record ta-l">
         <!--  <dl>
            <dt>交易编号：</dt>
            <dd>21080923001</dd>
          </dl> -->
          <dl>
            <dt>会员手机：</dt>
            <dd>{{detailsInfo.customerPhone}}</dd>
          </dl>
          <dl>
            <dt>交易时间：</dt>
            <dd>{{detailsInfo.addTime | filterDate}}</dd>
          </dl>
          <dl>
            <dt>账户结余：</dt>
            <dd>{{detailsInfo.currentAmount}}</dd>
          </dl>
          <dl>
            <dt>交易类型：</dt>
            <dd>{{detailsInfo.propertyType | filterTrade}}</dd>
          </dl>
          <dl>
            <dt>收益值：</dt>
            <dd>{{detailsInfo.propertyAmount}}</dd>
          </dl>
          <dl>
            <dt>凭证：</dt>
            <dd>
              <img v-if="detailsInfo.paymentVoucher" :src="detailsInfo.paymentVoucher | filterImgUrl">
              <span v-else>{{detailsInfo.paymentVoucher | filterEmpty}}</span>
            </dd>
          </dl>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="detailsVisible = false">确 定</el-button>
        </span>
      </el-dialog>
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
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    // 验证账户结余
    let validateAgentFee = (rule, value, callback) => {
      if (!value) return callback()
      let reg = /^(0|[1-9]\d*)\.\d{2}$/gi
      if (value.toString().length > 11 || !value.toString().match(reg)) callback(new Error('请输入正确的账户结余，限10个字符'))
      callback()
    }
    // 身份证号
    let validateIdCard = (rule, value, callback) => {
      if (value && !value.toString().match(/^[0-9a-zA-Z]{0,20}$/g)) return callback(new Error('仅限输入数字和字母，20个字符以内'))
      callback()
    }
    return {
      loading: false,           // 加载loading
      highSearchClose: true,   // 高级搜索开/关
      pageType: null,          // 页面类型［null/全部，1／账户余额，2／通用积分,3／消费积分］
      tableData: [],           // 列表数据
      formData: {
        condition: '',         // 手机号
        cardName: '',          // 会员姓名
        idCard: '',            // 身份证号
        phone: '',             // 会员手机
        addSource: ''          // 交易内容
      },
      detailsVisible: false,   // 交易详情弹框
      detailsInfo: {},         // 交易记录详情
      checkForm: {
        checkResult: 1,
        failDiscription: ''
      },
      copyFormData: '',
      rejectId: '',            // 不通过id
      pageData: {              // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 会员姓名
        cardName: { validator: validateCardName, trigger: 'blur' },
        // 查询条件
        condition: { validator: validatePhone, trigger: 'blur' },
        // 身份证号
        idCard: { validator: validateIdCard, trigger: 'blur' },
        // 会员手机
        phone: { validator: validatePhone, trigger: 'blur' },
        // 账户结余（低）
        agentLowness: { validator: validateAgentFee, trigger: 'blur' },
        // 账户结余（高）
        agentHigh: { validator: validateAgentFee, trigger: 'blur' }
      },
      userInfo: {},             // 用户信息
      tableFieldName: [
        {
          title: '会员姓名',
          key: 'cardName'
        },
        {
          title: '会员手机号',
          key: 'customerPhone'
        },
        {
          title: '交易类型',
          key: 'propertyTypeVal'
        },
        {
          title: '交易内容',
          key: 'addSourceVal'
        },
        {
          title: '交易额',
          key: 'propertyAmount'
        },
        {
          title: '账户结余',
          key: 'currentAmount'
        },
        {
          title: '交易时间',
          key: 'addTimeStr'
        }
      ]
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    let pathType = this.$route.path.match(/all|balance|cash|consume/gi)[0]
    switch (pathType) {
      case 'all':
        this.pageType = ''    // 全部
        break
      case 'balance':
        this.pageType = 3    // 账户余额
        break
      case 'cash':
        this.pageType = 2    // 通用积分
        break
      case 'consume':
        this.pageType = 1   // 消费积分
        break
    }
    this.copyFormData = this.$Utils.deepCopy(this.formData)

    // 获取tab标签类型
    let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageType)
    localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageType)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/sale/business/', (res) => {
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
        start: type ? 1 : this.pageData.currentPage,      // 是 string  当前页
        pageSize: type ? this.pageData.total : this.pageData.pageSize,    // 是 string  每页条数
        cardName: this.formData.cardName,                 // 否 Sting 会员姓名
        idCard: this.formData.idCard,                     // 否 Sting 身份证号
        condition: this.formData.condition,               // 否 string  手机号
        propertyType: this.pageType,                      // 否 int 交易类型 （1：消费积分，2：通用积分，3：金额）
        customerPhone: this.formData.phone,               // 否 string 会员手机
        addSource: this.formData.addSource                // 否  int 交易内容
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
     * 事件blur
     */
    handelBlur (obj) {
      if (isNaN(obj.applyStart) || isNaN(obj.applyEnd)) return
      this.$Utils.blurAutoCompletion(obj, 'applyStart')
      this.$Utils.blurAutoCompletion(obj, 'applyEnd')
    },

    /**
     * 详情
     */
    detailsBefore (item) {
      this.detailsVisible = true
      this.detailsInfo = item
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
     * 自动补全百分位
     */
    inpBlur (type) {
      this.$Utils.blurAutoCompletion(this.formData, type)
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
    searchHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.pageChange(1)
      })
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
.business-list-wrap{

  .trade-record{
    border: 1px solid #eee;
    border-bottom: none;
    dl{
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-bottom: 1px solid #eee;

      dt{
        width: 100px;
        text-align: right;
        display: inline-block;
      }

      dd{
        margin-left: 10px;
        display: inline-block;

        img{
          width: 100px;
          height: 100px;
        }
      }
    }

  }

  .dialog-footer{
    .el-button{
      width: 120px;
      background: #2eaaf7;
    }
    .el-button:hover{
      background: #199ED8;
    }
  }
}

</style>

<style lang="less">
.business-list-wrap{
  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }

  .w50{
    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }
  }

  .el-dialog{
    .el-button--primary{
      background: #33719b !important;
    }
  }
}
</style>
