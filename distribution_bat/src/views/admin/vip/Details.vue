<!-- 会员申请详情 -->
<template>
  <common-tpl class="vip-public-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">

        <el-form :model="formData" :rules="rules" ref="basicForm" class="ta-l">
          <!-- 会员基本信息 -->
          <gray-title title="会员基本信息"></gray-title>
          <table>
            <tr>
              <td>会员手机：</td>
              <td>{{datailsData.customerPhone | filterEmpty}}</td>
            </tr>
            <tr>
              <td>会员ID：</td>
              <td>{{datailsData.invitationCode | filterEmpty}}</td>
            </tr>
            <tr>
              <td>会员类型：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.memberType | filterMemberType}}</template>
                <template v-else>
                  <el-radio-group v-model="formData.memberType">
                    <el-radio :label="1">正常会员</el-radio>
                    <el-radio :label="2">特批会员</el-radio>
                  </el-radio-group>
                </template>
              </td>
            </tr>
            <tr>
              <td>当前身份：</td>
              <td>
                <el-row type="flex">
                  <span style="margin-right: 20px">{{datailsData.rankName | filterEmpty}}</span>
                  <el-button type="primary"   v-if="(datailsData.ifUpgrade === 1 && datailsData.rank !== 8) && pageType === 2" @click="handleUpgradeBefore(datailsData)">账户升级</el-button>
                </el-row>
               <!-- <template v-else>
                  <el-select placeholder="选择会员身份" v-model="formData.ruleId" @change="ruleChange">
                    <template v-for="item in ruleAllData">
                      <el-option :value="item.ruleId" :label="item.ruleName"></el-option>
                    </template>
                  </el-select>
                </template>-->
              </td>
            </tr>
            <tr>
              <td>代理级别：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.cardType | filterEmpty}}</template>
                <template v-else>
                  <el-form-item prop="agentRandStr" class="activate">
                    <el-radio-group v-model="formData.agentRandStr">
                      <el-radio :label="1">市级代理</el-radio>
                      <el-radio :label="2">地区代理</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </td>
            </tr>
            <tr>
              <td>代理区域：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.agentProvince + datailsData.agentCity + datailsData.agentZone| filterEmpty}}</template>
                <template v-else>
                  <el-form-item class="select-wrap">
                    <region-select :assignData="formData.region" @change="regionChange"></region-select>
                  </el-form-item>
                </template>
              </td>
            </tr>
            <tr>
              <td>证件类型：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.cardType | filterCardType}}</template>
                <template v-else>
                  <el-radio-group v-model="formData.agentRandStr">
                    <el-radio :label="1">身份证</el-radio>
                    <el-radio :label="2">护照</el-radio>
                  </el-radio-group>
                </template>
              </td>
            </tr>
            <tr>
              <td class="with-asterisk">会员姓名：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.cardName | filterEmpty}}</template>
                <template v-else>
                  <el-form-item prop="cardName">
                    <el-input placeholder="请输入真实姓名" v-model="formData.cardName" clearable></el-input>
                  </el-form-item>
                </template>
              </td>
            </tr>
            <!-- <tr>
              <td>身份证：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.idCard | filterEmpty}}</template>
                <template v-else>
                  <el-input placeholder="请输入身份证" v-model="formData.idCard" clearable></el-input>
                </template>
              </td>
            </tr> -->
            <tr>
              <td class="with-asterisk">证件号：</td>
              <td>
                <template v-if="pageType === 1">{{datailsData.idCard | filterEmpty}}</template>
                <template v-else>
                  <el-form-item prop="idCard">
                    <el-input :placeholder="'请输入' + (formData.cardType === 1 ? '身份证' : '护照')" v-model="formData.idCard" clearable></el-input>
                  </el-form-item>
                </template>
              </td>
            </tr>
            <tr>
              <td>性别：</td>
              <td>{{datailsData.sex}}</td>
            </tr>
            <tr>
              <td>地区：</td>
              <td>{{datailsData.region | filterEmpty}}</td>
            </tr>
            <tr>
              <td>最后登录时间：</td>
              <td>{{datailsData.lastLoginTime | filterDate}}</td>
            </tr>
            <tr>
              <td>注册时间：</td>
              <td>{{datailsData.registerTime}}</td>
            </tr>
          </table>

          <template v-if="pageType === 1">
            <!-- 会员账户信息 -->
            <gray-title title="会员基本信息"></gray-title>
            <table>
              <tr>
                <td>金额账户余额：</td>
                <td>{{datailsData.balance | filterEmpty}}</td>
              </tr>
              <tr>
                <td>消费积分余额：</td>
                <td>{{datailsData.bonusPoints | filterEmpty}}</td>
              </tr>
              <tr>
                <td>通用积分余额：</td>
                <td>{{datailsData.cashPoints | filterEmpty}}</td>
              </tr>
            </table>

            <!-- 邀请人信息 -->
            <gray-title title="邀请人信息"></gray-title>
            <table>
              <tr>
                <td>邀请人ID号：</td>
                <td>{{datailsData.inviterInvitationCode | filterEmpty}}</td>
              </tr>
              <tr>
                <td>邀请人姓名：</td>
                <td>{{datailsData.invitationName | filterEmpty}}</td>
              </tr>
              <tr>
                <td>邀请人手机：</td>
                <td>{{datailsData.inviterPhone | filterEmpty}}</td>
              </tr>
              <tr>
                <td>邀请人身份：</td>
                <td>{{datailsData.inviterDisRuleName | filterEmpty}}</td>
              </tr>
            </table>
          </template>
        </el-form>
      </div>
    </template>

    <template slot="other">
      <el-dialog title="输入密码" :visible.sync="dialogVisible" width="480px">
        <el-form :model="formData" :rules="rules" ref="form" label-width="90px" class="ta-l">
          <el-form-item prop="password">
            <el-input type="password" placeholder="输入修改密码" v-model="formData.password"></el-input>
          </el-form-item>
        </el-form>
        <template slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit('form')">确 定</el-button>
        </template>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <!-- <el-button type="primary" @click="dialogVisible = true" v-if="pageType === 2">提交</el-button> -->
      <el-button type="primary" @click="handleSubmitBefore('basicForm')" v-if="pageType === 2">提交</el-button>
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
      pageType: 1,            // 页面类型 [1、详情，2、编辑]
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
      dialogVisible: false,   // 弹窗
      ruleAllData: [],        // 规则等级列表
      datailsData: {},        // 详情信息
      storeData: {}           // 商品id
    }
  },
  mounted () {
    if (this.$route.path.match(/edit/gi)) this.pageType = 2
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
    this.datailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'VipDatails'))
    console.log('this.datailsData: ', this.datailsData)
    this.formData.ruleId = parseInt(this.datailsData.ruleId)
    this.formData.cardType = this.datailsData.cardType
    this.formData.cardName = this.datailsData.cardName
    this.formData.idCard = this.datailsData.idCard
    this.formData.ruleName = this.datailsData.ruleName
    if (this.pageType === 2) this.getRuleAllSubs()
  },

  methods: {
    /**
     * 获取所有分销规则比例级数
     */
    getRuleAllSubs () {
      this.$http.post('@ROOT_API/rule/getDisRuleAllSubs', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.ruleAllData = resData.data
      })
    },

    /**
     * 选择规则
     */
    ruleChange (id) {
      let filterRes = this.ruleAllData.filter((row) => parseInt(row.ruleId) === parseInt(id))[0]
      this.formData.ruleName = filterRes.ruleName
    },

    /**
     * 提交前操作
     */
    handleSubmitBefore (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.dialogVisible = true
      })
    },
    /**
     * 账户升级前操作
     */
    handleUpgradeBefore (row) {
      this.$router.push({
        path: '/admin/vip/center/upgrade',
        query: {userId: row.customerId}
      })
      //  localStorage.setItem(this.$global.SYSTEM + 'VipDatails', JSON.stringify(row))
    },
    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 提交操作
     */
    handleSubmit (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.submitLoading = true
        this.$http.post('@ROOT_API/buyMemberAccountManageController/updateMemberInfo', {
          id: this.datailsData.id,                   // 是 int 会员id
          disRuleId: this.formData.ruleId,           // 否 int 身份id
          disRuleName: this.formData.ruleName,       // 否 string  身份
          cardType: this.formData.cardType,          // 证件类型
          memberType: this.formData.memberType,      // 会员类型
          idCard: this.formData.idCard,              // 否 string 身份证号
          cardName: this.formData.cardName,          // 否 string 姓名
          managerPassword: this.formData.password    // 是 string 密码

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
            duration: 1000
          })
          this.dialogVisible = false
          this.datailsData.ruleId = this.formData.ruleId
          this.datailsData.idCard = this.formData.idCard
          this.datailsData.cardType = this.formData.cardType
          this.datailsData.cardName = this.formData.cardName
          localStorage.setItem(this.$global.SYSTEM + 'VipDatails', JSON.stringify(this.datailsData))
          this.$router.back()
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

