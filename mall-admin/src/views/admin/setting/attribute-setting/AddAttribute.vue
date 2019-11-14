<template>
  <div class="add-attribute-wrap">
    <div class="content-wrap">
      <el-form :model="attribute" ref="attributeForm" label-width="120px">
        <el-form-item label="属性类型：">
          <el-radio label="1" v-model="attribute.attributeType">复选框</el-radio>
          <el-radio label="2" v-model="attribute.attributeType">文本框</el-radio>
        </el-form-item>
        <el-form-item
          label="属性名称："
          class="pointer"
          prop="attributeName"
          :rules="[
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,20}/g, message: '属性名称要在20字以内', trigger: 'blur' }
          ]">
          <el-input v-model="attribute.attributeName"></el-input>
        </el-form-item>
        <el-form-item label="属性备注：">
          <el-input v-model="attribute.remarks"></el-input>
        </el-form-item>
        <el-form-item
          label="属性值名称："
          class="pointer"
          v-for="(item, index) in attribute.attributeValList"
          :key="index"
          v-if="attribute.attributeType === '1'"
          :prop="'attributeValList.' + index + '.attributeVal'"
          :rules="{
            required: true, message: '属性值名称不能为空', trigger: 'blur'
          }">
          <el-input v-model="item.attributeVal"></el-input>
          <i class="el-icon-plus" style="color: rgb(37, 157, 214); font-size: 24px;" @click="addValuesName"></i>
          <i class="el-icon-minus" style="color: rgb(37, 157, 214); font-size: 24px;" @click="removeValuesName(item)"></i>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="confirm('attributeForm')">确认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        attribute: {
          attributeType: '1',
          attributeName: '',
          remarks: '',
          attributeValList: [
            { attributeVal: '' }
          ]
        }
      }
    },
    methods: {
      addValuesName: function () {
        // 添加
        this.attribute.attributeValList.push({
          attributeVal: ''
        })
      },
      removeValuesName: function (item) {
        // 移除
        var index = this.attribute.attributeValList.indexOf(item)
        if (index !== -1) {
          this.attribute.attributeValList.splice(index, 1)
        }
      },
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      confirm: function (formName) {
        // 确定
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/admin/attribute/addAttribute', this.attribute)
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('添加成功')
                this.$router.push('/admin/setting/attribute-setting/attribute-management')
              }
            })
          } else {
            this.$message.error('表单项填写不正确')
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .add-attribute-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .add-attribute-wrap {
    .el-form {
      .el-input {
        width: 300px;
      }
    }
    .pointer
    .el-form-item__label::before {
      content: "*";
      color: #f56c6c;
      margin-right: 6px;
    }
    [class^=el-icon-] {
      font-size: 30px;
      cursor: pointer;
      position: relative;
      top: 5px;
    }
  }
</style>
