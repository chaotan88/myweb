<!-- 结算管理明细 -->
<template>
  <common-tpl class="finance-balance-details-wrap" footer back>
    <template slot="header">
      <div class="pos-r statistics-wrap">
        <div class="ta-c pos-a list">
          <h2><strong>{{statisticsData.settleMoney | filterMoney | filterEmpty('元')}}</strong></h2>
          <p>结算总金额</p>
        </div>
        <div class="list">
          <p>
            <span>包含订单数：<em class="fw-b">{{orderStatisticsData.orderNum | filterEmpty('个')}}</em></span>
            <span><em class="fw-b">共计{{orderStatisticsData.goodsNum | filterEmpty}}件商品</em></span>
            <span>运费：</span>
            <span><em class="fw-b">{{orderStatisticsData.logisticAmounts | filterEmpty}}</em></span>
          </p>
          <p>
            <span>结算单号：<em>{{statisticsData.settleFormNo | filterEmpty}}</em></span>
            <span>结算状态：<em>{{statisticsData.settleStatus | filterSettleStatus}}</em></span>
            <!-- <span>结算生成时间：<em>{{'' | filterDate}}</em></span> -->
            <span>结算时间：<em>{{statisticsData.settleTime | filterDate}}</em></span>
          </p>
        </div>
      </div>

      <third-menu :visible="true">
        <template slot="main">
          <a class='cursor-p d-ib ta-c' :class="{active: !$route.query.type || $route.query.type === 'order'}" @click="$router.push({path: '/admin/finance/balance/record/list', query: {type: 'order'}})">按订单显示</a>
          <a class='cursor-p d-ib ta-c' :class="{active: $route.query.type === 'goods'}" @click="$router.push({path: '/admin/finance/balance/record/list', query: {type: 'goods'}})">按商品显示</a>
        </template>
      </third-menu>

      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入订单编号/商品编码" v-model.trim="formData.searchText" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
        </div>
      </high-search>
    </template>

    <template slot="main">
      <!-- 按订单显示 -->
      <template v-if="pageType === 1">
        <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
          <el-table-column label="订单编号">
            <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
          </el-table-column>
          <el-table-column label="订单状态">
            <template slot-scope="scope">{{scope.row.orderStatus | filterOrderStatus}}</template>
          </el-table-column>
          <el-table-column label="进货价（元）">
            <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</template>
          </el-table-column>
          <el-table-column label="运费（元）">
            <template slot-scope="scope">{{scope.row.logisticsAmount | filterMoney | filterEmpty}}</template>
          </el-table-column>
          <!-- <el-table-column label="结算金额（元）"></el-table-column> -->
          <el-table-column label="下单时间">
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
                    <div @click="$router.push({path: '/admin/finance/balance/record/details', query: {id: scope.row.orderId}})"><i class="icon el-icon-view"></i>详情</div>
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
      </template>

      <!-- 按商品显示 -->
      <template v-else>
        <el-table :data="tableData" style="width: 100%" class="no-edit" v-loading="loading" element-loading-text="加载中">
          <el-table-column label="商品图片">
            <template slot-scope="scope">
              <img width="50px" height="50px" :src="scope.row.goodsImage | filterImgUrl">
            </template>
          </el-table-column>
          <el-table-column label="订单编号" width="180px">
            <template slot-scope="scope">{{scope.row.orderNo | filterEmpty}}</template>
          </el-table-column>
          <el-table-column label="商品编码">
            <template slot-scope="scope">{{scope.row.goodsNo | filterEmpty}}</template>
          </el-table-column>
          <el-table-column label="商品名称" min-width="150px">
            <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column label="进货价（元）">
            <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</template>
          </el-table-column>
          <!-- <el-table-column label="运费（元）">
            <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</template>
          </el-table-column> -->
          <el-table-column label="商品规格">
            <template slot-scope="scope">{{scope.row.goodsAttribute | filterEmpty}}</template>
          </el-table-column>  
          <el-table-column label="商品数量">
            <template slot-scope="scope">{{scope.row.goodsNum | filterEmpty}}</template>
          </el-table-column>  
          <el-table-column label="结算金额（元）">
            <template slot-scope="scope">{{scope.row.settleMoney | filterMoney | filterEmpty}}</template>
          </el-table-column>
          
          <!-- 暂无数据 -->
          <div slot="empty">
            <no-data></no-data>
          </div>
        </el-table>
      </template>

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

