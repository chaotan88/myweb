<!-- 账户信息 -->
<template>
  <common-tpl class="account-index-wrap">
    <template slot="header"></template>
    <template slot="main">  
      <el-form :model="formData" :rules="rules" ref="from" label-width="180px" class="info-form">
        <el-form-item label="登录名：">
          <el-input :disabled="true" v-model="formData.loginName"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input :disabled="true" readonly v-model="formData.phone"></el-input>
          <el-button size="mini" type="text" @click="updatePhoneVisible = true">{{userInfo.phone ? '修改' : '设置'}}</el-button>
        </el-form-item>
        <!-- <el-form-item label="客服电话：" prop="customerPhone">
          <el-input placeholder="20字符以内，例如：0755-88888888" v-model="formData.customerPhone"></el-input>
        </el-form-item> -->
      </el-form>
    </template>
    <template slot="footer">
      <!-- <el-button type="primary" @click="submitHandle">保存</el-button> -->
    </template>

    <template slot="other">
      <!-- 弹窗 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="updatePhoneVisible"
        width="580px">
        <!-- 修改手机号 -->
        <update-phone @close="updatePhoneVisible = false" @success="updatePhoneSuccess"></update-phone>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import UpdatePhone from './UpdatePhone'
export default {
  components: {UpdatePhone},
  data () {
    // 校验网店名称
    let validateCustomerPhone = (rule, value, callback) => {
      if (value) {
        if (value.length > 20) callback(new Error('20个字符以内'))
        callback()
      } else {
        callback()
      }
    }

    return {
      dialogTitle: '',              // 弹窗标题
      updatePhoneVisible: false,    // 修改手机号弹窗
      formData: {
        loginName: '',              // 登录名
        phone: '',                  // 手机号
        customerPhone: ''           // 客服电话
      },
      rules: {
        customerPhone: [{validator: validateCustomerPhone, trigger: 'blur'}]
      },
      userInfo: {}         // 用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.dialogTitle = this.userInfo.phone ? '手机号验证' : '设置手机号'
    this.formData.phone = this.userInfo.phone
    this.formData.loginName = this.userInfo.loginName
  },
  methods: {
    /**
     * 提交数据
     */
    submitHandle () {
      this.$http.post('@ROOT_API/accountSetController/saveUser', {
        id: this.userInfo.userId,          // 用户id
        customerPhone: this.formData.phone
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
        localStorage.setItem(this.$global.USER_INFO, JSON.stringify(this.userInfo))
        this.userInfo.loginName = this.formData.loginName
      })
    },

    /**
     * 手机号修改成功
     */
    updatePhoneSuccess (phone) {
      this.userInfo.phone = phone
      localStorage.setItem(this.$global.USER_INFO, JSON.stringify(this.userInfo))
      this.formData.phone = phone
      this.dialogTitle = '手机号验证'
    }
  }
}
</script>

<style lang="less" scoped>
.account-index-wrap{

  .el-form.info-form{
    .el-form-item{
      margin-top: -1px;
      margin-bottom: 0;
      border: 1px solid #f1f4f7;

      .el-input{
        width: 300px;
        margin-right: 10px;
      }
    }
  }
}
</style>

<style lang="less">
.account-index-wrap{
  .el-form.info-form{
    .el-form-item__label{
      border-right: 1px solid #f1f4f7;
      padding: 15px;
      background: #f8f8f8 !important;
    }

    .el-form-item__content{
      padding: 15px 10px 0 15px;

      .el-form-item__error{
        left: 15px !important;
        top: 78%;
      }
    }
  }
}
</style>
