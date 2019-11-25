<!-- 财务对账 -->
<template>
  <common-tpl class="finance-recon-list-wrap" :footer="false">
    <!-- 主体 -->
    <template slot="main">

      <!-- 时间 -->
      <el-form ref="form" :rules="rules" :model="formData.data" label-position="right" class="search-form" label-width="110px">
        <!-- <div class="d-ib pos-a" style="width: 150px;">
          <el-select v-model="formData.curYear" size="medium" class="year-box" placeholder="选择年份" @change="selectYear" clearable>
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in yearArr"></el-option>
          </el-select>
        </div> -->
        <div class="date-tabs">
          <span v-for="(dt, index) in dateTabs" :key="index" @click="dateTypeChange(dt)" :class="selectDateType === dt.value ? 'dt-active' : ''">{{dt.label}}</span>
        </div>
        <el-form-item label="统计时间段：" class="pos-r apply-date-wrap">
          <el-date-picker v-model.trim="formData.statisticsDate"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable @change="handleFilterDate"></el-date-picker>
        </el-form-item>
      </el-form>

      <!-- 统计 -->
      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.grabTotalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">收入金额</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>套餐订购 &nbsp;{{statisticsData.grabWxPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>

        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.purchaseTotalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">应付金额</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>套餐成本 &nbsp;{{statisticsData.purchaseAliPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: red; margin-left: 15px;"></i>
              <span>佣金分配 &nbsp;{{statisticsData.purchaseCashPointPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.withDrawalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">支出金额</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>提现已付金额 &nbsp;{{statisticsData.purchaseAliPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>

        <template v-if="formData.accountType === 'bonus' || formData.accountType === 'cash'">
          <dl class="ta-c fl-l cursor-p">
            <dt class="d-ib va-m">
              <svg class="icon icon-yueshengyuzonge" aria-hidden="true">
                <use xlink:href="#icon-yueshengyuzonge"></use>
              </svg>
            </dt>
            <dd class="d-ib va-m ta-c">
              <h3 class="fw-n">
                <template v-if="formData.accountType === 'bonus'">
                  <span>{{statisticsData.sumBonusPoints | filterEmpty}}</span>
                </template>
                <template v-if="formData.accountType === 'cash'">
                  <span>{{statisticsData.sumCashPoints | filterEmpty}}</span>
                </template>
              </h3>
              <template v-if="formData.accountType === 'bonus'">
                <h4 class="fw-n">消费积分剩余总数</h4>
              </template>
              <template v-if="formData.accountType === 'cash'">
                <h4 class="fw-n">通用积分剩余总数</h4>
              </template>
            </dd>
          </dl>
        </template>
      </div>

      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div style="margin-bottom: 20px" class="switch-wrap" slot="search">
          <el-radio-group v-model="pageType" @change="pageTypeHandle">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="1">套餐订购</el-radio-button>
            <el-radio-button label="2">套餐成本</el-radio-button>
            <el-radio-button label="3">佣金分配</el-radio-button>
            <el-radio-button label="4">提现已付金额</el-radio-button>
          </el-radio-group>
        </div>
      </high-search>
      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
        <template>
          <el-table-column prop="" label="交易编号">
            <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="推广大使手机">
            <template slot-scope="scope">{{scope.row.grabPrice | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="推广大使身份" width="160">
            <template slot-scope="scope">{{scope.row.configGrabNum | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易时间">
            <template slot-scope="scope">{{scope.row.grabNum | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易类型">
            <template slot-scope="scope">{{scope.row.grabAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易内容">
            <template slot-scope="scope">{{scope.row.grabAliPayAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易额">
            <template slot-scope="scope">{{scope.row.grabWxPayAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易状态">
            <template slot-scope="scope">{{scope.row.grabCashPointPayAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易科目">
            <template slot-scope="scope">{{scope.row.grabCashPointPayAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="" label="交易属性">
            <template slot-scope="scope">{{scope.row.grabCashPointPayAmount | filterEmpty}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="showDetail(scope.row)"><i class="icon el-icon-view"></i>详情</div>
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

    <template slot="other">
      <financeRecon-dialog :visible="financeReconVisible" :initData="detailData" @close="financeReconVisible = false" @success="handleSuccess"></financeRecon-dialog>
    </template>
  </common-tpl>
</template>

<script>
import FinanceReconDialog from './FinanceReconDialog'
export default {
  data () {
     // 验证手机
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback()
      if ((value && value.match(/\D/g)) || (value.length >= 11 && !value.toString().match(/^1\d{10}$/gi))) return callback(new Error('手机号格式错误'))
      callback()
    }
    return {
      loading: false,          // loading
      // yearArr: [              // 选择年
      //   {
      //     label: '近三个月',
      //     value: 3
      //   },
      //   {
      //     label: '近半年',
      //     value: 6
      //   },
      //   {
      //     label: '近一年',
      //     value: 12
      //   }
      // ],
      tableData: [{
        transferName: 111
      }],
      pageType: '',             // 1,抢购 2,批发
      date: '',                // 时间
      formData: {
        customerPhone: '',     // 否 string  客户号码
        statisticsDate: [],    // 日期
        payType: ''            // 否 int 支付方式（1：微信，2：支付宝，5：通用积分）
      },
      statisticsData: {},     // 统计数据
      rules: {
        // 查询条件
        // customerPhone: { validator: validatePhone, trigger: 'blur' },
        // 会员手机
        customerPhone: { validator: validatePhone, trigger: 'blur' }
      },
      pageData: {             // 分页
        currentPage: 3,
        pageSize: 10,
        total: 20
      },
      dateTabs: [
        { label: '今天', value: 0 },
        { label: '昨天', value: 1 },
        { label: '近一周', value: 7 },
        { label: '近15天', value: 15 },
        { label: '自定义', value: 999 }
      ],
      selectDateType: 0,
      financeReconVisible: false,
      detailData: {}
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.pageType = parseInt(this.$route.query.type) || 1

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/report/sale/list', (res) => {
      this.formData = res
    })
    this.formData.statisticsDate = (this.formData.statisticsDate || this.$Utils.filterDate(new Date(), 'YYYY-MM-DD')) + ' 00:00:00'
    this.getTableData()
    this.getStatisticsData()
  },

  methods: {
    getTableData () {
      this.$http.post('@ROOT_API/buyBusinessAccount/getBusinessAccountList', {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        businessType: this.pageType
      }).then((res) => {
        debugger
      })
    },
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/buyBusinessAccount/getBusinessAccountStatistics', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.statisticsData = resData.data
      })
    },

    /**
     * 获取抢购列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buySellStaticReoprtController/getGoodsGrabStatic'
        this.loading = true
      } else {
        url = 'buySellStaticReoprtController/exportGoodsGrabStatic'
      }
      let data = {
        ...this.handleDateArgs()
      }
      if (!type) {
        this.tableData = []
        this.$http.post(url, data).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          let data = resData.data
          this.tableData = data
          this.pageData.total = data.total
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
     * 获取批发列表数据
     */
    getWholesaleListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buySellStaticReoprtController/getGoodsPurchaseStatic'
        this.loading = true
      } else {
        url = 'buySellStaticReoprtController/exportGoodsPurchaseStatic'
      }
      let data = {
        customerPhone: '',   // 否 string  客户号码
        ...this.handleDateArgs()
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
            return false
          }
          let data = resData.data
          this.tableData = data
          this.pageData.total = data.total
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
     * 时间改变
     */
    selectYear (value) {
      if (!value) return false
      var dt = new Date()
      switch (value) {
        // case 0:
          // dt.setDate(dt.getDate())
          // break
        case 1:
          dt.setDate(dt.getDate() - 1)
          break
        case 2:
          dt.setDate(dt.getDate() - 2)
          break
      }
      this.formData.statisticsDate = dt
    },

    /**
     * 时间方法
     */
    handleDateArgs () {
      let res = {
        beginDate: '',
        endDate: ''
      }
      if (this.formData.statisticsDate) {
        res.beginDate = this.$Utils.filterDate(this.formData.statisticsDate, 'YYYY-MM-DD HH:mm:ss')
        res.endDate = this.$Utils.completionEndDate(res.beginDate, 'YYYY-MM-DD HH:mm:ss')
      }
      return res
    },

    /**
     * 过滤选择时间
     */
    handleFilterDate (data) {
      this.formData.statisticsDate = this.$Utils.filterDate(data, 'YYYY-MM-DD')
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 页面类型转换
     */
    pageTypeHandle (val) {
      this.$router.replace({path: this.$route.path, query: {type: val}})
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
    dateTypeChange (item) {
      this.selectDateType = item.value
      var dt = new Date()
      switch (item.value) {
        case 0:
          dt.setDate(dt.getDate())
          break
        case 1:
          dt.setDate(dt.getDate() - 1)
          break
        case 7:
          dt.setDate(dt.getDate() - 7)
          break
        case 15:
          dt.setDate(dt.getDate() - 15)
          break
      }
      this.formData.statisticsDate = [dt, new Date()]
      console.log(this.formData.statisticsDate, 66666)
    },
    showDetail (row) {
      this.detailData = row
      this.financeReconVisible = true
    },
    handleSuccess () {}
  },
  components: { FinanceReconDialog }
}
</script>

<style lang="less" scoped>
.finance-recon-list-wrap{

  .search-form {
    display: flex;
    font-size: 13px;
    color: #333;
    span {
      display: inline-block;
      width: 63px;
      height: 50px;
      text-align: center;
      line-height: 50px;
      border: 1px solid rgba(193, 224, 255, 1);
      cursor: pointer;
    }
    span:nth-child(1) {
      border-right: 0;
    }
    span:nth-child(2) {
      border-right: 0;
    }
    span:nth-child(3) {
      border-right: 0;
    }
    span:nth-child(4) {
      border-right: 0;
    }
    .dt-active {
      background: rgba(193, 224, 255, 1);
    }
  }
  /*-------------统计----------*/
  .statistics-cen{
    display: flex;
    justify-content: space-between;

    dl{
      width: 33%;
      height: 140px;
      padding-top: 40px;
      margin-right: 20px;
      margin-bottom: 20px;
      background: #c2e0fe url(../../../assets/img/product-statistics-basic-bg.jpg);
      background-size: cover;
      border-radius: 5px;
      margin-right: 20px;
      box-sizing: border-box;

      dt, dd{
        height: 60px;
      }
      
      /*dt{
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
      }*/

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

        .small-box-wrap{
          line-height: 20px;

          .small-box{
            width: 20px;
            height: 20px;
            background: green;
          }

          span{
            font-size: 14px;
          }
        }
      }
    }

    dl:last-child{
      margin-right: 0;
    }
  }
  
}
</style>

<style lang="less">
.finance-recon-list-wrap{
 
 /*------------高级搜索------*/
  .search-wrap{
    .apply-date-wrap{
      left: 200px;
      .el-form-item__label, .el-form-item__content {
        line-height: 50px;
      }
    }
    .search-head-wrap{
      padding: 0 !important;
      padding-bottom: 20px !important;
    }

    /*----------抢购/批发切换页----------*/
    .switch-wrap{
      .settle-btn {
        width: 102px;
        height: 36px;
        border-radius: 18px;
        border: solid 1px #2eaaf7;
        font-size: 14px;
        color: #2eaaf7;
        z-index: 10;
      }

      .el-radio-group{
        border-radius: 0;

        .apply-fee-label{
          .el-form-item__content{
            margin-left: 27px !important;
          }

          .el-radio-button:first-child .el-radio-button__inner{
            border-left: none;
          }
        }

        .el-radio-button__orig-radio:checked+.el-radio-button__inner{
          color: #409EFF;
          background: none;
          border: none;
          border-top: 2px solid #409EFF;
          border-right: 1px solid #dcdfe6;
          border-radius: 0;
        }

        .el-radio-button__inner{
          box-shadow: none;
        }

        .is-active{
          border-left: none;
        }
      }
    }
  }
}
</style>
