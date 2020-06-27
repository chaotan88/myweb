<template>
  <div class="recharge-setting-wrap">
    <div class="setting-left"
      v-loading="loading.loadingCurrency"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="table-title">
        Currency List
      </div>
      <div class="recharge-setting-con">
        <el-table
          :data="currencyList"
          style="width: 100%"
          height="500">
          <el-table-column label="Select" width="70px" align="center" header-align="center">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="templateRadio"
              @change.native="getTemplateRow(scope.$index,scope.row)" style="margin-left: 10px;">&nbsp;
            </el-radio>
          </template>
          </el-table-column>
          <el-table-column
            prop="currency"
            :label="$t('recharge.currency')">
          </el-table-column>
          <el-table-column
            prop="detail"
            :label="$t('recharge.details')">
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
    <div class="setting-right"
      v-loading="loading.loadingPackage"
      element-loading-text="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="table-title">
        Package List
      </div>
      <div class="recharge-setting-con">
        <el-table
          :data="packageList"
          style="width: 100%"
          height="500">
          <el-table-column
            prop="packageName"
            min-width="140"
            :label="$t('recharge.pachageName')">
          </el-table-column>
          <el-table-column
            prop="packagePrice"
            min-width="80"
            :label="$t('recharge.price')">
          </el-table-column>
          <el-table-column
            prop="packageDeviceNum"
            min-width="150"
            :label="$t('recharge.deviceNumber')">
          </el-table-column>
          <el-table-column prop="operation" :label="$t('common.operation')" min-width="220">
            <template slot-scope="props">
              <el-button class="detail-button" @click="updatePackage(props.row)">{{$t('common.update')}}</el-button>
              <!-- <el-button class="detail-button" @click="setVistor(props.row)">{{$t('common.update')}}</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="Edit"
      :visible.sync="settingDialog"
      width="480px"
      center class="grant-pop">
      <el-form :model="settingForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm bind-form">
        <el-form-item :label="$t('recharge.pachageName')" prop="packageName">
          <el-input readonly v-model="updateItem.packageName" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.price')" prop="packagePrice">
          <el-input v-model="updateItem.packagePrice" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.deviceNumber')" prop="packageDeviceNum">
          <el-input v-model="updateItem.packageDeviceNum" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">Cancel</el-button>
        <el-button type="primary" @click="savePackage">Ok</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {pageMixin} from '@/mixin'

  export default {
    data () {
      return {
        condition: '',
        settingDialog: false,
        rules: {
          deviceUsePrice: [{ required: true, trigger: 'blur' }],
          softUsePrice: [{ required: true, trigger: 'blur' }]
        },
        settingForm: {},
        templateRadio: false,
        templateSelection: {},
        currencyList: [],
        packageList: [],
        loading: {
          loadingCurrency: false,
          loadingPackage: false
        },
        updateItem: {}
      }
    },
    mounted () {
      this.getCurrencyList()
    },
    methods: {
      getCurrencyList () {
        this.loading.loadingCurrency = true
        this.$http.post('@ROOT_API/dfSoftPackageCurrency/getDfSoftPackageCurrencyAll', {
          start: 1,
          pageSize: 999
        }).then((res) => {
          if (res) {
            let { data } = res.data
            this.currencyList = data || []
            this.loading.loadingCurrency = false
            if (this.currencyList.length > 0) {}
            this.templateSelection = this.currencyList[0]
            this.getPackageList()
          }
        })
      },
      getPackageList () {
        this.loading.loadingPackage = true
        this.$http.post('@ROOT_API/dfSoftPackagePrice/getDfSoftPackagePriceAll', {
          currencyId: this.templateSelection.id
        }).then((res) => {
          if (res) {
            let { data } = res.data
            this.packageList = data || []
            this.loading.loadingPackage = false
          }
        })
      },
      savePackage () {
        this.$http.post('@ROOT_API/dfSoftPackagePrice/saveOrUpdateDfSoftPackagePrice', {
          id: this.templateSelection.id,
          packagePrice: this.updateItem.packagePrice,
          packageDeviceNum: this.updateItem.packageDeviceNum,
          packageName: this.updateItem.packageName
        }).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.settingDialog = false
            this.getPackageList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.msg || this.$t('common.errorMsg')
            })
          }
        })
      },
      getTemplateRow (index, row) {
        this.templateSelection = row
        this.getPackageList()
      },
      updatePackage (row) {
        this.updateItem = Object.assign({}, row)
        this.settingDialog = true
      }
    },
    mixins: [pageMixin]
  }
</script>
<style lang='less'>
.recharge-setting-wrap{
  display: flex;
  background: #fff;
  .table-title {
    margin: 20px;
    font-size: 16px;
    color: #666;
    margin-bottom: 0;
  }
  .setting-left {
    border-right: 1px dashed #ddd;
    width: 40%;
  }
  .recharge-setting-con{
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .recharge-setting-serch{
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
