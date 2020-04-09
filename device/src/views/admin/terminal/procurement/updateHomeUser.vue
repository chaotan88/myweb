<template>
  <div class="update-home-user">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" class="demo-ruleForm">
      <ul>
        <li>
          <el-form-item :label="$t('device.roomNumber')" prop="roomNumber" v-if="id">
            <el-input v-model="ruleForm.roomNumber" placeholder="6-20位字符" readonly></el-input>
          </el-form-item>
          <el-form-item :label="$t('device.roomNumber')" prop="roomNumber" v-else>
            <el-input v-model="ruleForm.roomNumber" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.hostName')" prop="hostName" >
            <el-input v-model="ruleForm.hostName" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone1')" prop="phone1" >
            <el-input v-model="ruleForm.phone1" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone2')" prop="phone2" >
            <el-input v-model="ruleForm.phone2" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.phone3')" prop="phone3" >
            <el-input v-model="ruleForm.phone3" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card1')" prop="card1" >
            <el-input v-model="ruleForm.card1" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card2')" prop="card2" >
            <el-input v-model="ruleForm.card2" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
        <li>
          <el-form-item :label="$t('device.card3')" prop="card3" >
            <el-input v-model="ruleForm.card3" placeholder="6-20位字符"></el-input>
          </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="save-box">
        <el-button type="primary" @click="$router.back(-1)">返回</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        id: '',
        ruleForm: {
          imei: '',
          code: '',
          roomNumber: '',
          hostName: '',
          phone1: '',
          phone2: '',
          phone3: '',
          card1: '',
          card2: '',
          card3: ''
        },
        rules: {
          roomNumber: [
            { required: true, trigger: 'blur' }
          ],
          hostName: [
            { required: true, trigger: 'blur' }
          ],
          phone1: [
            { required: true, trigger: 'blur' }
          ],
          phone2: [
            { required: true, trigger: 'blur' }
          ],
          phone3: [
            { required: true, trigger: 'blur' }
          ],
          card1: [
            { required: true, trigger: 'blur' }
          ],
          card2: [
            { required: true, trigger: 'blur' }
          ],
          card3: [
            { required: true, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      if (this.$route.params.id) {
        this.id = this.$route.params.id
        this.getDetail()
      }
    },
    methods: {
      /**
       * 表单验证
      */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.id) {
              this.updateItem()
            } else {
              this.addItem()
            }
          } else {
            return false
          }
        })
      },
      /**
       *修改家庭用户
      */
      updateItem () {
        let params = {
          id: this.id,
          imei: this.ruleForm.imei,
          code: this.ruleForm.code,
          // roomNumber: this.ruleForm.roomNumber,
          hostName: this.ruleForm.hostName,
          phone1: this.ruleForm.phone1,
          phone2: this.ruleForm.phone2,
          phone3: this.ruleForm.phone3,
          card1: this.ruleForm.card1,
          card2: this.ruleForm.card2,
          card3: this.ruleForm.card3
        }
        this.$http.post('@ROOT_API/dfDeviceFamily/saveOrUpdateDfDeviceFamily', params).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.$router.back(-1)
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      },
      addItem () {
        let saveList = []
        saveList.push({
          roomNumber: this.ruleForm.roomNumber,
          hostName: this.ruleForm.hostName,
          phone1: this.ruleForm.phone1,
          phone2: this.ruleForm.phone2,
          phone3: this.ruleForm.phone3,
          card1: this.ruleForm.card1,
          card2: this.ruleForm.card2,
          card3: this.ruleForm.card3
        })
        this.$http.post('@ROOT_API/dfDeviceFamily/saveOrUpdateDfDeviceFamilyList', saveList).then((res) => {
          if (res.data.status === '1') {
            this.$message.success('Success')
            this.$router.back(-1)
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      },
      getDetail () {
        this.$http.post('@ROOT_API/dfDeviceFamily/getDfDeviceFamily', {
          id: this.id
        }).then((res) => {
          if (res.data.status === '1') {
            this.ruleForm = res.data.data
          } else {
            this.$message.error(res.data.msg || this.$t('common.errorMsg'))
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  .update-home-user{
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
        .el-input, .el-select{
          width: 419px;
          height: 36px;
        }
      }
    }
  }
</style>
