<!-- 添加/编辑管理员 -->
<template>
  <common-tpl class="addadmin-cen" footer back>
    <template slot="main">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="登录名" prop="name">
          <!-- <div style="color: #333;" v-if="isEditPage">{{ruleForm.name}}</div> -->
          <el-input v-model="ruleForm.name" maxlength="20" placeholder="限20个字符"></el-input>
        </el-form-item>
        <el-form-item label="输入密码" prop="password" :required="!isEditPage">
          <el-input type="password" v-model="ruleForm.password" maxlength="20" placeholder="限6-20个字符"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPassword" :required="!isEditPage">
          <el-input type="password" v-model="ruleForm.newPassword" maxlength="20" placeholder="限6-20个字符"></el-input>
        </el-form-item>
        <el-form-item label="权限组" class="AddGroup">
          <el-select v-model="ruleForm.groupId" clearable>
            <template v-for="item in groupListData">
              <el-option :label="item.groupName" :value="item.id.toString()"></el-option>
            </template>
          </el-select>
          <span>请选择一个权限组，如果还未设置，请马上设置</span>
        </el-form-item>
      </el-form>
    </template>

    <template slot="footer">
      <el-button type="primary" @click="submitForm('ruleForm')" class="sub">提交</el-button>
    </template>
  </common-tpl>
</template>
<script>
export default {
  data () {
    var validateName = (rule, value, callback) => {
      if (!this.isEditPage && !value) return callback(new Error('请输入姓名!'))
      callback()
    }
    var validatePassword = (rule, value, callback) => {
      if (!this.isEditPage && !value) return callback(new Error('请输入密码'))
      if (value && value.length < 6) return callback(new Error('6-20字符以内'))
      callback()
    }
    var validateNewPassword = (rule, value, callback) => {
      if (!this.isEditPage && !value) return callback(new Error('请再次输入密码'))
      if (value && value !== this.ruleForm.password) return callback(new Error('两次输入密码不一致!'))
      callback()
    }
    return {
      // token: '',
      ruleForm: {
        name: '',
        password: '',
        newPassword: '',
        groupId: ''
      },
      rules: {
        name: [{ validator: validateName, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        newPassword: [{ validator: validateNewPassword, trigger: 'blur' }]
      },
      isEditPage: false,       // 编辑
      adminId: '',             // 管理员id
      groupListData: [],
      currentPage: 1,
      pageSize: 100,
      userInfo: {}      // 用户信息
    }
  },
  /**
   * 定义方法
   */
  mounted () {
    if (this.$route.path.match(/edit/gi)) this.isEditPage = true
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.adminId = parseInt(this.$route.query.id)
    if (this.adminId) this.getAdminInfo()
    this.getGroup()
  },
  /**
   * 执行方法
   */
  methods: {
    /**
     * 获取管理员信息
     */
    getAdminInfo () {
      this.$http.post('@ROOT_API/admin/info', {
        id: this.adminId
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
        this.ruleForm.name = resData.data.loginName
        this.ruleForm.groupId = resData.data.groupId
      })
    },

    /**
     * 获取权限组列表
     */
    getGroup () {
      this.$http.post('@ROOT_API/auth/groupSelectList', {
        id: this.userInfo.userId
        // pageNum: this.currentPage,
        // pageSize: this.pageSize
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1' && resData.status !== '9998') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.groupListData = resData.data.dataList
        if (!this.adminId) this.ruleForm.groupId = this.groupListData[0].id.toString()
      })
    },

    /**
     * 添加管理员提交
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let curGroupObj = this.groupListData.filter((row) => row.id === parseInt(this.ruleForm.groupId))
        let url = this.$route.path.match(/add/gi) ? '@ROOT_API/admin/add' : '@ROOT_API/admin/update'
        this.$http.post(url, {
          id: this.adminId,                          // 主键
          loginName: this.ruleForm.name,             // 登录名
          password: this.ruleForm.password,          // 密码
          groupId: parseInt(this.ruleForm.groupId),  // 所属的组id
          groupName: curGroupObj[0].groupName        // 所属的组名
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
            duration: 1500
          })
          this.$router.push({path: '/admin/seting/admin'})
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.addadmin-cen{

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
</style>

<style lang="less">
.addadmin-cen{

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
