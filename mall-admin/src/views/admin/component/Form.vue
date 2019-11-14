<template>
  <common-tpl class="date-wrap">
    <template slot="header">
    </template>
    <template slot="main">
      
      <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <!-- <table>
          <tr>
            <th>1</th>
            <th>2</th>
            <th>3</th>
          </tr>
          <tr v-for="(domain, index) in dynamicValidateForm.domains">
            <td>img...</td>
            <td>
              <el-form-item
                :label="'域名' + index"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
                :rules="validator"
              >
                <el-input v-model="domain.value"></el-input>
                <el-button @click="addDomain">新增域名</el-button>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                :label="'域名' + index"
                :key="domain.key"
                :prop="'domains.' + index + '.test'"
                :rules="validator"
              >
                <el-input v-model="domain.test"></el-input>
                <el-button @click="addDomain">新增域名</el-button>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
              </el-form-item>
            </td>
          </tr>
        </table> -->
        <el-table
          :data="dynamicValidateForm.domains"
          style="width: 100%">
          <el-table-column prop="date" label="日期">
            <template slot-scope="scope">
              <el-form-item
                :label="'域名' + scope.$index"
                :key="scope.row.key"
                :prop="'domains.' + scope.$index + '.value'"
                :rules="validator"
              >
                <el-input v-model="scope.row.value"></el-input>
                <el-button @click="addDomain">新增域名</el-button>
                <el-button @click.prevent="removeDomain(scope.row)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期">
            <template slot-scope="scope">
              <el-form-item
                :label="'域名' + scope.$index"
                :key="scope.row.key"
                :prop="'domains.' + scope.$index + '.value'"
                :rules="validator"
              >
                <el-input v-model="scope.row.value"></el-input>
                <el-button @click="addDomain">新增域名</el-button>
                <el-button @click.prevent="removeDomain(scope.row)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="日期">
            <template slot-scope="scope">
              <el-form-item
                :label="'域名' + scope.$index"
                :key="scope.row.key"
                :prop="'domains.' + scope.$index + '.value'"
                :rules="validator"
              >
                <el-input v-model="scope.row.value"></el-input>
                <el-button @click="addDomain">新增域名</el-button>
                <el-button @click.prevent="removeDomain(scope.row)">删除</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
      <el-button @click="resetForm('dynamicValidateForm')">重置</el-button>



    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      let validateItem = (rule, value, callback) => {
        if (!value) callback(new Error('请输入栏目排序'))
        let reg = /^[0-9]{1,2}$/gi
        if (value.length > 99 || !value.toString().match(reg)) callback(new Error('限0-99的整数，0的排序最高'))
        callback()
      }

      return {
        dynamicValidateForm: {
          domains: [{
            value: '',
            test: '',
            test2: ''
          }]
        },
        validator: {
          required: true, validator: validateItem, trigger: 'blur'
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      removeDomain (item) {
        var index = this.dynamicValidateForm.domains.indexOf(item)
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1)
        }
      },
      addDomain () {
        this.dynamicValidateForm.domains.push({
          value: '',
          key: Date.now()
        })
      }
    }
  }
</script>

<style lang="less" scoped></style>
