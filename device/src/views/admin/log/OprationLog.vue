<template>
  <div class="opration-log-wrap">
    <div class="opration-log-con">
      <div class="opration-log-serch">
        <!-- <el-select v-model="condition.addressId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select> -->
        <!-- <el-input  :placeholder="$t('log.pleaseEnterCardNumber')" v-model="condition.phone"></el-input> -->
        <el-date-picker
          v-model="condition.visitTime"
          type="daterange"
          range-separator="~"
          :start-placeholder="$t('log.visitingTime')"
          :end-placeholder="$t('log.visitingTime')">
        </el-date-picker>
        <el-button @click="findData()">{{$t("common.search")}}</el-button>
        <el-button @click="exportData()">{{$t("common.export")}}</el-button>
      </div>
      <el-table
        :data="itemList"
        style="width: 100%">
        <!-- <el-table-column
          type="selection">
        </el-table-column> -->
        <el-table-column
          type="index"
          :label="$t('common.index')"
          width="90">
        </el-table-column>
        <el-table-column
          prop="phone"
          :label="$t('log.userOperation')">
        </el-table-column>
        <el-table-column
          prop="roleName"
          :label="$t('log.userRoles')">
        </el-table-column>
        <el-table-column
          prop="roleAuth"
          :label="$t('log.roleAuthorization')">
        </el-table-column>
        <el-table-column
          prop="operateModule"
          :label="$t('log.operationModule')">
        </el-table-column>
        <el-table-column
          prop="operateItem"
          :label="$t('log.operantHehavior')">
        </el-table-column>
        <el-table-column
          prop="operateDetail"
          :label="$t('log.specificOperationContents')">
        </el-table-column>
        <el-table-column
          prop="operateTime"
          :label="$t('log.operatingTime')">
          <template slot-scope="props">
            <p>{{props.row.operateTime | dateFilter('YYYY-MM-DD')}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      @current-change="changePage" v-if="total">
    </el-pagination>
    <ISVIP v-if="isShowVip" @close="isShowVip = false"></ISVIP>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'
  import ISVIP from '@/views/public/IsVip.vue'

  export default {
    data () {
      return {
        condition: {
          addressId: '',
          dateType: '',
          phone: '',
          vistTime: []
        },
        addressList: [],
        isShowVip: false
      }
    },
    mounted () {
      if (!this.$isVip()) {
        this.isShowVip = true
      } else {
        this.initAddressData()
        this.findData()
      }
    },
    methods: {
      findData () {
        this.$http.post('@ROOT_API/dfDeviceSettingsLog/getDfDeviceSettingsLogPage', this.getParams()).then((res) => {
          this.itemList = res.data.data.list
          this.total = res.data.data.total
        })
      },
      initAddressData () {
        this.$http.post('@ROOT_API/dfAddress/getDfAddressPage', {
          start: this.pageNum,
          pageSize: this.pageSize
        }).then((res) => {
          this.addressList = res.data.data.list
        })
      },
      exportData () {
        this.$http.post('@ROOT_API/dfDeviceSettingsLog/exportSettingsLogList', this.getParams()).then((res) => {})
      },
      getParams () {
        let startDate = ''
        let endDate = ''
        if (this.visitTime && this.visitTime.length > 1) {
          startDate = this.vistTime[0]
          endDate = this.vistTime[1]
        }
        return {
          start: this.pageNum,
          pageSize: this.pageSize,
          addressId: this.condition.addressId,
          startTime: startDate,
          endTime: endDate
          // dateType: this.condition.dateType,
          // accountType: this.condition.accountType,
          // accountNo: this.condition.accountNo
        }
      }
    },
    mixins: [pageMixin],
    components: {
      ISVIP
    }
  }
</script>
<style lang='less'>
.opration-log-wrap{
  .opration-log-con{
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .opration-log-serch{
      margin-bottom: 21px;
      .el-input{
        width:150px;
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
