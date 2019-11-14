<!-- 创建店铺 -->
<template>
  <common-tpl class="classify-add-wrap">
    <!-- 主体内容 -->
    <template slot="main">
      <div class="public-wrap-box">
        <h2>店铺信息</h2>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="140px" class="demo-formData">
          <!-- 添加栏目 -->
          <div class="commodity-details pos-r">
            <el-form-item label="店铺类型:" prop="type" class="fl-l">
              <el-radio-group v-model="formData.shopType" v-if="addVisible">
                <el-radio :label="1">非自营店铺</el-radio>
                <el-radio :label="0">自营店铺</el-radio>
              </el-radio-group>
              <!--编辑店铺时显示-->
              <span v-else>{{formData.shopType | filterShopType}}</span>
            </el-form-item>
            <el-form-item label="店铺名称: " prop="shopName" class="fl-l">
              <el-input v-model="formData.shopName" placeholder="限50个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="主营业务: " prop="attributeTypeId" class="fl-l">
              <div class="select-opts">
                <select-opts @change="attributeSelect" :id="formData.attributeTypeId"></select-opts>
              </div>
            </el-form-item>
            <el-form-item label="合作商名称: " prop="partnerName" class="fl-l">
              <el-input v-model="formData.partnerName" placeholder="限50个字符" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系人: " prop="contactName" class="fl-l">
              <el-input v-model="formData.contactName" placeholder="20个字符以内" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系方式: " prop="contactPhone" class="fl-l">
              <el-input v-model="formData.contactPhone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item label="账号: " prop="account" class="fl-l">
              <el-input v-model="formData.account" placeholder="请输入手机号" clearable @blur="handleBlur(formData.account)"></el-input>
            </el-form-item>
            <el-form-item :label="pageType === 1 ? '初始密码: ' : '密码: '" prop="passWord" class="fl-l" :required="pageType === 1">
              <el-input v-model="formData.passWord" type="password" clearable @change="changePassword" ref="inpPwd"></el-input>（初始密码默认“111111”）
            </el-form-item>
            <el-form-item v-if="addVisible" label="确认密码: " prop="submitPassWord" class="fl-l">
              <el-input v-model="formData.submitPassWord" type="password" clearable @blur="handleConfirm"></el-input>
            </el-form-item>
            <!-- <el-form-item label="创客等级: " prop="rankName" class="fl-l">
              <el-select v-model="formData.rankName" v-if="addVisible" placeholder="大侠" disabled>
                <el-option v-model="formData.rankName"></el-option>
              </el-select>
              <span v-else>{{formData.rankName}}</span>
            </el-form-item> -->
            <el-form-item label="拓展员手机号: " prop="recommendPhone">
              <el-input v-model="formData.recommendPhone" placeholder="输入拓展员手机号" clearable @blur="handleConfirm"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="submitForm('formData')">提交</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      /**
       * 验证店铺名称、合作商名称字段
       */
      let validateName = (rule, value, callback) => {
        const SHOPNAME = 'shopName'                     // '店铺名称'表单项
        const PARTNERNAME = 'partnerName'               // '合作商名称'表单项
        let reg = /^[a-zA-Z0-9\s\u4e00-\u9fa5]*$/gi     // 表单项验证规则
        switch (rule.field) {
          case SHOPNAME:
            if (!value) callback(new Error('请输入店铺名称'))
            if (value.length > 50 || !value.toString().match(reg)) callback(new Error('限50个字符，不含特殊字符'))
            callback()
            break
          case PARTNERNAME:
            if (!value) {
              callback()
            } else {
              if (value.length > 50 || !value.toString().match(reg)) callback(new Error('限50个字符，不含特殊字符'))
              callback()
            }
            break
        }
      }

      // 验证联系人
      let validateLinkMan = (rule, value, callback) => {
        if (!value) return callback(new Error('请输入联系人'))
        let reg = /^[0-9a-zA-Z\s\u4e00-\u9fa5]*$/gi
        if (value.length > 20 || !value.toString().match(reg)) return callback(new Error('限20个字符'))
        callback()
      }

      // 主营业务
      let validateClassify = (rule, value, callback) => {
        // debugger
        if (!value) return callback(new Error('请选择主营业务'))
        callback()
      }

      // 验证手机
      let validatePhone = (rule, value, callback) => {
        if (!value) callback(new Error('请输入手机号'))
        let reg = /^1\d{10}$/gi
        if (!value.toString().match(reg)) callback(new Error('手机号格式错误'))
        callback()
      }

      // 验证拓展员手机
      let validateDevPhone = (rule, value, callback) => {
        if (!value) return callback()
        let reg = /^1\d{10}$/gi
        if (!value.toString().match(reg)) callback(new Error('手机号格式错误'))
        callback()
      }

      // 密码验证
      let validatePassword = (rule, value, callback) => {
        if (this.pageType === 1 || (value && this.pageType !== 1)) {
          if (!value) return callback(new Error('请输入密码'))
          let reg = /^[\da-zA-Z/*]{6,}$/gi
          if (value.toString().length > 20 || !value.toString().match(reg)) return callback(new Error('请输入数字或字母，至少6字符，且不能超过20个字符'))
          callback()
        }
        callback()
      }

      // 确认密码验证
      let validatesubmitPassWord = (rule, value, callback) => {
        if (!value) return callback(new Error('请输入密码'))
        let reg = /^[\da-zA-Z/*]{6,}$/gi
        if (value.toString().length > 20 || !value.toString().match(reg)) return callback(new Error('请输入数字或字母，至少6字符，且不能超过20个字符'))
        if (value !== this.formData.passWord) return callback(new Error('两次输入密码不一致'))
        callback()
      }

      return {
        addVisible: true,
        pageType: 1,                // 页面类型1.新增 2.编辑
        formData: {
          // id: null,
          shopType: 1,
          shopName: '',             // 栏目名称
          attributeTypeId: null,    // 主营业务id
          attributeTypeName: '',    // 主营业务
          partnerName: '',          // 合作商名称
          contactName: '',          // 联系人
          contactPhone: '',         // 联系方式
          account: '',              // 账号
          passWord: '111111',       // 初始密码
          submitPassWord: '',       // 确认密码
          rankName: '少侠',         // 创客等级
          recommendPhone: ''        // 拓展员手机号
        },
        rules: {
          // 栏目名称
          shopName: { required: true, validator: validateName, message: '', trigger: 'blur' },
          // 联系人
          contactName: { required: true, validator: validateLinkMan, trigger: 'blur' },
          // 合作商名称
          partnerName: { required: false, validator: validateName, message: '', trigger: 'blur' },
          // 主营业务
          attributeTypeId: { required: true, validator: validateClassify, trigger: 'change' },
          // 手机号
          contactPhone: {required: true, validator: validatePhone, trigger: 'blur'},
          account: {required: true, validator: validatePhone, trigger: 'blur'},
          // 密码
          passWord: {validator: validatePassword, trigger: 'blur'},
          submitPassWord: {required: true, validator: validatesubmitPassWord, trigger: 'blur'},
          recommendPhone: {validator: validateDevPhone, trigger: 'blur'}
        }
      }
    },

    created () {
      if (this.$route.path.match(/edit/gi)) {
        this.formData = JSON.parse(localStorage.getItem('MANAGER_STORE'))
        this.pageType = 2
      }
      this.formData.attributeTypeId = this.formData.attributeTypeId ? parseInt(this.formData.attributeTypeId) : this.formData.attributeTypeId
    },

    mounted () {
      this.addVisible = this.formData.attributeTypeId !== null ? !!false : !!true
      !this.addVisible && this.handleBlur(this.formData.rankName)
    },

    methods: {
      changePassword (val) {
        if (!val) {
          let inp = this.$refs.inpPwd.$el.children[0]
          setTimeout(() => {
            inp.blur()
          }, 30)
          setTimeout(() => {
            inp.focus()
          }, 50)
        }
      },

      /**
       * 主营业务select
       */
      attributeSelect (val) {
        if (val) {
          this.formData.attributeTypeId = parseInt(val.id)
          this.formData.attributeTypeName = val.attributeTypeName
        } else {
          this.formData.attributeTypeId = null
          this.formData.attributeTypeName = ''
        }
      },

      /**
       * 确认密码
       */
      handleConfirm () {
        if (this.formData.submitPassWord !== this.formData.passWord) {
        }
      },

      /**
       * 通过账号获取创客等级
       */
      handleBlur (account) {
        if (!account) return
        this.$http.post('@ROOT_API/shopManageController/getLevelByPhone', {
          account: account
        }).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.formData.rankName = resData.data.rankName
        })
      },

      /**
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.$Utils.scrollToTop('admin-child-main')
            return false
          }
          if (this.addVisible) {
            this.$http.post('@ROOT_API/shopManageController/addShop', this.formData).then(res => {
              let resData = res.data
              if (resData.status !== '1') {
                this.$message({
                  message: resData.msg,
                  type: 'error',
                  duration: 2000
                })
                return false
              }
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1500
              })
              this.$router.back()
            })
          } else {
            this.$http.post('@ROOT_API/shopManageController/editShop', this.formData).then(res => {
              let resData = res.data
              if (resData.status !== '1') {
                this.$message({
                  message: resData.msg,
                  type: 'error',
                  duration: 2000
                })
                return false
              }
              this.$message({
                message: '提交成功',
                type: 'success',
                duration: 1500
              })
              this.$router.back()
            })
          }
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.classify-add-wrap{

  .public-wrap-box{

    h2{
      height: 50px;
      line-height:50px;
      font-weight: normal;
      font-size: 16px;
      background: #f4f4f4;
      margin-bottom: 30px;
      padding-left: 62px;
    }

    .button-wrap{
      height: 40px;
      left: 0;
      bottom: 0;
    }

    /*------添加栏目--------*/
    .commodity-details{
      overflow: hidden;
      border-bottom: 1px solid #f4f4f4;

      .el-form-item{
        width: 800px;
        float: left;

        .el-input,.select-opts,.el-select{
          width: 300px;
        }
      }

      .el-form-item:nth-child(even){
        float: right;
      }
      .el-form-item:last-child{
        float: left;
      }
    }

  }
}
</style>

<style lang="less">
.classify-add-wrap{
  .public-wrap{
    .el-form-item__label{
      margin-right: 30px;
    }

    .el-form-item__error{
      left: 30px !important;
    }

    .el-form-item__label{
      width: 130px !important;
    }

    .el-form-item__content{
      margin-left: 130px !important;
    }

    .el-radio__input.is-checked .el-radio__inner{
      border-color: #409EFF;
      background: #409EFF;
    }

    .el-input-group__append{
      font-size: 20px;
      i{
        font-size: 20px;
      }
    }
  }
}
</style>
