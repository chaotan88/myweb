<template>
  <div class="order-detail-wrap">
    <div class="content-wrap">
      <div class="column-wrap">
        <!-- 栏目标题 -->
        <div class="column-title">
          <span>订单详情</span>
        </div>
        <!-- 栏目内容 -->
        <div class="column-content">
          <div class="order-detail">
            <span class="detail-attribute">订单状态：<span>{{ orderDetail.orderState | orderStateFilter }}</span></span>
            <span class="detail-attribute">订单编号：<span>{{ orderDetail.orderNo }}</span></span>
            <span class="detail-attribute">下单时间：<span>{{ orderDetail.createTime | dateFilter }}</span></span>
            <span class="detail-attribute">支付时间：<span>{{ orderDetail.createTime | dateFilter }}</span></span>
          </div>
          <el-table :data="orderDetail.orderDetailList" border>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="主图">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage | filterImgUrl" alt="商品主图" style="width: 80px; height: 80px">
              </template>
            </el-table-column>
            <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column label="商品状态">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsState | goodsStateFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodsAttribute" label="规格"></el-table-column>
            <el-table-column prop="goodsNum" label="数量"></el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.goodsPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额小计">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.goodsTotalPrice }}</span>
              </template>
            </el-table-column>
          </el-table>
          <p class="buyer-message">
            <span>买家留言：</span>
            <span>{{ orderDetail.customerFeedback }}</span>
          </p>
          <ul class="total-statistic-wrap">
            <li class="statistic-list-item clear-float">
              <span class="data-wrap">
                <span>合计：</span>
                <span>￥</span>
                <span>{{ orderDetail.orderAmount }}</span>
              </span>
            </li>
            <li class="statistic-list-item clear-float">
              <span class="data-wrap">
                <span>运费：</span>
                <span>￥</span>
                <span>{{ orderDetail.freight | filterMoney | filterEmpty('元') }}</span>
              </span>
            </li>
            <li class="statistic-list-item clear-float">
              <span class="data-wrap">
                <span>实收款 ：</span>
                <span class="dollar-sign">￥</span>
                <span class="dollar-number">{{ orderDetail.orderTotalAmount | filterMoney | filterEmpty('元') }}</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="column-wrap">
        <!-- 栏目标题 -->
        <div class="column-title">
          <span>物流信息</span>
        </div>
        <!-- 栏目内容 -->
        <div class="column-content clear-float">
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">收件人</span>
              <span class="item-value">{{ orderDetail.customerName }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">收件地址</span>
              <span class="item-value">{{ orderDetail.customerAddress }}</span>
            </li>
            <!-- <li class="list-item clear-float">
              <span class="item-attribute">发货状态</span>
              <span class="item-value">{{ orderDetail.orderState }}</span>
            </li> -->
            <li class="list-item clear-float">
              <span class="item-attribute">收货状态</span>
              <span class="item-value" v-if="orderDetail.confirmTime">已收货</span>
            </li>
          </ul>
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">联系方式</span>
              <span class="item-value">{{ orderDetail.customerPhone }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">发货时间</span>
              <span class="item-value">{{ orderDetail.sendGoodsTime }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">物流单号</span>
              <span class="item-value">{{ orderDetail.logisticsNo}}</span>
            </li>
            <!-- <li class="list-item clear-float">
              <span class="item-attribute"></span>
              <span class="item-value"></span>
            </li> -->
          </ul>
        </div>
      </div>
      <!-- 功能按钮组 -->
      <div class="button-group">
        <el-button v-if="orderDetail.orderState === '2'" @click="sendGoods(orderDetail.orderId)">发货</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
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
  export default {
    data: function () {
      return {
        orderId: '',
        orderDetail: {},
        expressOptions: [], // 快递选项
        logistics: {}, // 发货数据
        sendGoodsData: {}, // 提交服务器的发货数据
        logisticsList: [], // 物流列表
        dialogVisible: false
      }
    },
    methods: {
      getOrderById: function () {
        // 获取订单详情
        this.$http.post('/admin/order/getOrderById', this.qs.stringify({
          orderId: this.orderId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.orderDetail = res.data.obj // res.data.obj => 订单
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
            this.getOrderById()
          } else {
            this.$message.error('发货失败')
          }
        })
      },
      close: function () {
        // 关闭
        this.$router.go(-1)
      },
      sendGoods: function (orderId) {
        // 发货
        this.orderId = orderId
        this.logistics = {} // 初始化发货数据
        this.dialogVisible = true // 显示弹窗
        this.getOrderById()  // 获取订单详情
      }
    },
    mounted: function () {
      this.orderId = this.$route.params.orderId
      this.getOrderById()
    }
  }
</script>

<style lang="less" scoped>
  .order-detail-wrap {
    .content-wrap {
      background-color: rgb(255, 255, 255);
      padding-top: 30px;
      padding-left: 20px;
      .column-wrap {
        margin-bottom: 20px;
        .column-title {
          height: 26px;
          line-height: 26px;
          margin-left: 20px;
          border-bottom: 1px solid rgb(204, 204, 204);
        }
        .column-content {
          .order-detail {
            margin-left: 96px;
            line-height: 40px;
            .detail-attribute {
              font-size: 14px;
              margin-right: 36px;
            }
            .detail-attribute:first-child {
              color: red;
            }
          }
          .list-wrap {
            width: 50%;
            margin-top: 30px;
            border: 1px solid rgb(204, 204, 204);
            float: left;
            box-sizing: border-box;
            font-size: 14px;
            .list-item {
              line-height: 40px;
              border-bottom: 1px solid rgb(204, 204, 204);
              span {
                display: block;
                float: left;
              }
              .item-attribute {
                width: 33%;
                height: 40px;
                border-right: 1px solid rgb(204, 204, 204);
                box-sizing: border-box;
                text-align: center;
                line-height: 40px;
                background-color: rgb(242, 242, 242);
              }
              .item-value {
                width: 67%;
              }
            }
            .list-item:last-child {
              border-bottom: 0;
            }
          }
          .list-wrap:first-child {
            border-right: 0;
          }
          .buyer-message {
            font-size: 14px;
            line-height: 46px;
          }
          .total-statistic-wrap {
            border: 1px solid rgb(204, 204, 204);
            .statistic-list-item {
              height: 40px;
              line-height: 40px;
              padding-right: 110px;
              border-bottom: 1px solid rgb(204, 204, 204);
              .data-wrap {
                float: right;
                font-size: 14px;
                .dollar-sign, .dollar-number {
                  color: rgb(255, 0, 0);
                }
              }
            }
            .statistic-list-item:last-child {
              border-bottom: 0;
            }
          }
        }
      }
      .column-wrap:before {
        content: '';
        display: block;
        width: 10px;
        height: 26px;
        background-color: rgb(153, 153, 153);
        float: left;
      }
      .column-wrap:last-child {
        padding-bottom: 120px;
      }
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
  .order-detail-wrap {
    .content-wrap {
      .button-group {
        margin-top: 50px;
        .el-button {
          width: 120px;
          padding: 0;
          height: 40px;
          background-color: rgb(242, 242, 242);
          border-color: rgb(204, 204, 204);
          color: rgb(51, 51, 51);
          border-radius: 0;
          margin-right: 24px;
        }
      }
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
