<!-- 创建店铺/编辑店铺 -->
<template>
  <common-tpl class="classify-add-wrap" footer>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="public-wrap-box">
        <!-- <gray-title title=""></gray-title> -->
        <h2>店铺信息</h2>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="140px" class="demo-formData">
          <!-- 店铺信息 -->
          <div class="commodity-details">
            <div style="overflow: hidden;">
              <el-form-item label="商城类型:" prop="type">
              <el-radio-group v-model="formData.shopGenre">
                <el-radio :label="1">云店铺</el-radio>
                <el-radio :label="2">独立部署</el-radio>
              </el-radio-group>
              <!--编辑店铺时显示-->
              <!--<span v-else>{{formData.shopGenre | filterShopType}}</span>-->
              </el-form-item>
              <el-form-item label="商城名称: " prop="shopName" class="fl-l">
                <el-input v-model="formData.shopName" placeholder="限50个字符" maxLength="50" clearable></el-input>
              </el-form-item>
              <el-form-item label="商城域名: " prop="shopDomain" class="fl-l" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-input v-model="formData.shopDomain" placeholder="限50个字符" maxLength="50" clearable></el-input>
              </el-form-item>
              <el-form-item label="主营业务: " prop="attributeTypeId" class="fl-l">
                <!-- <div class="select-opts">
                  <select-opts @change="attributeSelect" :id="formData.attributeTypeId"></select-opts>
                </div> -->
              <!-- <el-form-item :prop="'materialListData.' + index + '.buySourceId'" :rules="[{required: true, message: '不能为空', trigger: 'change'}]"> -->
              <el-form-item>
                <el-select v-model="formData.attributeTypeId" placeholder="请选择" style="margin-left: 120px;"  @change="attributeSelect">
                  <el-option v-for="item in materialListData" :label="item.attributeTypeName" :value="item.id" :key="item.value"></el-option>
                </el-select>
                <!--<el-select v-model="formData.attributeTypeId" placeholder="请选择">-->
                  <!--<el-option-->
                    <!--v-for="item in formData.materialListData"-->
                    <!--:key="item.value"-->
                    <!--:label="item.attributeTypeName"-->
                    <!--:value="item.id">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              </el-form-item>
              </el-form-item>
              <el-form-item label="合作商名称: " prop="partnerName" class="fl-l">
                <el-input v-model="formData.partnerName" placeholder="限50个字符" maxLength="50" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系人: " prop="contactName" class="fl-l">
                <el-input v-model="formData.contactName" placeholder="20个字符以内" maxLength="20" clearable></el-input>
              </el-form-item>
              <el-form-item label="联系方式: " prop="contactPhone" class="fl-l">
                <el-input v-model="formData.contactPhone" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
              <el-form-item label="使用者: " prop="loginName" class="fl-l"  :rules="[{required: true, message: '请输入登录名', trigger: 'change'}]">
                <el-input v-model="formData.loginName" placeholder="限20个字符以内" maxLength="20" clearable></el-input>
              </el-form-item>
              <el-form-item label="管理员手机: " prop="account" class="fl-l">
                <el-input v-model="formData.account" placeholder="请输入手机号码" clearable></el-input>
              </el-form-item>
              <el-form-item label="初始密码" prop="passWord" class="fl-l" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-input v-model="formData.passWord" placeholder="6-20个字符以内" type="password" clearable @change="changePassword" minLength="6" maxLength="20" ref="inpPwd"></el-input>（初始密码默认“111111”）
              </el-form-item>
              <el-form-item label="确认密码: " prop="submitPassWord" class="fl-l">
                <el-input v-model="formData.submitPassWord" placeholder="6-20个字符以内" type="password" minLength="6" maxLength="20" clearable @blur="handleConfirm"></el-input>
              </el-form-item>
            </div>

            <!-- 服务器信息 -->
            <template v-if="formData.shopGenre === 2">
              <div style="overflow: hidden;">
                <!-- <gray-title title=""></gray-title> -->
                <h2>服务器信息</h2>
                <el-form-item label="服务器IP地址: " prop="serviceIp" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                  <el-input v-model="formData.serviceIp" placeholder="20个字符以内" maxLength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="服务器账号: " prop="serviceAccount" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-input v-model="formData.serviceAccount" placeholder="20个字符以内" maxLength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="服务器密码: " prop="servicePassword" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                  <el-input v-model="formData.servicePassword" placeholder="20个字符以内" maxLength="20" clearable></el-input>
                </el-form-item>
                <el-form-item label="Web访问路径: " prop="webUrl" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                  <el-input v-model="formData.webUrl" placeholder="50个字符以内" maxLength="50" clearable></el-input>
                  <span>（格式如：/home/e2w-p/）</span>
                </el-form-item>
              </div>
              <div style="overflow: hidden;">
                <!-- <gray-title title=""></gray-title> -->
                <h2>数据库信息</h2>
                <el-form-item label="数据库账号: " prop="dbAccount" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                  <el-input v-model="formData.dbAccount" placeholder="50个字符以内" maxLength="50" clearable></el-input>
                </el-form-item>
                <el-form-item label="数据库密码: " prop="dbPassword" class="fl-l"  :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-input v-model="formData.dbPassword" placeholder="20个字符以内" maxLength="20" clearable></el-input>
                </el-form-item>
              </div>
            </template>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">返回</el-button>
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
        //  let reg = /^[\da-zA-Z/*]{6,}$/gi
      //    if (value.toString().length > 20 || !value.toString().match(reg)) return callback(new Error('请输入数字或字母，至少6字符，且不能超过20个字符'))
          callback()
        }
        callback()
      }

      // 确认密码验证
      let validatesubmitPassWord = (rule, value, callback) => {
        if (!value) return callback(new Error('请输入密码'))
      //  let reg = /^[\da-zA-Z/*]{6,}$/gi
      //  if (value.toString().length > 20 || !value.toString().match(reg)) return callback(new Error('请输入数字或字母，至少6字符，且不能超过20个字符'))
        if (value !== this.formData.passWord) return callback(new Error('两次输入密码不一致'))
        callback()
      }

      return {
        addVisible: true,
        pageType: 1,                // 页面类型1.新增 2.编辑
        shopId: '',                 // 商场id
        formData: {
          parentId: 0,              // 上级id
          id: null,
          shopGenre: 1,
          shopName: '',             // 栏目名称
          shopDomain: '',           // 域名
          attributeTypeId: null,    // 主营业务id
          attributeTypeName: '',    // 主营业务
          partnerName: '',          // 合作商名称
          contactName: '',          // 联系人
          contactPhone: '',         // 联系方式
          account: '',              // 账号
          passWord: '111111',       // 初始密码
          submitPassWord: '',       // 确认密码
          serviceIp: '',            // 服务器IP地址
          serviceAccount: '',       // 服务器账号
          servicePassword: '',      // 服务器密码
          webUrl: '',               // Web访问路径
          dbAccount: '',            // 数据库账号
          dbPassword: '',           // 数据库密码
          rankName: '少侠',         // 创客等级
          recommendPhone: ''       // 拓展员手机号
        },
        materialListData: [],
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
    },

    mounted () {
      this.formData.id = parseInt(this.$route.query.id)
      this.pageType = this.$route.path.match(/edit/gi) ? 2 : 1
      this.attributeData()
      if (this.formData.id) {
        this.marketDetails()  // 商场详情
      }
    },

    methods: {
      /**
       * 商场详情
       */
      marketDetails () {
        this.$http.get('@ROOT_API/shopManageController/getShopDetail', {
          params: {
            shopId: this.formData.id
          }
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
          this.formData = resData.data
          this.attributeSelect(this.formData.attributeTypeId)
        })
      },

      /**
       * 默认初始密码
       */
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
       * 主营业务详情
       */
      attributeData () {
        this.$http.post('@ROOT_API/attributeType/getAttributeTypeListByParentId', {
          parentId: 0
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
          this.materialListData = resData.data
        })
      },

      /**
       * 主营业务select
       */
      attributeSelect (val) {
        console.log('val: ', val)
        // if (val) {
        //   this.formData.attributeTypeId = parseInt(val.id)
        //   this.formData.attributeTypeName = val.attributeTypeName
        // } else {
        //   this.formData.attributeTypeId = null
        //   this.formData.attributeTypeName = ''
        // }
        if (val) {
          this.formData.attributeTypeName = this.materialListData.filter(item => item.id === val)[0].attributeTypeName
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
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            //  this.$Utils.scrollToTop('admin-child-main')
            return false
          }
          let url = this.pageType === 1 ? '@ROOT_API/shopManageController/addShop' : '@ROOT_API/shopManageController/editShop'
          this.$http.post(url, this.formData).then(res => {
            let resData = res.data
            console.log(resData)
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

        .el-select{
          margin-left: 0 !important;
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
