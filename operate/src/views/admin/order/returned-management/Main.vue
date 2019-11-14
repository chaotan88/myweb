<template>
  <div class="order-management-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="search-wrap">
          <div class="search-group">
            <div class="search-left">
              <!-- <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <el-date-picker
                v-model="search.startTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <el-date-picker
                v-model="search.endTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </div>
            <div class="search-right">
              <el-input v-model="search.customerPhone" placeholder="商品名称/订单编号/客户手机号" clearable @clear="getRefundOrderPage">
                <el-button slot="append" icon="el-icon-search" @click="getRefundOrderPage"></el-button>
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="orderNo" label="订单编号"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column label="买家信息">
            <template slot-scope="scope">
              <span>{{ scope.row.customerName }}</span><br>
              <span>{{ scope.row.customerPhone }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sendState" label="退款状态">
            <template slot-scope="scope">
              <span>{{ scope.row.refundState | refundStateFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收款">
            <template slot-scope="scope">
              <span>¥</span>
              <span>{{ scope.row.reundGoodsPrice }}</span><br>
              <span>含运费：¥</span>
              <span>{{ scope.row.refundFreightPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请金额">
            <template slot-scope="scope">
              <span>¥</span>
              <span>{{ scope.row.refundApplyPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="退款金额">
            <template slot-scope="scope">
              <span>¥</span>
              <span>{{ scope.row.refundPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.refundState === '1'" @click="refundPay(scope.row.refundOrderId, scope.row.payType, scope.row.totalPrice)">退款</el-button>
              <el-button type="text" @click="viewOrderDetail(scope.row.refundOrderId)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-module">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 驳回弹窗 -->
    <!-- <el-dialog
      title="申请退货驳回"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定驳回退货订单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 退款弹窗 -->
    <el-dialog
      title="退款"
      :visible.sync="dialogVisible2"
      width="30%">
      <div class="dialog-body">
        <el-form :model="refundOrder">
          <el-row>
            <el-form-item>
              <el-radio v-model="radio" label="1">退回原账户</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <span>订单金额：</span>
              <span>{{ orderDetail.refundApplyPrice }}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <span>退款金额：</span>
              <el-input v-model.number="refundOrder.refundPrice"></el-input>
              <span>元</span>
            </el-form-item>
          </el-row>
          <!-- <p>输入金额不能超过订单金额</p> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        search: {
          startTime: '',
          endTime: '',
          refundState: '',
          customerPhone: '',
          pageNo: 1,       // 默认开始页码
          pageSize: 10    // 默认每页数量
        },
        tableData: [],     // 退货订单列表
        refundOrder: {},   // 退款订单
        orderDetail: {},   // 订单详情
        refundOrderId: '', // 订单ID
        payType: '',       // 支付类型
        totalPrice: '',    // 支付总金额
        radio: '1',
        dialogVisible: false,
        dialogVisible2: false,
        currentPage: 1, // 当前页码
        total: 0       // 分页总数
      }
    },
    methods: {
      getRefundOrderPage: function () {
        // 获取订单列表
        if (!this.search.refundState) this.search.refundState = ''
        this.$http.post('/admin/refundOrder/getRefundOrderPage', this.qs.stringify(this.search))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // res.data.obj.dataList => 订单列表
            this.total = res.data.obj.total // res.data.obj.total => 分页总数
          } else if (res.data.res === 0) {
            // 接口没有数据返回
            this.tableData = []
            this.total = 0
          }
        })
      },
      getRefundOrder: function (refundOrderId) {
        // 获取订单详情
        this.$http.post('/admin/refundOrder/getRefundOrder', this.qs.stringify({
          refundOrderId: refundOrderId
        })).then(res => {
          if (res.data.res === 1) {
            this.orderDetail = res.data.obj // res.data.obj => 订单详情
          }
        })
      },
      refundPay: function (refundOrderId, payType, totalPrice) {
        // 退款
        this.dialogVisible2 = true  // 显示弹窗
        this.refundOrder = {}       // 初始化退款订单
        this.refundOrderId = refundOrderId  // 保存退款单ID
        this.payType = payType  // 保存退款单支付类型
        this.totalPrice = totalPrice || '' // 保存订单总金额
        this.getRefundOrder(refundOrderId)  // 获取订单详情
      },
      cancel: function () {
        // 取消
        this.dialogVisible2 = false
      },
      confirm: function () {
        // 确定
        if (this.refundOrder.refundPrice > this.orderDetail.refundApplyPrice) {
          // 输入的退款金额大于订单金额
          this.$message.error('退款失败，退款金额不能超过订单金额')
        } else {
          // 输入的退款金额小于等于订单金额
          var order = {}
          order.refundOrderId = this.refundOrderId
          order.refundPrice = this.refundOrder.refundPrice
          order.payType = this.payType
          order.totalPrice = this.totalPrice
          if (order.payType === '1') {
            // 微信支付
            this.$http.post('/admin/wxPay/refundPay', this.qs.stringify(order))
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('退款成功')
                this.getRefundOrderPage() // 重新获取列表
              } else {
                this.$message.error('退款失败')
              }
            })
          } else if (order.payType === '2') {
            // 支付宝支付
            this.$http.post('/admin/aliPay/refundPay', this.qs.stringify(order))
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('退款成功')
                this.getRefundOrderPage() // 重新获取列表
              } else {
                this.$message.error('退款失败')
              }
            })
          }
        }
        this.dialogVisible2 = false
      },
      viewOrderDetail: function (refundOrderId) {
        // 查看订单详情
        this.$router.push(`/admin/order/returned-management/order-detail/${refundOrderId}`)
      },
      handleSizeChange: function (val) {
        // 每页数量改变
        this.search.pageNo = 1 // 初始化页码
        this.search.pageSize = val // 改变每页数量
        this.getRefundOrderPage()
      },
      handleCurrentChange: function (val) {
        // 当前页码改变
        this.search.pageNo = val // 改变当前页码
        this.getRefundOrderPage()
      }
    },
    watch: {
      '$route': function (to, from) {
        // 在这里监视路由的变化
        this.search.refundState = to.params.refundState
        this.getRefundOrderPage()
      }
    },
    mounted: function () {
      this.search.refundState = this.$route.params.refundState
      this.getRefundOrderPage()
    }
  }
