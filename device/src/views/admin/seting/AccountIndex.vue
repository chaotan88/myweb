<!-- 账户信息 -->
<template>
  <div class="my-info-wrap">
    <div class="my-info-cen">
      <el-form label-position="right" :model="formData" :rules="rules" ref="form" label-width="240px">
        <el-form-item :label="$t('recharge.userName')">
          <span class="phone">{{formData.userName}}</span>
        </el-form-item>
        <el-form-item :label="$t('account.permissionGroup')">
          <span class="phone">{{formData.groupName}}</span>
        </el-form-item>
        <el-form-item :label="$t('account.email')" prop="email">
           <el-input v-model="formData.email" :placeholder="$t('common.pleaseInputEmail')"></el-input>
           <el-button @click="showDialogHandle('Replace Email', 'showCheckPhone')">{{$t('account.replace')}}</el-button>
        </el-form-item>
        <!-- <el-form-item :label="$t('account.location')" class="select-wrap">
          <region-select :assignData="formData.region" @change="regionChange"></region-select>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="ta-c my-info-b">
      <el-button type="primary" @click="submitForm('form')">{{$t('common.save')}}</el-button>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialogWrap"
      :before-close="closeDialogHandle"
      width="580px">
      <!-- 修改手机号 -->
      <update-phone v-if='showCheckPhone' @close="closeDialogHandle" v-bind:phone="formData.phone"></update-phone>
      <!-- <auth-id v-if='showAuthId' @close="closeDialogHandle"></auth-id>
      <auth-enterprise v-if='showAuthEnterprise' @close="closeDialogHandle"></auth-enterprise> -->
    </el-dialog>
  </div>
</template>

<script>
import UpdatePhone from './AccountUpdatePhone'
import AuthId from '@/views/public/AuthId'
import AuthEnterprise from '@/views/public/AuthEnterprise'
import RegionSelect from '@/components/utils/RegionSelect'

export default {
  components: { UpdatePhone, AuthId, AuthEnterprise, RegionSelect },
  data () {
    // 验证邮箱
    let validateEmail = (rule, value, callback) => {
      if (value) {
        var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/gi
        if (!value.match(reg)) {
          callback(new Error('邮箱不合法!'))
        } if (value.match(reg) && value.length > 150) {
          callback(new Error('邮箱内容过长!'))
        }
      } else {
        // callback(new Error('请输入邮箱!'))
      }
      callback()
    }
    return {
      authDialogType: '',                 // 查看认证信息类型
      authDialogTitle: '',                // 查看认证信息标题
      authDialogVisible: false,           // 查看认证信息
      dialogTitle: '',                    // 弹窗标题
      showDialogWrap: false,              // 显示弹窗
      showCheckPhone: false,              // 显示手机号验证弹窗
      showAuthId: false,                  // 显示身份认证弹窗
      showAuthEnterprise: false,          // 显示企业认证弹窗
      formData: {
        phone: '',                        // 手机号码
        email: '',                        // 邮箱
        name: '',                         // 姓名
        company: '',                      // 公司
        address: '',                      // 地址
        region: {
          province: {                     // 省
            code: '',
            name: ''
          },
          city: {                         // 市
            code: '',
            name: ''
          },
          area: {                         // 区
            code: '',
            name: ''
          }
        }
      },
      rules: {
        email: [{required: false, validator: validateEmail, trigger: 'blur'}]
      },
      userInfo: {},                       // 用户信息
      userAllInfo: {}                     // 接口获取用户信息
    }
  },
  mounted () {
    this.getUserInfoHandle()
  },
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfoHandle () {
      this.userAllInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
      // this.$http.post('@ROOT_API/cooperationUserController/viewUser', {
      //   id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId
      // }).then((res) => {
      //   // console.log(JSON.stringify(res, null, 5))
      //   if (!res) return false
      //   let resData = res.data
      //   this.userAllInfo = resData.data
      //   this.formData.name = this.userAllInfo.cardName
      this.formData.userName = this.userAllInfo.userName
      //   this.formData.company = this.userAllInfo.companyName
      //   this.formData.phone = this.userAllInfo.phone
      this.formData.email = this.userAllInfo.email
      //   this.formData.invitationCode = this.userAllInfo.invitationCode
      //   this.formData.groupName = this.userAllInfo.groupName
      //   this.formData.cardStatus = this.userAllInfo.cardStatus
      //   this.formData.companyStatus = this.userAllInfo.companyStatus
      //   this.formData.region.province.name = this.userAllInfo.userProvince
      //   this.formData.region.province.code = this.userAllInfo.userProvinceCode
      //   this.formData.region.city.name = this.userAllInfo.userCity
      //   this.formData.region.city.code = this.userAllInfo.userCityCode
      //   this.formData.region.area.name = this.userAllInfo.userZone
      //   this.formData.region.area.code = this.userAllInfo.userZoneCode
      // })
    },

    /**
     * 显示弹窗
     * @param  {[type]} title      [弹窗标题]
     * @param  {[type]} content    [弹窗主体内容]
     */
    showDialogHandle (title, content) {
      this.showDialogWrap = true
      this.dialogTitle = title
      this[content] = true
    },

    /**
     * 关闭弹窗
     */
    closeDialogHandle () {
      this.showDialogWrap = false
      this.showCheckPhone = false
      this.showAuthId = false
      this.showAuthEnterprise = false

      this.getUserInfoHandle()
    },
    /**
     * 保存用户信息
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.$http.post('@ROOT_API/cooperationUserController/saveUser', {
          id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId,
          phone: this.formData.phone,
          email: this.formData.email,
          cardStatus: this.userAllInfo.cardStatus,
          companyStatus: this.userAllInfo.companyStatus,
          userProvince: this.formData.region.province.name,
          userProvinceCode: this.formData.region.province.code,
          userCity: this.formData.region.city.name,
          userCityCode: this.formData.region.city.code,
          userZone: this.formData.region.area.name,
          userZoneCode: this.formData.region.area.code
        }).then((res) => {
          // console.log(res)
          let resData = res.data
          if (resData.status !== '1') {
            this.$message.error(resData.msg)
            return false
          }
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.getUserInfoHandle()
        })
      })
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 查看认证信息
     */
    viewHandle (type) {
      this.authDialogType = type
      this.authDialogTitle = type === 'id' ? '身份信息' : '企业认证'
      this.authDialogVisible = true
    }

  }
}
</script>

