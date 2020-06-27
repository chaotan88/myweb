<template>
  <div class="duration-manage-wrap">
    <div class="duration-manage-con">
      <el-table :data="itemList" style="width: 100%">
        <el-table-column prop="dateName" :label="$t('recharge.duration')"></el-table-column>
        <el-table-column prop="discount" :label="$t('recharge.discount')"></el-table-column>
        <el-table-column prop="detail" :label="$t('recharge.details')"></el-table-column>
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
        <el-form-item :label="$t('recharge.duration')">
          <el-input placeholder="Please enter" v-model="settingItem.dateName" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.discount')">
          <el-input placeholder="Please enter" v-model="settingItem.discount" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('recharge.details')">
          <el-input placeholder="Please enter" v-model="settingItem.detail" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveDuration" :loading="loading">Ok</el-button>
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
  },
  methods: {
    findData () {
      this.$http.post('@ROOT_API/dfSoftPackageDate/getDfSoftPackageDateAll', {
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
          let { data, total } = res.data
          this.itemList = data
          this.total = total
        }
      })
    },
    saveDuration () {
      this.loading = true
      let params = {
        id: this.settingItem.id || '',
        discount: this.settingItem.discount
      }
      this.$http.post('@ROOT_API/dfSoftPackageDate/saveOrUpdateDfSoftPackageDate', params)
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
    }
  },
  mixins: [pageMixin]
}
</script>
<style lang='less'>
.duration-manage-wrap {
  .duration-manage-con {
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: px;
    .duration-manage-serch {
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