export default{
  data () {
    return {
      loading: false,           // loading
      pageType: 1,              // 页面类型 [1、按订单显示 2、按商品显示]
      formData: {               // 表单数据
        searchText: ''          // 会员姓名/手机号
      },
      tableData: [],            // 列表数据
      pageData: {               // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      statisticsData: {},       // 本地存储数据
      orderStatisticsData: {},  // 订单统计
      userInfo: {}              // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO)) || {}
    this.pageType = !this.$route.query.type || this.$route.query.type === 'order' ? 1 : 2
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1

    this.statisticsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'BalanceRecordDetails'))

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/finance/balance/record/list', (res) => {
      this.formData = res
    })
    if (this.pageType === 1) {
      this.getListData('order')
    } else {
      this.getListData('goods')
    }
    this.getStatisticsData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData (type) {
      let isExport = false
      let url = ''
      switch (type) {
        case 'goods':
          url = '@ROOT_API/buySupplierSettleDetailBygoodsController/getGoodsList'
          break
        case 'order':
          url = '@ROOT_API/buySupplierSettleDetailController/getSupplierSettleDetailList'
          break
        case 'export':
          isExport = true
          url = 'order/exportOrderList'
          break
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        settleFormId: this.statisticsData.id,
        condition: this.formData.searchText
      }
      if (!isExport) {
        this.loading = true
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
          this.tableData = results.list
          this.pageData.total = results.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 获取列表数据
     */
    getStatisticsData () {
      this.$http.post('@ROOT_API/buySupplierSettleDetailController/getSupplierSettleListSumById', {
        settleFormId: this.statisticsData.id
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
        this.orderStatisticsData = resData.data
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
        let query = this.$route.query
        this.$router.push({query: {type: query.type, page: this.pageData.currentPage}})
      }
    }
  }
}
</script>

<style lang='less' scoped>
.finance-balance-details-wrap{

  /* -------------------- { 统计 } -------------------- */
  .statistics-wrap{
    color: #6c6c6c;
    font-size: 14px;
    padding: 16px 16px 16px 180px;
    margin-bottom: 20px;
    background: #fff;

    .list.pos-a{
      width: 160px;
      left: 16px;
      top: 16px;
    }

    .list:last-child{
      border-left: 1px solid #e5e5e5;
      padding-left: 30px;
    }

    h2{
      font-size: 14px;

      strong{
        color: #f95a5a;
        font-size: 18px;
      }
    }

    p{
      margin-bottom: 5px;

      span{
        margin-right: 30px
      }

      em{
        font-style: normal;
      }

      em.fw-b{
        color: #3c3c3c;
      }
    }
  }

  /* -------------------- { 充值弹窗用户信息 } -------------------- */
  .recharge-table{
    border-collapse: collapse;
    border: 1px solid #ebeef5;
    margin-bottom: 30px;

    th, td{
      padding: 0 15px;
    }

    th{
      width: 25%;
      height: 40px;
      background: #eef1f9;
    }

    td{
      border-left: 1px solid #ebeef5;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }

  /* -------------------- { 充值弹窗表单 } -------------------- */
  .el-form{
    border: 1px solid #ebeef5;
    margin-bottom: 30px;

    .el-form-item{
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 15px;
      margin-bottom: 15px;

      .el-input{
        width: 200px;
        margin-right: 10px;
      }
    }

    .el-form-item:last-child{
      border-bottom: 0;
      margin-bottom: 0;
    }
  }

  .gray-text{
    color: #bbb;
    font-size: 14px;

    strong{
      color: red;
      font-size: 18px;
    }
  }

}
</style>
