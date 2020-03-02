<!-- 添加管理员 -->
<template>
  <div class="addadmin">
    <div class="addadmin-cen">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="登录名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="限20个字以内，不含特殊字符" v-if="ruleForm.id" :disabled="true"></el-input>
          <el-input v-model="ruleForm.name" placeholder="限20个字以内，不含特殊字符" v-else></el-input>
          <!-- <span>请输入登录名</span> -->
        </el-form-item>
        <el-form-item label="输入密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="6-20位字符"></el-input>
          <!-- <span>请输入密码</span> -->
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword" placeholder="6-20位字符"></el-input>
          <!-- <span>请确认密码</span> -->
        </el-form-item>
        <el-form-item label="权限组" class="AddGroup">
          <el-select v-model="ruleForm.groupId" placeholder="运营人员">
            <template v-for="item in groupListData">
              <el-option :label="item.groupName" :value="item.id.toString()"></el-option>
            </template>
          </el-select>
          <span>请选择一个权限组，如果还未设置，请马上设置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="ta-c addadmin-b">
      <!--修改-->
      <el-button type="primary" @click="submitForm('ruleForm')" class="sub" v-if="ruleForm.id">提交</el-button>
      <!--添加-->
      <el-button type="primary" @click="submitForm('ruleForm')" class="sub" v-else>提交</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!value) callback(new Error('请输入姓名!'))
      if (value.length > 20 || !value.match(/^[a-zA-Z0-9]+$/ig)) callback(new Error('限20个字以内，不含特殊字符!'))
      callback()
    }
    var validatePassword = (rule, value, callback) => {
      if (this.inputReauird === true || this.ruleForm.password) {
        if (!value) callback(new Error('请输入密码'))
        if (!/^\S{6,20}$/.test(value)) callback(new Error('6-20位字符'))
        callback()
      } if (this.inputReauird === false && !this.ruleForm.password) {
        callback()
      }
    }
    var validateNewPassword = (rule, value, callback) => {
      if (this.inputReauird === true || this.ruleForm.password || this.ruleForm.newPassword) {
        if (!value) callback(new Error('请再次输入密码'))
        if (!/^\S{6,20}$/.test(value)) callback(new Error('6-20位字符'))
        if (value !== this.ruleForm.password) callback(new Error('两次输入密码不一致!'))
        callback()
      } if (this.inputReauird === false && !this.ruleForm.password && !this.ruleForm.newPassword) {
        callback()
      }
    }
    return {
      token: '',
      ruleForm: {
        id: '',
        name: '',
        password: '',
        newPassword: '',
        groupId: ''
      },
      inputReauird: true, // 判断密码框是否是必填
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        password: [{ required: true, validator: validatePassword, trigger: 'blur' }],
        newPassword: [{ required: true, validator: validateNewPassword, trigger: 'blur' }]
      },
      groupListData: [],
      currentPage: 1,
      pageSize: 10,
      adminMesage: '' // 管理员信息
    }
  },
  /**
   * 定义方法
   */
  mounted () {
    let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    this.token = adminInfo.token
    this.ruleForm.id = this.$route.query.id
    // 如果有id 是编辑 没有id是添加
    if (this.ruleForm.id) {
      this.getadminDetail() // 管理员详情
      this.inputReauird = false
      this.rules.password[0].required = false
      this.rules.newPassword[0].required = false
    } else {
      this.getGroup()
      this.inputReauird = true
      this.rules.password[0].required = true
      this.rules.newPassword[0].required = true
    }
  },
  /**
   * 执行方法
   */
  methods: {
    /**
     * 获取权限组列表
     */
    getGroup () {
      this.$http.post('@ROOT_API/auth/list', {
        id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId,
        pageNum: 1,
        pageSize: 9999
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        }
        this.groupListData = resData.data.dataList
        this.groupListData.some((ite) => {
          if (this.adminMesage.groupId === ite.id.toString()) {
            this.ruleForm.groupId = ite.id.toString()
            return true
          } else {
            this.ruleForm.groupId = this.groupListData[0].id.toString()
            return false
          }
        })
      })
    },
    /**
     * 获取管理员详情
    */
    getadminDetail () {
      this.$http.post('@ROOT_API/admin/info', {
        id: this.ruleForm.id
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        } else {
          if (res.data.data) {
            this.adminMesage = res.data.data
            this.ruleForm.name = res.data.data.loginName
            this.getGroup()
          }
        }
      })
    },
    /**
     * 添加权限组提交  修改
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (this.inputReauird === true || this.ruleForm.password || this.ruleForm.newPassword) {
          if (!valid) return false
        }
        // let curGroupObj = this.groupListData.filter((row) => row.id === parseInt(this.ruleForm.groupId))
        let resUrl = null
        /**
         * 定义请求参数
        */
        var parmea = {
          password: this.ruleForm.password,
          subPassword: this.ruleForm.newPassword,
          groupId: parseInt(this.ruleForm.groupId)
        }
        // 编辑
        if (this.ruleForm.id) {
          resUrl = '@ROOT_API/admin/update' // 编辑
          parmea.id = this.ruleForm.id
        } else {
          resUrl = '@ROOT_API/admin/add' // 添加
          parmea.loginName = this.ruleForm.name
          parmea.belongSystem = 3
        }

        this.$http.post(resUrl, parmea).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message.error(resData.msg)
            return false
          }
          this.$message.success(resData.msg)
          this.$router.push({path: '/admin/seting/auth/admin/index'})
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.addadmin-cen{
  background: #fff;
  padding:40px 40px 60px 40px;
  border-radius:5px;

  .demo-ruleForm{
    border:1px solid #eef1f5;
    border-bottom: none;
    span{
      color: #999999;
      padding-left: 10px;
    }
  }
  .el-form-item{
    color: #fff;
    padding:16px 0 16px 0;
    border-bottom: 1px solid #eef1f5;
    margin:0;
  }
  .el-input{
    width: 445px;
  }
}

.addadmin-b{
  margin-top: 40px;
}
</style>
<style lang="less">
.addadmin{
  .el-input__icon+.el-input__inner{
    padding-right: 265px;
  }
  .el-button--primary:hover{
    background: #116298;
  }
  .el-input--suffix .el-input__inner{
    width: 445px;
  }
}
</style>
