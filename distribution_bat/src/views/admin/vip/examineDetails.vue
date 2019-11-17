<!-- 会员申请详情 -->
<template>
  <common-tpl class="vip-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="formData"  ref="basicForm" class="ta-l">
          <!-- 会员基本信息 -->
          <gray-title title="会员基本信息"></gray-title>
          <table>
            <tr>
              <td>会员手机：</td>
              <td>{{upgradeDetail.userPhone | filterEmpty}}</td>
            </tr>
            <tr>
              <td>姓名：</td>
              <td>{{upgradeDetail.userName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>当前身份：</td>
              <td>{{upgradeDetail.currentRankName | filterEmpty}}</td>
            </tr>
          </table>

          <!-- 升级内容 -->
          <gray-title title="升级内容"></gray-title>
          <table>
            <tr>
              <td>升级成为：</td>
              <td>{{upgradeDetail.rankName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>升级金额：</td>
              <td>{{upgradeDetail.upgradeAmount | filterMoney | filterEmpty('元')}}</td>
            </tr>
          </table>

          <!-- 邀请人信息 -->
          <gray-title title="升级抵扣"></gray-title>
          <table>
            <tr>
              <td>抵扣金额累计：</td>
              <td><span style="color: red">{{upgradeDetail.deductionAmountTotal | filterMoney | filterEmpty}}</span> 元</td>
            </tr>
          </table>
          <el-table :data="tableData" style="width: 100%;margin-bottom: 20px" v-loading="loading" element-loading-text="加载中">
            <el-table-column fixed  label="抵扣类型">
              <template slot-scope="scope">{{scope.row.deductionType | filterDeductionType}}</template>
            </el-table-column>
            <el-table-column  label="扣除账户手机">
              <template slot-scope="scope">{{scope.row.deductionUserPhone | filterEmpty}}</template>
            </el-table-column>
            <el-table-column  label="抵扣售出金额">
              <template slot-scope="scope">{{scope.row.deductionSaleAmount | filterMoney | filterEmpty}}</template>
            </el-table-column>
            <el-table-column  label="账户预计收益">
              <template slot-scope="scope">{{scope.row.expectedProfit | filterMoney | filterEmpty}}</template>
            </el-table-column>
            <el-table-column  label="实际抵扣金额">
              <template slot-scope="scope">{{scope.row.deductionAmount | filterMoney | filterEmpty}}</template>
            </el-table-column>
            <el-table-column  label="剩余未抵扣金额">
              <template slot-scope="scope">{{scope.row.laveAmount | filterMoney | filterEmpty}}</template>
            </el-table-column>
            <el-table-column  label="操作" width="120">
              <template slot-scope="scope" v-if="scope.row.deductionType !== 1"><span class="checkLook" @click="LookDetail(scope.row)"> 查看 </span> </template>
            </el-table-column>
            <div slot="empty">
              <no-data></no-data>
            </div>
          </el-table>

          <!-- 审核结果 -->
          <gray-title title="审核结果"></gray-title>
          <div class="fromBox">
            <el-form :model="updateDate" :rules="rules2" ref="updateDate" label-width="90px" class="ta-l" v-if="upgradeDetail.dealWithStatus === 1">
              <el-form-item   label="处理结果">
                <div>
                  <el-radio v-model="updateDate.dealWithStatus" label="2">审核通过</el-radio>
                  <el-radio v-model="updateDate.dealWithStatus" label="3">打回</el-radio>
                </div>

              </el-form-item>
              <el-form-item   label=" " v-show="updateDate.dealWithStatus == 3">
                <div  class="textarea">
                  <el-input type="textarea" :rows="4" placeholder="请输入打回原因...." v-model="updateDate.returnExplanation" >
                  </el-input>
                </div>
              </el-form-item>
            </el-form>
            <div v-else>
              <span>处理结果：</span>
              <span>{{upgradeDetail.dealWithStatus | filterDealWith}}</span>
            </div>
          </div>
        </el-form>
      </div>
    </template>

    <template slot="other">
      <el-dialog title="查看抵扣记录" :visible.sync="dialogVisible" width="800px">
        <div class="centBox">
          <div class="top">
            <el-row>
              <el-col :span="8">
                <div class="itme">已选择预计收益：<span style="color: red"> {{deduction.expectedProfit | filterEmpty}}</span> 元</div>
              </el-col>
              <el-col :span="8">
                <div class="itme">
                  <div class="itme">抵扣金额：<span style="color: red"> {{deduction.deductionAmount | filterMoney | filterEmpty}}</span> 元</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="itme">
                  <div class="itme">剩余未抵扣收益：<span style="color: red"> {{deduction.laveAmount | filterMoney | filterEmpty}}</span> 元</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="cent">
            <el-table :data="deductionDetail" style="width: 100%;margin-bottom: 20px" v-loading="loading" element-loading-text="加载中">
              <el-table-column fixed  label="待售商品" min-width="120">
                <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
              </el-table-column>
              <el-table-column  label="挂售金额" min-width="120">
                <template slot-scope="scope">{{scope.row.hangSellAmount | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column  label="挂售时间" width="180">
                <template slot-scope="scope">{{scope.row.hangTime | filterDate}}</template>
              </el-table-column>
              <el-table-column  label="预计收益" min-width="120">
                <template slot-scope="scope">{{scope.row.expectedProfit | filterMoney | filterEmpty}}</template>
              </el-table-column>
              <el-table-column  label="是否抵扣" min-width="100">
                <template slot-scope="scope">{{scope.row.ifDeduction | filterifDeduction}}</template>
              </el-table-column>
              <div slot="empty">
                <no-data></no-data>
              </div>
            </el-table>
          </div>
          <div v-show="deduction.deductionVoucher">
            <el-row>
              <el-col :span="4">
                <div class="itme">抵扣凭证</div>
              </el-col>
              <el-col :span="8">
                <div class="imgBox">
                  <a :href="deduction.deductionVoucher | filterImgUrl" target="_blank">
                  <img :src="deduction.deductionVoucher">
                  </a>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <template slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="dialogVisible = false">确 定</el-button>
        </template>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <!-- <el-button type="primary" @click="dialogVisible = true" v-if="pageType === 2">提交</el-button> -->
      <el-button type="primary" @click="handleSubmit('updateDate')" v-if="upgradeDetail.dealWithStatus === 1">提交</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect},
  data () {
    let validateIdCard = (rule, value, callBack) => {
      if (!value) return callBack(new Error('请输入证件号'))
      if (this.formData.cardType === 1 && this.$Utils.filterIdCard(value) !== true) return callBack(new Error('身份证不正确'))
      callBack()
    }
    return {
      submitLoading: false,   // 确定loading
      loading: false,         // 列表loading
      pageType: 1,            // 页面类型 [1、详情，2、编辑]
      upgradeId: '',          // 审核id
      updateDate: {
        id: '',           // 当前身份id
        dealWithStatus: '2',         // 2审核通过 3 打回
        returnExplanation: ''
      },
      formData: {
        ruleId: '',           // 当前身份id
        ruleName: '',         // 当前身份
        cardName: '',         // 姓名
        memberType: 1,        // 会员类型
        agentRandStr: 1,      // 代理级别
        cardType: 1,          // 证件类型
        idCard: '',           // 身份证
        password: ''          // 修改密码
      },
      rules: {
        cardName: [{required: true, message: '请输入真实姓名', trigger: 'blur'}],
        idCard: [{required: true, validator: validateIdCard, trigger: 'blur'}],
        password: [{required: true, min: 1, message: '请输入密码', trigger: 'blur'}]
      },
      rules2: {
      },
      dialogVisible: false,   // 弹窗
      upgradeDetail: {},       // 审核详情
      tableData: [],           // 列表
      deductionDetail: [],      // 抵扣记录列表
      deduction: {}           // 当前抵扣列表
    }
  },
  mounted () {
//    if (this.$route.path.match(/edit/gi)) this.pageType = 2
//    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
//    this.datailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'VipDatails'))
//    console.log('this.datailsData: ', this.datailsData)
//    this.formData.ruleId = parseInt(this.datailsData.ruleId)
//    this.formData.cardType = this.datailsData.cardType
//    this.formData.cardName = this.datailsData.cardName
//    this.formData.idCard = this.datailsData.idCard
//    this.formData.ruleName = this.datailsData.ruleName
//    if (this.pageType === 2) this.getRuleAllSubs()
    this.upgradeId = this.$route.query.upgradeId
    this.pageType = this.$route.query.page
    console.log(this.upgradeId)
    this.getUpgradeReviewDetail()
  },

  methods: {
    /**
     * 获取所有分销规则比例级数
     */
    getUpgradeReviewDetail () {
      this.$http.get('@ROOT_API/buyMemberAccountManageController/getUpgradeReviewDetail', {
//      this.$http.get('/api/json1.json', {
        params: {
          upgradeId: this.upgradeId
        }
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
        this.upgradeDetail = resData.data
        this.tableData = resData.data.deductionList
      })
    },

    /**
     * 抵扣详情请求
     */
    getDeductionDetailList (id) {
      this.$http.get('@ROOT_API/buyMemberAccountManageController/getDeductionDetailList', {
//      this.$http.get('/api/json1.json', {
        params: {
          deductionId: this.deduction.deductionId
        }
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
        this.deductionDetail = resData.data
      })
    },
    /**
     * 抵扣详情查看
     */
    LookDetail (v) {
      this.deduction = v
      this.getDeductionDetailList()
      this.dialogVisible = true
    },

    /**
     * 提交操作
     */
    handleSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.submitLoading = true
        var parm = {
          id: parseInt(this.upgradeId),                   // 审核id
          dealWithStatus: parseInt(this.updateDate.dealWithStatus)          // 处理结果状态 2：审核通过 3：已打回
        }
        if (this.updateDate.returnExplanation) {
          parm.returnExplanation = this.updateDate.returnExplanation
        }
        this.$http.post('@ROOT_API/buyMemberAccountManageController/executeMemberUpgrade', parm).then((res) => {
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
            duration: 1000
          })
          this.$router.push('/admin/vip/upgrade/audit/index')
        }).finally(() => {
          setTimeout(() => {
            this.submitLoading = false
          }, 1000)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.vip-public-detail-wrap{

  .admin-gray-title{
    margin-bottom: 0
  }

  .el-select, .el-input{
    width: 260px !important;
  }

  .goods-common-details{
    .checkLook{
      color: #307bad;
      cursor: pointer;
      display: inline-block;
      width: 100%;
      height: 30px;
      line-height: 30px;
    }
    .title{
      height: 50px;
      line-height:50px;
      font-size: 16px;
      padding-left: 20px;
      padding-bottom: 10px;
    }

    table{
      width: 100%;
      border: 1px solid #f1f4f7;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        border-bottom: 1px solid #f1f4f7;
        font-size: 15px;
        padding: 20px;
      }

      td:nth-child(odd) {
        color: #666;
        width: 200px;
        text-align: right;
      }

      td:nth-child(even) {
        color: #333;
        padding: 0 20px;
      }

    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .fromBox{
    line-height: 40px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 14px;
    margin-bottom: 40px;

    .textarea{
      width: 500px;
    }
  }

  .centBox{
    .top{margin-bottom: 20px;font-size: 14px}
    .imgBox{
      width: 70px;
      height: 70px;
      background: #e1e1e1;
      img{
        width: 100%;
        max-width: 70px;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="less">
.vip-public-detail-wrap{
  .region-select-wrap{
    display:inline !important;
    .el-select{
      width: 260px !important;
    }
  }
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }

  .el-form-item{
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>

