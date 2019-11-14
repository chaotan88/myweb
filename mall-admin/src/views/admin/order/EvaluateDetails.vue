<!-- 订单管理-详情页 -->
<template>
  <common-tpl class="management-details-wrap" :back="true">
    <template slot="main">

      <gray-title title="评价信息"></gray-title>

      <!-- 订单详情 -->
      <div class="logistics-infor-wrap">
        <div class="order-line">
          <div class="d-ib">
            <span>订单编号: </span>
            <span>{{formData.orderNo}}</span>
          </div>
          <div class="d-ib">
            <span>评价时间: </span>
            <span>{{formData.createTime | filterDate}}</span>
          </div>
          <div class="d-ib">
            <span>下单时间:</span>
            <span>{{formData.orderCreateTime | filterDate}}</span>
          </div>
        </div>
        <table>
          <tr>
            <td>买家</td>
            <td>{{formData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>联系方式</td>
            <td>{{formData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>评价类型</td>
            <td>{{formData.commentType | filterEvaluateStatus}}</td>
          </tr>
          <tr>
            <td>评价留言</td>
            <td>{{formData.commentContent}}</td>
          </tr>
          <tr>
            <td>评价图片</td>
            <td>
              <a :href="item | filterImgUrl" target="_blank" title="点击查看大图" v-for="item in formData.commentImage" v-if="formData.commentImage.length">
                <img style="width: 60px; height: 60px;" :src="item | filterImgUrl">
              </a>
              <template v-else>{{item | filterEmpty}}</template>
            </td>
          </tr>
        </table>
      </div>

      <!-- 商品详情 -->
      <div class="order-detalis-wrap">
        <h2>商品详情</h2>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" :index="filterIndex" label="序号" width="60"></el-table-column>
          <el-table-column prop="goodsImage" label="主图">
            <template slot-scope="scope">
              <a :href="item | filterImgUrl" target="_blank" title="点击查看大图" v-for="item in scope.row.commentImage" v-if="scope.row.commentImage.length">
                <img style="width: 60px; height: 60px;" :src="scope.row.commentImage | filterImgUrl">
              </a>
              <template v-else>{{'' | filterEmpty}}</template>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="goodsAttribute" label="规格">
            <template slot-scope="scope">{{scope.row.goodsAttribute | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="单价">
            <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney | filterEmpty('元')}}</template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      // 列表数据
      tableData: [{
        number: '65968446498498',                   // 商品编码
        name: 'Kindle Paperwhite 新款升级版6英寸',  // 商品名称
        province: '黑色，16G',                      // 规格
        city: '¥1000.00'                            // 单价
      }],

      // 评价信息
      formData: {
        name: '李宝贵',                            // 发货人姓名
        phone: '13613088572',                      // 联系方式
        adress: '好评',                            // 评价类型
        region: '不错的购物体验',                  // 评价留言
        number: ''                                 // 评价图片
      },
      // orderNo: '',                    // 订单编号
      // commentType: '',                // 评论类型

      // 分页操作
      pageData: {
        currentPage: 1,
        pageSize: 100,
        total: 50
      }
    }
  },
  mounted () {
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.tableData[0] = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'CommonDetails'))
    this.tableData.forEach((row) => {
      if (row.commentImage.toString().indexOf(',') !== -1) {
        row.commentImage = row.commentImage.split(',')
      } else {
        row.commentImage = row.commentImage ? [row.commentImage] : []
      }
    })
    this.formData = this.tableData[0]
  },
  methods: {
    /**
     * 过滤索引
     */
    filterIndex (index) {
      return parseInt((this.pageData.currentPage - 1) * 10) + index + 1
    }
  }
}
</script>

<style lang="less" scoped>
.management-details-wrap{
  h2{
    padding-left: 20px;
    font-size: 18px;
    font-weight: normal;
    width: 100px;
    color: #333;
    border-left: 3px solid #ccc;
    margin: 20px 0;

  }

  /*----------订单详情----------*/
  .order-detalis-wrap{

    h2{
      margin: 20px 0;
    }

    .order-box{
      border: 1px solid #eee;
      border-bottom: none;
      border-top: none;
      h3{
        font-size: 14px;
        font-weight: normal;
        border-bottom: 1px solid #eee;
        line-height: 35px;
        padding-right: 50px;
      }
    }

    .el-table{
      border: 1px solid #eee;
      border-bottom: none;
    }
  }

  /*----------物流信息----------*/

  .logistics-infor-wrap{
    .order-line{
      height: 45px;
      line-height: 45px;
      padding-left: 100px;

      span{
        margin-left: 20px;
      }

      .red{
        color: red;
      }
    }

    table{
      width: 100%;
      border-collapse: collapse;

      tr{
        width: 100%;
        overflow: hidden;
        td{
          color: #666;
          height: 35px;
          line-height: 35px;
          border: 1px solid #ddd;
          padding: 10px;
          overflow: hidden;
        }

        td:nth-child(1){
          width: 150px;
          text-align: right;
          padding-right: 20px;
          background: #eef1f9;
        }

        td:nth-child(2){
          padding-left: 20px;
        }
      }
    }
  }

  /*----------按钮--------------*/

  .bottom-wrap{
    left: 0;
    bottom: -80px;
  }

   /*----------------发货----------*/
  .el-dialog{
    .el-dialog__body{
      text-align: left !important;

      .order-info{
        padding: 0 20px;
        border-bottom: 1px solid #eee;
        span{
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }
      }

      .order-express{
        padding: 20px 0 0 0;

        .number{
          width: 46%;
        }
      }
    }

    .el-dialog__footer{
      .el-button{
        border-radius: 3px;
        border-color: none;
      }
    }
  }
}

</style>

<style lang="less">
  .management-details-wrap{
    .el-dialog__body{
      text-align: left !important;
    }
  }
</style>
