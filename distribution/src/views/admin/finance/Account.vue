<!-- 财务对账 -->
<template>
  <common-tpl class="account-recon-list-wrap" :footer="false">
    <!-- 主体 -->
    <template slot="main">

      <!-- 统计 -->
      <div class="statistics-cen">
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.cashPoints | filterAmountFixed('元')}}</span>
            </h3>
            <h4 class="fw-n">当前账户总余额</h4>
          </dd>
        </dl>

        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{(statisticsData.cashPointsTotal) | filterAmountFixed('元')}}</span>
            </h3>
            <h4 class="fw-n">累计账户总余额</h4>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.withdrawalAmountTotal | filterAmountFixed('元')}}</span>
            </h3>
            <h4 class="fw-n">已提现总金额</h4>
          </dd>
        </dl>
      </div>

      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">
            <div class="d-ib pos-r" style="width: 250px;">
            <el-input placeholder="输入推广大使手机号/姓名" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
            </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getTableData('export')">导出</el-button>
        </template>
      </high-search>
      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
        <template>
          <el-table-column prop="phone" label="推广大使手机" min-width="150">
            <template slot-scope="scope">{{scope.row.phone | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="disRuleName" label="当前身份" min-width="160">
            <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="addTime" label="身份所属区域" min-width="200">
            <template slot-scope="scope">{{scope.row.agentAddress | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="memberType" label="级别产生方式" min-width="100">
            <template slot-scope="scope">
              <span>{{scope.row.memberType | filterEmpty}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userAddress " label="所属地区" min-width="120">
            <template slot-scope="scope">{{scope.row.userAddress  | filterAddSource}}</template>
          </el-table-column>
          <el-table-column prop="cashPoints " label="当前账户余额" min-width="120">
            <template slot-scope="scope">{{scope.row.cashPoints  | filterMoney}}</template>
          </el-table-column>
          <el-table-column prop="cashPointsTotal " label="累计账户余额" min-width="120">
            <template slot-scope="scope">{{scope.row.cashPointsTotal  | filterMoney}}</template>
          </el-table-column>
          <el-table-column prop="withdrawalAmount " label="申请提现金额" min-width="120">
            <template slot-scope="scope">{{scope.row.withdrawalAmount  | filterMoney}}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="80">
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
  </common-tpl>
</template>

<script>

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
        payType: '',            // 否 int 支付方式（1：微信，2：支付宝，5：通用积分）
        searchText: ''
      },
      statisticsData: {},     // 统计数据
      rules: {
        // 查询条件
        // customerPhone: { validator: validatePhone, trigger: 'blur' },
        // 会员手机
        customerPhone: { validator: validatePhone, trigger: 'blur' }
      },
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 20
      },
      dateTabs: [
        { label: '今天', value: '0' },
        { label: '昨天', value: '1_day' },
        { label: '近一周', value: '7_day' },
        { label: '近15天', value: '15_day' },
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
    // this.pageType = parseInt(this.$route.query.type) || 1

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/report/sale/list', (res) => {
      this.formData = res
    })
    this.getTableData()
    this.getStatisticsData()
  },

  methods: {
    getTableData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buyMemberAccountManageController/getAccountList'
        this.loading = true
      } else {
        url = 'buyMemberAccountManageController/exportAccountList'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        condition: this.formData.searchText
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
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/buyMemberAccountManageController/getAccountStatistics', {
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
        this.statisticsData = resData.data
      })
    },

    /**
     * 时间方法
     */
    handleDateArgs () {
      let res = {
        startTime: '',
        endTime: ''
      }
      if (this.formData.statisticsDate) {
        let startDate = new Date(this.formData.statisticsDate[0])
        let endDate = new Date(this.formData.statisticsDate[1])
        let startStr = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} 00:00:00`
        let endStr = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()} 23:59:59`
        res.startTime = new Date(startStr).getTime()
        res.endTime = new Date(endStr).getTime()
      }
      return res
    },

    /**
     * 页面类型转换
     */
    pageTypeHandle (val) {
      // this.$router.replace({path: this.$route.path, query: {type: val}})
      this.pageData.currentPage = 1
      this.getTableData()
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
      // localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      // if (this.pageData.currentPage === page) {
      // } else {
      //   this.pageData.currentPage = page
      // }
      this.pageData.currentPage = page
      this.getTableData()
    },
    showDetail (row) {
      localStorage.setItem('account-info', JSON.stringify(row))
      this.$router.push({
        path: `/admin/finance/detail/index/${row.customerId}`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.account-recon-list-wrap{

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
.account-recon-list-wrap{
 
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
