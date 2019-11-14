<template>
  <common-tpl class="supplier-public-wrap" footer back>
    <template slot="main">
      <gray-title title="基本信息"></gray-title>
      <el-form label-width="150px" :model="formData" :rules="rules" ref="form">
        <div class="commodity-details pos-r">
          <el-form-item label="供应商名称：" prop="supplierName">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码：" prop="">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.supplierNo"></el-input>
          </el-form-item>
          <el-form-item label="供应商logo：" prop="" class="full-w picture">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadFileList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.uploadFileList"
                :on-exceed="exceedHandle"
                :before-upload="beforeUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadSuccessHandle"
                :on-remove="removeHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!-- <el-upload
                list-type="picture-card"
                action="https://jsonplaceholder.typicode.com/posts/"
                :limit="1">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload> -->
              <span><span class="el-icon-warning"></span> 建议尺寸：150 * 150px</span>
            </div>
          </el-form-item>
          <el-form-item label="联系人：" prop="">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.contactsName"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="contactsPhone">
            <el-input placeholder="输入11位数手机号码" maxlength="11" v-model="formData.contactsPhone"></el-input>
          </el-form-item>
          <el-form-item label="仓库名称：" prop="storageName">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.storageName"></el-input>
          </el-form-item>
          <el-form-item label="经营品牌：" prop="brandList">
            <el-select v-model="formData.brandList" multiple filterable placeholder="请选择经营品牌" @remove-tag="removeTag" @change="brandChange">
              <template v-for="(item, index) in brandListData">
                <el-option
                  :key="item.id"
                  :label="item.brandName"
                  :value="item.id"
                  :disabled="pageType === 2 && item.brandCount > 0">
                  <!-- <el-checkbox class="d-b is-checked" :aria-checked="true" :checked="formData.brandList.indexOf(item.id) > 0">{{ item.brandName }} {{formData.brandList.indexOf(item.id) > 0}}</el-checkbox> -->
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地：">
            <region-select :initData="formData.region" @change="regionChange"></region-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="contactsAddress">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.contactsAddress"></el-input>
          </el-form-item>
        </div>
        <gray-title title="合作方式"></gray-title>
        <div class="commodity-details pos-r">
          <el-form-item label="结算方式：" prop="">
            <el-radio-group v-model="formData.balanceType" @change="balanceTypeChange">
              <el-radio :label="1">周期结算</el-radio>
              <el-radio :label="2">额度结算</el-radio>
              <el-radio :label="3">实时结算</el-radio>
              <el-radio :label="4">预付结算</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结算帐期：" prop="balanceValue" v-if="formData.balanceType === 1">
            <el-input placeholder="输入正整数" maxlength="10" v-model="formData.balanceValue"></el-input>
            <span>&nbsp;天</span>
          </el-form-item>
          <el-form-item label="结算金额：" prop="balanceMoney" v-if="formData.balanceType === 2">
            <el-input @blur="inpBlur('balanceMoney')" placeholder="输入正数，可精确到百分位" maxlength="15" v-model="formData.balanceMoney"></el-input>
            <span>&nbsp;元</span>
          </el-form-item>
          <el-form-item label="预付金额：" prop="balanceMoney" v-if="formData.balanceType === 4">
            <el-input @blur="inpBlur('balanceMoney')" placeholder="输入正数，可精确到百分位" maxlength="10" v-model="formData.balanceMoney"></el-input>
            <span>&nbsp;元</span>
          </el-form-item>
          <el-form-item label="合作周期：" prop="concurDate">
            <el-col :span="7">
              <el-date-picker type="daterange" start-placeholder="年 / 月 / 日" end-placeholder="年 / 月 / 日" class="full-w" clearable v-model="formData.concurDate"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="合作跟进人：" prop="">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.followupPerson"></el-input>
          </el-form-item>
          <el-form-item label="跟进人电话：" prop="followupPhone">
            <el-input placeholder="输入11位数手机号码" maxlength="11" v-model="formData.followupPhone"></el-input>
          </el-form-item>
        </div>
        <gray-title title="账户登录信息"></gray-title>
        <div class="commodity-details pos-r">
          <el-form-item label="登录名：" prop="loginName" :required="pageType === 1">
            <template v-if="pageType === 1">
              <el-input placeholder="限50个字符" maxlength="50" v-model="formData.loginName"></el-input>
            </template>
            <template v-if="pageType === 2">{{formData.loginName | filterEmpty}}</template>
          </el-form-item>
          <el-form-item label="输入密码：" prop="password" :required="pageType === 1">
            <el-input type="password" placeholder="限50个字符" maxlength="50" v-model="formData.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword" :required="pageType === 1">
            <el-input type="password" placeholder="限50个字符" maxlength="50" v-model="formData.confirmPassword"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="图标预览" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button v-loading="loading" type="primary" @click="handleSubmit('form')" :loading="submitLoading">提交</el-button>
    </template>

  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect},
  data () {
    // 校验登录名
    let validateLoginName = (rule, value, callback) => {
      if (!value && this.pageType === 1) return callback(new Error('请输入登录名'))
      if (value && !value.toString().match(/^[a-zA-Z].*$/gi)) return callback(new Error('登录名必须以英文开头'))
      callback()
    }

    // 校验密码
    let validatePwd = (rule, value, callback) => {
      if (!value && this.pageType === 1) return callback(new Error('请输入确认密码'))
      callback()
    }

    // 校验确认密码
    let validateConfirmPwd = (rule, value, callback) => {
      if (!value && this.pageType === 1) return callback(new Error('请输入确认密码'))
      if (value && value !== this.formData.password) return callback(new Error('密码输入不一致'))
      callback()
    }

    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (!value) return callback(new Error('值不能为空'))
      if (!value.toString().match(/^[1-9]{1}\d{0,9}$/gi)) return callback(new Error('输入正整数'))
      callback()
    }

    // 校验金额
    let validateMoney = (rule, value, callback) => {
      if (this.formData.balanceType === 2 || this.formData.balanceType === 4) {
        if (!value) return callback(new Error('值不能为空'))
        let reg = /^\d+\.\d{2}$/gi
        if (value && !value.toString().match(reg)) return callback(new Error('请输入正数,精确到百分位'))
        callback()
      }
      callback()
    }

    // 校验手机号
    let validatePhone = (rule, value, callback) => {
      if (value && !value.toString().match(/^1\d{10}$/gi)) return callback(new Error('手机格式错误'))
      callback()
    }
    return {
      loading: false,         // 加载中
      pageType: 1,            // 页面类型 [1、新增，2、编辑]
      submitLoading: false,   // 提交loading
      formData: {
        supplierName: '',     // 供应商名称
        supplierNo: '',       // 供应商编码
        uploadFileList: [],   // 上传列表
        supplierLogo: '',     // 供应商logo
        contactsName: '',     // 联系人姓名
        contactsPhone: '',    // 联系人手机
        storageName: '',      // 仓库名称
        brandList: [],        // 经营品牌列表
        active: true,
        region: {
          province: {         // 省
            code: '',
            name: ''
          },
          city: {             // 市
            code: '',
            name: ''
          },
          area: {             // 区
            code: '',
            name: ''
          }
        },
        contactsAddress: '',  // 详细地址
        balanceType: 1,       // 结算方式
        balanceValue: '',     // 结算方式值
        concurDate: [],       // 合作周期时间
        followupPerson: '',   // 合作跟进人
        followupPhone: '',    // 跟进人电话
        loginName: '',        // 登录名
        password: '',         // 密码
        confirmPassword: ''   // 确认密码
      },
      rules: {
        supplierName: [{required: true, message: '请输入供应商名称', trigger: 'blur'}],
        storageName: [{required: true, message: '请输入仓库名称', trigger: 'blur'}],     // 仓库名称
        brandList: [{required: true, type: 'array', message: '请选择经营品牌', trigger: 'change'}],     // 经营品牌
        loginName: [{validator: validateLoginName, trigger: 'blur'}],
        contactsPhone: [{validator: validatePhone, trigger: 'blur'}],       // 联系方式
        followupPhone: [{validator: validatePhone, trigger: 'blur'}],       // 跟进人电话
        balanceMoney: [{required: true, validator: validateMoney, trigger: 'blur'}],
        balanceValue: [{required: true, validator: validateInt, trigger: 'blur'}],
        concurDate: [{ type: 'array', required: true, message: '请选择合作周期', trigger: 'change' }],
        password: [{validator: validatePwd, message: '请输入密码', trigger: 'blur'}],
        confirmPassword: [{validator: validateConfirmPwd, trigger: 'blur'}]
      },
      copyBrandList: [],      // 拷贝品牌选中值
      brandListData: [],      // 品牌名称列表
      supplierId: '',         // 供应商id
      dialogVisible: false,   // 图片弹窗显示
      dialogImageUrl: '',     // 图片弹窗显示地址
      detailsData: {},        // 详情数据
      userInfo: {},           // 用户信息
      brandPage: {            // 品牌分页
        currentPage: 1,
        pageSize: 9999,
        total: 0
      }
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  mounted () {
    if (this.$route.path.match(/edit/gi)) this.pageType = 2
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.supplierId = parseInt(this.$route.query.id) || ''
    if (this.supplierId) this.getDetailsData()
    this.getBusinessBrand()
  },

  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/supplier/getSupplierAdminDetail', {
        supplierId: this.supplierId
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
        this.detailsData = results
        this.formData.loginName = results.loginName                        // 是 string  登录名
        this.formData.password = results.password                          // 是 string  密码
        this.formData.confirmPassword = results.respassword                // 是 string  确认密码
        this.formData.supplierName = results.supplierName                  // 是 string  供应商名称
        this.formData.supplierNo = results.supplierCode                    // 否 string  供应商编码
        if (results.supplierLogo) this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(results.supplierLogo)})
        this.formData.supplierLogo = results.supplierLogo                  // 否 String  供应商logo
        this.formData.contactsName = results.contactName                   // 否 String  联系人
        this.formData.contactsPhone = results.contactPhone                 // 否 String  联系方式
        this.formData.storageName = results.storageName                    // 否 String  仓库名称
        this.formData.brandList = results.brandList                        // 否 String  经营品牌
        this.copyBrandList = this.$Utils.deepCopy(this.formData.brandList)
        this.formData.brandListData = []
        this.formData.region.province.name = results.supplierProvince      // 否 String  所在地省
        this.formData.region.province.code = results.supplierProvinceCode  // 否 String
        this.formData.region.city.name = results.supplierCity              // 否 String  所在市
        this.formData.region.city.code = results.supplierCityCode          // 否 String
        this.formData.region.area.name = results.supplierZone              // 否 String  所在地区
        this.formData.region.area.code = results.supplierZoneCode          // 否 String
        this.formData.contactsAddress = results.supplierAddress            // 否 String  详细地址
        this.formData.balanceType = results.settleMethod                   // 否 int 结算方式
        if (results.settleMethod === 1) {
          this.formData.balanceValue = results.settleMethodVal             // 否 int 结算方式值
        } else {
          this.formData.balanceMoney = results.settleMethodVal             // 否 int 结算方式值
          this.inpBlur('balanceMoney')
        }
        this.formData.concurDate.push(results.concurStart)                 // 否 date  合作周期时间
        this.formData.concurDate.push(results.concurEnd)                   // 否 date  合作周期时间
        // this.formData.concurStart = results.concurStart                    // 否 date  合作周期开始时间
        // this.formData.concurEnd = this.$Utils.completionEndDate(results.concurEnd)  // 否 date  合作周期结束时间
        this.formData.followupPerson = results.concurName                  // 否 String  合作跟进人
        this.formData.followupPhone = results.concurPhone                  // 否 String  跟进人电话
      })
    },

    /**
     * 移除品牌
     */
    removeTag (value) {
      let filterObj = this.brandListData.filter(row => row.id === value)
      if (filterObj[0].brandCount > 0) {
        this.$message({
          message: '品牌已关联商品，不可删除',
          duration: 1500,
          type: 'error'
        })
        this.formData.brandList = this.$Utils.deepCopy(this.copyBrandList)
      }
    },

    /**
     * 品牌选择
     */
    brandChange (value) {
      setTimeout(() => {
        this.copyBrandList = this.$Utils.deepCopy(this.formData.brandList)
      }, 500)
    },

    /**
     * 得到经营品牌
     */
    getBusinessBrand () {
      this.$http.get('@ROOT_API/supplier/getListBrandName', {
        params: {
          // supplierId: this.supplierId,
          start: this.brandPage.currentPage,
          pageSize: this.brandPage.pageSize
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
        this.brandListData = resData.data
      })
    },

    /**
     * 结算方式改变
     */
    balanceTypeChange () {
      this.$refs['form'].clearValidate(['balanceValue', 'balanceMoney'])
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个LOGO',
        type: 'error'
      })
    },

    /**
    * 文件上传前的格式和大小校验
    */
    beforeUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLegalPhoto && isLt10M
    },

    /**
     * 图片预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /*
     * 图片上传成功
     */
    uploadSuccessHandle (res) {
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.supplierLogo = res.data
    },

    /**
     * 图片被移除
     */
    removeHandle (file, fileList) {
      this.formData.uploadFileList = []
      this.formData.supplierLogo = ''
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 提交数据
     */
    handleSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.submitLoading = true
        this.loading = true
        let url = ''
        url = this.pageType === 1 ? '@ROOT_API/supplier/addSupplier' : '@ROOT_API/supplier/editAdminSupplier'
        let concurStart = new Date(this.formData.concurDate[0]).getTime()
        let concurEnd = new Date(this.formData.concurDate[1]).getTime()
        let settleMethodVal = null
        if (this.formData.balanceType === 1) {
          settleMethodVal = this.formData.balanceValue
        } else if (this.formData.balanceType === 2 || this.formData.balanceType === 4) {
          settleMethodVal = parseFloat(this.formData.balanceMoney)
        }
        this.$http.post(url, {
          id: this.pageType !== 1 ? this.detailsData.id : '',
          userId: this.pageType !== 1 ? this.detailsData.userId : '',
          loginName: this.formData.loginName,                        // 是 string  登录名
          password: this.formData.password,                          // 是 string  密码
          respassword: this.formData.confirmPassword,                // 是 string  确认密码
          supplierName: this.formData.supplierName,                  // 是 string  供应商名称
          supplierCode: this.formData.supplierNo,                    // 否 string  供应商编码
          supplierLogo: this.formData.supplierLogo,                  // 否 String  供应商logo
          contactName: this.formData.contactsName,                   // 否 String  联系人
          storageName: this.formData.storageName,                    // 是 String  仓库名称
          brandList: this.formData.brandList,                        // 是 list 品牌主键集合
          contactPhone: this.formData.contactsPhone,                 // 否 String  联系方式
          supplierProvince: this.formData.region.province.name,      // 否 String  所在地省
          supplierProvinceCode: this.formData.region.province.code,  // 否 String
          supplierCity: this.formData.region.city.name,              // 否 String  所在市
          supplierCityCode: this.formData.region.city.code,          // 否 String
          supplierZone: this.formData.region.area.name,              // 否 String  所在地区
          supplierZoneCode: this.formData.region.area.code,          // 否 String
          supplierAddress: this.formData.contactsAddress,            // 否 String  详细地址
          settleMethod: this.formData.balanceType,                   // 否 int 结算方式
          settleMethodVal,                                           // 否 int 结算方式值
          concurStart,                                               // 否 date  合作周期开始时间
          concurEnd,                                                 // 否 date  合作周期结束时间
          concurName: this.formData.followupPerson,                  // 否 String  合作跟进人
          concurPhone: this.formData.followupPhone                   // 否 String  跟进人电话
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
          this.submitLoading = false
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
            this.submitLoading = false
          }, 1000)
        })
      })
    },

    /**
     * 自动补全两位小数
     */
    inpBlur (key) {
      this.$Utils.blurAutoCompletion(this.formData, key)
    }
  }
}
</script>

