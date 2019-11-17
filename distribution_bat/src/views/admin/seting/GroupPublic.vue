<!-- 添加 || 编辑 权限组 -->
<template>
  <common-tpl class="add-group-wrap" footer back>
    <template slot="main">
      <gray-title :title="pageType === 1 ? '新增权限组' : '编辑权限组'"></gray-title>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="240px">
        <el-row class="row-wrap">
          <el-form-item label="权限组名称：" prop="name" class="item-name">
            <el-input v-model="formData.name" placeholder="限6-50个字符"></el-input>
          </el-form-item>
        </el-row>
        <h3 class="fw-n">基础模块授权</h3>
        <el-form-item prop="selectList" class="table-item-wrap">
          <table cellpadding="0" cellspacing="0" class="ta-l table-wrap">
            <tr>
              <th colspan="2"><el-checkbox v-model="checkAll" :disabled="checkAllDisabled === true" @change="allSelectChange">全选</el-checkbox></th>
            </tr>
            <tr v-for="item in groupData" :key="item.id">
              <td><el-checkbox v-model="item.selected" :disabled="item.disabled === true" @change="rowSelectChange(item)">{{item.meunName}}</el-checkbox></td>
              <td><el-checkbox v-for="list in item.childMenuList" v-model="item.selectList" :label="list.id" :value="list.id" :key="list.id" :disabled="item.disabled === true" @change="listSelectChange(item)">{{list.meunName}}</el-checkbox></td>
            </tr>
          </table>
        </el-form-item>
      </el-form>
    </template>

    <template slot="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="submitForm('formData')" :loading="loading">确定</el-button>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateName = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入权限组名称'))
      if (value.length < 6 || value.length > 50) return callback(new Error('限6-50个字符'))
      callback()
    }
    let validateSelectList = (rule, value, callback) => {
      if (!this.formData.selectList.length) return callback(new Error('请勾选权限'))
      callback()
    }
    return {
      pageType: 1,              // 页面类型 [1、新增 2、编辑]

      loading: false,           // 加载中
      formData: {
        name: '',               // 权限组名称
        selectList: []          // 权限选择结果
      },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        selectList: [{required: true, validator: validateSelectList, trigger: 'change'}]
      },

      checkAll: false,          // 是否全选
      checkAllDisabled: false,  // 是否禁用全选
      roleMenuList: [],         // 当前用户权限菜单
      selectMenuData: [],       // 已选择权限菜单
      groupData: [],            // 权限列表
      authId: ''                // 管理员id
    }
  },

  watch: {
    'selectMenuData' () {
      if (!this.groupData.length) return false
      this.filterSelectMenu()
    },

    'groupData' () {
      if (!this.selectMenuData.length) return false
      this.filterSelectMenu()
    }
  },

  mounted () {
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    this.authId = parseInt(this.$route.query.id) || ''
    if (this.authId) this.getAdminInfo()
    this.getGroup()
    this.roleMenuList = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'MenuList')) || []
  },

  methods: {
    /**
    * 获取管理员信息
    */
    getAdminInfo () {
      this.$http.post('@ROOT_API/auth/info', {
        id: this.authId
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        }
        let results = resData.data
        this.formData.name = results.groupName
        this.selectMenuData = results.menuData
      }, 1000)
    },

    /**
    * 获取权限组
    */
    getGroup () {
      this.$http.get('@ROOT_API/auth/menus').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1 && parseInt(resData.status) !== 9998) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.filterGroupMenu(resData.data).then((res) => {
          this.groupData = res
          setTimeout(() => {
            let disabledLen = 0
            let isCheckAll = true
            this.groupData.map((row) => {
              if (row.selectList.length !== row.childMenuList.length) isCheckAll = false
              if (row.disabled === true) disabledLen++
            })
            if (isCheckAll) this.checkAll = true
            if (disabledLen === this.groupData.length) this.checkAllDisabled = true
          }, 10)
        })
      })
    },

    /**
     * 过滤权限组列表
     */
    filterGroupMenu (lists) {
      return new Promise((resolve, reject) => {
        lists.map((row) => {
          if (row.parentId === 0) {
            row.selected = false
            row.selectList = []
          }
          row.disabled = this.roleMenuList.length && this.roleMenuList.indexOf(row.menuCode) === -1
          // 如果存在子集列表，递归操作
          if (row.childMenuList && row.childMenuList.length) this.filterGroupMenu(row.childMenuList)
        })
        resolve(lists)
      })
    },

    /**
     * 编辑操作初始化已选中菜单
     */
    filterSelectMenu () {
      this.selectMenuData.forEach((row) => {
        if (row.childMenuList && row.childMenuList.length) {
          this.groupData.forEach((list) => {
            if (row.menuCode === list.menuCode) {
              list.selected = row.childMenuList.length === list.childMenuList.length
              row.childMenuList.forEach((child) => {
                list.selectList.push(child.id)
              })
            }
          })
        }
      })
    },

    /**
     * 全选操作
     */
    allSelectChange (val) {
      this.formData.selectList = []
      this.groupData.forEach((row) => {
        if (row.disabled !== true) {
          row.selected = val
          this.rowSelectChange(row)
        }
      })
    },

    /**
     * 行全选
     */
    rowSelectChange (item) {
      this.formData.selectList = []
      if (item.selected && item.disabled !== true) {
        item.selectList = []
        item.childMenuList.forEach((row) => {
          item.selectList.push(row.id)
        })
      } else {
        item.selectList = []
      }
      this.checkAll = true
      this.groupData.forEach((row) => {
        if (row.disabled !== true && !row.selected) this.checkAll = false
      })
    },

    /**
     * 单个元素选择
     */
    listSelectChange (item) {
      this.formData.selectList = []
      item.selected = item.selectList.length === item.childMenuList.length
      this.checkAll = true
      this.groupData.forEach((row) => {
        if (row.disabled !== true && !row.selected) this.checkAll = false
      })
    },

    /**
    * 添加或修改权限组
    */
    submitForm (formName) {
      // 过滤选择权限集合
      this.groupData.forEach((row) => {
        if (row.disabled !== true && row.selectList.length) {
          this.formData.selectList.push(row.id)
          row.selectList.forEach((list) => {
            this.formData.selectList.push(list)
          })
        }
      })
      // console.log('this.formData.selectList: ', this.formData.selectList)
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.loading = true
        let url = this.authId ? '@ROOT_API/auth/update' : '@ROOT_API/auth/add'
        this.$http.post(url, {
          id: this.authId,
          groupName: this.formData.name,
          menuIds: this.formData.selectList.join(',')
        }).then((res) => {
          this.loading = false
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
          setTimeout(() => {
            this.$router.push({path: '/admin/seting/auth/group'})
          }, 200)
        })
      })
    }
  }
}
</script>

<style lang="less">
.add-group-wrap{

  .row-wrap{
    border-top: 1px solid #eef1f5;

    .item-name{
      .el-input__inner{
        width: 390px;
      }
    }

    .el-form-item{
      border: 1px solid #eef1f5;
      border-top: 0;
      margin-bottom: 0;

      .el-form-item__label{
        padding: 15px 60px 15px 0;
        border-right: 1px solid #eef1f5;
        background: #f8f8f8;
      }

      .el-form-item__content{
        padding: 15px 50px 0 50px;
      }

      .el-form-item__error{
        left: 50px;
        top: 75%;
      }
    }
  }

  h3{
    font-size: 18px;
    margin-top: 30px;
    padding-left: 20px;
  }

  .table-item-wrap{
    .el-form-item__content{
      margin-left: 0 !important;
    }
  }

  .table-wrap{
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    margin-top: 20px;

    tr{
      height: 60px;
      line-height: 60px;

      th, td{
        padding: 0 30px;
      }

      th{
        background: #f8f8f8;
      }

      td:first-child{
        width: 200px;
        background: #f8f8f8;
      }

      td{
        border: 1px solid #ddd;
      }
    }
  }
}
</style>
