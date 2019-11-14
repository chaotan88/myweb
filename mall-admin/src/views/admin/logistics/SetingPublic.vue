<!-- 新增商品 -->
<template>
  <common-tpl class="logistics-public-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <gray-title :title="pageType === 1 ? '新增物流' : '编辑物流'"></gray-title>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
        <el-form-item label=" 物流名称：" prop="logisticsName">
          <el-input v-model="formData.logisticsName" placeholder="限20个字符"></el-input>
        </el-form-item>
        <el-form-item label="收费类型：">
          <el-radio-group v-model="formData.logisticsType">
            <el-radio :label="0">现付</el-radio>
            <el-radio :label="1">包邮</el-radio>
            <el-radio :label="2">到付</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="物流费用：" prop="logisticsCost" v-if="formData.logisticsType === 0">
          <el-input v-model="formData.logisticsCost" placeholder="0-1000数字"></el-input><span>元</span>
        </el-form-item>
        <el-form-item label="状　　态：" prop="isEnabled">
          <el-radio-group v-model="formData.isEnabled">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="submitForm('formData')">确定</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      // ---------物流费用
      let validatePrice = (rule, value, callback) => {
        if (!value && parseInt(value) !== 0) return callback(new Error('请输入物流费用'))
        if (value < 0 || value > 1000 || isNaN(value) || !value.toString().match(/^\d{0,4}\.?\d{0,2}$/)) return callback(new Error('仅限0-1000的数字'))
        callback()
      }
      return {
        pageType: 1,                // 页面类型 [1、新增 2、编辑]
        logisticsId: '',            // 物流id
        formData: {
          logisticsName: '',        // 物流名称
          logisticsType: 0,         // 收费类型
          logisticsCost: '',        // 物流费用
          isEnabled: 1              // 状态
        },
        rules: {
          // ----------- 物流名称
          logisticsName: [
            { required: true, message: '请输入物流名称', trigger: 'blur' },
            { min: 0, max: 20, message: '限20个字符', trigger: 'blur' }
          ],
          // ----------- 请选择物流状态
          isEnabled: [
            { required: true, message: '请选择活动资源', trigger: 'blur' }
          ],
          // ----------- 物流费用
          logisticsCost: [{ required: true, validator: validatePrice, trigger: 'blur' }]
        }
      }
    },
    mounted () {
      this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
      this.logisticsId = parseInt(this.$route.query.id) || ''
      this.pageType === 2 && this.getDetailsHandle()
    },
    methods: {
      /**
       * 获取详情
       */
      getDetailsHandle () {
        this.$http.post('@ROOT_API/logistics/info', {
          id: this.logisticsId
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.formData = resData.data
        })
      },

      /**
       * 提交表单
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          let url = this.pageType === 1 ? '@ROOT_API/logistics/add' : '@ROOT_API/logistics/update'
          this.$http.post(url, {
            id: this.logisticsId,                        // int 物流信息ID
            logisticsName: this.formData.logisticsName,  // 是 String  物流名称
            logisticsCost: this.formData.logisticsType === 0 ? this.formData.logisticsCost : 0,      // 是 String  物流费用
            isEnabled: this.formData.isEnabled,          // 是 String  物流是否启用： 0 关闭 1 开启'
            logisticsType: this.formData.logisticsType   // 是 Integer 物流类型 0 现付 1 包邮 2 到付
          }).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
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
            this.$router.back()
          })
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.logistics-public-wrap{
  .el-form{
    margin-top: 20px;

    .el-form-item{
      .el-input{
        width: 400px;
      }

      span{
        margin-left: 10px;
      }
    }
  }
}
</style>

<style lang="less">

</style>
