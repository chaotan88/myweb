<template>
  <div class="visit-log-wrap"
    v-loading="loading"
    element-loading-text="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="visit-log-con">
      <div class="visit-log-serch">
        <div class="frist-row">
          <el-select v-model="condition.device" placeholder="Location" clearable>
            <el-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.apartmentName"
              :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="condition.dateType" placeholder="User Type" clearable>
            <el-option
              v-for="item in dateTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              clearable>
            </el-option>
          </el-select>
          <el-date-picker
            v-model="condition.visitTime"
            type="daterange"
            range-separator="~"
            :start-placeholder="$t('log.visitingTime')"
            :end-placeholder="$t('log.visitingTime')"
            format="MM-dd-yyyy h:mm:ss A">
          </el-date-picker>
        </div>
        <div class="second-row">
          <div>
            <el-select v-model="condition.accountType" placeholder="Open Type" clearable>
              <el-option
                v-for="item in accountTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable>
              </el-option>
            </el-select>
            <el-input  placeholder="Account/Card No." v-model="condition.accountNo" clearable></el-input>
          </div>
          <div class="buttons">
            <el-button @click="reset()">{{$t("common.reset")}}</el-button>
            <el-button @click="findData()">{{$t("common.search")}}</el-button>
            <el-button @click="exportData()">{{$t("common.export")}}</el-button>
          </div>
        </div>
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
          prop="address"
          :label="$t('device.location')">
          <template slot-scope="props">
            <p>{{props.row.address}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="username"
          :label="$t('device.userName')">
          <template slot-scope="props">
            <p>{{props.row.username}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="dateType"
          label="User Type">
          <template slot-scope="props">
            <p>{{props.row.userTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountType"
          label="Open Type">
          <template slot-scope="props">
            <p>{{props.row.openTypeValue}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountNo"
          :label="$t('log.keyNumber')"
          min-width="150">
        </el-table-column>
        <el-table-column
          prop="accountNo"
          :label="$t('log.openStatus')">
          <template slot-scope="props">
            <p v-if="props.row.openStatus === 1">Success</p>
            <p v-else-if="props.row.openStatus === 0">Fail</p>
            <p v-else>Success</p>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="relay"
          :label="$t('log.relay')">
        </el-table-column> -->
        <el-table-column
          prop="openTime"
          :label="$t('log.visitingTime')" min-width="150">
          <template slot-scope="props">
            <p>{{props.row.openTime | dateFilter}}</p>
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
            value: '1',
            label: 'Family'
          },
          {
            value: '2',
            label: 'Permanent'
          },
          {
            value: '3',
            label: 'Limit'
          },
          {
            value: '4',
            label: 'Temporary'
          },
          {
            value: '5',
            label: 'Manager'
          }
        ],
        accountTypes: [
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
        isShowVip: false,
        loading: false
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
        this.loading = true
        this.$http.post('@ROOT_API/dfDeviceOpenLog/getDfDeviceOpenLogPage', this.getParams()).then((res) => {
          if (res.data.status === '1') {
            this.itemList = res.data.data.list
            this.total = res.data.data.total
          }
          this.loading = false
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
        if (this.condition.visitTime && this.condition.visitTime.length > 1) {
          startDate = this.$formatDate(this.condition.visitTime[0], 'YYYY-MM-DD 00:00:00')
          endDate = this.$formatDate(this.condition.visitTime[1], 'YYYY-MM-DD 23:59:59')
        }
        return {
          start: this.pageNum,
          pageSize: this.pageSize,
          addressId: this.condition.addressId,
          startTime: startDate,
          endTime: endDate,
          userType: this.condition.dateType,
          openType: this.condition.accountType,
          accountNo: this.condition.accountNo
        }
      },
      reset () {
        this.condition = {
          addressId: '',
          dateType: '',
          accountNo: '',
          vistTime: [],
          accountType: ''
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
      .second-row {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
      margin-bottom: 21px;
      .el-input{
        width:200px;
        display: inline-block;
        margin-right: 20px;
      }
      .el-button{
        padding: 9px 33px;
        font-size: 14px;
      }
      .el-date-editor {
        width: 500px;
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
