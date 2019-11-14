<!-- 充值设置 -->
<template>
  <common-tpl class="gift-record-wrap" footer>

    <!-- 列表 -->
    <template slot="main">
      <div class="buy-goods-wrap">
        <el-form ref="main-form" :model="formData" :rules="rules">
          <el-table :data="formData.tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="会员等级" min-width="200px">
              <template slot-scope="scope">{{scope.row.disRuleName | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="赠送消费积分比例（占充值金额比值）" min-width="160px">
              <template slot-scope="scope">
                <el-row type="flex" justify="" align="center">
                  <el-form-item  :prop="'tableData.' + scope.$index + '.sendBonusPointRate'" :rules="sendBonusPointRate" class="w130">
                    <el-input size="small" v-model="scope.row.sendBonusPointRate" placeholder="限0-100正整数"></el-input>
                  </el-form-item>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column label="赠送余额比例（占充值金额比值）" min-width="160px">
              <template slot-scope="scope">
                <el-row type="flex" justify="" align="center">
                  <el-form-item  :prop="'tableData.' + scope.$index + '.sendBalanceRate'" :rules="sendBalanceRate" class="w130">
                    <el-input size="small" v-model="scope.row.sendBalanceRate" placeholder="限0-1000正整数"></el-input>
                  </el-form-item>
                </el-row>
              </template>
            </el-table-column>

            <!-- 暂无数据 -->
            <div slot="empty">
              <no-data></no-data>
            </div>
          </el-table>
        </el-form>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="handleSave('main-form')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      // 赠送余额比例
      let validateNum = (rule, value, callback) => {
        if (!value && parseInt(value) !== 0) return callback(new Error('请输入赠送消费积分比例'))
        if (value && (value < 0 || value > 100 || !value.toString().match(/^\d{0,5}$/gi))) return callback(new Error('输入0~100数字'))
        callback()
      }

      // 赠送消费积分比例
      let validateBatchValue = (rule, value, callback) => {
        if (!value && parseInt(value) !== 0) return callback(new Error('请输入赠送余额比例'))
        if (value && (value < 0 || value > 1000 || !value.toString().match(/^\d{0,4}$/gi))) return callback(new Error('输入0~1000数字'))
        callback()
      }
      return {
        loading: false,
        saveLoading: false,   // 保存loading
        pageType: 1,          // [1: 新增  2: 编辑]
        formData: {
          sendBonusPointRate: '',    // 赠送消费积分比例
          sendBalanceRate: '',       //
          date: 1,
          tableData: []       // 列表数据
        },
        rules: {
          sendBonusPointRate: [{ validator: validateNum, trigger: 'blur' }],
          sendBalanceRate: [{ validator: validateBatchValue, trigger: 'blur' }]
        },
        sendBonusPointRate: [{validator: validateNum, trigger: 'blur'}],
        sendBalanceRate: [{validator: validateBatchValue, trigger: 'blur'}],
        copyFormData: {},     // 拷贝
        pageData: {           // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}          // 用户信息
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/finance/advancet/set', (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()
    },

    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.formData.tableData = []
        this.$http.get('@ROOT_API/rechargeRuleManageController/getRechargeRuleList', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
          this.formData.tableData = resData.data || []
        }).finally(() => {
          this.loading = false
        })
      },

      /**
       * 保存规则
       */
      handleSave (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.saveLoading = true
          let ruleList = []
          this.formData.tableData.forEach((row) => {
            ruleList.push({
              id: row.id,
              disRuleId: row.disRuleId,
              disRuleName: row.ruleName,
              sendBonusPointRate: row.sendBonusPointRate,
              sendBalanceRate: row.sendBalanceRate
            })
          })
          this.$http.post('@ROOT_API/rechargeRuleManageController/addOrUpdateRechargeRule', {
            ruleList
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
              return false
            }
            this.$message({
              message: resData.msg,
              type: 'success',
              duration: 1500
            })
            if (this.pageType === 2) {
              this.getListData()
            }
          }).finally(() => {
            setTimeout(() => {
              this.saveLoading = false
            }, 500)
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .gift-record-wrap {
    /*----------------搜索-----------*/
    .search-wrap {
      .el-form-item {
        .el-radio-group {
          div {
            margin-right: 20px;
          }
        }
      }

      .el-dropdown {
        width: 80px;
        top: 0;
        left: -80px;
      }
    }
    .sub-info{
      background: #D6EAFF;
      padding: 20px 0 0 20px;
      margin-bottom: 20px;
    }
    .flex{
      display: flex;
      align-items: center;
    }
    .w130{
      width: 130px;
    }

    .ml-40{
      margin-left: 40px;
    }
    .color-999{
      color: #999999;
    }
  }
</style>

<style lang="less">
  .gift-record-wrap {

    .region-select-wrap{
      .el-input{
        width: auto !important;
      }
    }

    .el-table{
      .el-form-item{
        /*width: 50%;*/
        float: left;
        margin-bottom: 0;


        .el-select{
          width: 120px;
          margin: 0 20px 0 0;
        }
      }
      .batch{
        color: #409eff;
        line-height: 32px;
        margin-left: 10px;
        cursor:pointer;
      }
    }

    .el-form-item{
      .el-form-item__label, .el-form-item__content{
        line-height: 32px;
      }
    }
  }

  .search-wrap .high-search-down .btn-wrap {
    margin-top: 0;
  }
</style>

<style lang="less">
  .gift-record-wrap{
    .el-table .cell{
      overflow: inherit;
    }

    .el-dialog{

      .el-dialog__body{
        padding: 30px 40px;
        .el-form-item{
          margin-bottom: 15px;
        }
      }
    }
    .other-form-item{
      .el-form-item__error{
        left: 80px;
      }
    }
  }
</style>
