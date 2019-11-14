<!-- 订单管理-详情页 -->
<template>
  <common-tpl class="management-details-wrap" footer back>
    <template slot="main">
      <gray-title title="订单详情"></gray-title>
      <!-- 订单详情 -->
      <div class="order-detalis-wrap">
        <div class="order-line">
          <div class="d-ib va-t red">
            <span>订单状态：</span>
            <span>{{formData.orderStatus | filterOrderStatus}}</span>
          </div>
          <div class="d-ib va-t">
            <span>订单号: </span>
            <span>{{formData.orderNo | filterEmpty}}</span>
          </div>
          <div class="d-ib va-t">
            <span>下单时间:</span>
            <span>{{formData.orderTime | filterDate}}</span>
          </div>
          <div class="d-ib va-t">
            <span>支付时间:</span>
            <span>{{formData.payTime | filterDate}}</span>
          </div>
        </div>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="index" :index="filterIndex" label="序号" width="60">
          </el-table-column>
          <el-table-column label="主图">
            <template slot-scope="scope">
              <div class="thumbnail-wrap">
                <img :src="scope.row.goodsImage | filterImgUrl" class="full-wrap">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="goodsStatus" label="商品状态">
            <template slot-scope="scope">{{scope.row.goodsStatus | filterGoodsStatus}}</template>
          </el-table-column>
          <el-table-column prop="goodsAttribute" label="规格">
            <template slot-scope="scope">{{scope.row.goodsAttribute | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="goodsNum" label="数量">
            <template slot-scope="scope">{{scope.row.goodsNum | filterEmpty}}</template>
          </el-table-column>
          <!-- <el-table-column prop="goodsPrice" label="单价">
            <template slot-scope="scope">{{scope.row.goodsPrice | filterMoney | filterEmpty('元')}}</template>
          </el-table-column> -->
          <el-table-column prop="" label="进货价">
            <template slot-scope="scope">{{scope.row.buyingPrice | filterMoney | filterEmpty('元')}}</template>
          </el-table-column>
          <!-- <el-table-column prop="orderTotalAmount" label="金额小计">
            <template slot-scope="scope">￥{{(scope.row.goodsPrice * scope.row.goodsNum) | numToFixed(2) | filterMoney | filterEmpty('元')}}</template>
          </el-table-column> -->
        </el-table>

        <div class="order-box">
          <div class="ta-r list"><div>进货价合计：￥{{totalPrice | filterMoney | filterEmpty('元')}}</div></div>
          <div class="ta-r list"><div>　　　运费：￥{{formData.logisticsAmount | filterMoney | filterEmpty('元')}}</div></div>
        </div>

        <!-- <div class="order-box">
          <div class="ta-r list"><div>金额合计：￥{{formData.orderAmount | filterMoney | filterEmpty('元')}}</div></div>
          <div class="ta-r list"><div>积分合计：{{formData.usedPoints | filterEmpty}}</div></div>
        </div> -->

        <dl class="pos-r dl-row order-box">
          <dt class="ta-c pos-a">买家留言</dt>
          <dd>{{formData.customerFeedback | filterEmpty}}</dd>
        </dl>

        <!-- <div class="order-box">
          <div class="ta-r list"><div>运　　费：￥{{formData.logisticsAmount | filterMoney | filterEmpty('元')}}</div></div>
          <div class="ta-r list"><div>实 收 款： ￥<span>{{formData.orderTotalAmount | filterMoney | filterEmpty('元')}}</span></div></div>
          <div class="ta-r list"><div>实收积分：{{formData.usedPoints | filterEmpty}}</div></div>
        </div> -->

        <!-- <div class="order-box">
          <h3 class="ta-r">合计：￥{{formData.orderAmount}}元</h3>
          <h3 class="ta-r">运费：￥{{formData.logisticsAmount}}元</h3>
          <h3 class="ta-r">实收款：￥<span>{{formData.orderTotalAmount}}元</span></h3>
        </div> -->
      </div>

      <!-- 买家信息 -->
      <div class="logistics-infor-wrap">
        <h2>买家信息</h2>
        <table>
          <tr>
            <td>买家姓名</td>
            <td>{{formData.cardName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>买家手机号</td>
            <td>{{formData.phone | filterEmpty}}</td>
          </tr>
        </table>
      </div>

      <!-- 物流信息 -->
      <div class="logistics-infor-wrap">
        <h2>物流信息</h2>
        <table>
          <tr>
            <td>收件人</td>
            <td>{{formData.customerName}}</td>
          </tr>
          <tr>
            <td>联系方式</td>
            <td>{{formData.customerPhone}}</td>
          </tr>
          <tr>
            <td>收件人地址</td>
            <td>{{formData.customerAddress}}</td>
          </tr>
          <!-- <tr>
            <td>发货状态</td>
            <td>{{formData.orderStatus | filterOrderStatus}}</td>
          </tr> -->
          <tr>
            <td>发货时间</td>
            <td>{{formData.sendGoodsTime | filterDate}}</td>
          </tr>
          <!-- <tr>
            <td>收货状态</td>
            <td>{{formData.confirmStatus | filterConfirmStatus}}</td>
          </tr> -->
          <tr>
            <td>物流单号</td>
            <td>{{formData.logisticsNumber | filterEmpty}}</td>
          </tr>
        </table>
      </div>

      <!-- 发货 -->
      <el-dialog
        title="发货" :visible.sync="deliverHandle" width="30%">
        <div class="order-info">
          <span>{{formData.customerName}}</span>
          <span>{{formData.customerPhone}}</span>
          <div class="msg">{{formData.customerAddress}}</div>
        </div>
        <div class="order-express">
          <el-form :model="sendData" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="快递类型：" prop="sendLogisticsId">
              <el-select v-model="sendData.sendLogisticsId" placeholder="请选择快递" @change="handleSelect">
                <template v-for="item in sendList">
                  <el-option :label="item.logisticsName" :value="item.id">
                    <template>{{item.logisticsName}}</template>
                  </el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item label="快递单号：" prop="logisticsNumber">
              <el-input v-model="sendData.logisticsNumber" maxlength="50" placeholder="请输入物流单号，限50个字符" class="number" clearable></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deliverHandle = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button v-if="formData.orderStatus === 2" type="primary" @click="handleSend">发货</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      orderId: null,
      pageType: 1,              // 页面类型 [1待付款，2 待发货，3 待收货，4 待评价，5 已完成，6 平台关闭 ，7 取消订单]
      formData: {},
      totalPrice: 0,            // 价格合计
      rules: {
        sendLogisticsId: [{ required: true, message: '请选择快递类型', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '请输入快递单号', trigger: 'change' }]
        // number: [{ required: true, validator: validateCode, trigger: 'change' }]
      },
      // 列表数据
      tableData: [],
      sendList: [],             // 发货物流列表
      sendData: {               // 发货物流信息
        sendLogisticsId: '',
        sendLogisticsNo: '',        // 物流公司编号
        sendLogisticsName: '',
        logisticsNumber: ''
      },
      deliverHandle: false,     // 发货
      // 分页操作
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 50
      },
      userInfo: {}              // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.orderId = parseInt(this.$route.query.id)
    this.pageData.currentPage = this.$route.query.page || 1
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/order/getOrderDetail', {
        orderId: this.orderId
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.formData = resData.data
        this.tableData = this.formData.orderDetailGoodsDtoList
        this.tableData.forEach((row) => {
          this.totalPrice += (row.buyingPrice * row.goodsNum)
        })
      })
    },

    /**
     * 点击发货
     */
    handleSend () {
      this.deliverHandle = true
      this.$http.get('@ROOT_API/orderLogistics/getLogisticsCompanyList', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.sendList = resData.data
      })
    },

    /**
     * 选取快递
     */
    handleSelect (val) {
      let filterRes = this.sendList.filter(item => item.id === val)
      this.sendData.sendLogisticsName = filterRes[0].logisticsName
      this.sendData.sendLogisticsNo = filterRes[0].logisticsNo
    },

    /**
     * 过滤索引
     */
    filterIndex (index) {
      return parseInt((this.pageData.currentPage - 1) * 10) + index + 1
    },

    /**
     * 提交发货
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/orderLogistics/saveOrderLogistics', {
          shopId: this.userInfo.shopId,                   // 是 int 商城Id
          orderId: this.orderId,                          // 是 int 订单ID
          orderNo: this.formData.orderNo,                 // 是 String 订单编号
          logisticsNo: this.sendData.sendLogisticsNo,     // 是 String 物流公司编号
          logisticsNumber: this.sendData.logisticsNumber, // 是 String 物流运单号
          logisticsName: this.sendData.sendLogisticsName  // 是 String 物流公司名称
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
            duration: 1000
          })
          this.$router.back()
        })
      })
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
    .order-line{
      height: 45px;
      line-height: 45px;
      padding-left: 100px;

      div{
        margin-right: 10px;
      }

      span{
        margin-left: 5px;
      }

      .red{
        color: red;
      }
    }

    .order-box{
      border: 1px solid #eee;
      border-bottom: none;
      border-top: none;

      .list{
        font-size: 14px;
        font-weight: normal;
        border-bottom: 1px solid #eee;
        line-height: 35px;
        padding-right: 50px;
  
        div{
          width: 280px;
          text-align: left;
          display: inline-block;
        }

        span{
          color: red;
          font-size: 18px;
        }
      }
    }

    .dl-row{
      height: 36px;
      line-height: 36px;
      border-bottom: 1px solid #eee;
      padding-left: 150px;

      dt{
        width: 120px;
        border-right: 1px solid #eee;
        left: 0;
      }
    }

    .el-table{
      border: 1px solid #eee;
      border-bottom: none;

      .thumbnail-wrap{
        width: 60px;
        height: 60px;
      }
    }
  }

  /*----------物流信息----------*/

  .logistics-infor-wrap{
    h2{
      margin: 20px 0;
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
          border: 1px solid #ebeef5;
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
        height: auto;
        font-size: 14px;
        padding: 0 20px;
        border-bottom: 1px solid #eee;

        span{
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }

        .msg{
          word-break: break-all;
          padding-bottom: 10px;
        }
      }

      .order-express{
        padding: 20px 0 0 0;

        .number{
          width: 46%;
        }

        .el-select, .el-input{
          width: 230px;
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