</script>

<style lang="less" scoped>
  .order-management-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      /* 搜索 */
      .search-module {
        /* 搜索框 */
        .search-wrap {
          .search-group {
            float: right;
          }
          .search-left {
            float: left;
            margin-right: 60px;
          }
          .search-right {
            float: right;
          }
        }
      }
      /* 表格 */
      .table-module {
        margin-top: 20px;
      }
    }
    /* 分页器 */
    .pagination-module {
      margin-top: 30px;
    }
    /* 清除浮动类 */
    .clear-float::after {
      content: '';
      display: block;
      clear: both;
    }
  }
</style>

<style lang="less">
  .order-management-wrap {
    .content-wrap {
      /* 搜索 */
      .search-module {
        /* 搜索框 */
        .search-wrap {
          .el-select {
            .el-input {
              width: 118px;
            }
          }
          input {
            height: 36px;
            background-color: #f8f8f8;
            border-color: #c8d0da;
          }
          .el-date-editor {
            width: 180px;
          }
          .search-group {
            .search-right {
              .el-input {
                width: 240px;
              }
            }
          }
        }
      }
      /* 表格 */
      .table-module {
        .el-table {
          border: 1px solid #eef1f5;
          border-bottom: 0;
          .el-table__header-wrapper, .el-table__body-wrapper {
            table {
              th, td {
                padding: 0;
                height: 60px;
                text-align: center;
                font-size: 14px;
              }
            }
          }
          .el-table__header-wrapper {
            table {
              th {
                background-color: #f8f8f8;
                color: #333;
              }
            }
          }
          .el-table__body-wrapper {
            table {
              td {
                color: #666;
                button {
                  color: #666;
                }
              }
            }
          }
        }
      }
    }
    /* 分页器 */
    .pagination-module {
      .el-pagination {
        padding: 0;
        text-align: center;
      }
    }
    .el-form-item {
      margin: 0;
    }
    .dialog-body {
      .el-input {
        width: 200px;
      }
    }
  }
</style>
