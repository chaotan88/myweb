<template>
    <common-tpl class="pos-r property-add-wrap" footer back>
      <!-- 主体内容 -->
      <template slot="main">
        <template v-if="formData.level === 3">
          <h2>{{pageType === 1 ? '新增参数' : '编辑参数'}}</h2>
          <div class="commodity-details pos-r">
            <el-form :model="formData" ref="formData" :rules="rules" label-width="140px" class="demo-formData">
              <el-form-item label="参数类型：" prop="type" v-if="!formData.attributeId">
                <el-radio-group v-model="formData.type">
                  <el-radio :label="1">复选框</el-radio>
                  <el-radio :label="2">文本框</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="参数名称：" prop="name">
                <el-input v-model="formData.name" placeholder="限20个字符，不含特殊字符" maxlength="20"></el-input>
              </el-form-item>
              <template v-for="(item, index) in formData.valueName" v-if="formData.type === 1">
                <el-form-item label="参数值名称："
                  :prop="'valueName.' + index + '.attributeVal'"
                  :rules="validateValueName">
                  <el-input v-model="item.attributeVal" placeholder="限200个字符，不含特殊字符" maxlength="200"></el-input>
                  <i class="el-icon-plus pos-r multiple-icon" @click="addName"></i>
                  <i class="el-icon-minus pos-r multiple-icon" v-if="formData.valueName.length > 1" @click="removeName(index, item.id)"></i>
                </el-form-item>
              </template>
              <el-form-item label="备注：" prop="remark">
                <el-input v-model="formData.remark" class="textarea-type" placeholder="50个字符以内" maxlength="50"></el-input>
              </el-form-item>

              <el-form-item label="关 键 词：">
                <el-input type="textarea" v-model="formData.keyWords" class="textarea-type" rows="6" style="min-height: 150px;" placeholder="限200个字符以内，多个关键词以“#”号分隔" maxlength="200"></el-input>
                <span style="color: #999; margin-left: 5px;">({{formData.keyWords.length}}/200)</span>
              </el-form-item>
            </el-form>
          </div>
        </template>

        <template v-else>
          <no-data text="参数错误" class="pos-a" style="height: 100px; margin-top: -50px; margin-left: -50px; top: 50%; left: 50%"></no-data>
        </template>
      </template>

      <!-- 底部 -->
      <template slot="footer">
        <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')" v-if="formData.level === 3">确认</el-button>
      </template>
    </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证参数名称
    let validateName = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入参数名称'))
      // let reg = /^[a-zA-Z0-9\-_\s\u4e00-\u9fa5]*$/gi
      if (value.length > 20) return callback(new Error('限20个字符'))
      callback()
    }

    // 验证参数值名称
    let validateValueName = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入参数值名称'))
      // let reg = /^[a-zA-Z0-9\-_\s\u4e00-\u9fa5]*$/gi
      // if (value.length > 20 || !value.toString().match(reg)) return callback(new Error('限20个字符，不含特殊字符'))
      if (value.length > 20) return callback(new Error('限20个字符'))
      callback()
    }

    // 验证备注
    let validateRemark = (rule, value, callback) => {
      if (value && value.length > 20) return callback(new Error('20个字符以内'))
      callback()
    }

    return {
      confirmLoading: false,   // 确定loading
      pageType: 1,             // 当前页面 [1、新增，2、编辑]
      formData: {
        level: '',             // 商品分类等级
        levelId: '',           // 商品分类等级id
        attributeId: '',       // 参数ID
        type: 1,               // 参数类型
        name: '',              // 参数名称
        valueName: [{
          id: '',
          attributeVal: '',
          attributeId: ''
        }],                   // 参数值名称
        remark: '',           // 备注
        keyWords: ''           // 关键词
      },
      validateValueName: { required: true, validator: validateValueName, trigger: 'blur' },
      rules: {
        name: { required: true, validator: validateName, trigger: 'blur' },
        value: { required: true, validator: validateValueName, trigger: 'blur' },
        remark: { validator: validateRemark, trigger: 'blur' }
      }
    }
  },
  mounted () {
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    let query = this.$route.query
    this.formData.level = parseInt(query.level)
    this.formData.levelId = parseInt(query.levelId)

    if (this.formData.level !== 3) return false

    this.formData.attributeId = parseInt(query.id) || ''
    if (this.formData.attributeId) this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/attribute/getAttributeDetailById', {
        id: this.formData.attributeId
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
        let results = resData.data
        this.formData.type = results.attributeType
        this.formData.name = results.attributeName
        this.formData.valueName = results.attributeValList
        this.formData.remark = results.remark
        this.formData.keyWords = results.keyWords || ''
      })
    },

    /**
     * 增加参数名
     */
    addName () {
      if (this.formData.valueName.length >= 100) {
        this.$message({
          message: '您已达到参数最高添加上限100个，无法继续添加',
          duration: 1500,
          type: 'error'
        })
        return false
      }
      this.formData.valueName.length < 100 && this.formData.valueName.push({
        id: '',
        attributeVal: '',
        attributeId: ''
      })
    },

    /**
     * 删除参数名
     */
    removeName (index, id) {
      if (this.pageType === 1) {
        this.formData.valueName.splice(index, 1)
      } else {
        this.$http.post('@ROOT_API/attribute/deleteAttributeValById', {
          id: id
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
          this.formData.valueName.splice(index, 1)
        })
      }
    },

    /**
     * 提交验证表单
     */
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.confirmLoading = true
        this.$http.post('@ROOT_API/attribute/saveOrUpdateAttribute', {
          id: this.formData.attributeId,
          attributeTypeId: this.formData.levelId,
          attributeType: this.formData.type,
          attributeName: this.formData.name,
          attributeValList: this.formData.valueName,
          remark: this.formData.remark,
          keyWords: this.formData.keyWords
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.$router.push('/admin/goods/property/index')
        }).finally(() => {
          this.confirmLoading = false
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .property-add-wrap {


    h2{
      height: 50px;
      line-height:50px;
      font-weight: normal;
      font-size: 16px;
      background: #f4f4f4;
      margin-bottom: 30px;
      padding-left: 62px;
    }

    .commodity-details{
      overflow: hidden;
      border-bottom: 1px solid #f4f4f4;

      .el-form-item{
        width: 800px;
        float: left;
        .el-select{
          width: 400px;
        }
        .el-input{
          width: 400px;
        }
      }

      .textarea-type {
        width: 400px;

        textarea {
          min-height: 100px;
        }
      }

      .multiple-icon {
        color: blue;
        font-size: 26px;
        margin-right: 10px;
        left: 4px;
        top: 6px;
        cursor: pointer;
      }

    }
  }
</style>
