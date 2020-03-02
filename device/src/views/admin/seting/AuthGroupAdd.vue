<!-- 添加权限组 -->
<template>
<div class="add-group-wrap">
  <div class="add-group-cen">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-row class="form-wrap">
        <el-form-item label="权限组" prop="name">
          <el-input v-model="ruleForm.name" placeholder="限20个字，不含特殊字符"></el-input>
        </el-form-item>
      </el-row>
      <el-form-item prop="selectList" class="table-item-wrap">
        <table cellpadding="0" cellspacing="0" class="ta-l table-wrap">
          <tr>
            <th colspan="2"><el-checkbox v-model="checkAll" @change="allSelectChange">全选</el-checkbox></th>
          </tr>
          <tr v-for="item in groupData" :key="item.id">
            <td><el-checkbox v-model="item.checkAll" @change="rowSelectChange(item)">{{item.meunName}}</el-checkbox></td>
            <td><el-checkbox v-for="list in item.childMenuList" v-model="ruleForm.selectList" :label="list.id" :value="list.id" :key="list.id" @change="listSelectChange(list, item)">{{list.meunName}}</el-checkbox></td>
          </tr>
        </table>
      </el-form-item>
    </el-form>
  </div>
  <div class="ta-c add-group-b">
    <el-button type="primary" @click="submitForm('ruleForm')">{{adminId ? '提交修改' : '立即创建'}}</el-button>
    <el-button @click="$router.back()" v-if="adminId">返回</el-button>
  </div>
</div>
</template>

