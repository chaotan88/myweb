<template>
  <div class="edit-logistics-wrap">
    <div class="content-wrap">
      <el-form :model="form" :rules="rules" ref="editLogisticsForm" label-width="100px">
        <el-form-item label="物流名称：" prop="logisticsName">
          <el-input v-model="form.logisticsName"></el-input>
        </el-form-item>
        <el-form-item label="物流费用：" prop="logisticsCost">
          <el-input v-model="form.logisticsCost"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio v-model="form.status" label="1">开启</el-radio>
          <el-radio v-model="form.status" label="2">关闭</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="confirm('editLogisticsForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        form: {},
        rules: {
          logisticsName: [
            { required: true, message: '请输入物流名称', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,20}/g, message: '物流名称限20个字', trigger: 'blur' }
          ],
          logisticsCost: [
            { required: true, message: '请输入物流费用', trigger: 'blur' },
            { pattern: /^\d+(\.{0,1}\d+){0,1}$/g, message: '物流费用不能为负数', trigger: 'blur' }
          ]
        },
        logisticsId: null
      }
    },
    methods: {
      getLogisticsById: function (logisticsId) {
        // 获取物流详情
        this.$http.post('/admin/logistics/getLogisticsById', this.qs.stringify({
          logisticsId: logisticsId
        })).then((res) => {
          if (res.data.res === 1) {
            this.form = res.data.obj
          }
        })
      },
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      confirm: function (formName) {
        // 确定
        this.$refs[formName].validate((valid) => {  // 表单校验
          if (valid) {
            // 通过
            this.$http.post('/admin/logistics/updateOrDeleteLogisticsById', this.qs.stringify({
              logisticsId: this.form.logisticsId,
              logisticsName: this.form.logisticsName,
              logisticsCost: this.form.logisticsCost,
              status: this.form.status
            })).then((res) => {
              if (res.data.res === 1) {
                this.$message.success('修改物流成功')
                this.$router.push('/admin/setting/logistics-setting/logistics-list')
              } else {
                this.$message.error('修改物流失败')
              }
            })
          } else {
            // 未通过
            this.$message.error('表单项目不能为空')
          }
        })
      }
    },
    mounted: function () {
      var logisticsId = this.$route.params.logisticsId  // 获取物流ID
      this.getLogisticsById(logisticsId)  // 获取物流详情
    }
  }
</script>

<style lang="less" scoped>
  .edit-logistics-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .edit-logistics-wrap {
    .el-form {
      .el-input {
        width: 300px;
      }
    }
    .el-form-item__label::before {
      content: "*";
      color: #f56c6c;
      margin-right: 6px;
    }
  }
</style>