<style lang='less' scoped>
.my-info-wrap{
  .my-info-cen{
    padding: 40px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 16px rgba(51, 113, 155, .06);

    h2{
      font-size: 18px;
      margin-bottom: 20px;
      padding-left: 20px;
    }

    .el-form{
      border: 1px solid #eff2f6;
      border-bottom: 0;

      .el-form-item{
        border-bottom: 1px solid #eff2f6;
        margin-bottom: 0;

        .phone{
          color: #999;
          font-size: 16px;
        }

        .success-btn{
          color: #79d40b;
          font-size: 14px;
          border: 1px solid #79d40b;
          padding: 2px 8px;
          background: #f1fbe6;
          border-radius: 5px;
        }

        .uncertified{
          color: #ff3a31;
          font-size: 14px;
          border: 1px solid #ff3a31;
          padding: 2px 8px;
          // background: #ffebea;
          border-radius: 5px;
        }

        .el-input{
          width: 440px;
        }

        .el-button{
          color: #33719b;
          border-color: #33719b;
          padding: 5px 15px;
          margin-left: 10px;
          background: #eaf1f5;
          border-radius: 4px;
        }

        .el-button:hover{
          color: #fff;
          background: #33719b;
        }
      }
    }
  }

  /* -------------------- { 查看认证信息 } -------------------- */
  .view-authinfo-wrap{
    dl{
      min-height: 30px;
      line-height: 30px;
      font-size: 16px;
      padding-left: 120px;
      margin-bottom: 10px;

      dt{
        width: 110px;
        left: 0;
      }

      dd{
        img{
          width: 100px;
          height: 100px;
        }
      }
    }

    .btn-wrap{
      padding-top: 30px;
    }
  }

  .my-info-b{
    margin-top: 30px;

    .el-button{
      border: 0;
      font-size: 16px;
      // letter-spacing: 3px;
      padding: 10px 30px;
      background: #33719b;
    }
  }
}
</style>

<style lang='less'>
.my-info-wrap{
  .my-info-cen{

    .el-form-item{

      .el-form-item__label{
        font-size: 14px;
        border-right: 1px solid #eef1f5;
        padding: 10px 50px 10px 0;
        background: #f8f8f8;
      }

      .el-form-item__content{
        padding: 15px 0 0 60px;
      }
    }

    .el-form-item.select-wrap{
      .el-form-item__content{
        width: 440px;
      }
    }
  }
}
</style>
