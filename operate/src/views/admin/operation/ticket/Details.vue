<!-- 订单管理-详情页 -->
<template>
  <common-tpl class="operation-ticket-details-wrap" footer back>
    <template slot="main">

      <!-- 订单详情 -->
      <div class="logistics-infor-wrap">
        <h2>订单信息</h2>
        <table>
          <tr>
            <td>支付状态</td>
            <td>{{detailsData.payStatus | filterPayStatus}}</td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td>{{detailsData.payType | filterPayType}}</td>
          </tr>
          <tr>
            <td>下单时间</td>
            <td>{{detailsData.orderTime | filterDate}}</td>
          </tr>
          <tr>
            <td>门票售价</td>
            <td>{{detailsData.ticketPrice ? '¥' : ''}}{{detailsData.ticketPrice | filterMoney | filterEmpty}}</td>
          </tr>
          <tr>
            <td>购买数量</td>
            <td>{{detailsData.ticketNum | filterEmpty}}</td>
          </tr>
          <tr>
            <td>入场码</td>
            <td>
              <template v-if="detailsData.ticketNo">{{detailsData.ticketNo.join(', ')}}</template>
              <template v-else>{{'' | filterEmpty}}</template>
            </td>
          </tr>
          <tr>
            <td>实收金额</td>
            <td>{{detailsData.totalAmount ? '¥' : ''}}{{detailsData.totalAmount | filterMoney | filterEmpty}}</td>
          </tr>
        </table>
      </div>

      <!-- 买家信息 -->
      <div class="logistics-infor-wrap">
        <h2>买家信息</h2>
        <table>
          <tr>
            <td>买家姓名</td>
            <td>{{detailsData.userName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>买家手机号</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
        </table>
      </div>

      <!-- 会议信息 -->
      <div class="logistics-infor-wrap">
        <h2>会议信息</h2>
        <table>
          <tr>
            <td>会议名称</td>
            <td>{{detailsData.meetingName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>所属地区</td>
            <td>{{detailsData.region | filterEmpty}}</td>
          </tr>
          <tr>
            <td>开始时间</td>
            <td>{{detailsData.beginTime | filterDate}}</td>
          </tr>
          <tr>
            <td>结束时间</td>
            <td>{{detailsData.endTime | filterDate}}</td>
          </tr>
          <tr>
            <td>状态</td>
            <td>{{detailsData.ticketStatus | filterTicketStatus}}</td>
          </tr>
          <tr>
            <td>获得积分类型</td>
            <td>{{detailsData.getPointType | filterSourceType}}
              {{(detailsData.getPointType === 4 ? detailsData.getServicePoints : detailsData.getBonusPoints) | filterEmpty('个')}}
            </td>
          </tr>
        </table>
      </div>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      orderId: null,
      pageType: 1,              // 页面类型 [1待付款，2 待发货，3 待收货，4 待评价，5 已完成，6 平台关闭 ，7 取消订单]
      moduleType: 1,            // 模块类型 [1、订单，2，审核]
      rules: {
        sendLogisticsId: [{ required: true, message: '请选择快递类型', trigger: 'change' }],
        logisticsNumber: [{ required: true, message: '请输入快递单号', trigger: 'change' }]
        // number: [{ required: true, validator: validateCode, trigger: 'change' }]
      },
      detailsData: {},          // 详情数据
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
    if (this.$route.path.match(/finance/gi)) this.moduleType = 2
    this.orderId = parseInt(this.$route.query.id)
    this.pageData.currentPage = this.$route.query.page || 1
    if (this.orderId) this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsData () {
      this.$http.get('@ROOT_API/meetingTicketOrder/getMeetingTicketOrderDetail', {
        params: {
          ticketOrderId: this.orderId
        }
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
        let results = resData.data
        if (!results) return false
        let region = []
        if (results.province) region.push(results.province)
        if (results.city) region.push(results.city)
        if (results.zone) region.push(results.zone)
        results.region = region.join(',')
        this.detailsData = results
      })
    }
  }
}
</script>

<style lang="less" scoped>
.operation-ticket-details-wrap{
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
        padding-left: 30px;
  
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
        line-height: 60px;
      }
    }
  }

  /*---------- 订单详情 ----------*/

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
  .operation-ticket-details-wrap{
    .el-dialog__body{
      text-align: left !important;
    }
  }
</style>
