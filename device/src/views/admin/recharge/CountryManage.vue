<template>
  <div class="country-manage-wrap">
    <div class="country-manage-con">
      <div class="country-manage-serch">
        <el-button @click="addData()">{{$t("common.new")}}</el-button>
      </div>
      <el-table :data="itemList" style="width: 100%">
        <el-table-column prop="country" :label="$t('recharge.country')"></el-table-column>
        <el-table-column prop="countryCode" :label="$t('recharge.countryCode')"></el-table-column>
        <el-table-column prop="currency" :label="$t('recharge.currency')"></el-table-column>
        <el-table-column prop="details" :label="$t('recharge.details')"></el-table-column>
        <el-table-column prop="operation" :label="$t('common.operation')" min-width="220">
          <template slot-scope="props">
            <el-button class="detail-button" @click="editData(props.row)">{{$t('common.update')}}</el-button>
            <!-- <el-button class="detail-button" @click="setVistor(props.row)">{{$t('common.update')}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      :current-page.sync="pageNum"
      :page-size="pageSize"
      :total="total"
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
      <el-form-item :label="$t('recharge.country')" prop="deviceUsePrice">
        <el-select v-model="settingItem.countryCode">
          <el-option
          v-for="item in countryList"
          :key="item.short"
          :label="item.en"
          :value="item.short">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item :label="$t('recharge.currency')" prop="currency">
          <el-select v-model="settingItem.currencyId">
            <el-option
            v-for="item in currencyList"
            :key="item.id"
            :label="item.currency"
            :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('recharge.details')">
          <el-input placeholder="Please enter" v-model="settingItem.details" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取 消</el-button>
        <el-button type="primary" @click="savePrice" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageMixin } from '@/mixin'
import { countries } from '../../../assets/data.json'

export default {
  data () {
    return {
      condition: '',
      settingDialog: false,
      rules: {},
      settingForm: {},
      settingItem: {
        id: '',
        country: '',
        countryCode: '',
        currency: '',
        details: '',
        currencyId: ''
      },
      countryList: [],
      currencyList: [],
      loading: false
    }
  },
  mounted () {
    this.findData()
    this.initSelectData()
  },
  methods: {
    findData () {
      this.$http.post('@ROOT_API/dfSoftDeviceUsePrice/getDfSoftDeviceUsePricePage', {
        start: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.data.status !== '1') {
          this.$message({
            type: 'error',
            message: res.data.msg || this.$t('common.errorMsg')
          })
          return false
        } else {
          let { list, total } = res.data.data
          this.itemList = list
          this.total = total
        }
      })
    },
    savePrice () {
      this.loading = true
      let params = {
        id: this.settingItem.id || '',
        countryCode: this.settingItem.countryCode,
        currencyId: this.settingItem.currencyId,
        details: this.settingItem.details
      }
      this.getCodeById(params, 'countryCode', 'country', 'countryList', 'short', 'en')
      this.getCodeById(params, 'currencyId', 'currency', 'currencyList', 'id', 'currency')
      this.$http.post('@ROOT_API/dfSoftDeviceUsePrice/saveOrUpdateDfSoftDeviceUsePrice', params)
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
        this.loading = false
      })
    },
    addData () {
      this.settingDialog = true
      this.settingItem = {
        id: '',
        country: '',
        countryCode: '',
        currency: '',
        details: ''
      }
    },
    editData (item) {
      this.settingItem = Object.assign({}, item)
      this.settingDialog = true
    },
    initSelectData () {
      this.countryList = countries
      this.$http.post('@ROOT_API/dfSoftPackageCurrency/getDfSoftPackageCurrencyAll', {
        start: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.data.status !== '1') {
          this.$message({
            type: 'error',
            message: res.data.msg || this.$t('common.errorMsg')
          })
          return false
        } else {
          let { data } = res.data
          this.currencyList = data
        }
      })
    },
    getCodeById (params, id, codeName, listName, idName, name) {
      let items = this[listName].filter(da => da[idName] === this.settingItem[id])
      if (items && items.length > 0) {
        let [item] = items
        params[codeName] = item[name]
      }
    }
  },
  mixins: [pageMixin]
}
</script>
<style lang='less'>
.country-manage-wrap {
  .country-manage-con {
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .country-manage-serch {
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
