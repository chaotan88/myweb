<template>
  <div class="visit-log-wrap">
    <div class="visit-log-con">
      <div class="visit-log-serch">
        <!-- <el-select v-model="condition.device" placeholder="请选择">
          <el-option
            v-for="item in addressList"
            :key="item.id"
            :label="item.apartmentName"
            :value="item.id">
          </el-option>
        </el-select> -->
        <el-select v-model="condition.dateType" :placeholder="$t('log.dateType')">
          <el-option
            v-for="item in dateTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            clearable>
          </el-option>
        </el-select>
        <el-select v-model="condition.accountTypes" :placeholder="$t('log.accessType')">
          <el-option
            v-for="item in accountType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            clearable>
          </el-option>
        </el-select>
        <el-input  :placeholder="$t('log.pleaseEnterCardNumber')" v-model="condition.accountNo" clearable></el-input>
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
          prop="dateType"
          :label="$t('log.dateType')">
          <template slot-scope="props">
            <p v-if="props.row.dateType == 0">Family</p>
            <p v-if="props.row.dateType == 1">Permanent</p>
            <p v-if="props.row.dateType == 2">Limit</p>
            <p v-if="props.row.dateType == 3">Temporary</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountType"
          :label="$t('log.accessType')">
          <template slot-scope="props">
            <p v-if="props.row.accountType == 1">Code</p>
            <p v-if="props.row.accountType == 2">Phone</p>
            <p v-if="props.row.accountType == 3">Card</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountNo"
          :label="$t('log.keyNumber')">
        </el-table-column>
        <el-table-column
          prop="relay"
          :label="$t('log.relay')">
        </el-table-column>
        <el-table-column
          prop="openTime"
          :label="$t('log.visitingTime')">
          <template slot-scope="props">
            <p>{{props.row.openTime | dateFilter('YYYY-MM-DD')}}</p>
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
          accountNo: '',
          vistTime: [],
          accountType: ''
        },
        addressList: [],
        dateTypes: [
          {
            value: '',
            label: 'All'
          },
          {
            value: '1',
            label: 'Permanent'
          },
          {
            value: '2',
            label: 'Limit'
          },
          {
            value: '3',
            label: 'Temporary'
          }
        ],
        accountTypes: [
          {
            value: '',
            label: 'All'
          },
          {
            value: '1',
            label: 'Code'
          },
          {
            value: '2',
            label: 'Phone'
          },
          {
            value: '3',
            label: 'Card'
          }
        ],
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
        this.$http.post('@ROOT_API/dfDeviceOpenLog/getDfDeviceOpenLogPage', this.getParams()).then((res) => {
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
        this.$http.post('@ROOT_API/dfDeviceOpenLog/exportOpenLogList', this.getParams()).then((res) => {})
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
          endTime: endDate,
          dateType: this.condition.dateType,
          accountType: this.condition.accountType
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
.visit-log-wrap{
  .visit-log-con{
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .visit-log-serch{
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
