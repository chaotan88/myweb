<!-- 供应商管理 -->
<template>
  <common-tpl class="order-index-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入供应商名称" v-model.trim="formData.supplierName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!tableData.length" @click="getListData('export')">导出</el-button>
          <el-button @click="$router.push('/admin/supplier/manage/add')">添加供应商</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="formData" label-width="100px">
            <el-form-item label="联系人：" prop="customerName">
              <el-input v-model.trim="formData.contactName" placeholder="限50个字符" maxlength="50" clearable></el-input>
            </el-form-item>
            <el-form-item label="所在地：">
              <region-select :initData="formData.region" @change="regionChange"></region-select>
            </el-form-item>
            <el-form-item label="联系方式：" prop="customerPhone" clearable>
              <el-col :span="11">
                <el-input v-model.trim="formData.contactPhone" placeholder="输入11位数手机号码" maxlength="11" clearable></el-input>
              </el-col>
            </el-form-item>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="供应商名称">
          <template slot-scope="scope">{{scope.row.supplierName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="所在地区">
          <template slot-scope="scope">{{scope.row.region | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="合作开始时间">
          <template slot-scope="scope">{{scope.row.concurStart | filterDate}}</template>
        </el-table-column>
        <el-table-column label="联系人">
          <template slot-scope="scope">{{scope.row.contactName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column prop="name5" label="联系方式">
          <template slot-scope="scope">{{scope.row.contactPhone | filterEmpty}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleUpdatePasswordBefore(scope.row)"><i class="icon el-icon-setting"></i>修改密码</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/supplier/manage/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
               <!--  <el-dropdown-item>
                  <div @click="handleDelSupplierBefore(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                </el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
      </el-pagination>
    </template>

    <template slot="other">
      <!-- 修改密码 -->
      <el-dialog
        :visible.sync="updatePasswordVisible"
        title="修改密码"
        width="500px">

        <el-form label-width="110px" style="padding: 0 30px;" :model="formData" :rules="rules" ref="update-password">
          <el-form-item label="新　密　码：" prop="newPwd">
            <el-input type="password" placeholder="6-20位字符" v-model="formData.newPwd"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码：" prop="confirmPwd">
            <el-input type="password" placeholder="6-20位字符" v-model="formData.confirmPwd"></el-input>
          </el-form-item>
        </el-form>
        
        <br>
        <div class="ta-c">
          <el-button @click="updatePasswordVisible = false, updatePasswordLoading = false">取消</el-button>
          <el-button type="primary" :loading="updatePasswordLoading" @click="handleUpdatePassword('update-password')">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="删除供应商" :visible.sync="delSupplierVisible" width="500px">
        <div class="ta-c" style="padding: 40px 0 50px 0;">确认是否删除供应商？</div>
        <div class="ta-c">
          <el-button @click="delSupplierVisible = false, delSupplierLoading = false">取消</el-button>
          <el-button type="primary" :loading="delSupplierLoading" @click="handleDelSupplier">确定</el-button>
        </div>
      </el-dialog>      
    </template>
  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect},
  data () {
    // 验证手机
    let validatePhone = (rule, value, cb) => {
      let reg = /^1\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return cb(new Error('手机格式错误'))
      cb()
    }
    // 验证密码
    let validatePwd = (rule, value, callback) => {
      if (!value) return callback(new Error(rule.tips))
      if (value.length < 6 || value.length > 20) return callback(new Error('6-20位字符'))
      if (rule.field === 'confirmPwd' && this.formData.newPwd && value !== this.formData.newPwd) return callback(new Error('密码输入不一致'))
      if (rule.field === 'newPwd' && this.formData.confirmPwd) this.$refs['update-password'].validateField('confirmPwd')
      callback()
    }

    return {
      formData: {
        loading: false,
        supplierName: '',   // 供应商名称
        contactName: '',    // 联系人
        contactPhone: '',   // 联系方式
        region: {
          province: {       // 省
            code: '',
            name: ''
          },
          city: {           // 市
            code: '',
            name: ''
          },
          area: {           // 区
            code: '',
            name: ''
          }
        },
        newPwd: '',         // 新密码
        confirmPwd: ''      // 确认密码
      },
      rules: {
        newPwd: [{required: true, validator: validatePwd, tips: '请输入新密码', trigger: 'blur'}],
        confirmPwd: [{required: true, validator: validatePwd, tips: '请再次输入新密码', trigger: 'blur'}],
        customerPhone: { validator: validatePhone, trigger: 'blur' },
        customerName: [{ max: 50, message: '限50个字符', trigger: 'blur' }]
      },
      tableData: [],
      copyFormData: {},     // 拷贝
      pageData: {           // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      updatePasswordVisible: false, // 修改密码弹窗
      updatePasswordLoading: false, // 修改密码提交中
      updatePasswordData: {},       // 修改密码数据

      delSupplierVisible: false,    // 删除供应商弹窗
      delSupplierLoading: false,    // 删除供应商提交中
      delSupplierData: {},          // 删除供应商数据
      userInfo: {}                  // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/supplier/manage', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (type) {
      let url = null
      if (!type) {
        this.loading = true
        url = '@ROOT_API/supplier/getSupplierPage'
      } else {
        url = 'supplier/exportSupplier'
      }
      let data = {
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize,
        supplierName: this.formData.supplierName,                  // 否 string  供应商名称
        contactName: this.formData.contactName,                    // 否 string  联系人
        contactPhone: this.formData.contactPhone,                  // 否 string  联系人方式
        supplierProvinceCode: this.formData.region.province.code,  // 否 string  省
        supplierCityCode: this.formData.region.city.code,          // 否 string  市
        supplierZoneCode: this.formData.region.area.code           // 否 string  区
      }
      if (!type) {
        this.$http.get(url, {
          params: data
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          let results = resData.data
          if (!results.list.length) {
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          results.list.forEach((row) => {
            let region = []
            if (row.supplierProvince) region.push(row.supplierProvince)
            if (row.supplierCity) region.push(row.supplierCity)
            if (row.supplierZone) region.push(row.supplierZone)
            row.region = region.join(' , ')
          })
          this.tableData = results.list
          this.pageData.total = results.total
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 修改密码前操作
     */
    handleUpdatePasswordBefore (row) {
      this.updatePasswordVisible = true
      this.formData.newPwd = ''
      this.formData.confirmPwd = ''
      if (this.$refs['update-password']) this.$refs['update-password'].clearValidate()
      this.updatePasswordData = row
    },

    /**
     * 修改密码
     */
    handleUpdatePassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.updatePasswordLoading = true
        this.loading = true
        this.$http.post('@ROOT_API/supplier/editPassword', {
          userId: this.updatePasswordData.userId, // 是 string  供应商用户主键
          password: this.formData.newPwd,         // 是 string  密码
          respassword: this.formData.confirmPwd   // 是 string  确认密码
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
            duration: 1000
          })
          this.updatePasswordVisible = false
          this.updatePasswordLoading = false
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 500)
        })
      })
    },

    /**
     * 删除供应商前操作
     */
    handleDelSupplierBefore (row) {
      this.delSupplierVisible = true
      this.delSupplierData = row
    },

    /**
     * 删除供应商
     */
    handleDelSupplier () {
      this.delSupplierLoading = true
      this.$http.get('@ROOT_API/supplier/deleteSupplier', {
        params: {
          userId: this.delSupplierData.userId     // 是 string  供应商用户主键
        }
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
          duration: 1000
        })
        this.delSupplierVisible = false
        this.delSupplierLoading = false
        this.getListData()
      })
    },

    /**
     * 重置表单
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
    }
  }
}
</script>

<style lang="less" scoped>
.order-index-wrap {
  /*----------------搜索-----------*/
  .search-wrap {
    .el-form-item {
      .el-radio-group {
        div {
          margin-right: 20px;
        }
      }
    }

    .el-dropdown {
      width: 80px;
      top: 0;
      left: -80px;
    }
  }
}
</style>

<style lang="less">
.order-index-wrap {

  .region-select-wrap{
    .el-input{
      width: auto !important;
    }
  }


  /*----------------发货----------*/
  .el-dialog {
    .el-dialog__body {
      text-align: left;

      .order-info {
        padding: 0 20px;
        border-bottom: 1px solid #eee;
        span {
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }
      }

      .order-express {
        padding: 20px 0 0 0;

        .number {
          width: 46%;
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        border-radius: 3px;
        border-color: none;
      }
    }
  }

  /* -------------------- { 确认支付 } -------------------- */
  .confirm-pay-dialog {
    h2 {
      font-size: 20px;
      margin-bottom: 30px;

      strong {
        color: red;
      }
    }

    .tips {
      color: #999;
      font-size: 14px;
      margin-top: 10px;
    }

    .confirm-pay-btns {
      padding-top: 50px;

      .el-button {
        margin: 0 20px;
      }
    }
  }

  .confirm-pay-dialog.max {
    .el-upload--picture-card {
      display: none;
    }
  }

  /* -------------------- { 查看物流 } -------------------- */
  .el-dialog {
    .el-dialog__header {
      text-align: left;
    }

    .logistics-msg-wrap {
      padding-left: 140px;

      .logistics-title {
        color: #feae34;
        font-size: 15px;
        margin-left: -56px;

        p {
          margin-bottom: 5px;
        }

        span {
          color: #999;
        }
      }

      .el-step.is-vertical:first-child {
        .el-step__icon {
          color: #fff;
          padding: 5px;
          background: #fe9a01;
        }

        .icon {
          fill: #fff;
        }
      }

      .phone-color {
        span {
          color: #feae34;
        }
      }

      .el-step__line {
        width: 1px;
        border-left: 1px dashed #dfdfdf;
        background: none;
      }

      .logistics-number {
        color: #feae34;
      }

      .el-step__main {
        position: relative;

        .el-step__title {
          line-height: 20px;
          font-weight: normal;
          font-size: 15px;
          position: absolute;
          left: -140px;
          top: -8px;

          strong {
            color: #666;
            margin-bottom: 3px;
          }

          p {
            color: #c0c4cc;
            font-size: 14px;
          }
        }

        .el-step__description {
          color: #c0c4cc;
          line-height: 30px;
          font-size: 15px;
          margin-top: -3px;
          padding-bottom: 30px;
        }

        .el-step__title {
          width: 100px;
          text-align: right;
        }
      }

      .el-step__icon.is-text {
        border: none;
      }

      .el-step__icon {
        color: #999;
        background: #d0d0d0;
        padding: 3px;
      }

      .icon {
        fill: #999;
      }
    }
  }
}

.search-wrap .high-search-down .btn-wrap {
  margin-top: 0;
}
</style>
