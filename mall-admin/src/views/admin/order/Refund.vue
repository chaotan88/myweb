<!-- 退款管理 -->
<template>
  <common-tpl class="order-index-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="handleHighSerach('form')" :close="highSearchClose">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入订单编号" v-model="orderNum" @keyup.enter.native="handleSearch"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="handleSearch"></i>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm('form')">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="订单编号" prop="number">
              <el-input v-model="formData.orderNo" placeholder="请输入订单编号"></el-input>
            </el-form-item>
            <el-form-item label="申请时间" class="apply-time">
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择开始时间" v-model="formData.startTime" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line ta-c" :span="2">至</el-col>
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择结束时间" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
              </el-col>
              <!--<el-date-picker v-model="formData.value6" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">-->
              <!--</el-date-picker>-->
            </el-form-item>
           <el-form-item label="商品名称">
              <el-input v-model="formData.goodsName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item label="买家姓名" prop="customerName">
              <el-input v-model="formData.customerName" placeholder="请输入买家姓名"></el-input>
            </el-form-item>
            <el-form-item label="买家手机号" prop="customerPhone">
              <el-input v-model="formData.customerPhone" placeholder="请输入买家手机号"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <el-table-column label="买家信息">
          <template slot-scope="scope">
            <div>{{scope.row.customerName}}</div>
            {{scope.row.customerPhone}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="phone" label="买家手机号"></el-table-column>-->
        <el-table-column prop="sendStatus" label="发货状态">
          <template slot-scope="scope">{{scope.row.sendStatus | filterSendType}}</template>
        </el-table-column>
        <el-table-column label="实收款">
          <template slot-scope="scope">
            <div>￥{{scope.row.refundGoodsPrice}}</div>
            <div>含运费：￥{{scope.row.refundFreightPrice}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="refundApplyPrice" label="申请金额">
          <template slot-scope="scope">￥{{scope.row.refundApplyPrice}}</template>
        </el-table-column>
        <el-table-column prop="refundPrice" label="退款金额">
          <template slot-scope="scope">￥{{scope.row.refundPrice}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="parseInt(scope.row.refundStatus) === 1">
                  <div @click="deliverHandle(scope.row)"><i class="icon el-icon-edit-outline"></i>退款</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="$router.push({path:'/admin/order/refund/details', query: {refundOrderId: scope.row.refundOrderId}})"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
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

    <!-- 退款 -->
    <template slot="other">
      <el-dialog title="退款" :visible.sync="refundVisible" width="480px">
        <refund-dialog
        :payType="payType"
        :orderMoney="orderMoney"
        :refundMoney="refundMoney"
        :refundOrderId="refundOrderId" @close="refundVisible = false" @success="refundSucess"></refund-dialog>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
import RefundDialog from './RefundDialog'
export default {
  components: {RefundDialog},
  data () {
    // 验证手机号
    let validatePhone = (rule, value, callback) => {
      if (value && !value.toString().match(/^1\d{10}$/gi)) return callback(new Error('请输入正确的手机号'))
      callback()
    }
    return {
      pageType: null,          // 页面类型［0/全部，1／待退款，2／已退款］
      highSearchClose: true,   // 高级搜索收起
      orderNum: '',            // 输入框订单编号
      formData: {},
      payType: 0,              // 支付类型
      orderMoney: '',          // 订单金额
      refundMoney: '',         // 退款金额
      refundOrderId: '',       // 退款订单ID
      rules: {
        customerPhone: [{ validator: validatePhone, trigger: 'blur' }]
      },
      tableData: [],           // 列表数据
      copyFormData: {},        // 拷贝数据
      refundVisible: false,    // 退款弹窗
      pageData: {              // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    if (this.$route.path.match(/refunds/gi)) {
      this.pageType = 1
    } else if (this.$route.path.match(/refunded/gi)) {
      this.pageType = 2
    }
    this.tableData.map((row) => {
      row.status = this.pageType
    })
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$router.push({query: {page: this.pageData.currentPage}})
      this.$http.post('@ROOT_API/refund/getRefundList', Object.assign({
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        orderNo: this.orderNum,
        refundStatus: this.pageType
      }, this.formData)).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
        this.tableData = resData.data.list
        this.pageData.total = resData.data.total
      })
    },

    /**
     * input 失去焦点自动补全
     */
    inpBlur () {
      this.$Utils.blurAutoCompletion(this.formData, 'refundAmount')
    },

    /**
     * 退款
     */
    deliverHandle (row) {
      this.refundVisible = true
      this.orderMoney = (row.refundFreightPrice + row.refundGoodsPrice).toString()
      this.refundMoney = row.refundPrice.toString()
      this.payType = parseInt(row.payType)
      this.refundOrderId = row.refundOrderId
    },

    /**
     * 提交退款
     */
    refundSucess () {
      this.refundVisible = false
      // this.tableData.map((item, index) => {
      //   item.refundOrderId === this.refundOrderId && this.tableData.splice(index, 1)
      // })
      // this.pageData.currentPage = 1
      this.getListData()
    },

    /**
     * 分页操作
     */
    pageChange (page) {
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
    handleHighSerach (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.handleSearch()
        this.highSearchClose = true
      })
    },

    /**
     * 搜索
     */
    handleSearch () {
      this.pageData.currentPage = 1
      this.getListData()
    },

    /**
     * 重置表单
     */
    resetForm (formName) {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.order-index-wrap{

  /*----------------搜索-----------*/
  .search-wrap{
    .el-form-item{
      width: 50%;
      float: left;

      .el-input{
        width: 440px;
      }

      .el-date-editor--daterange{
        width: 60%;
      }
    }



    .w100{
      width: 100%;
    }

    .el-dropdown{
      width: 100px;
      left: -110px;
      top: 0;
    }
  }
}
</style>

<style lang="less">
.search-wrap .high-search-down .btn-wrap{
  margin-top: 0;
}
</style>
