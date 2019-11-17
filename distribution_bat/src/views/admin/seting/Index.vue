<!-- 账户信息 -->
<template>
  <div class="my-info-wrap">
    <div class="my-info-cen">
      <h2 class="fw-n">基本信息</h2>
      <el-form label-position="right" :model="formData" :rules="rules" ref="form" label-width="240px" class="basic-form-wrap">
        <el-form-item label="登录名：">
          <template v-if="userAllInfo.userName">
            <span class="phone">{{userAllInfo.userName}}</span>
          </template>
        </el-form-item>
        <el-form-item label="权限组 ：">
          <span class="phone">{{userAllInfo.groupName ? userAllInfo.groupName : '无'}}</span>
        </el-form-item>
        <el-form-item label="手机号：">
          <span class="phone">{{userInfo.phone | filterPhone}}</span>
          <el-button @click="showDialogHandle('手机号验证', 'showCheckPhone')">设置</el-button>
        </el-form-item>
        <el-form-item label="邮　　箱：" prop="email">
          <el-input v-model="formData.email" placeholder='输入邮箱格式（0-150）'></el-input>
        </el-form-item>
        <!-- <el-form-item label="身份认证：">
          <div v-if="!formData.name">
            <span class="uncertified">未认证</span>
            <el-button @click="showDialogHandle('身份认证', 'showAuthId')">认证</el-button>
          </div>
          <div v-else>
            <span class="success-btn">已认证</span>
            <el-button @click="viewHandle('id')">查看</el-button>
          </div>
        </el-form-item> -->
        <!-- <el-form-item label="企业认证：">
          <template v-if="formData.company">
            <span class="success-btn">已认证</span>
            <el-button @click="viewHandle('company')">查看</el-button>
          </template>
          <template v-else>
            <span class="uncertified">未认证</span>
            <el-button @click="showDialogHandle('企业认证', 'showAuthEnterprise')">认证</el-button>
          </template>
        </el-form-item> -->
        <el-form-item label="所 在 地：" class="select-wrap">
          <region-select :assignData="formData.region" @change="regionChange"></region-select>
        </el-form-item>
        <el-form-item label="安全设置：">
          <el-button type="text" @click="dialogVisible = true">修改密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="ta-c my-info-b">
      <el-button type="primary" @click="submitForm('form')">保存</el-button>
    </div>

    <!-- 弹窗 -->
    <el-dialog class="dialog-left"
      append-to-body="true"
      :title="dialogTitle"
      :visible.sync="showDialogWrap"
      :before-close="closeDialogHandle"
      width="580px">
      <!-- 修改手机号 -->
      <update-phone v-if='showCheckPhone' @close="closeDialogHandle" @success="closeDialogHandle"></update-phone>
      <auth-id v-if='showAuthId' @close="closeDialogHandle" @success="closeDialogHandle"></auth-id>
      <auth-enterprise v-if='showAuthEnterprise' @close="closeDialogHandle" @success="closeDialogHandle"></auth-enterprise>
      <set-name v-if='showSetName' @close="closeDialogHandle" @success="closeDialogHandle"></set-name>
    </el-dialog>

    <!-- 查看认证信息 -->
    <el-dialog class="dialog-left"
      :title="authDialogTitle"
      :visible.sync="authDialogVisible"
      width="580px">
      <div class="view-authinfo-wrap">
        <template v-if="authDialogType === 'id'">
          <dl class="pos-r">
            <dt class="ta-r pos-a">姓　　名：</dt>
            <dd>{{userAllInfo.cardName}}</dd>
          </dl>
          <dl class="pos-r">
            <dt class="ta-r pos-a">身份证号：</dt>
            <dd>{{userAllInfo.idCard}}</dd>
          </dl>
        </template>
        <template v-else>
          <dl class="pos-r">
            <dt class="ta-r pos-a">企业名称：</dt>
            <dd>{{this.formData.company}}</dd>
          </dl>
          <dl class="pos-r">
            <dt class="ta-r pos-a">企业所在地：</dt>
            <dd>
              {{userAllInfo.companyProvince}}
              {{userAllInfo.companyCity}}
              {{userAllInfo.companyZone}}
              {{userAllInfo.address}}
            </dd>
          </dl>
          <dl class="pos-r">
            <dt class="ta-r pos-a">营业执照：</dt>
            <dd>
              <a :href="userAllInfo.companyLicense | filterImgUrl" target="_blank" title="查看">
                <img :src="userAllInfo.companyLicense | filterImgUrl">
              </a>
            </dd>
          </dl>
        </template>
        <div class="ta-c btn-wrap">
          <el-button type="primary" class='confirm-btn' @click="authDialogVisible = false">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import UpdatePhone from './AccountUpdatePhone'
