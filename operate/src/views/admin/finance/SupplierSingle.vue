<!-- 生成结算单 -->
<template>
  <common-tpl class="finance-supplier-details" footer>
    <!-- 头部 -->
    <template slot="header">
      <!-- 统计 -->
      <supplier-tip :orderIds="orderIds" :settleFormId="settlementGoodsData.supplierSettleFormId"></supplier-tip>
    </template>

    <!-- 主体 -->
    <template slot="main">

      <!-- 表格部分 -->
     <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="goodsImage" label="商品图片" class="good-img">
          <template slot-scope="scope">
            <img style="width: 50px; height: 50px" :src="scope.row.goodsImage | filterImgUrl">
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="160">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.orderNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码">
          <template slot-scope="scope">
            <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="150">
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
            <div class="truncate">{{scope.row.goodsPrice | filterMoney}}</div>
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
      </el-table>
      <!-- 分页 -->
      <div v-if="pageData.total">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pageData.currentPage"
          :page-size="pageData.pageSize"
          :total="pageData.total"
          @current-change="pageChange"
          v-if="pageData.total">
        </el-pagination>
      </div>
      <br>
      <br>
      <br>
    </template>

    <template slot="footer">
      <el-form ref="formData" :model="formData" label-width="110px" :rules="rules">
        <span class="d-ib">订单数: 
          <strong>{{settlementGoodsData.orderNum}}</strong>
        </span>
        <span class="d-ib">结算总金额: 
          <strong>{{settlementGoodsData.settleMoney | filterMoney | filterEmpty('元')}}</strong>
        </span>
        <span class="d-ib">结算方式: 
          <strong>{{settlementGoodsData.settleMethod | filterSettlement}}</strong>
        </span>
        <span class="d-ib">
          <el-form-item label="实际结算金额:" prop="amount">
            <el-input v-model="formData.amount" v-auto-price placeholder="输入正数，可精确到百分位"></el-input>
          </el-form-item>
        </span>
        <br>
        <template v-if="supplierSettleForm === 1">
          <el-button @click="handleBack">返回</el-button>
        </template>
        <template v-else>
          <el-button @click="handleBackSettlement">返回结算记录</el-button>
        </template>
        <el-button type="primary" :loading="loading" @click="SettlementHandle('formData')">立即结算</el-button>
      </el-form>
    </template>
  </common-tpl>
</template>

<script>
import SupplierTip from './SettlementSheet'
export default {
  components: {SupplierTip},
  data () {
    // 验证实际结算金额
    let validateAmount = (rule, value, callback) => {
      let reg = /^\d+\.\d{2}$/gi
      if (value && !value.toString().match(reg)) return callback(new Error('请输入正数'))
      callback()
    }
    return {
      loading: false,                 // 加载中
      formData: {
        amount: ''                    // 结算金额
      },
      tableData: [],                  // 商品显示表格
      settlementIds: [],              // 多选操作
      settlementGoodsData: {},        // 本地存储结算单信息
      orderIds: [],
      supplierSettleForm: null,       // 继续结算路由
      pageData: {                     // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        amount: { required: true, validator: validateAmount, trigger: 'blur' }
      }
    }
  },

  mounted () {
    this.orderIds = this.$route.query.orderIds && this.$route.query.orderIds.split(',')

    this.settlementGoodsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'SettlementGoodsData'))

    let matchPath = this.$route.path.match(/single|continue/gi)
    if (matchPath) {
      switch (matchPath[0]) {
        case 'single':
          this.supplierSettleForm = 1
          break
        case 'continue':
          this.supplierSettleForm = 2
          break
      }
    }
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getSupplierListData()
  },
  methods: {
    /**
     * 获取继续结算列表数据
     */
    getSupplierListData () {
      this.$http.post('@ROOT_API/buySupplierSettleDetailBygoodsController/getGoodsList', {
        start: this.pageData.currentPage,                   // 是 int 当前页
        pageSize: this.pageData.pageSize,                   // 是 int 每页条数
        settleFormId: this.settlementGoodsData.supplierSettleFormId                     // 结算单id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.pageData.total = 0
          return false
        }
        let results = resData.data
        this.tableData = results.list
        this.pageData.total = results.total
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 多选操作
     */
    handleSelectionChange (val) {
      this.settlementIds = val
    },

    /**
     * 立即结算
     */

    SettlementHandle (formName) {
      // this.loading = true
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/buySupplierSettleFormController/supplierSettle', {
          realSettleMoney: this.formData.amount,              // 实际结算金额
          settleMoney: this.settlementGoodsData.settleMoney,  // 结算金额
          supplierSettleFormId: this.settlementGoodsData.supplierSettleFormId  // 结算表id
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
            duration: 1500
          })
          this.$router.push('/admin/finance/supplier/record/settlement')
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
      })
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      this.pageData.currentPage = page
      this.$router.replace({query: {orderIds: this.$route.query.orderIds, page: this.pageData.currentPage}})
      this.getSupplierListData()
    },

    /**
     * 返回操作
     */
    handleBack () {
      this.loading = true
      this.$http.post('@ROOT_API/buySupplierSettleFormController/deleteSettleForm', {
        supplierSettleFormId: this.settlementGoodsData.supplierSettleFormId  // 结算表id
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
        this.$router.back()
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 返回结算记录
     */
    handleBackSettlement () {
      this.$router.push('/admin/finance/supplier/record/settlement')
    }
  }
}
</script>

<style lang="less" scoped>
.finance-supplier-details{
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

  .admin-common-tpl-footer .cen{
    span{
      color: #606266;
      font-size: 14px;
      margin: 0 50px 0 30px;
      strong{
        margin: 0 3px;
      }

      .el-form-item{
        width: 350px;
        .el-form-item__label{
          font-size: 20px;
        }
      }
    }
  }
}
</style>

<style lang="less">
.finance-supplier-details{
  .settlement-count-table{
    margin-bottom: 20px !important;
  }
}
</style>
