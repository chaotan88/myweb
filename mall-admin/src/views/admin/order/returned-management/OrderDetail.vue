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
            <span class="detail-attribute">订单状态：<span>{{ orderDetail.refundState | refundStateFilter }}</span></span>
            <span class="detail-attribute">订单编号：<span>{{ orderDetail.orderNo }}</span></span>
            <span class="detail-attribute">申请时间：<span>{{ orderDetail.refundApplyTime | dateFilter }}</span></span>
          </div>
          <el-table :data="tableData" border>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="主图">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage | filterImgUrl" alt="商品主图" style="width: 80px; height: 80px">
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="商品编码"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.refundState | refundStateFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column label="规格">
              <template slot-scope="scope">
                <span>{{ scope.row.goodsAttribute }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="goodNum" label="数量"></el-table-column>
            <el-table-column label="单价">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.goodsPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="运费">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.refundFreightPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="金额小计">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.reundGoodsPrice }}</span>
              </template>
            </el-table-column>
            <el-table-column label="申请退款金额">
              <template slot-scope="scope">
                <span>¥</span>
                <span>{{ scope.row.refundPrice }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="data-wrap">
            <span>退款金额：</span>
            <span class="dollar-sign">¥</span>
            <span class="dollar-number">{{ orderDetail.refundPrice }}</span>
          </div>
        </div>
      </div>
      <div class="column-wrap">
        <!-- 栏目标题 -->
        <div class="column-title">
          <span>退款信息</span>
        </div>
        <!-- 栏目内容 -->
        <div class="column-content clear-float">
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">收款人</span>
              <span class="item-value">{{ orderDetail.customerName }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">退款原因</span>
              <span class="item-value">{{ orderDetail.refundReason }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">备注说明</span>
              <span class="item-value">{{ orderDetail.refundRemarks }}</span>
            </li>
          </ul>
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">联系方式</span>
              <span class="item-value">{{ orderDetail.customerPhone }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">退款方式</span>
              <span class="item-value"></span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute"></span>
              <span class="item-value"></span>
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
              <span class="item-attribute">发货物流</span>
              <span class="item-value">未发货</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">退货物流</span>
              <span class="item-value">--</span>
            </li>
          </ul>
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">发货物流单号</span>
              <span class="item-value">--</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">退货物流单号</span>
              <span class="item-value">--</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 功能按钮组 -->
      <div class="button-group">
        <el-button v-if="orderDetail.refundState === '1'">退款</el-button>
        <el-button @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { api } from '../../../../../config/utils.js'
  export default {
    data: function () {
      return {
        tableData: [],
        orderDetail: {}, // 退款订单
        refundOrderId: '',
        api: api
      }
    },
    methods: {
      getRefundOrder: function () {
        // 获取退款订单详情
        this.$http.post('/admin/refundOrder/getRefundOrder', this.qs.stringify({
          refundOrderId: this.refundOrderId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.orderDetail = res.data.obj // res.data.obj => 退款订单
            this.tableData.push(res.data.obj)
          }
        })
      },
      close: function () {
        // 关闭
        this.$router.go(-1)
      }
    },
    mounted: function () {
      this.refundOrderId = this.$route.params.refundOrderId
      this.getRefundOrder()
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
          .data-wrap {
            text-align: right;
            margin-top: 30px;
            padding-right: 30px;
            .dollar-sign, .dollar-number {
              color: red;
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
          margin-right: 118px;
        }
      }
    }
  }
</style>