import SetName from './AccountSetName'
import AuthId from '@/views/public/AuthId'
import AuthEnterprise from '@/views/public/AuthEnterprise'
import RegionSelect from '@/components/utils/RegionSelect'

export default {
  components: { SetName, UpdatePhone, AuthId, AuthEnterprise, RegionSelect },
  data () {
    // 验证邮箱
    let validateEmail = (rule, value, callback) => {
      if (value) {
        if (!value.match(/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/gi)) {
          callback(new Error('邮箱不合法!'))
        }
        if (value.length > 150) callback(new Error('输入邮箱格式（0-150）'))
      }
      callback()
    }

    // 验证密码
    var validatePwd = (rule, value, callback) => {
      if (!value) callback(new Error('请输入密码!'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      callback()
    }

    // 验证再次输入密码
    var validateConfirmPwd = (rule, value, callback) => {
      if (!value) callback(new Error('请再次输入密码'))
      if (value.length < 6 || value.length > 20) callback(new Error('6-20位字符'))
      if (value !== this.formData.newPwd) callback(new Error('两次输入密码不一致!'))
      callback()
    }
    return {
      dialogVisible: false,
      authDialogType: '',                 // 查看认证信息类型
      authDialogTitle: '',                // 查看认证信息标题
      authDialogVisible: false,           // 查看认证信息
      dialogTitle: '',                    // 弹窗标题
      showDialogWrap: false,              // 显示弹窗
      showCheckPhone: false,              // 显示手机号验证弹窗
      showAuthId: false,                  // 显示身份认证弹窗
      showAuthEnterprise: false,          // 显示企业认证弹窗
      showSetName: false,                 // 显示设置登录名弹窗
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
          // ,
          // originalPwd: '',                // 原密码
          // newPwd: '',                     // 新密码
          // confirmPwd: ''                  // 确认新密码
        }
      },
      rules: {
        email: [{ validator: validateEmail, trigger: 'blur' }],
        originalPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        newPwd: [{ required: true, validator: validatePwd, trigger: 'blur' }],
        confirmPwd: [{ required: true, validator: validateConfirmPwd, trigger: 'blur' }]
      },
      userInfo: {},                       // 用户信息
      userAllInfo: {}                     // 接口获取用户信息
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getUserInfoHandle()
  },
  methods: {
    /**
     * 获取用户信息
     */
    getUserInfoHandle () {
      this.$http.post('@ROOT_API/accountSetController/viewUser', {
        id: this.userInfo.userId
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
        if (!res) return false
        this.userAllInfo = resData.data
        this.userInfo.phone = this.userAllInfo.phone
        this.formData.name = this.userAllInfo.cardName
        this.formData.company = this.userAllInfo.companyName
        this.formData.email = this.userAllInfo.email
        this.formData.phone = this.userAllInfo.phone
        this.formData.region.province.name = this.userAllInfo.userProvince
        this.formData.region.province.code = this.userAllInfo.userProvinceCode
        this.formData.region.city.name = this.userAllInfo.userCity
        this.formData.region.city.code = this.userAllInfo.userCityCode
        this.formData.region.area.name = this.userAllInfo.userZone
        this.formData.region.area.code = this.userAllInfo.userZoneCode
      })
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
        this.$http.post('@ROOT_API/accountSetController/saveUser', {
          id: this.userInfo.userId,                      // 用户id
          phone: this.formData.phone,                           // 用户手机号
          email: this.formData.email,                           // 邮箱
          cardStatus: this.userAllInfo.cardStatus,              // 认证状态 0：认证通过 1：未认证
          companyStatus: this.userAllInfo.companyStatus,        // 认证状态 0：认证通过 1：未认证
          userProvince: this.formData.region.province.name,     // 用户所在省
          userProvinceCode: this.formData.region.province.code, // 用户所在省
          userCity: this.formData.region.city.name,             // 用户所在市
          userCityCode: this.formData.region.city.code,         // 用户所在市
          userZone: this.formData.region.area.name,             // 用户所在区
          userZoneCode: this.formData.region.area.code          // 用户所在区
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

    .basic-form-wrap{
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
          background: #ffebea;
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
      letter-spacing: 3px;
      padding: 10px 30px;
      background: #33719b;
    }
  }
}
</style>

<style lang='less'>
.my-info-wrap{
  .my-info-cen{

    .basic-form-wrap{
      .el-form-item{

        .el-form-item__label{
          font-size: 14px;
          border-right: 1px solid #eef1f5;
          padding: 15px 50px 15px 0;
          background: #f8f8f8;
        }

        .el-form-item__content{
          padding: 15px 0 0 60px;

          .el-form-item__error{
            left: 60px;
            top: 75%;
          }
        }
      }

      .el-form-item.select-wrap{
        .el-form-item__content{
          width: 440px;
        }
      }
    }
  }

  .dialog-left .el-dialog__body{
    text-align: left;
  }

}
</style>
