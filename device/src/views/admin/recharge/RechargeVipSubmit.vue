<template>
  <div class="supplier-add-wrap">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <ul>
        <li>
          <el-form-item label="供应商名称" prop="r1" >
            <el-input type="test" v-model="ruleForm.r1" placeholder="限50个字"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="联系人" prop="r2" >
            <el-input type="text" v-model="ruleForm.r2" placeholder="限20个字"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="联系方式" prop="r3" >
            <el-input type="text" v-model="ruleForm.r3" placeholder="手机格式，限11个数字"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="新增供应数量" prop="r4" width="400">
            <el-input type="text" v-model="ruleForm.r4" placeholder="限0-500数字"></el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="save-box">
      <el-button type="primary" @click="tapSupplier(1,'ruleForm')" v-if="sid">保存</el-button>
      <el-button type="primary" @click="tapSupplier(2,'ruleForm')" v-else>保存</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      var validatePass0 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入供应商名称'))
        } else if (value.length > 50) {
          callback(new Error('限50个字'))
        } else {
          callback()
        }
      }
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入联系人'))
        } else if (value.length > 20) {
          callback(new Error('限20个字'))
        } else {
          callback()
        }
      }

      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'))
        } else if (!value.match(/^((1[0-9]{1})+\d{9})$/) || value.length > 11) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      var validatePass3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新增供应数量'))
        } else if (!(/(^[1-9]\d*$)/.test(value)) || value > 500) {
          callback(new Error('限0-500数字'))
        } else {
          callback()
        }
      }
      return {
        sid: '', // 供应商id
        SupplierData: '', // 供应商数据
        ruleForm: {
          r1: '',
          r2: '',
          r3: '',
          r4: ''
        },
        rules: {
          r1: [
            { required: true, validator: validatePass0, trigger: 'blur' }
          ],
          r2: [
            { required: true, validator: validatePass1, trigger: 'blur' }
          ],
          r3: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ],
          r4: [
            { required: true, validator: validatePass3, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.sid = this.$route.query.id
      if (this.sid) {
        this.getMesg()
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addSupplier()
          } else {
            return false
          }
        })
      },
      /**
       * 获取供应商的编辑信息
      */
      getMesg () {
        this.$http.post('@ROOT_API/supplier/getSupplierInfo', {
          id: this.sid
        }).then((res) => {
          // console.log(res)
          if (res.data.status === '1') {
            this.ruleForm.r1 = res.data.data.supplierName
            this.ruleForm.r2 = res.data.data.contact
            this.ruleForm.r3 = res.data.data.contactPhone
            this.ruleForm.r4 = res.data.data.addNum
          }
        })
      },
      /**
       * 保存按钮
       * @num 1 修改 2 添加
      */
      tapSupplier (num, formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.conformForm(num)
          } else {
            return false
          }
        })
      },
      /**
       * 提交表单
      */
      conformForm (num) {
        var pathUrl = ''
        // 修改
        if (num === 1) {
          pathUrl = '@ROOT_API/supplier/updateSupplier'
        }
        // 添加
        if (num === 2) {
          pathUrl = '@ROOT_API/supplier/addSupplier'
        }
        this.$http.post(pathUrl, {
          id: this.sid,
          supplierName: this.ruleForm.r1,
          contact: this.ruleForm.r2,
          contactPhone: this.ruleForm.r3,
          addNum: this.ruleForm.r4
        }).then((res) => {
          // console.log(res)
          if (res.data.status === '1') {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success'
            })
            this.$router.push('/admin/cooperation/supplier/index')
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .supplier-add-wrap{
    .save-box{
      text-align: center;
      margin-top: 30px;
      .el-button--primary{
        padding: 10px 30px;
      }
    }
    ul{
      background: #fff;
      padding: 40px;
      border-radius: 4px;
      -moz-border-radius: 4px;
      -ms-border-radius: 4px;
      -o-border-radius: 4px;
      -webkit-border-radius: 4px;
      font-size: 15px;
      color: #7a7a7a;
      li{
        height: 36px;
        line-height: 36px;
        margin-bottom: 33px;
        .el-input{
          width: 419px;
          height: 36px;
        }
      }
    }
  }
</style>