<style lang='less' scoped>
.supplier-public-wrap{

  .button-wrap{
    margin-left: 0;
    height: 40px;
  }

  .commodity-details, .relation-public-wrap{
    border: 1px solid #f0f0f0;
    border-top: 0;
    margin-bottom: 20px;
    margin-top: -20px;
    padding-top: 20px;
  }

  .commodity-details{
    margin-top: 0;
    padding-top: 20px;
  }

  /*------添加栏目--------*/
  .commodity-details{
    overflow: hidden;

    .el-form-item{
      .el-select, .el-input, .region-select-wrap{
        width: 400px;
      }
    }

    .el-col-3{
      width: 172px;
    }

    .data{
      overflow: hidden;
    }

    /*----------itme图片---------*/
    .picture{
      .el-form-item__content{
        height: 150px;
        border: 1px solid #c8d0da;
      }

      span{
        color: #f5a74a;
      }
    }
  }
}
</style>

<style lang="less">
.supplier-public-wrap{

  .upload-wrap.max{
    .el-upload{
      display: none;
    }
  }

  .column-item{
    .el-radio{
      margin-right: 10px;
      .el-radio__input{
        display: none;
      }
    }

    .el-radio.is-checked{
      background: #2eaaf7;

      .el-radio__label{
        color: #fff !important;
      }
    }
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }

  .el-input-group__append{
    font-size: 14px;
    cursor: pointer;

    span:hover{
      color: #409EFF;
    }
  }
}
</style>