<script>
export default {
  data () {
    // 校验权限组名称
    let validateJurisdiction = (rule, value, callback) => {
      var pattern = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      if (value.length <= 0) return callback(new Error('请输入权限组名称'))
      if (pattern.test(value)) return callback(new Error('请输入正确的权限组名称'))
      if (value.length > 20) return callback(new Error('限20个字，不含特殊字符'))
      callback()
    }
    return {
      token: '',
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        selectList: []                  // 权限选择结果
      },
      rules: {
        name: [
          { required: true, validator: validateJurisdiction, trigger: 'blur' }
        ],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
        date1: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
        date2: [{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }],
        type: [{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }],
        resource: [{ required: true, message: '请选择活动资源', trigger: 'change' }],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
        selectList: [{ type: 'array', required: true, message: '请勾选权限!', trigger: 'change' }]
      },

      checkAll: false,                  // 是否全选
      selectAllList: [],                // 权限组所有id集合
      groupData: [],                    // 权限列表
      isIndeterminate: true,            // 选中状态
      adminId: '',                      // 管理员id
      adminInfo: {},                    // 管理员信息
      adminInfoData: {},                // 管理员信息
      actionType: ''                    // 添加 || 编辑
    }
  },
  watch: {
    '$route' () {
      this.adminId = this.$route.query.id || ''
      this.getGroup()
      if (this.adminId) {
        this.getAdminInfo()
      } else {
        this.ruleForm.name = ''
        this.ruleForm.selectList = []
      }
    }
  },
  /**
  * 定义方法
  */
  mounted () {
    this.adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    this.token = this.adminInfo.token
    this.adminId = this.$route.query.id
    this.getGroup()
    if (this.adminId) this.getAdminInfo()
    this.actionType = this.$route.query.type || ''
  },
  /**
   * 执行方法
   */
  methods: {
    /**
    * 获取管理员信息
    */
    getAdminInfo () {
      this.$http.post('@ROOT_API/auth/info', {
        id: this.adminId
      }).then((res) => {
        let resData = res.data
        console.log(resData)
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        }
        this.adminInfoData = resData.data
        this.adminInfoData.menuData.forEach((row) => {
          this.ruleForm.selectList.push(row.id)
          row.childMenuList.forEach((list) => {
            this.ruleForm.selectList.push(list.id)
          })
        })
        setTimeout(() => {
          this.groupData.map((row) => {
            let flag = true
            row.childMenuList.forEach((list, index) => {
              if (this.ruleForm.selectList.indexOf(list.id) !== -1) {
                list.checkAll = true
              } else {
                flag = false
              }
              if (index === row.childMenuList.length - 1 && flag) row.checkAll = true
            })
          })
          let checkallFlag = true
          this.groupData.forEach((row) => {
            if (!row.checkAll) checkallFlag = false
          })
          if (checkallFlag && this.ruleForm.selectList.length) this.checkAll = true
        }, 200)
        this.ruleForm.name = this.adminInfoData.groupName
      })
    },

    /**
    * 获取权限组
    */
    getGroup () {
      this.$http.get('@ROOT_API/auth/menus').then((res) => {
        // console.log(res.data)
        let resData = res.data
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        }
        resData.data.map((row) => {
          row.checkAll = false
          this.selectAllList.push(row.id)
          row.childMenuList.forEach((list) => {
            list.checkAll = false
            this.selectAllList.push(list.id)
          })
        })
        this.groupData = resData.data
      })
    },

    /**
    * 添加权限组
    */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let filterUrl = this.adminId ? 'auth/update' : 'auth/add'
        this.$http.post(this.$dm.ROOT_API + filterUrl, {
          id: parseInt(this.$route.query.id),
          groupName: this.ruleForm.name,
          menuIds: this.ruleForm.selectList.join(',')
        }).then((res) => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message.error(resData.msg)
            return false
          }
          this.$message.success(resData.msg)
          this.$router.push({path: '/admin/seting/auth/group/index'})
        })
      })
    },

    /**
     * 全选操作
     */
    allSelectChange (val) {
      console.log('this.groupData: ', this.groupData)
      if (val) {
        this.ruleForm.selectList = this.deepCopy(this.selectAllList)
        this.groupData.forEach((row) => {
          row.checkAll = true
        })
      } else {
        this.ruleForm.selectList = []
        this.groupData.forEach((row) => {
          row.checkAll = false
        })
      }
    },

    /**
     * 行全选
     */
    rowSelectChange (item) {
      if (item.checkAll) {
        item.childMenuList.forEach((row, i) => {
          this.ruleForm.selectList.push(row.id)
          row.checkAll = true
        })
        this.ruleForm.selectList.push(item.id)
      } else {
        item.childMenuList.forEach((row, i) => {
          this.ruleForm.selectList.splice(this.ruleForm.selectList.findIndex(v => v === row.id), 1)
          row.checkAll = false
        })
        this.ruleForm.selectList.splice(this.ruleForm.selectList.findIndex(v => v === item.id), 1)
      }
      this.filterSelect()
    },

    /**
     * 单个元素选择
     */
    listSelectChange (list, item) {
      list.checkAll = !list.checkAll
      let flag = null
      let index = 0
      item.childMenuList.map((row) => {
        if (row.checkAll === false) flag = true
        if (row.checkAll !== false) index++
      })
      item.checkAll = !flag ? !!true : !!false
      index > 0 ? this.ruleForm.selectList.push(item.id) : this.ruleForm.selectList.splice(this.ruleForm.selectList.indexOf(item.id), 1)
      this.filterSelect()
    },

    /**
     * 过滤全选
     */
    filterSelect () {
      this.ruleForm.selectList = [...new Set(this.ruleForm.selectList)]
      if (this.ruleForm.selectList.length === this.selectAllList.length) {
        this.checkAll = true
        this.isIndeterminate = false
      } else {
        this.checkAll = false
        this.isIndeterminate = true
      }
    },

    /**
     * 深拷贝
     */
    deepCopy (o) {
      if (o instanceof Array) {
        let n = []
        for (let i = 0; i < o.length; ++i) {
          n[i] = this.deepCopy(o[i])
        }
        return n
      } else if (o instanceof Object) {
        let n = {}
        for (let i in o) {
          n[i] = this.deepCopy(o[i])
        }
        return n
      } else {
        return o
      }
    }
  }
}
</script>

<style lang="less">
.add-group-wrap{

  .add-group-cen{
    background: #fff;
    padding:50px 40px;
    border-radius: 5px;
  }

  .form-wrap{
    width: 440px;
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

  .add-group-b{
    margin-top: 40px;
    .el-button{
      height: 36px;
      font-size: 16px;
      padding: 0 20px;
    }
    .el-button--default{
      background: none;
    }
  }
}
</style>
