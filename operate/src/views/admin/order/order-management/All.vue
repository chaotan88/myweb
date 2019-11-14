<template>
  <div class="order-management-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <search-bar-all-order v-if="orderState === '0'" @transferSearchData="getSearchData"></search-bar-all-order>
      <search-bar-wait-payment v-else-if="orderState === '1'" @transferSearchData="getSearchData"></search-bar-wait-payment>
      <search-bar-wait-delivery v-else @transferSearchData="getSearchData"></search-bar-wait-delivery>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="tableData">
          <el-table-column prop="orderNo" label="订单编号"></el-table-column>
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item, index) in scope.row.orderDetailList" :key="index" style="padding: 5px 0;">{{item.goodsName}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item, index) in scope.row.orderDetailList" :key="index" style="padding: 5px 0;">{{item.goodsPrice}}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              <ul>
                <li v-for="(item, index) in scope.row.orderDetailList" :key="index" style="padding: 5px 0;">{{ item.goodsNum }}</li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column label="买家信息">
            <template slot-scope="scope">
              <p>{{ scope.row.customerName }}</p>
              <p>{{ scope.row.customerPhone }}</p>
            </template>
          </el-table-column>
          <el-table-column label="支付状态/方式">
            <template slot-scope="scope">
              <span>{{ scope.row.payState | payStateFilter }}</span>
              <span v-if="scope.row.payType !== '0'">/</span>
              <span>{{ scope.row.payType | payTypeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实收款">
            <template slot-scope="scope">
              <p><span>¥</span>{{ scope.row.orderTotalAmount }}</p>
              <p><span>含运费：¥</span>{{ scope.row.freight }}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="viewOrderDetail(scope.row.orderId)">详情</el-button>
              <el-button type="text" v-if="scope.row.orderState === '2'" @click="sendGoods(scope.row.orderId)">发货</el-button>
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
        :current-page="search.pageNo"
        :page-sizes="[10, 20, 30]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 发货弹窗 -->
    <el-dialog
      title="收货地址"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="dialog-body-wrap">
        <div class="delivery-info">
          <p>
            <span>{{ orderDetail.customerName }}</span>
            <span>{{ orderDetail.customerPhone }}</span>
          </p>
          <p>{{ orderDetail.customerAddress }}</p>
        </div>
        <div class="delivery-form">
          <el-form :model="logistics">
            <el-row>
              <span class="form-item-title">快递类型</span>
              <el-form-item>
                <el-select v-model="logistics.logisticsItem" placeholder="请选择">
                  <el-option
                    v-for="item in expressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <span class="form-item-title">快递单号</span>
              <el-form-item>
                <el-input v-model="logistics.logisticsNo"></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SearchBarOfAllOrder from './SearchBarOfAllOrder'
  import SearchBarOfWaitPayment from './SearchBarOfWaitPayment'
  import SearchBarOfWaitDelivery from './SearchBarOfWaitDelivery'
  export default {
    data: function () {
      return {
        initSearch: {
          orderState: '',
          pageNo: 1,
          pageSize: 10
        },
        search: {
          orderState: '',
          pageNo: 1,  // 分页器默认开始页码
          pageSize: 10 // 分页器默认分页数量
        },
        tableData: [],  // 表格
        orderId: '',    // 订单ID
        expressOptions: [], // 快递选项
        logisticsList: [], // 物流列表
        orderDetail: {}, // 订单详情
        logistics: {}, // 发货数据
        sendGoodsData: {}, // 提交服务器的发货数据
        total: 0,       // 分页总数
        orderState: '',  // 路由中的订单状态
        dialogVisible: false
      }
    },
    components: {
      'search-bar-all-order': SearchBarOfAllOrder,
      'search-bar-wait-payment': SearchBarOfWaitPayment,
      'search-bar-wait-delivery': SearchBarOfWaitDelivery
    },
    watch: {
      '$route': function (to, from) {
        // 监听路由变化
        this.search = this.initSearch
        this.orderState = to.params.orderState
        this.search.orderState = this.orderState === '0' ? '' : this.orderState
        this.getOrderPage()
      }
    },
    methods: {
      getOrderPage: function () {
        // 获取订单列表
        this.$http.post('/admin/order/getOrderPage', this.qs.stringify(this.search))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableData = res.data.obj.dataList // res.data.obj.dataList => 订单
            this.total = res.data.obj.total // res.data.obj.total => 分页总数
          } else if (res.data.res === 0) {
            this.tableData = []
            this.total = 0
          }
        })
      },
      getOrderById: function () {
        // 获取订单详情
        this.$http.post('/admin/order/getOrderById', this.qs.stringify({
          orderId: this.orderId
        })).then(res => {
          if (res.data.res === 1) {
            this.orderDetail = res.data.obj // res.data.obj => 订单详情
          }
          this.getLogisticsPage() // 获取物流列表
        })
      },
      getLogisticsPage: function () {
        // 获取物流列表
        this.$http.post('/admin/logistics/getLogisticsPage')
        .then(res => {
          if (res.data.res === 1) {
            this.logisticsList = res.data.obj.dataList // res.data.obj.dataList => 物流列表
            this.handleLogisticsList() // 处理物流列表
          } else if (res.data.res === 0) {
            this.$message.error('暂无物流列表')
            this.logisticsList = []
          }
        })
      },
      handleLogisticsList: function () {
        // 处理物流列表
        this.expressOptions = []
        this.logisticsList.forEach(item => {
          this.expressOptions.push({
            value: item.logisticsId,
            label: item.logisticsName
          })
        })
      },
      viewOrderDetail: function (orderId) {
        // 查看订单详情
        this.$router.push(`/admin/order/order-management/order-detail/${orderId}`)
      },
      sendGoods: function (orderId) {
        // 发货
        this.orderId = orderId
        this.logistics = {} // 初始化发货数据
        this.dialogVisible = true // 显示弹窗
        this.getOrderById()  // 获取订单详情
      },
      cancel: function () {
        // 取消
        this.orderId = '' // 初始化订单ID
        this.logistics = {} // 初始化发货数据
        this.dialogVisible = false // 隐藏弹窗
      },
      confirm: function () {
        // 确定
        this.sendGoodsData = {} // 初始化提交数据
        this.sendGoodsData.orderId = this.orderId  // 订单ID
        this.sendGoodsData.sendLogisticsId = this.logistics.logisticsItem.value  // 物流ID
        this.sendGoodsData.sendLogisticsName = this.logistics.logisticsItem.label // 物流名称
        this.sendGoodsData.logisticsNo = this.logistics.logisticsNo  // 快递单号
        this.dialogVisible = false // 隐藏弹窗
        this.$http.post('/admin/order/sendGoods', this.qs.stringify(this.sendGoodsData))
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('发货成功')
            this.getOrderPage() // 重新获取订单列表
          } else {
            this.$message.error('发货失败')
            this.getOrderPage()
          }
        })
      },
      // --------------------------- 分页器的事件 -------------------- //
      handleSizeChange: function (val) {
        // 每页数量改变
        this.search.pageNo = 1 // 初始化页码
        this.search.pageSize = val // 改变每页数量
        this.getOrderPage()
      },
      handleCurrentChange: function (val) {
        // 当前页码改变
        this.search.pageNo = val
        this.getOrderPage()
      },
      // --------------------------- 搜索栏的点击事件 -------------------- //
      getSearchData: function (search) {
        this.search = search
        if (this.orderState !== '0') {
          this.search.orderState = this.orderState
        }
        this.search.pageNo = 1  // 初始化分页器的开始页码
        this.search.pageSize = 10 // 初始化分页器的每页数量
        this.getOrderPage()
      }
    },
    mounted: function () {
      this.orderState = this.$route.params.orderState
      this.search.orderState = this.orderState === '0' ? '' : this.orderState
      this.getOrderPage() // 获取订单列表
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
      /* 表格 */
      .table-module {
        margin-top: 20px;
      }
    }
    /* 分页器 */
    .pagination-module {
      margin-top: 30px;
      text-align: center;
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
      }
    }
    .el-form-item {
      margin: 0;
      display: inline-block;
    }
    /* 发货弹窗 */
    .delivery-form {
      margin-top: 20px;
      .el-row:first-child {
        margin-bottom: 26px;
      }
      .el-row {
        .form-item-title {
          margin-right: 6px;
        }
        .el-input {
          width: 200px;
        }
      }
    }
  }
</style>
