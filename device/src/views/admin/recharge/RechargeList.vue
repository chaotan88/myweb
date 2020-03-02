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
        <el-table-column
          prop="phone"
          :label="$t('recharge.memberMobileNumber')"
          width="200">
        </el-table-column>
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
            {{props.row.orderPrice}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTime"
          :label="$t('recharge.orderTime')" width="130">
          <template slot-scope="props">
            {{props.row.expireTime | dateFilter('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expireTime"
          :label="$t('recharge.expireTime')" width="130">
          <template slot-scope="props">
            {{props.row.expireTime | dateFilter('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="payStatus"
          :label="$t('recharge.payStatus')" width="180">
          <template slot-scope="props">
            <span v-if="props.row.payStatus == 0">未支付</span>
            <span v-else-if="props.row.payStatus == 1">支付成功</span>
            <span v-else-if="props.row.payStatus == 2">支付失败</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          :label="$t('recharge.payType')" width="180">
          <template slot-scope="props">
            <span v-if="props.row.payType == 1">palpay</span>
            <span v-else>其他</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="beforeOrderNo"
          :label="$t('recharge.beforeOrderNo')" width="210">
        </el-table-column>
        <el-table-column
          prop="beforePrice"
          :label="$t('recharge.beforePrice')" width="240">
        </el-table-column>
        <el-table-column
          prop="beforeNumber"
          :label="$t('recharge.beforeNumber')" width="220">
        </el-table-column>
        <el-table-column
          prop="beforeRealNumber"
          :label="$t('recharge.beforeRealNumber')" width="230">
        </el-table-column>
        <el-table-column
          prop="beforeNoPayPrice"
          :label="$t('recharge.beforeNoPayPrice')" width="200">
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
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'

  export default {
    data () {
      return {
        condition: ''
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
</style>
