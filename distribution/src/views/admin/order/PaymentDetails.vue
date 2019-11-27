<!-- 共用详情页 -->
<template>
  <common-tpl class="order-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <gray-title title="订单信息" class="ta-l title"></gray-title>
        <table>
          <tr>
            <td>订单状态：</td>
            <td>{{detailsData.orderStatus | filterOrderStatus}}</td>
          </tr>
          <tr>
            <td>订单号：</td>
            <td>{{detailsData.orderNo | filterEmpty}}</td>
          </tr>
          <tr>
            <td>下单时间：</td>
            <td>{{detailsData.orderTime | filterDate}}</td>
          </tr>
          <tr>
            <td>支付时间：</td>
            <td>{{detailsData.payTime | filterDate}}</td>
          </tr>
        </table>

        <el-table border :data="tableData" style="width: 100%" :summary-method="getSummaries" show-summary>
          <el-table-column
            type="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column prop="mainImageUrl" label="主图">
            <template slot-scope="scope">
              <img :src="scope.row.mainImageUrl | filterImgUrl">
            </template>
          </el-table-column>
          <el-table-column prop="setMealNumber" label="套餐编码" width="180">
            <template slot-scope="scope">{{scope.row.setMealNumber | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="setMealName" label="套餐名称" min-width="120">
            <template slot-scope="scope">{{scope.row.setMealName | filterEmpty}}</template>
          </el-table-column>
          <el-table-column prop="setMealStatus" label="套餐状态">
            <template slot-scope="scope">{{scope.row.setMealStatus | filterMealStatus}}</template>
          </el-table-column>
          <el-table-column prop="setMealPrice" label="套餐价">
            <template slot-scope="scope">{{scope.row.setMealPrice | filterMoney}}</template>
          </el-table-column>
          <div slot="empty">
            <no-data></no-data>
          </div>
        </el-table>

        <gray-title title="买家信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>买家姓名：</td>
            <td>{{detailsData.userName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>买家手机号：</td>
            <td>{{detailsData.phone | filterEmpty}}</td>
          </tr>
        </table>
        <gray-title title="物流信息" class="ta-l"></gray-title>
        <table>
          <tr>
            <td>收件人：</td>
            <td v-if="detailsData.orderStatus === 2">
              <el-input v-model="formData.customerName" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>联系方式：</td>
            <td v-if="detailsData.orderStatus === 2">
              <el-input v-model="formData.customerPhone" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerPhone | filterEmpty}}</td>
          </tr>
          <tr>
            <td>收件人地址：</td>
            <td v-if="detailsData.orderStatus === 2">
              <el-input v-model="formData.customerAddress" clearable></el-input>
            </td>
            <td v-else>{{detailsData.customerAddress | filterEmpty}}</td>
          </tr>
          <tr>
            <td>发货时间：</td>
            <td v-if="detailsData.orderStatus === 2">
              {{new Date() | filterDate}}
            </td>
            <td v-else>{{detailsData.sendGoodsTime | filterDate}}</td>
          </tr>
          <tr>
            <td>快递类型：</td>
            <td v-if="detailsData.orderStatus === 2">
              <!-- <el-input v-model="formData.logisticsName" clearable></el-input> -->
              <el-select v-model="formData.logisticsName" size="medium" class="year-box"
                placeholder="选择快递类型">
                <el-option :label="logistics.logisticsName" :value="logistics.logisticsName" :key="index" v-for="(logistics, index) in logisticsList"></el-option>
              </el-select>
            </td>
            <td v-else>{{detailsData.logisticsName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>物流单号：</td>
            <td v-if="detailsData.orderStatus === 2">
              <el-input v-model="formData.logisticsNumber" clearable></el-input>
            </td>
            <td v-else>{{detailsData.logisticsNumber | filterEmpty}}</td>
          </tr>
        </table>

      </div>
    </template>

    <template slot="other">
      <!-- 添加/编辑 -->
      <el-dialog class="dialog-left"
        title="发货"
        :visible.sync="passVisible"
        width="500px">
        <div class="ta-l view-authinfo-wrap">
          <template>
            <el-form :model="addForm" :rules="rules" ref="addForm" label-position="right" label-width='120px'>
              <div>{{formData.customerPhone}}&nbsp;&nbsp;{{formData.customerName}}</div>
              <div>{{formData.customerAddress}}</div>
              <el-form-item inline label='快递类型：' prop='useType' class="address-wrap">
                <el-select v-model="addForm.useType" size="medium" class="year-box"
                  placeholder="请选择">
                  <el-option :label="item.label" :value="item.value" :key="index" v-for="(item, index) in uses"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item inline label='快递单号：' prop='description'>
                <el-input style="width: 200px;" placeholder='限20个字符,不含特殊字符' v-model="addForm.description"></el-input>
              </el-form-item>
              <div class="ta-c btn-wrap">
                <el-button type="primary" class='confirm-btn' @click="submitForm('addForm')">确定</el-button>
              </div>
            </el-form>
          </template>
        </div>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <template v-if="parseInt(detailsData.orderStatus) === 2">
        <el-button type="primary" @click="passVisible = true">发货</el-button>
      </template>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      formData: {
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        logisticsName: '',
        logisticsNo: '',
        logisticsNumber: ''
      },
      addForm: {},
      uses: [],
      rules: {},
      orderId: '',              // 申请id
      detailsData: {},          // 详情数据
      fxUserInfo: {},           // 用户信息
      passVisible: false,        // 发货弹窗
      tableData: [],
      logisticsList: []
    }
  },
  mounted () {
    this.orderId = parseInt(this.$route.query.id) || ''
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getLogisticsCompanylist()
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/meal/getSetMealOrderDetails', {
        params: {
          orderId: this.orderId          // long  申请ID
        }
      }).then(res => {
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
        if (results) {
          this.tableData = []
          this.tableData.push({
            mainImageUrl: results.mainImageUrl,
            setMealNumber: results.setMealNumber,
            setMealName: results.setMealName,
            setMealStatus: results.setMealStatus,
            setMealPrice: results.setMealPrice
          })
          this.detailsData = results
          this.detailsData.orderStatus = 2
        }
      })
    },
    submitForm () {},
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index < 4) return ''
        if (index === 4) {
          sums[index] = '实收金额合计:'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ' 元'
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    },
    getLogisticsCompanylist () {
      this.$http.get('@ROOT_API/meal/getLogisticsCompanylist', {}).then(res => {
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
        this.logisticsList = results || []
      })
    }
  }
}
</script>

<style lang="less" scoped>
.order-detail-wrap{
  
  .admin-gray-title{
    margin-bottom: 0;
  }

  .goods-common-details{

    table{
      width: 100%;
      border: 1px;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        font-size: 14px;
        padding: 10px;
        border: 1px solid #eee;
      }

      td:nth-child(odd) {
        width: 160px;
        text-align: right;
        border-right: none;
      }

      td:nth-child(even) {
        color: #999;
        border-left: none;
      }

    }

    .thumbnail-wrap{
      width: 100px;
      height: 100px;
      margin-right: 10px;
    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
    .el-input {
      width: 200px;
    }
  }
  .el-table {
    margin-bottom: 20px;
  }
}
</style>
<style lang="less">
.order-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
      .btn-wrap {
        padding-bottom: 20px;
      }
    }
  }
}
</style>
