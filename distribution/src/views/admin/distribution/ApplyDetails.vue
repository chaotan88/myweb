<!-- 会员申请详情 -->
<template>
  <common-tpl class="manage-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <!-- 会员信息 -->
          <h2 class="title maggin-t">会员信息</h2>
          <table>
            <tr>
              <td>会员手机：</td>
              <td>{{detailsData.phone | filterEmpty}}</td>
            </tr>
            <tr>
              <td>当前身份：</td>
              <td>{{detailsData.currentIdentity | filterEmpty}}</td>
            </tr>
            <tr>
              <td>证件类型：</td>
              <td>{{detailsData.cardType | filterCardType}}</td>
            </tr>
            <tr>
              <td>姓名：</td>
              <td>{{detailsData.cardName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>证件号：</td>
              <td>{{detailsData.idCard | filterEmpty}}</td>
            </tr>
            <tr>
              <td>性别：</td>
              <td>{{detailsData.sex}}</td>
            </tr>
            <tr>
              <td>地区：</td>
              <td>{{detailsData.userAddress | filterEmpty}}</td>
            </tr>
          </table>

          <!-- 升级信息 -->
          <h2 class="title">升级信息</h2>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>申请编号：</td>
              <td>{{detailsData.applyNo | filterEmpty}}</td>
            </tr>
            <tr>
              <td>申请成为：</td>
              <td>{{detailsData.applyIdentity | filterEmpty}}</td>
            </tr>
            <tr>
              <td>代理金额：</td>
              <td>{{detailsData.payAmount | filterMoney | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>代理级别：</td>
              <td>{{detailsData.agentRandStr | filterEmpty}}</td>
            </tr>
            <tr>
              <td>代理区域：</td>
              <td>{{detailsData.agentZoneStr | filterEmpty}}</td>
            </tr>
          </table>

          <!-- 支付信息 -->
          <h2 class="title">支付信息</h2>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>应付金额：</td>
              <td>{{detailsData.payAmount | filterMoney | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>付款方式：</td>
              <td>{{detailsData.payType | filterPayType}}</td>
            </tr>
            <tr>
              <td>付款凭证：</td>
              <td>
                <template v-if="detailsData.paymentVoucher && detailsData.paymentVoucher.length">
                  <div class="d-ib thumbnail-wrap" v-for="item in detailsData.paymentVoucher">
                    <a :href="item | filterImgUrl" target="_blank">
                      <img class="full-wrap" :src="item | filterImgUrl">
                    </a>
                  </div>
                </template>
                <template v-else>{{'' | filterEmpty}}</template>
              </td>
            </tr>
            <tr>
              <td>支付状态：</td>
              <td>{{detailsData.payStatus | filterPayStatus(detailsData.payType)}}</td>
            </tr>
            <tr>
              <td>第三方支付单号：</td>
              <td>{{detailsData.transactionId | filterEmpty}}</td>
            </tr>
          </table>

          <h2 class="title">邀请人信息</h2>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>邀请人ID：</td>
              <td>{{detailsData.beInvitationCode | filterEmpty()}}</td>
            </tr>
            <tr>
              <td>邀请人姓名：</td>
              <td>{{detailsData.beCardName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>邀请人身份：</td>
              <td>{{detailsData.beRuleName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>邀请人手机号：</td>
              <td>{{detailsData.bePhone | filterEmpty}}</td>
            </tr>
          </table>

          <!-- 激活信息 -->
          <h2 class="title">激活信息</h2>
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td>商城商品：</td>
              <td>{{detailsData.toGoodsMoney | filterMoney | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>商城消费积分：</td>
              <td>{{detailsData.toConsumePoint | filterMoney | filterEmpty('个积分')}}</td>
            </tr>
            <tr v-if="parseInt(detailsData.isOpen) === 0 && parseInt(detailsData.payStatus) === 1">
            <!-- <tr v-if="parseInt(detailsData.isOpen) === 0 && parseInt(detailsData.payStatus) === 1 && parseInt(detailsData.payType) === 3 && parseInt(detailsData.payAuditStatus) === 2 || parseInt(detailsData.payType) !== 3"> -->
              <td>是否激活：</td>
              <td>
                <el-form-item class="resource">
                  <el-radio-group v-model="ruleForm.isOpen">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.isOpen === 2">
              <td>失败原因：</td>
              <td>
                <el-form-item label-width="0" prop="remark">
                  <el-input type="textarea" maxlength="100" rows="5" style="width: 590px" placeholder="填写失败原因" v-model="ruleForm.remark"></el-input>
                  <span>{{ruleForm.remark.length}}/100</span>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </template>

    <template slot="footer">
      <el-button type="primary" v-if="parseInt(detailsData.isOpen) === 0 && parseInt(detailsData.payStatus) === 1" @click="resourceHandle()">提交</el-button>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    // 失败原因
    let validateRemark = (rule, value, callback) => {
      if (value && this.ruleForm.isOpen === 2 && value.length > 100) return callback(new Error('仅100个字符以内'))
      callback()
    }
    return {
      // 审核结果
      ruleForm: {
        isOpen: 1,               // 是否激活
        remark: ''               // 失败原因
      },
      rules: {
        // 失败原因
        remark: [{ validator: validateRemark, trigger: 'blur' }]
      },
      formDataList: {},
      // 详情数据
      detailsData: {},
      applyId: '',               // 申请id
      type: 2,                   // 商品详情
      storeData: {},             // 商品id
      passVisible: false         // 审核弹窗
    }
  },
  mounted () {
    this.applyId = parseInt(this.$route.query.id) || ''
    this.detailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'detailsData'))
    console.log('this.detailsData: ', this.detailsData)
    console.log('this.applyId: ', this.applyId)
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
    this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    getDetails () {
      this.$http.get('@ROOT_API/distributeApplyManage/applyInfo', {
        params: {
          applyId: this.applyId          // long  申请ID
        }
      }).then(res => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let results = resData.data
        if (results) {
          if (results.paymentVoucher) {
            results.paymentVoucher = results.paymentVoucher.split(',')
          } else {
            results.paymentVoucher = []
          }
          this.detailsData = resData.data
        }
      })
    },

    /**
     * 激活账号
     */
    resourceHandle () {
      this.$http.post('@ROOT_API/distributeApplyManage/openApply', {
        applyId: this.applyId,
        isOpen: this.ruleForm.isOpen,
        openInfo: this.ruleForm.remark
      }).then(res => {
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
        this.$router.back()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{

  .goods-common-details{

    .title{
      height: 50px;
      line-height:50px;
      font-size: 16px;
      margin: 20px;
    }

    .maggin-t{
      margin-top: 0;
    }

    table{
      width: 100%;
      border: 1px solid #f1f4f7;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        /*height: 50px;*/
        border: 1px solid #f1f4f7;
        font-size: 15px;
        padding: 20px;
      }

      td:nth-child(odd) {
        color: #666;
        width: 200px;
        text-align: right;
        background: #f8f8f8;
      }

      td:nth-child(even) {
        color: #333;
      }

    }

    .thumbnail-wrap{
      width: 100px;
      height: 100px;
      margin-right: 10px;
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
}
</style>
<style lang="less">
.manage-public-detail-wrap{
  .el-form-item{
    margin-bottom: 0;
  }

  .resource{
    .el-form-item__content{
      margin-left: 0 !important;
    }
  }
}
</style>

