<!-- 供应商结算记录 - 详情 - 按商品显示/按订单显示 -->
<template>
  <common-tpl class="settlement-wrap" footer>
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <supplier-tip :settleFormId="settleFormId"></supplier-tip>
      <br/>

      <third-menu :visible="true">
        <template slot="main">
          <a class='d-ib ta-c cursor-p' :class="{active: pageType === 1}" @click="handleLink('goods')">按商品显示</a>
          <a class='d-ib ta-c cursor-p' :class="{active: pageType === 2}" @click="handleLink('order')">按订单显示</a>
        </template>
      </third-menu>
    </template>
    <!-- 主体 -->
    <template slot="main">
      <!-- 按商品显示表格 -->
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-show="pageType === 1" @selection-change="handleSelectionChange">
        <el-table-column prop="goodsImage" label="商品图片" class="good-img">
          <template slot-scope="scope">
            <!-- {{scope.row.goodsImage}} -->
            <img :src="scope.row.goodsImage | filterImgUrl">
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="buyingPrice" label="进货价（元）">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.buyingPrice | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="销售价（元）">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsSpecialPrice" label="特卖价（元）">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsSpecialPrice | filterMoney | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="profitRate" label="利润率">
          <template slot-scope="scope">
            <div class="truncate">{{(scope.row.goodsPrice - scope.row.buyingPrice) / scope.row.buyingPrice | numToFixed | filterEmpty('%')}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsAttribute" label="商品规格">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsAttribute | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNum" label="销售数量">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNum | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="settleMoney" label="结算金额(元)">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.settleMoney | filterMoney}}</div>
          </template>
        </el-table-column>

        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>


      <!-- 按订单显示表格 -->
      <el-table :data="orderTableData" style="width: 100%" v-show="pageType === 2">
        <el-table-column prop="orderNo" label="订单编号">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.supplierName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderStatus | filterOrderStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="买家姓名">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.customerName | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customerPhone" label="买家手机号">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.customerPhone | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payStatus" label="支付状态">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.payStatus | filterPayStatus}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.payType | filterPayType}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderTotalAmount" label="实收款">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderTotalAmount | filterMoney}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="orderTime" label="下单时间">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderTime | filterDate}}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                 <div @click="handleDetails(scope.row)"><i class="icon el-icon-edit"></i>详情</div>
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
       <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
      </el-pagination>
    </template>

    <template slot="footer">
      <el-button @click="$router.push('/admin/finance/supplier/record/settlement')">返回</el-button>
    </template>
  </common-tpl>
</template>

<script>
import SupplierTip from './SettlementSheet'
export default {
  components: {SupplierTip},
  data () {
    return {
      pageType: 1,                // 页面类型
      amountData: {},             // 金额统计
      formData: {
        name: '',
        classifySelectValue: ''   // 多选菜单结果
      },
      tableData: [],              // 商品显示表格
      orderTableData: [],         // 订单显示表格
      multipleSelection: [],      // 多选操作
      goodListDetails: '',        // 商品订单列表id
      settleFormId: null,           // 结算单主键
      pageData: {                 // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  watch: {
    '$route' () {
      this.pageType = this.$route.query.type === 'goods' ? 1 : 2
      if (this.pageType === 1) {
        this.getGoodsListData()
      } else {
        this.getListData()
      }
    }
  },
  mounted () {
    this.settleFormId = parseInt(this.$route.query.id)
    this.goodListDetails = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'goodListDetails'))
    this.pageType = !this.$route.query.type || this.$route.query.type === 'goods' ? 1 : 2
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    if (this.pageType === 1) {
      this.getGoodsListData()
    } else {
      this.getListData()
    }
  },
  methods: {
    /**
     * 获取商品列表数据
     */
    getGoodsListData () {
      this.loading = true
      this.$http.post('@ROOT_API/buySupplierSettleDetailBygoodsController/getGoodsList', {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize,                   // 是 int 每页条数
        settleFormId: this.goodListDetails.id               // 结算单id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.orderTableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.orderTableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取订单列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/buySupplierSettleDetailController/getSupplierSettleDetailList', {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize,                   // 是 int 每页条数
        settleFormId: this.settleFormId,
        supplierId: this.supplierId
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.tableData = []
          this.orderTableData = []
          this.pageData.total = 0
          return false
        }
        this.tableData = resData.data.list
        this.orderTableData = resData.data.list
        this.pageData.total = resData.data.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 跳转链接
     */
    handleLink (type) {
      this.pageType = type === 'goods' ? 1 : 2
      this.pageData.currentPage = 1
      this.$router.push({path: '/admin/finance/supplier/record/details', query: {type, id: this.$route.query.id, page: 1}})
    },

     /**
     * 查看详情
     */
    handleDetails (row) {
      if (!row) return false
      localStorage.setItem(this.$global.SYSTEM + 'RechargeDetails', JSON.stringify(row))
      setTimeout(() => {
        this.$router.push({path: '/admin/finance/supplier/record/order/details', query: {'id': row.orderId}})
      }, 30)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        console.log('if page: ', page)
        this.getListData()
      } else {
        console.log('else page: ', page)
        this.pageData.currentPage = page
        this.$router.push({query: {type: this.$route.query.type || 'goods', page: this.pageData.currentPage, id: this.$route.query.id}})
      }
    },

    /**
     * 选择集合
     */
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped lang="less">
.settlement-wrap{
  .settlement-count-table{
    max-width: 100%;
    background: #fff;
    padding: 30px;
    box-sizing: border-box;

    .count-box{
      float: left;
      width: 100%;
      text-align: left;
      overflow: hidden;

      dl{

        dd{
          height: 60px;
          padding: 20px 40px;
          border-right: 1px solid #e5e5e5;

          h3{
            color: #f95a5a;
          }

          h4{
            line-height: 40px;
          }
        }

        dt{
          padding-left: 180px;
          span{
            color: #6c6c6c;
            height: 45px;
            line-height: 45px;
            font-size: 14px;
            margin-left: 20px;
          }

          strong{
            color: #3c3c3c;
            margin: 0 3px;
          }
        }
      }
    }
  }
  .settlement-count-table:after{
    content: '';
    display: block;
    clear: both;
  }
}
</style>

<style lang="less">
.settlement-wrap{
  .select-wrap{

    .el-icon--right{
      line-height: 40px !important;
      right: 5px;
    }
  }
  .caret-wrapper{
    height: 14px;
    .ascending{
      top: -4px;
    }
    .descending{
      bottom: -4px;
    }
  }

  .el-table{
    tr{
      td:first-child{
        width: 80px;
        height: 80px;

        img{
          width: 80px;
          height: 80px;
        }
      }

      .cell{

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .search-wrap .retailers-wrap{
    .el-form-item{
      margin-bottom: 0;

      .el-form-item__content{
        margin-left: 0 !important;

        .el-input__inner{
          border-radius: 3px;
          height: 36px;
        }
      }
    }
  }
}
</style>
