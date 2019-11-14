<template>
  <div class="order-detail-wrap">
    <div class="content-wrap">
      <div class="column-wrap">
        <!-- 栏目标题 -->
        <div class="column-title">
          <span>评价信息</span>
        </div>
        <!-- 栏目内容 -->
        <div class="column-content clear-float">
          <div class="order-detail">
            <span class="detail-attribute">评价时间：<span>{{ orderDetail.createTime | dateFilter }}</span></span>
            <span class="detail-attribute">下单时间：<span>{{ orderDetail.orderCreateTime }}</span></span>
          </div>
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">买家</span>
              <span class="item-value">{{ orderDetail.customerName }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">评价类型</span>
              <span class="item-value">{{ orderDetail.commentType | commentTypeFilter }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">评价留言</span>
              <span class="item-value">{{ orderDetail.commentContent }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute">评价图片</span>
              <span class="item-value">图片</span>
            </li>
          </ul>
          <ul class="list-wrap">
            <li class="list-item clear-float">
              <span class="item-attribute">联系方式</span>
              <span class="item-value">{{ orderDetail.customerPhone }}</span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute"></span>
              <span class="item-value">
                <!-- <el-rate
                  v-model="value5"
                  disabled
                  text-color="#ff9900">
                </el-rate> -->
              </span>
            </li>
            <li class="list-item clear-float">
              <span class="item-attribute"></span>
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
          <span>商品详情</span>
        </div>
        <!-- 栏目内容 -->
        <div class="column-content">
          <el-table :data="tableData" border style="margin-top: 20px">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="主图">
              <template slot-scope="scope">
                <img :src="scope.row.goodsImage | filterImgUrl" alt="商品主图" style="width: 80px; height: 80px">
              </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="商品编码"></el-table-column>
            <el-table-column prop="goodsName" label="商品名称"></el-table-column>
            <el-table-column prop="goodsAttribute" label="规格"></el-table-column>
            <el-table-column prop="goodsPrice" label="单价"></el-table-column>
          </el-table>
        </div>
      </div>
      <!-- 功能按钮组 -->
      <div class="button-group">
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
        orderDetail: {},
        tableData: [],
        commentId: '',
        api: api
      }
    },
    methods: {
      getCommentById: function () {
        // 获取订单详情
        this.$http.post('/admin/comment/getCommentById', this.qs.stringify({
          commentId: this.commentId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.orderDetail = res.data.obj
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
      this.commentId = this.$route.params.commentId
      this.getCommentById()
    }
  }
</script>

<style lang="less" scoped>
  .order-detail-wrap {
    .content-wrap {
      background-color: rgb(255, 255, 255);
      padding-top: 30px;
      padding-left: 20px;
      height: 800px;
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
          }
          .list-wrap {
            width: 50%;
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
      .el-rate {
        position: relative;
        top: 10px;
      }
    }
  }
</style>
