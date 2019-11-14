<!-- 设置 -->
<template>
  <common-tpl class="seting-index-wrap" footer>
    <template slot="header"></template>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="from" label-width="200px">
        <gray-title>供应商资料</gray-title>

        <div class="list-wrap">
          <el-form-item class="pos-r upload" label="供应商logo：" prop="supplierLogo">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadFileList.length}">
              <el-upload class="d-ib va-t"
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.uploadFileList"
                :on-exceed="exceedHandle"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeUpload"
                :on-remove="removeHandle"
                :on-success="uploadSuccessHandle">
                <i class="el-icon-plus"></i>
                <el-input v-model="formData.supplierLogo" class="d-n"></el-input>
              </el-upload>
              <div class="pos-a tips-text">
                <p>建议尺寸：80 * 80px</p>
                <p>建议大小：100KB以内</p>
              </div>
            </div>
            <el-dialog title="预览" :visible.sync="previewVisible">
              <img class="full-w" :src="formData.supplierLogo | filterImgUrl">
            </el-dialog>
          </el-form-item>

          <el-form-item label="供应商名称：" prop="supplierName">
            <el-input placeholder="50字符以内" maxlength="50" v-model="formData.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码：" prop="supplierCode">
            <el-input placeholder="50字符以内" maxlength="50" v-model="formData.supplierCode"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contactsName">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.contactsName"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <!-- <span>{{userInfo.phone}}</span>&nbsp;&nbsp; -->
            <span>{{formData.contactsPhone}}</span>
            <el-button size="mini" @click="showDialogWrap = true">{{formData.contactsPhone ? '修改' : '设置'}}</el-button>
          </el-form-item>
          <el-form-item label="所在地：">
            <region-select :initData="formData.region" @change="regionChange"></region-select>
          </el-form-item>
          <el-form-item label="详细地址：" prop="contactsAddress">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.contactsAddress" clearable></el-input>
          </el-form-item>
          <el-form-item label="仓库名称：" prop="storageName">
            <el-input placeholder="限50个字符" maxlength="50" v-model="formData.storageName" clearable></el-input>
          </el-form-item>
          <el-form-item label="经营品牌：" prop="brandList">
            <el-select placeholder="请选择经营品牌" multiple filterable clearable v-model="formData.brandList" @remove-tag="removeTag" @change="brandChange">
              <template v-for="item in brandListData">
                <el-option :key="item.id" :label="item.brandName" :value="item.id">
                  <el-checkbox class="d-b" :checked="formData.brandList.indexOf(item.id) !== -1">{{ item.brandName }}</el-checkbox>
                  <!-- <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span> -->
                </el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>

        <br>

        <gray-title>合作模式</gray-title>
        <div class="list-wrap last">
          <el-form-item label="结算方式：">{{formData.settleMethod | filterSettlement}}</el-form-item>
          <el-form-item label="合作周期：">{{formData.concurStart | filterDate('YYYY-MM-DD')}} 至 {{formData.concurEnd | filterDate('YYYY-MM-DD')}}</el-form-item>
          <el-form-item label="平台对接人：">{{formData.concurName | filterEmpty}}</el-form-item>
          <el-form-item label="联系方式：">{{formData.concurPhone | filterEmpty}}</el-form-item>
        </div>

      </el-form>

    </template>

    <template slot="footer">
      <el-button type="primary" @click="submitHandle('from')">保存</el-button>
    </template>

    <template slot="other">
      <!-- 弹窗 -->
      <el-dialog class="update-phone-dialog"
        title="手机号验证"
        :visible.sync="showDialogWrap"
        :before-close="closeDialogHandle"
        width="580px">
        <!-- 修改手机号 -->
        <update-phone :phone="formData.contactsPhone" :initData="formData" @close="closeDialogHandle" @success="handleSuccess"></update-phone>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import UpdatePhone from './AccountUpdatePhone'
