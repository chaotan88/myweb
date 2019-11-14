<template>
  <div class="edit-attribute-wrap">
    <div class="content-wrap">
      <el-form :model="attribute" ref="attributeForm" label-width="120px">
        <el-form-item
          label="属性名称："
          prop="attributeName"
          :rules="[
            { required: true, message: '请输入属性名称', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,20}/g, message: '属性名称要在20字以内', trigger: 'blur' }
          ]">
          <el-input v-model="attribute.attributeName"></el-input>
        </el-form-item>
        <el-form-item label="属性备注：" class="remarks">
          <el-input v-model="attribute.remarks"></el-input>
        </el-form-item>
        <el-form-item
          label="属性值名称："
          v-for="(item, index) in attribute.attributeValList"
          :key="index"
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
  import $ from 'jquery'
  export default {
    data: function () {
      return {
        attributeId: '',
        attribute: {
          attributeType: '1',
          attributeName: '',
          remarks: '',
          attributeValList: [
            { attributeVal: '' }
          ]
        },
        deletedAttributeNames: [] // 保存移除的属性值名称
      }
    },
    methods: {
      getAttributeById: function () {
        // 获取属性详情
        this.$http.post('/admin/attribute/getAttributeById', this.qs.stringify({
          attributeId: this.attributeId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.attribute = res.data.obj
          }
        })
      },
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
        this.deletedAttributeNames.push(item)
      },
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      confirm: function (formName) {
        // 确定
        var attributeCopy = {}
        $.extend(true, attributeCopy, this.attribute) // 深拷贝
        this.deletedAttributeNames.forEach((item) => {
          item.attributeVal = ''
          attributeCopy.attributeValList.push(item)
        })
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post('/admin/attribute/updateAttribute', attributeCopy)
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('修改成功')
                this.$router.go(-1)
              }
            })
          } else {
            this.$message.error('表单项填写不正确')
          }
        })
      }
    },
    mounted: function () {
      this.attributeId = this.$route.params.attributeId  // 获取属性ID
      this.getAttributeById()  // 获取属性详情
    }
  }
</script>

<style lang="less" scoped>
  .edit-attribute-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .edit-attribute-wrap {
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
    [class^=el-icon-] {
      font-size: 30px;
      cursor: pointer;
      position: relative;
      top: 5px;
    }
    .remarks .el-form-item__label::before {
      content: '';
    }
  }
</style>
