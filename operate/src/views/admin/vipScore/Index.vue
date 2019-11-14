<!-- 积分设置 -->
<template>
  <common-tpl class="vipScore-index-wrap" footer>
    <!-- 主体 -->
    <template slot="main">
      <div class="buy-goods-wrap">
        <h4>购买商品积分设置</h4>
        <p class="description">（根据利润范围设置购买商品获取积分规则）</p>
        <el-form :model="tableFormData" class="form-box pos-r" ref="tableFormData" :rules="rules">
          <div class="pos-r" style="padding-right: 90px;">
            <table cellspacing="0" cellpadding="0" class="full-w">
              <tr class="header">
                <th width="25%">利润率起始值</th>
                <th></th>
                <th width="28%">利润率终止值</th>
                <th width="30%">获取积分比例（占进货价比值）</th>
              </tr>
              <tbody>
                <tr v-for="(item, index) in tableFormData.formData" v-if="tableFormData.formData.length">
                  <td>
                    <el-form-item :key="item.key" :prop="'formData.' + index + '.profitRateMin'">
                      <el-input v-model="item.profitRateMin" placeholder="仅限0或正整数" disabled style="width: 130px"></el-input>
                      &nbsp;%
                    </el-form-item>
                  </td>
                  <td>{{item.profit}}</td>
                  <td>
                    <el-form-item :key="item.key" :prop="'formData.' + index + '.profitRateMax'" class="pos-r">
                      <el-input v-model="item.profitRateMax" placeholder="仅限0或正整数" style="width: 130px" @blur="filterInpRes"></el-input>
                      &nbsp;%
                      <div class="pos-a tip-message" :class="{flag: !item.tableFlag}">{{item.tipMessage}}</div>
                    </el-form-item>
                  </td>
                  <td>
                    <el-form-item :key="item.key" :prop="'formData.' + index + '.profitRateSub'" :rules="ValidCommissionRate">
                      利润率&nbsp;-&nbsp;
                      <el-input v-model="item.profitRateSub" placeholder="仅限0或正整数" style="width: 130px" @blur="handleAutoComp(item)"></el-input>&nbsp;
                      &nbsp;%
                    </el-form-item>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="pos-a operater-box">
              <el-button class="pos-a" @click="handleAdd"><i class="el-icon-plus fw-b"></i></el-button>
              <el-button class="pos-a" style="bottom: 20px;" @click="tableFormData.formData.pop()" v-if="tableFormData.formData.length"><i class="el-icon-minus fw-b"></i></el-button>
            </div>

            <!-- 暂无数据 -->
            <no-data v-if="!tableFormData.formData.length"></no-data>
          </div>

          <div class="fixed-wrap">
            <h4>固定积分设置</h4>
            <div class="fixed-box">
              <el-form-item prop="pointsRegister" label="注册送积分：" label-width="100px">
                <el-input v-model="tableFormData.pointsRegister" placeholder="仅限正整数" class="d-ib"></el-input>&nbsp;&nbsp;
                <span>积分</span>
                <span class="text">（首次注册获得）</span>
              </el-form-item>
              <br>
              <el-form-item prop="pointsRecommend" label="推 荐 买 家：" label-width="100px">
                <el-input v-model="tableFormData.pointsRecommend" placeholder="仅限正整数"></el-input>&nbsp;&nbsp;
                <span>积分</span>
                <span class="text">（推荐买家注册获得）</span>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="loading" @click="submitForm('tableFormData')">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      // 验证利润起始值/终止值
      let validateInput = (rule, value, callback) => {
        if (!value) return callback()
        let reg = /^([1-9]\d{0,3}|0|10000)$/gi
        if (!value.toString().match(reg)) return callback(new Error('请输入正确的分佣比例，10000%以内'))
        callback()
      }
      // 验证积分比例
      let validateComminsion = (rule, value, callback) => {
        if (!value) return callback()
        let reg = /^([1-9]\d{0,3}|0|10000)\.\d{2}$/gi
        if (parseFloat(value) > 10000 || !value.toString().match(reg)) return callback(new Error('请输入正确的分佣比例，10000%以内'))
        callback()
      }
      // 验证固定积分
      let validateFixed = (rule, value, callback) => {
        if (!value) return callback()
        let reg = /^[1-9]\d*$/gi
        if (!value.toString().match(reg)) return callback(new Error('请输入0或正整数'))
        callback()
      }
      return {
        loading: false,
        tableFormData: {         // form集合
          pointsRecommend: '',   // 注册送积分
          pointsRegister: '',    // 推荐买家
          formData: []
        },
        fixedFormData: {},       // 固定积分form
        formFlag: true,
        // tipMessage: '输入不得大于下一级的终止值',
        rules: {
          pointsRegister: { validator: validateFixed, trigger: 'blur' },
          pointsRecommend: { validator: validateFixed, trigger: 'blur' }
        },
        ValidProfitEnd: { validator: validateInput, trigger: 'blur' },
        ValidCommissionRate: { validator: validateComminsion, trigger: 'blur' }
      }
    },

    mounted () {
      this.getListData()
    },

    methods: {
      /**
      * 得到列表
      */
      getListData () {
        this.$http.post('@ROOT_API/bonuspoints/get', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error'
            })
            return false
          }
          let results = resData.data
          this.tableFormData.pointsRecommend = results.pointsRecommend
          this.tableFormData.pointsRegister = results.pointsRegister
          results.buyPointsProfitRateResultList.forEach((item) => {
            item.profitRateMin = item.profitRateMin ? item.profitRateMin : 0
            item.profit = '<=  利润率  <'
            item.profitRateMax = item.profitRateMax ? item.profitRateMax : 0
            item.tableFlag = true
            item.tipMessage = null
            this.tableFormData.formData.push(item)
            this.$Utils.blurAutoCompletion(item, 'profitRateSub')
          })
        })
      },

      /**
       * 点击增加按钮
       */
      handleAdd () {
        let profitRateMin = this.tableFormData.formData.length && this.tableFormData.formData[this.tableFormData.formData.length - 1].profitRateMax || 0
        this.tableFormData.formData.push({
          profitRateMin: profitRateMin,
          profit: '<=  利润率  <',
          profitRateMax: null,
          tableFlag: true,
          tipMessage: '利润终止值不得小于利润起始值',
          profitRateSub: null
        })
      },

      /**
       * 利润blur事件
       */
      handleAutoComp (obj) {
        if (isNaN(obj.profitRateSub)) return
        this.$Utils.blurAutoCompletion(obj, 'profitRateSub')
      },

      /**
       * 过滤输入值是否符合规则
       */
      filterInpRes () {
        return new Promise((resolve, reject) => {
          let formData = this.tableFormData.formData
          formData.forEach((item, index) => {
            // 判断是否为空
            if (!item.profitRateMax) {
              item.tipMessage = '请输入利润率终止值'
              item.tableFlag = false
              return
            }
            // 判断非数字
            if (isNaN(item.profitRateMax)) {
              item.tipMessage = '请输入正确的利润率终止值'
              item.tableFlag = false
              return
            }
            let profitRateMax = parseFloat(item.profitRateMax) || 0
            let profitRateMin = parseFloat(item.profitRateMin) || 0
            if (profitRateMax <= profitRateMin) {
              item.tipMessage = '利润率终止值不得小于利润率起始值'
              item.tableFlag = false
              return
            }
            if (profitRateMax > 10000) {
              item.tipMessage = '请输入正确的利润率终止值，10,000以内'
              item.tableFlag = false
              return
            }
            if (index !== 0) {
              let prevObj = formData[index - 1]
              if (profitRateMax <= parseFloat(prevObj.profitRateMax)) {
                item.tableFlag = false
                item.tipMessage = '输入不得大于等于下一级的终止值'
                return
              }
            }
            item.tableFlag = true
            if (index < formData.length - 1) formData[index + 1].profitRateMin = item.profitRateMax || item.profitRateMin
            if (index === formData.length - 1) {
              this.formFlag = true
              resolve()
            }
          })
        })
      },

      /**
       *  点击保存
       */
      submitForm (fieldName) {
        let formFlag = this.formFlag
        this.$refs[fieldName].validate((valid) => {
          if (!valid || !formFlag) return false
          this.filterInpRes().then(() => {
            this.loading = true
            this.$http.post('@ROOT_API/bonuspoints/addOrSave', {
              buyPointsProfitRateResultList: this.tableFormData.formData,
              pointsRegister: this.tableFormData.pointsRegister,
              pointsRecommend: this.tableFormData.pointsRecommend
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
                message: '保存成功',
                type: 'success',
                duration: 1500
              })
            }).finally(() => {
              setTimeout(() => {
                this.loading = false
              }, 500)
            })
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.vipScore-index-wrap {
  .buy-goods-wrap{

    .description{
      font-size: 12px;
    }

    .form-box{

      table{
        margin: 20px 0;
        font-size: 14px;

        .header{
          height: 50px;
          background: #eef1f9;

          th{
            text-align: left;
            font-weight: normal;
            padding: 10px;
          }
        }

        tbody{
          tr{

            td{
              border-bottom: 1px solid #ebeef5;
              padding: 20px 0;
            }

            td:first-child{
              border-left: 1px solid #ebeef5;
            }

            td:last-child{
              border-right: 1px solid #ebeef5;
            }

            .el-form-item{
              margin: 0 11px;

              .el-input{
                width: 160px;
              }
            }

            .tip-message{
              top: 27px;
              left: 0;
              height: 0;
              overflow: hidden;
              color: #f56c6c;
              font-size: 12px;
              padding-top: 4px;
              transition: all ease-in-out .5s;
              white-space: nowrap !important;
            }
            .flag{
              height: 30px;
            }
          }
        }
      }

      .fixed-wrap{
        height: 200px;
        margin-top: 40px;

        .fixed-box{
          margin: 20px 0;
          font-size: 14px;

          .text{
            color: #e43937;
          }

          .el-input{
            width: 120px;
          }
        }
      }
    }

    .operater-box{
      height: 100%;
      top: 0;
      right: 0;

      .el-button{
        color: #2eaaf7;
        border-color: #2eaaf7;
        right: 0;
      }

      .el-button:first-child{
        top: 5px;
      }

      i{
        position: relative;
        left: -2px;
      }

      p{
        margin-bottom: 6px;
      }

      span{
        width: 8px;
        height: 12px;
      }

      li{
        height: 100px;
        line-height: 100px;

        .active{
          display: none;
        }
      }
    }
  }

}
</style>
<style lang="less">
.vipScore-index-wrap{
}
</style>
