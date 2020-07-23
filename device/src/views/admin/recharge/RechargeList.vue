<template>
  <div class="recharge-index-wrap">
    <div class="recharge-index-con">
      <div class="recharge-index-serch">
        <el-input  :placeholder="$t('recharge.pleaseEnterPhoneNumber')" v-model="condition" clearable></el-input>
        <el-button @click="findData()">{{$t("common.search")}}</el-button>
        <el-button @click="exportData()">{{$t("common.export")}}</el-button>
      </div>
      <el-table
        :data="itemList"
        style="width: 100%">
        <el-table-column
          type="index"
          :label="$t('common.index')"
          width="90">
        </el-table-column>
        <!-- <el-table-column
          prop="phone"
          :label="$t('recharge.memberMobileNumber')"
          width="200">
        </el-table-column> -->
        <el-table-column
          prop="orderNo"
          :label="$t('recharge.orderNo')" width="210">
        </el-table-column>
        <el-table-column
          prop="deviceNumber"
          :label="$t('recharge.deviceNumber')" width="140">
        </el-table-column>
        <!-- <el-table-column
          prop="deviceUsePrice"
          :label="$t('recharge.deviceUsePrice')" width="160">
        </el-table-column>
        <el-table-column
          prop="softUsePrice"
          :label="$t('recharge.softUsePrice')" width="150">
        </el-table-column> -->
        <el-table-column
          prop="orderPrice"
          :label="$t('recharge.orderAmount')" width="130">
          <template slot-scope="props">
            {{props.row.orderPrice | filterDollar}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTime"
          :label="$t('recharge.orderTime')" width="190">
          <template slot-scope="props">
            {{props.row.orderTime | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expireTime"
          :label="$t('recharge.expireTime')" width="190">
          <template slot-scope="props">
            {{props.row.expireTime | dateFilter}}
          </template>
        </el-table-column>
        <el-table-column
          prop="packageOrderType"
          label="Order Method" width="190">
          <template slot-scope="props">
            {{props.row.packageOrderType | packageOrderTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderType"
          label="Order Type" width="190">
          <template slot-scope="props">
            {{props.row.orderType | orderTypeFilter}}
          </template>
        </el-table-column>

        <el-table-column
          prop="packageName"
          :label="$t('recharge.pachageName')" width="130">
          <template slot-scope="props">
            {{props.row.packageName | filterEmpty}}
          </template>
        </el-table-column>
        <el-table-column
          prop="packageDateName"
          label="Package Date" width="130">
          <template slot-scope="props">
            {{props.row.packageDateName | filterEmpty}}
          </template>
        </el-table-column>
        <el-table-column
          prop="payStatus"
          label="Pay Status" width="130">
            <template slot-scope="props">
            {{props.row.payStatus | payStatusFilter}}
          </template>
        </el-table-column>
        
        
        <el-table-column prop="operation" :label="$t('common.operation')" min-width="120">
          <template slot-scope="props">
            <el-button class="detail-button" @click="showDetail(props.row)">{{$t('common.detail')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="total"
      :current-page.sync="pageNum"
      @current-change="changePage" v-if="total">
    </el-pagination>

    <!--detail -->
    <el-dialog title="Detail" :visible.sync="visibleDetail" width="800px">
      <el-form label-position="right" label-width="220px" class="ta-l" ref="form">
        <div class="form-item-group recharge-item-group">
          <template>
            <!-- <el-form-item :label="$t('recharge.memberMobileNumber')">{{initData.phone | filterEmpty}}</el-form-item> -->
            <el-form-item :label="$t('recharge.orderNo')">{{initData.orderNo | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.deviceNumber')">{{initData.deviceNumber | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.price')">{{initData.orderPrice | filterEmpty |filterDollar}}</el-form-item>
            <el-form-item :label="$t('recharge.orderTime')">{{initData.orderTime | dateFilter | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.expireTime')">{{initData.expireTime | dateFilter | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.payStatus')">
              <span v-if="initData.payStatus == 0">Wait for pay</span>
              <span v-else-if="initData.payStatus == 1">Success</span>
              <span v-else-if="initData.payStatus == 2">File</span>
            </el-form-item>
            <el-form-item :label="$t('recharge.payType')">
              <span v-if="initData.payType == 1">Stripe</span>
              <span v-else>Other</span>
            </el-form-item>
            <el-form-item :label="$t('recharge.orderMethod')">{{initData.packageOrderType | packageOrderTypeFilter}}</el-form-item>
            <el-form-item :label="$t('recharge.orderType')">{{initData.orderType | orderTypeFilter}}</el-form-item>
            <el-form-item :label="$t('recharge.pachageName')">{{initData.packageName | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.packageDate')">{{initData.packageDateName | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.packageprice')">{{initData.packagePrice | filterEmpty | filterDollar}}</el-form-item>
            <el-form-item :label="$t('recharge.packageDiscount')">{{initData.packageDiscount | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.country')">{{initData.country | filterEmpty}}</el-form-item>
            <el-form-item :label="$t('recharge.currency')">{{initData.currency | filterEmpty}}</el-form-item>
          </template>
        </div>
      </el-form>
      <div class="btns-wrap" style="text-align: center;">
        <el-button type="primary" @click="visibleDetail=false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'

  export default {
    data () {
      return {
        condition: '',
        visibleDetail: false,
        initData: {}
      }
    },
    mounted () {
      this.findData()
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDeviceOrder/getDfDeviceOrderPage', {
          start: this.pageNum,
          pageSize: this.pageSize,
          phone: this.condition
        }).then((res) => {
          if (res.data.data) {
            this.itemList = res.data.data.list
            this.total = res.data.total
          }
        })
      },
      listChange (selection) {
        console.log(selection)
      },
      exportData () {
        this.$http.post('@ROOT_API/dfDeviceOrder/exportDeviceOrderList', {
          start: 1,
          pageSize: 9999
        }).then((res) => {})
      },
      showDetail (row) {
        this.initData = row
        this.visibleDetail = true
      }
    },
    mixins: [pageMixin]
  }
</script>
<style lang='less'>
.recharge-index-wrap{
  .recharge-index-con{
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .recharge-index-serch{
      margin-bottom: 21px;
      .el-input{
        width: 385px;
        display: inline-block;
        margin-right: 20px;
      }
      .el-button{
        padding: 9px 33px;
        font-size: 14px;
      }
    }
    .del-table{
      padding: 7px 20px;
      background-color: #ff0000!important;
      margin-top: 40px;
    }
    .el-table{
      border: 1px solid #ebeef5;
      .cell{
        text-align: center;
      }
      .el-button{
        padding: 4px 10px;
        font-size: 14px;
      }
      .edit-button{
        border: 1px solid #79d40b;
        color: #79d40b;
      }
      .delete-button{
        border: 1px solid #ff9501;
        color: #ff9501;
      }
    }
  }
}
.recharge-item-group {
  padding-top: 10px;
  .el-form-item {
    margin-bottom: 5px;
    .el-form-item__label, .el-form-item__content {
      line-height: 30px;
    }
  }
}
</style>
