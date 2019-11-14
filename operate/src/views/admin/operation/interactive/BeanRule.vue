<!-- 芯豆规则 -->
<template>
  <common-tpl class="gift-record-wrap" footer>

    <!-- 列表 -->
    <template slot="main">
      <div class="buy-goods-wrap">
        <el-form ref="main-form" :model="formData" :rules="rules">
          <!--          <el-row type="flex" class="sub-info" >
                      <el-form-item label="当天限制：" prop="limitNumber" class="flex">
                        <el-input v-model.number="formData.limitNumber" placeholder="限0-1000正整数" class="w100" maxLength="4"></el-input>
                        <span>个/人 <span class="color-999">（0为不限）</span></span>
                      </el-form-item>
                      <el-form-item label="最高数额：" prop="maxNumber" class="ml-40 flex">
                        <el-input v-model.number="formData.maxNumber" placeholder="限0-100000正整数" class="w100" maxLength="7"></el-input>
                        <span>个/人 <span class="color-999">（0为不限）</span></span>
                      </el-form-item>
                    </el-row>-->
          <el-table :data="formData.tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="内容" min-width="200px">
              <template slot-scope="scope">{{scope.row.ruleType | filterRuleType | filterEmpty}}</template>
            </el-table-column>
            <el-table-column label="说明" min-width="200px">
              <template slot-scope="scope">{{scope.row.ruleType | filterRuleDescription | filterEmpty}}</template>
            </el-table-column>
            <el-table-column prop="isShow" label="是否显示" min-width="100">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.delStatus"
                  active-color="#56ade8"
                  @change="handleSwitch(scope.row)"
                  inactive-color="#ccc">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="赠送值" min-width="340px">
              <template slot-scope="scope">
                <template v-if="scope.row.ruleType === 29">
                  <el-form-item>
                    <el-select v-model="formData.currentDateId" size="small" @change="dateChange">
                      <template v-for="item in formData.dateList">
                        <el-option :label="item.dayNum | filterDateNum" :value="item.id"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                  <template v-for="(item, index) in formData.dateList" v-if="formData.currentDateId === item.id">
                    <el-form-item :prop="'dateList.' + index + '.handselNum'" :rules="ruleBatchValue">
                      <el-input placeholder="限0-1000正整数" autocomplete="off" v-model.trim="item.handselNum" size="small"></el-input>
                    </el-form-item>
                  </template>
                  <span class="batch d-ib" @click="batchSetupBefore(scope.row)">批量设置</span>
                </template>
                <el-row v-else type="flex" justify="" align="center">
                  <el-form-item  :prop="'tableData.' + scope.$index + '.handselNum'" :rules="ruleNum" class="w100">
                    <el-input size="small" v-model="scope.row.handselNum" placeholder="限0-1000000正整数"></el-input>
                  </el-form-item>
                  <el-form-item label="" prop="limitNumber"  v-if="scope.row.ruleType === 23" class="other-form-item">
                    <span style="margin: 0 10px;">当天上限</span>
                    <el-input v-model="formData.limitNumber" size="small" placeholder="限0-1000000正整数" class="w100" maxLength="7"></el-input>
                  </el-form-item>
                  <el-form-item label="" prop="maxNumber" v-if="scope.row.ruleType === 30" class="other-form-item">
                    <span style="margin: 0 10px;">当天上限</span>
                    <el-input v-model="formData.maxNumber" size="small" placeholder="限0-1000000正整数" class="w100" maxLength="7"></el-input>
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

    <template slot="other">
      <!-- 批量设置弹窗 -->
      <el-dialog title="设置签到" :visible.sync="batchSetupVisble" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-form class="ta-l" :model="formData" ref="batch-form" label-width="80px">
          <template v-for="(item, index) in formData.dateList">
            <el-form-item :label="item.dayNum | filterDateNum('：')" :prop="'dateList.' + index + '.handselNum'" :rules="ruleBatchValue">
              <el-input placeholder="限0-1000正整数" autocomplete="off" v-model="item.handselNum" size="small"></el-input>
            </el-form-item>
          </template>
          <br>
          <div class="dialog-footer ta-c">
            <el-button size="medium" type="primary" @click="validateBatchSetup('batch-form')">确 定</el-button>
          </div>
        </el-form>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="handleSave('main-form')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      let validateBatchValue = (rule, value, callback) => {
        if (value && (value < 0 || value > 1000 || !value.toString().match(/^\d{0,4}$/gi))) return callback(new Error('输入0~1000数字'))
        callback()
      }

      let validateNum = (rule, value, callback) => {
        if (value && (value < 0 || value > 10000 || !value.toString().match(/^\d{0,5}$/gi))) return callback(new Error('输入0~10000数字'))
        callback()
      }
     // let validateMaxNumber = (rule, value, callback) => {
     //   if (value === '') return callback(new Error('不能为空'))
     //   if (value && (value < 0 || value > 1000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入0~1000正整数'))
     //   callback()
     // }
      let validateMaxNumber2 = (rule, value, callback) => {
        if (value === '') return callback(new Error('不能为空'))
        if (value && (value < 0 || value > 1000000 || !value.toString().match(/^\d+$/gi))) return callback(new Error('输入0~1000000正整数'))
        callback()
      }
      return {
        loading: false,
        saveLoading: false,   // 保存loading
        formData: {
          maxNumber: 0,
          limitNumber: 0,
          date: 1,
          handselNum: '',     // 签到
          integer: '',        // 整数
          currentDate: {},    // 当前选择天数对象
          currentDateId: {},  // 当前选择天数id
          dateList: [],       // 天数列表
          tableData: []       // 列表数据
        },
        rules: {
          handselNum: [{ validator: validateBatchValue, trigger: 'blur' }],
          integer: [{ validator: validateNum, trigger: 'blur' }],
          limitNumber: [{required: true, validator: validateMaxNumber2, trigger: 'blur'}],
          maxNumber: [{required: true, validator: validateMaxNumber2, trigger: 'blur'}]
        },
        maxNumber: [{required: true, validator: validateMaxNumber2, trigger: 'blur'}],
        ruleBatchValue: [{validator: validateBatchValue, trigger: 'blur'}],
        ruleNum: [{validator: validateNum, trigger: 'blur'}],
        batchSetupVisble: false,  // 批量设置弹窗
        tableData: [],        // 列表数据
        copyFormData: {},     // 拷贝
        pageData: {           // 分页数据
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        otherData: [],
        userInfo: {}          // 用户信息
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('/admin/supplier/manage', (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()
    },

    methods: {
      /**
       * 获取列表数据
       * @param  {[type]} type [数据类型，type存在表示获取导出数据]
       */
      getListData () {
        // this.loading = true
        this.formData.tableData = []
        this.formData.dateList = []
        this.$http.get('@ROOT_API/shareTheme/getListByGoldBeanRule', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
          let flag = false
          resData.data.forEach((row) => {
            if (row.ruleType !== 29 || row.ruleType === 29 && !flag) this.formData.tableData.push(row)
            if (row.ruleType === 29) {
              flag = true
              this.formData.dateList.push(row)
            }
            if (row.ruleType === 110) this.formData.limitNumber = row.handselNum
            if (row.ruleType === 111) this.formData.maxNumber = row.handselNum
            row.delStatus = row.delStatus === 0 ? !!true : !!false
          })
          this.otherData = this.$Utils.deepCopy(this.formData.tableData)
          this.formData.tableData = this.formData.tableData.filter((row) => {
            return row.ruleType !== 111 && row.ruleType !== 110
          })
          if (this.formData.dateList && this.formData.dateList.length) {
            this.formData.currentDateId = this.formData.dateList[0].id
            this.formData.currentDate = this.formData.dateList[0]
          }
        }).finally(() => {
          this.loading = false
        })
      },

      /**
       * 校验批量设置
       */
      validateBatchSetup (formName) {
        this.$nextTick(() => {
          this.$refs[formName].validate((valid) => {
            if (!valid) return false
            this.batchSetupVisble = false
          })
        })
      },

      /**
       * 天数改变
       */
      dateChange (id) {
        this.formData.currentDate = this.formData.dateList.filter(row => row.id === id)[0]
      },

      /**
       * 批量设置签到前操作
       */
      batchSetupBefore (row) {
        this.batchSetupVisble = true
        this.delSupplierData = row
      },

      /**
       * 改变状态
       */
      handleSwitch (item) {
        // console.log(item.isShow)
        this.$http.post('@ROOT_API/shareTheme/updateGoldBeanRuleByRuleType', {
          ruleType: item.ruleType,
          delStatus: item.delStatus ? 0 : 1
        }).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
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
        })
      },

      /**
       * 保存规则
       */
      handleSave (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          let data = []
          this.formData.dateList.forEach((row) => {
            let copyData = this.$Utils.deepCopy(row)
            copyData.delStatus = ''
            data.push(copyData)
          })
          this.formData.tableData.forEach((row) => {
            if (row.ruleType !== 29) {
              let copyData = this.$Utils.deepCopy(row)
              copyData.delStatus = ''
              data.push(copyData)
            }
          })
          this.otherData.forEach((row) => {
            if (row.ruleType === 110 || row.ruleType === 111) {
              data.push({
                dayNum: row.dayNum,
                delStatus: 0,
                handselNum: row.handselNum,
                id: row.id,
                ruleType: row.ruleType
              })
            }
          })
          data.forEach((row) => {
            if (row.ruleType === 110) row.handselNum = this.formData.limitNumber
            if (row.ruleType === 111) row.handselNum = this.formData.maxNumber
          })
          this.saveLoading = true
          this.$http.post('@ROOT_API/shareTheme/editByGoldBeanRule', data).then((res) => {
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
            this.getListData()
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
    .w100{
      width: 100px;
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
