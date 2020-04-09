<template>
  <div class="add-limit-vistors">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="demo-ruleForm"
    >
      <ul>
        <li>
          <el-form-item label="访问类型" prop="pasword1">
            <el-select v-model="ruleForm.pasword1" placeholder="请选择">
              <el-option v-for="item in vistorTypes" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="秘钥/电话/卡片号" prop="pasword2">
            <el-input v-model="ruleForm.pasword2" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="允许使用时间段" prop="pasword3" class="date-range">
            <el-time-select
              v-model="ruleForm.date1"
              :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00'
                }"
              placeholder="选择时间"
            ></el-time-select>~
            <el-time-select
              v-model="ruleForm.date2"
              :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '24:00'
                }"
              placeholder="选择时间"
            ></el-time-select>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="save-box">
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </div>
</template>
<script>
const cityOptions = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
export default {
  data () {
    return {
      ruleForm: {
        pasword1: '',
        pasword2: '',
        pasword3: '',
        date1: '',
        date2: ''
      },
      rules: {
        pasword1: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20个字符', trigger: 'blur' }
        ],
        pasword2: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20个字符', trigger: 'blur' }
        ],
        pasword3: [{ required: true, trigger: 'blur' }]
      },
      vistorTypes: ['密码访问', '卡片访问', '电话访问'],
      checkAll: false,
      checkedCities: ['上海', '北京'],
      cities: cityOptions,
      isIndeterminate: true
    }
  },
  methods: {
    /**
     * 表单验证
     */
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updatePwd()
        } else {
          return false
        }
      })
    },
    /**
     *修改密码
     */
    updatePwd () {
      this.$http
        .post('@ROOT_API/cooperationUserController/updatePass', {
          id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId,
          password: this.ruleForm.pasword1,
          newPassword: this.ruleForm.pasword2,
          subNewPassword: this.ruleForm.pasword3
        })
        .then(res => {
          if (res.data.status === '1') {
            localStorage.clear()
            this.$message({
              message: 'Success',
              type: 'success',
              duration: 500
            })
            setTimeout(() => {
              this.$router.push('/login')
            }, 500)
          } else {
            this.$message.error(res.data.msg)
          }
        })
    },
    handleCheckAllChange (val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>
<style lang='less' scoped>
.add-limit-vistors {
  .save-box {
    text-align: center;
    margin-top: 30px;
    .el-button--primary {
      padding: 10px 30px;
    }
  }
  ul {
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: 4px;
    font-size: 15px;
    color: #7a7a7a;
    li {
      height: 36px;
      line-height: 36px;
      margin-bottom: 33px;
      .el-input,
      .el-select {
        width: 419px;
        height: 36px;
      }
    }
  }
}
</style>
<style lang="less">
.add-limit-vistors {
  .date-range {
    width: 200px;
    .el-input {
      width: 200px !important;
      input {
        width: 200px;
      }
    }
    .el-form-item__content {
      display: flex;
      .el-checkbox-group {
        display: flex;
      }
      .el-checkbox {
        margin-left: 15px;
        margin-right: 0;
      }
    }
  }
}
</style>