import RegionSelect from '@/components/public/RegionSelect'
export default {
  components: {UpdatePhone, RegionSelect},
  data () {
    // 校验手机号
    let validatePhone = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入11位手机号'))
      if (!value.toString().match(/^1\d{10}$/g)) return callback(new Error('手机号格式不正确'))
      callback()
    }

    return {
      formData: {
        id: '',
        userId: '',
        uploadFileList: [],     // 上传集合
        supplierLogo: '',       // 供应商logo
        supplierName: '',       // 供应商名称
        supplierCode: '',         // 供应商编码
        contactsName: '',       // 联系人
        contactsPhone: '',      // 手机号
        region: {               // 所在地
          province: {           // 省
            code: '',
            name: ''
          },
          city: {               // 市
            code: '',
            name: ''
          },
          area: {               // 区
            code: '',
            name: ''
          }
        },
        contactsAddress: '',    // 详细地址
        storageName: '',        // 仓库名称
        brandList: [],          // 经营品牌
        settleMethod: '',       // int 结算方式
        settleMethodVal: '',    // int 结算方式值
        concurStart: '',        // date  合作周期开始时间
        concurEnd: '',          // date  合作周期结束时间
        concurName: '',         // String  合作跟进人
        concurPhone: ''         // String  跟进人电话
      },
      rules: {
        supplierLogo: [{required: true, message: '请上传供应商LOGO', trigger: 'change'}],
        supplierName: [
          {required: true, message: '请输入供应商名称', trigger: 'blur'},
          {required: true, max: 50, message: '50字符以内', trigger: 'blur'}
        ],
        supplierCode: [
          {required: true, message: '请输入供应商编码', trigger: 'blur'},
          {required: true, min: 1, max: 50, message: '50字符以内', trigger: 'blur'}
        ],
        contactsName: [
          {required: true, message: '请输入联系人', trigger: 'blur'},
          {required: true, max: 50, message: '限50个字符', trigger: 'blur'}
        ],
        contactsPhone: [{required: true, validator: validatePhone, trigger: 'blur'}],
        contactsAddress: [{max: 50, message: '限50个字符', trigger: 'blur'}],
        storageName: [{required: true, message: '请输入仓库名称', trigger: 'blur'}],
        brandList: [{required: true, message: '请选择经营品牌', trigger: 'change'}]
      },
      brandListData: [],        // 经营品牌列表
      copyBrandList: [],        // 拷贝经营品牌
      brandPage: {              // 品牌分页
        currentPage: 1,
        pageSize: 100,
        total: 1
      },
      previewVisible: false,  // 查看图片
      userInfo: {},           // 用户信息
      showDialogWrap: false   // 修改手机号弹窗
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getDetailsData()
    this.getBrandList()
    this.$refs['from'].resetFields()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.get('@ROOT_API/supplier/getSupplierDetail', {}).then((res) => {
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
        this.formData.id = results.id
        this.formData.userId = results.userId
        if (results.supplierLogo) this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(results.supplierLogo)})
        this.formData.supplierLogo = results.supplierLogo
        this.formData.supplierName = results.supplierName
        this.formData.supplierCode = results.supplierCode
        this.formData.contactsName = results.contactName
        this.formData.contactsPhone = results.contactPhone
        this.formData.contactsAddress = results.supplierAddress

        this.formData.region.province.code = results.supplierProvinceCode
        this.formData.region.province.name = results.supplierProvince
        this.formData.region.city.code = results.supplierCityCode
        this.formData.region.city.name = results.supplierCity
        this.formData.region.area.code = results.supplierZoneCode
        this.formData.region.area.name = results.supplierZone
        this.formData.storageName = results.storageName
        this.formData.brandList = results.brandList
        this.copyBrandList = this.$Utils.deepCopy(results.brandList)

        this.formData.settleMethod = results.settleMethod
        this.formData.settleMethodVal = results.settleMethodVal
        this.formData.concurStart = results.concurStart
        this.formData.concurEnd = results.concurEnd
        this.formData.concurName = results.concurName
        this.formData.concurPhone = results.concurPhone
      })
    },

    /**
     * 获取品牌列表
     */
    getBrandList () {
      this.$http.get('@ROOT_API/supplier/getListBrandName', {
        params: {
          supplierId: this.userInfo.supplierId,
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
     * 文件上传前的格式和大小校验
     */
    beforeUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
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
     * 上传成功
     */
    uploadSuccessHandle (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.supplierLogo = res.data
      this.formData.uploadFileList.push({
        url: this.$Utils.filterImgUrl(res.data)
      })
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      this.formData.supplierLogo = ''
      this.formData.uploadFileList = []
    },

    /**
     * 文件预览
     */
    handlePictureCardPreview (file) {
      this.previewVisible = true
    },

    /**
     * 关闭修改手机号弹窗
     */
    closeDialogHandle () {
      this.showDialogWrap = false
    },

    /**
     * 关闭修改手机号弹窗(成功)
     */
    handleSuccess (value) {
      if (value) this.formData.contactsPhone = value
    },

    /**
     * 所在地选择
     */
    regionChange (res) {
      this.formData.region = res
    },

    /**
     * 保存
     */
    submitHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let concurStart = this.formData.concurStart ? new Date(this.formData.concurStart).getTime() : ''
        let concurEnd = this.formData.concurEnd ? new Date(this.formData.concurEnd).getTime() : ''
        this.$http.post('@ROOT_API/supplier/editSupplier', {
          id: this.formData.id,
          userId: this.formData.userId,
          // loginName: this.formData.loginName,                     // 是 string  登录名
          // password: this.formData.password,                       // 是 string  密码
          // respassword: this.formData.confirmPassword,             // 是 string  确认密码
          supplierName: this.formData.supplierName,                  // 是 string  供应商名称
          supplierCode: this.formData.supplierCode,                  // 否 string  供应商编码
          supplierLogo: this.formData.supplierLogo,                  // 否 String  供应商logo
          contactName: this.formData.contactsName,                   // 否 String  联系人
          // contactPhone: this.formData.contactsPhone,                 // 否 String  联系方式
          supplierProvince: this.formData.region.province.name,      // 否 String  所在地省
          supplierProvinceCode: this.formData.region.province.code,  // 否 String
          supplierCity: this.formData.region.city.name,              // 否 String  所在市
          supplierCityCode: this.formData.region.city.code,          // 否 String
          supplierZone: this.formData.region.area.name,              // 否 String  所在地区
          supplierZoneCode: this.formData.region.area.code,          // 否 String
          supplierAddress: this.formData.contactsAddress,            // 否 String  详细地址
          storageName: this.formData.storageName,                    // 是 String 仓库名称
          brandList: this.formData.brandList,                        // 是 list 品牌主键集合
          settleMethod: this.formData.balanceType,                   // 否 int 结算方式
          settleMethodVal: this.formData.balanceValue,               // 否 int 结算方式值
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
            duration: 1500
          })
        })
      })
    }
  }
}
</script>

<style lang="less">
.seting-index-wrap{
  .list-wrap{
    border: 1px solid #eef1f9;
  }

  .el-form-item{
    margin-bottom: 0;
    padding-top: 10px;
    padding-bottom: 10px;

    .el-form-item__content, .el-select{
      width: 400px;
    }
  }

  .list-wrap:last-child {
    .el-form-item{
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  .upload-wrap{
    height: 150px;

    .el-upload-list__item{
      margin-bottom: 0;
    }

    .tips-text{
      color: #aaa;
      width: 200px;
      height: 56px;
      line-height: 28px;
      font-size: 13px;
      margin-top: -30px;
      margin-left: 15px;
      left: 160px;
      top: 50%;
    }
  }

  .upload-wrap.max{
    .el-upload--picture-card{
      display: none;
    }
  }
  
  /**
   * 修改手机号
   */
  .update-phone-dialog{
    .el-form-item{
      .el-form-item__content{
        width: 300px;
      }
    }
  }
}
</style>
