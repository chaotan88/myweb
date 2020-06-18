<template>
  <div class="recharge-plans-wrap">
    <div class="recharge-plans-con">
      <div class="recharge-plans-serch">
        <el-button @click="addData()">{{$t("common.new")}}</el-button>
      </div>
      <el-table :data="itemList" style="width: 100%">
        <el-table-column prop="deviceUsePrice" :label="$t('recharge.deviceUsePrice')"></el-table-column>
        <el-table-column prop="softUsePrice" :label="$t('recharge.softUsePrice')"></el-table-column>
        <el-table-column prop="country" :label="$t('recharge.country')"></el-table-column>
        <el-table-column prop="countryCode" :label="$t('recharge.countryCode')"></el-table-column>
        <el-table-column prop="currency" :label="$t('recharge.currency')"></el-table-column>
        <el-table-column prop="details" :label="$t('recharge.details')"></el-table-column>
        <el-table-column prop="operation" :label="$t('common.operation')" min-width="220">
          <template slot-scope="props">
            <el-button class="detail-button" @click="settingDialog = true">{{$t('common.update')}}</el-button>
            <!-- <el-button class="detail-button" @click="setVistor(props.row)">{{$t('common.update')}}</el-button> -->
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
      @current-change="changePage"
      v-if="total"
    ></el-pagination>

    <el-dialog :title="settingItem.id ? 'Edit': 'Add'" :visible.sync="settingDialog" width="480px" center class="grant-pop">
      <el-form
        :model="settingForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm bind-form"
      >
      <!-- <el-form-item :label="$t('recharge.country')" prop="deviceUsePrice">
        <el-select v-model="ruleForm3.accountType">
          <el-option
          v-for="item in vistorTypes"
          :key="item.id"
          :label="item.label"
          :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item :label="$t('recharge.currency')" prop="currency">
          <el-select v-model="ruleForm3.accountType">
            <el-option
            v-for="item in vistorTypes"
            :key="item.id"
            :label="item.label"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('recharge.deviceUsePrice')" prop="deviceUsePrice">
          <el-input placeholder="Please enter" v-model="settingItem.deviceUsePrice" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.softUsePrice')" prop="softUsePrice">
          <el-input placeholder="Please enter" v-model="settingItem.softUsePrice" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.details')">
          <el-input placeholder="Please enter" v-model="settingItem.details" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePrice">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/mixin'

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
      settingItem: {
        deviceUsePrice: 0,
        softUsePrice: 0,
        details: ''
      }
    }
  },
  mounted () {
    this.findData()
  },
  methods: {
    findData () {
      this.$http
        .post('@ROOT_API/dfSoftDeviceUsePrice/getDfSoftDeviceUsePricePage', {})
        .then(res => {
          this.itemList = []
          if (res.data.data) {
            let { data } = res.data
            this.itemList.push({
              deviceUsePrice: data.deviceUsePrice || 0,
              softUsePrice: data.softUsePrice || 0,
              details: data.details || ''
            })
            this.settingItem = data
          } else {
            this.itemList.push({
              deviceUsePrice: 0,
              softUsePrice: 0,
              details: ''
            })
          }
        })
    },
    savePrice () {
      this.$http.post('@ROOT_API/dfSoftDeviceUsePrice/saveOrUpdateDfSoftDeviceUsePrice', {
        deviceUsePrice: this.settingItem.deviceUsePrice,
        softUsePrice: this.settingItem.softUsePrice,
        details: this.settingItem.details
      })
      .then(res => {
        if (res.data.status === '1') {
          this.$message.success('Success')
          this.settingDialog = false
          this.findData()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg || this.$t('common.errorMsg')
          })
        }
      })
    },
    addData () {
      this.settingDialog = true
    }
  },
  mixins: [pageMixin]
}
</script>
<style lang='less'>
.recharge-plans-wrap {
  .recharge-plans-con {
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .recharge-plans-serch {
      margin-bottom: 21px;
      .el-input {
        width: 385px;
        display: inline-block;
        margin-right: 20px;
      }
      .el-button {
        padding: 9px 33px;
        font-size: 14px;
      }
    }
    .del-table {
      padding: 7px 20px;
      background-color: #ff0000 !important;
      margin-top: 40px;
    }
    .el-table {
      border: 1px solid #ebeef5;
      .cell {
        text-align: center;
      }
      .el-button {
        padding: 4px 10px;
        font-size: 14px;
      }
      .edit-button {
        border: 1px solid #79d40b;
        color: #79d40b;
      }
      .delete-button {
        border: 1px solid #ff9501;
        color: #ff9501;
      }
    }
  }
}
</style>
