<!-- 业绩统计表 -->
<template>
  <common-tpl class="cash-list-wrap" :footer="false">
    <!-- 主体 -->
    <template slot="main">

      <!-- 时间 -->
      <el-form ref="form" :rules="rules" :model="formData.data" label-position="right" class="search-form" label-width="110px">
        <div class="d-ib pos-a" style="width: 150px;">
          <el-select v-model="formData.curYear" size="medium" class="year-box" placeholder="选择年份" @change="selectYear" clearable>
            <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in yearArr"></el-option>
          </el-select>
        </div>
        <el-form-item label="统计时间段：" class="pos-r apply-date-wrap" style="left: 200px">
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
            <h4 class="fw-n">抢购业绩</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>微信 &nbsp{{statisticsData.grabWxPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: orange; margin-left: 15px;"></i>
              <span>支付宝 &nbsp{{statisticsData.grabAliPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: red; margin-left: 15px;"></i>
              <span>通用积分 &nbsp{{statisticsData.grabCashPointPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>

        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.purchaseTotalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">批发业绩</h4>
            <div class="va-m small-box-wrap" style="margin-top: 10px;">
              <i class="d-ib va-t small-box"></i>
              <span>微信 &nbsp{{statisticsData.purchaseWxPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: orange; margin-left: 15px;"></i>
              <span>支付宝 &nbsp{{statisticsData.purchaseAliPayAmount || 0}}</span>
              <i class="d-ib va-t small-box" style="background: red; margin-left: 15px;"></i>
              <span>通用积分 &nbsp{{statisticsData.purchaseCashPointPayAmount || 0}}</span>
            </div>
          </dd>
        </dl>
        <dl class="ta-c fl-l cursor-p">
          <dd class="d-ib va-m ta-c">
            <h3 class="fw-n">
              <span>{{statisticsData.withDrawalAmount | filterEmpty('元')}}</span>
            </h3>
            <h4 class="fw-n">提现金额</h4>
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
        <div class="pos-r" slot="search">

          <!-- 输入手机可查找会员旗下业绩 -->
          <div class="d-ib pos-r" style="width: 380px;">
            <el-input placeholder="输入手机可查找会员旗下业绩" v-model.trim="formData.customerPhone" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
          </div>
          &nbsp;

          <!-- 支付方式 -->
          <div class="d-ib" style="width: 150px;">
            <el-select class="full-w" v-model="formData.payType" @change="subTypehandle()" placeholder="全部支付方式">
              <el-option label="全部支付方式" value=""></el-option>
              <el-option label="微信" value="1"></el-option>
              <el-option label="支付宝" value="2"></el-option>
              <el-option label="通用积分" value="5"></el-option>
            </el-select>
          </div>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </template>
      </high-search>

      <el-table :data="tableData" class="full-w" v-loading="loading" element-loading-text="加载中">
       <el-table-column prop="" label="产品名称">
          <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="抢购价">
          <template slot-scope="scope">{{scope.row.grabPrice | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="成本价">
          <template slot-scope="scope">{{scope.row.buyingPrice | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="基数放量利润">
          <template slot-scope="scope">{{scope.row.companyProfit | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="基数放量">
          <template slot-scope="scope">{{scope.row.companyGoodsNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="基数放量抢购金额" width="160">
          <template slot-scope="scope">{{scope.row.companyAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="已抢购业绩">
          <template slot-scope="scope">{{scope.row.grabAmount | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="已挂售数">
          <template slot-scope="scope">{{scope.row.hangSellNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="已抢购数量">
          <template slot-scope="scope">{{scope.row.grabNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="挂售未抢购数量">
          <template slot-scope="scope">{{scope.row.notSellNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="批发价">
          <template slot-scope="scope">{{scope.row.purchasePrice | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="已批发数量">
          <template slot-scope="scope">{{scope.row.purchaseNum | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="" label="批发业绩">
          <template slot-scope="scope">{{scope.row.purchaseTotalAmount | filterEmpty}}</template>
        </el-table-column>
        <!-- <el-table-column prop="" label="交易时间">
          <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
        </el-table-column> -->
        <!-- <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="this.$router.push('/admin/finance/currency/cash/details')"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
     <!--  <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination> -->
    </template>

    <template slot="other">

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
      loading: false,                 // loading
      yearArr: [              // 选择年
        {
          label: '近三个月',
          value: 3
        },
        {
          label: '近半年',
          value: 6
        },
        {
          label: '近一年',
          value: 12
        }
      ],
      nowdatestr: '',           // 当前日期
      tableData: [{
        transferName: 111
      }],
      // pickerOptions0: {                // 限制时间
      //   onPick: ({ maxDate, minDate }) => {
      //     this.onPickDate = minDate
      //   },
      //   disabledDate: (time) => {
      //     if (this.onPickDate) {
      //       let date = this.onPickDate
      //       let y = date.getFullYear()
      //       let m = date.getMonth()
      //       let firstDay = new Date(y, m, 1)
      //       let lastDay = new Date(y, m + 2, 0)
      //       return time.getTime() < firstDay || time.getTime() || time.getTime() > lastDay
      //     } else {
      //       return time.getTime() > new Date()
      //     }
      //   }
      // },
      formData: {
        curYear: '',           // 选择日期
        statisticsDate: [],    // 日期
        customerPhone: '',     // 否 string  客户号码
        endDate: '',           // 统计时间结束: '',           // 否 string  结束时间
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
      }
    }
  },
  mounted () {
    // dt.setDate(dt.getDate() - 1)
    // console.log('dt.setDate: ', this.$Utils.filterDate(dt, 'YYYY-MM-DD'))

    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/giftGiving', (res) => {
      this.formData = res
    })

    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getApiData()
  },
  methods: {
    getApiData () {
      this.getStatisticsData()   // 获取统计数据
      this.getListData()         // 获取列表数据
    },
    /**
     * 获取统计数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/buySellStaticReoprtController/getTotalPerformaceStatic', {
        customerPhone: this.formData.customerPhone,   // 否 string  客户号码
        ...this.handleDateArgs(),
        payType: this.formData.payType                // 否 int 支付方式（1：微信，2：支付宝，5：通用积分）
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
     * 获取列表数据
     */
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buySellStaticReoprtController/getGoodsPerformaceStatic'
        this.loading = true
      } else {
        url = 'buySellStaticReoprtController/exportBuySellStatic'
      }
      let data = {
        customerPhone: this.formData.customerPhone,
        ...this.handleDateArgs(),
        payType: this.formData.payType
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
     * 时间改变
     */
    selectYear (value) {
      if (!value) return false
      var dt = new Date()
      switch (value) {
        case 3:
          dt.setMonth(dt.getMonth() - 3)
          break
        case 6:
          dt.setMonth(dt.getMonth() - 6)
          break
        case 12:
          dt.setMonth(dt.getMonth() - 12)
          break
      }
      this.formData.statisticsDate = [dt, new Date()]
      this.getApiData()
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
        res.beginDate = this.$Utils.filterDate(this.formData.statisticsDate[0], 'YYYY-MM-DD')
        res.endDate = this.$Utils.filterDate(this.formData.statisticsDate[1], 'YYYY-MM-DD')
      }
      return res
    },

    /**
     * 过滤选择时间
     */
    handleFilterDate (data) {
      this.formData.curYear = ''
      this.getApiData()
    },

    /**
     * 选择支付方式
     */
    subTypehandle (val) {
      console.log('val: ', val)
      this.getListData()
    },

    /**
     * 选择账户
     */
    accountChange () {
      this.allSelection = false
      this.selectDefaultekey()
      this.getListData()
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.getStatisticsData()
      this.pageChange(1)
    },

    /**
     * 导出
     */
    exportData () {
      let url = 'pointsTransfer/exportPointsTransferGroup'
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'contentText=' + this.formData.contentText, '_blank')
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
    }
  }
}
</script>

<style lang="less" scoped>
.cash-list-wrap{

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
.cash-list-wrap{
 
 /*------------高级搜索------*/
  .search-wrap{
    .apply-date-wrap{
      left: 200px;
    }
    .search-head-wrap{
      padding: 0 !important;
      padding-bottom: 20px !important;
    }
  }
}
</style>
