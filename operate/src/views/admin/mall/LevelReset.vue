<!-- 创客特权 -->
<template>
  <common-tpl :footer="false" class="level-reset-wrap">
    <!-- 主体 -->
    <template slot="main">
      <el-form :model="tableFormData" ref="tableFormData">
        <el-table :data="formData" style="width: 100%;" class="goods-level-box">
          <el-table-column prop="rankName" label="创客等级" width="160"></el-table-column>
          <el-table-column prop="points" label="积分数" width="160"></el-table-column>
          <el-table-column prop="consignmentGoodsNum" label="代销商品数量（件）">
            <template slot-scope="scope">
              <span v-if="scope.row.saveEdit === 1">{{ scope.row.consignmentGoodsNum }}</span>
              <el-form v-if="scope.row.saveEdit !== 1" :model="scope.row" :rules="rules" :ref="'formData' + scope.$index">
                <el-form-item prop="consignmentGoodsNum">
                  <el-input v-model="scope.row.consignmentGoodsNum" placeholder="仅限0和正整数"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="commissionRate" label="分佣比例（%）">
            <template slot-scope="scope">
              <span v-if="scope.row.saveEdit === 1">{{ scope.row.commissionRate }}</span>
              <el-form v-if="scope.row.saveEdit !== 1" :model="scope.row" :rules="rules" :ref="'formData' + scope.$index">
                <el-form-item prop="commissionRate">
                  <el-input placeholder="精确到小数点后两位" v-model="scope.row.commissionRate" @blur="inpBlur(scope.row)"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="withdrawalPeriod" label="提现周期（天）">
            <template slot-scope="scope">
              <span  v-if="scope.row.saveEdit === 1">{{ scope.row.withdrawalPeriod }}</span>
              <el-form v-if="scope.row.saveEdit !== 1" :model="scope.row" :rules="rules" :ref="'formData' + scope.$index">
                <el-form-item prop="withdrawalPeriod">
                  <el-input v-model="scope.row.withdrawalPeriod" placeholder="仅限0和正整数，0代表实时体现"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="说明">
            <template slot-scope="scope">
              <span class="text-ellipsis" v-if="scope.row.saveEdit === 1">{{ scope.row.description }}</span>
              <el-form v-if="scope.row.saveEdit !== 1" :model="scope.row" :rules="rules" :ref="'formData' + scope.$index">
                <el-form-item class="pos-r intru-text" prop="description">
                  <el-input v-model="scope.row.description" type="textarea" :rows="3"></el-input>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column prop="applyStatus" label="是否可申请开店" width="180" fixed="right">
            <template slot-scope="scope">
              <template v-if="pageType === 1">
                {{scope.row.applyStatus ? '是' : '否'}}
                <el-switch
                  v-model="scope.row.applyStatus"
                  active-color="#56ade8"
                  inactive-color="#ccc"
                  @change="statusChange(scope.row, scope.$index)">
                </el-switch>
              </template>
              <template v-else>--</template>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <template slot-scope="scope">
              <el-button class="save-edit" type="text" @click="scope.row.saveEdit = 2" size="small" v-if="scope.row.saveEdit === 1">编辑</el-button>
              <el-button type="text" @click="scope.row.saveEdit = 1" size="small" v-if="scope.row.saveEdit === 2">取消</el-button>
              <el-button type="text" @click="submitForm('formData' + scope.$index, scope.row)" size="small" v-if="scope.row.saveEdit === 0 || scope.row.saveEdit === 2">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
     // 验证代销商品数量
    let validateSaleNum = (rule, value, callback) => {
      if (!value) return
      let reg = /^\d+$/gi
      if (!value.toString().match(reg)) callback(new Error('只能输入正整数'))
      callback()
    }

    // 验证分佣比例
    let validatePercent = (rule, value, callback) => {
      if (!value) return
      let reg = /^(0|[1-9]\d{0,2})\.\d{2}$/gi
      if (parseFloat(value) > 100 || !value.toString().match(reg)) callback(new Error('请输入正确的分佣比例，100%以内'))
      callback()
    }

    // 验证提现周期
    let validateCycle = (rule, value, callback) => {
      if (!value) return
      let reg = /^\d+$/gi
      if (!value.toString().match(reg)) callback('只能输入正整数')
      callback()
    }

    // 验证说明
    let validateIntruction = (rule, value, callback) => {
      // if (!value) callback(new Error('请输入说明'))
      callback()
    }

    return {
      // 表单数据
      pageType: 1,            // 页面类型［1、已采购，2、待采购]
      tableFormData: {},
      formData: [],
      formDataCopy: [],       // 深拷贝
      rules: {
        // 代销商品数
        consignmentGoodsNum: { validator: validateSaleNum, trigger: 'blur' },
        // 分佣比例
        commissionRate: { validator: validatePercent, trigger: 'blur' },
        // 提现周期
        withdrawalPeriod: { validator: validateCycle, trigger: 'blur' },
        // 说明
        description: { validator: validateIntruction, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.formData.map(item => {})
    this.getListData()
  },
  methods: {
    /**
    * 得到列表
    */
    getListData () {
      this.$http.post('@ROOT_API/makerPrivilegeController/getMemberRuleDetailList', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error'
          })
          this.formData = []
          return false
        }
        resData.data.forEach((row) => {             // 循环列表追加操作字段，默认为0
          row.saveEdit = 0
        })
        resData.data.forEach((row) => {
          row.applyStatus = (parseInt(row.applyStatus) === 1) ? !!true : !!false
        })
        this.formData = resData.data
        this.formDataCopy = this.$Utils.deepCopy(this.formData)
      })
    },

    /**
     * 状态改变
     */
    statusChange (row, index) {
      if (row.applyStatus === false) {
        this.formData.forEach((row, tableIndex) => {
          if (tableIndex <= index && row.applyStatus === true) this.statusChangePublic(row, 0)
        })
        this.statusChangePublic(row, 0)
      } else {
        this.formData.forEach((row, tableIndex) => {
          if (tableIndex >= index && row.applyStatus === false) this.statusChangePublic(row, 1)
        })
        this.statusChangePublic(row, 1)
      }
    },

    /**
     * 是否可申請開店
     */
    statusChangePublic (row, applyStatus) {
      this.$http.post('@ROOT_API/makerPrivilegeController/saveMemberRuleDetail', {
        id: row.id,
        applyStatus
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error'
          })
          return false
        }
        row.applyStatus = applyStatus === 0 ? !!false : !!true
      })
    },

    /**
     * 自动补全百分位
     */
    inpBlur (obj) {
      if (isNaN(obj.commissionRate)) return
      this.$Utils.blurAutoCompletion(obj, 'commissionRate')
    },

    /**
     *  点击保存
     */
    submitForm (fieldName, item) {
      this.$refs[fieldName].validate((valid) => {
        if (!valid) return false
        // ajax
        let changeFlag = true
        this.formDataCopy.map(obj => {
          if (obj.id === item.id && obj.consignmentGoodsNum === item.consignmentGoodsNum &&
          obj.commissionRate === item.commissionRate &&
          obj.withdrawalPeriod === item.withdrawalPeriod &&
          obj.description === item.description &&
          obj.applyStatus === item.applyStatus) {
            changeFlag = false
          }
        })
        if (!changeFlag) {
          item.saveEdit = 1
          return false
        }
        item.saveEdit = 0
        this.$http.post('@ROOT_API/makerPrivilegeController/saveMemberRuleDetail', {
          id: item.id,                                    // id
          consignmentGoodsNum: item.consignmentGoodsNum,  // 代销商品数量
          commissionRate: item.commissionRate,            // 分佣比例
          withdrawalPeriod: item.withdrawalPeriod,        // 提现周期
          description: item.description,                  // 说明
          applyStatus: item.applyStatus === true ? 0 : 1  // 是否可申请开店
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
          item.saveEdit = 1
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.level-reset-wrap {
  .goods-level-box {

    .el-form{
      height: 90px;
      padding-top: 30px;
    }

    .intru-text{
      top: -18px;
    }

    .el-form-item{
      margin: 12px 0;
    }

    .text-ellipsis{
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      -moz-box-orient: vertical;
      -moz-line-clamp: 3;
      -o-box-orient: vertical;
      -o-line-clamp: 3;
    }
  }
}
</style>

<style lang="less">
.level-reset-wrap{
  td {
    padding: 0;
    height: 101px;
  }
}
</style>
