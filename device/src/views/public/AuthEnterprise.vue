<template>
  <div class="auth-enterprise-wrap">
    <el-form :model="formData" :rules="rules" ref="verifiForm" label-position="right" label-width='120px'>
      <el-form-item inline label='企业名称：' prop='name'>
        <el-input class='inp-name' placeholder='请输入企业名称' v-model="formData.name"></el-input>
        <span class="pos-a character-wrap">{{formData.name.length}}/100</span>
      </el-form-item>
      <el-form-item inline label='企业所在地：' prop='address' class="address-wrap">
        <region-select :assignData="formData.region" @change="regionChange"></region-select>
        <el-input class='inp-address' type="textarea" placeholder='详细地址' v-model="formData.address"></el-input>
        <p class="ta-r pos-a text-gray character-wrap">{{formData.address.length}}/100</p>
      </el-form-item>
      <el-form-item label='附　　件：' prop='enclosure'>
        <div class="upload-wrap">
          <el-upload
            :action="uploadUrl"
            :limit="1"
            :on-success="uploadSuccessHandle"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            class="upload-wrap">
              <el-button>上传营业执照</el-button>
          </el-upload>
        </div>
        <p class="text-gray">上传营业执照扫描件（图片格式: jpg、png）</p>
      </el-form-item>
      <div class="ta-c btn-wrap">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button type="primary" class='confirm-btn' @click="submitForm('verifiForm')">确定</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: { RegionSelect },
  data () {
    return {
      formData: {                 // 表单数据
        name: '',                 // 企业名称
        province: '',             // 省
        city: '',                 // 市
        area: '',                 // 区
        address: '',              // 详细地址
        enclosure: '',            // 附件
        region: {
          province: {                     // 省
            code: '',
            name: ''
          },
          city: {                         // 市
            code: '',
            name: ''
          },
          area: {                         // 区
            code: '',
            name: ''
          }
        }
      },
      rules: {
        name: [
          { required: true, message: '输入企业名称', trigger: 'blur' },
          { min: 1, max: 100, message: '请输入(1-100)个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 100, message: '详细地址(1-100)个字符', trigger: 'blur' }
        ],
        enclosure: [{ required: true, message: '请上传营业执照', trigger: 'blur' }]
      },
      fileList: [],               // 上传列表
      userInfo: {}                // 用户信息
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API.substring(0, this.$dm.ROOT_API.length - 10) + 'equipment/upload/uploadimg/ad/adAcount?clientType=1&token=' + this.userInfo.token
      // return ' http://192.168.8.100:8085/passpay-admin/admin/upload/uploadimg/ad/adAcount?clientType=1&token=' + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('deviceAdminInfo')) || {}
  },
  methods: {
    /**
     * 省市区选择
     */
    regionChange (results) {
      this.formData.region = results
    },

    /**
     * 提交表单
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        // ajax ...
        this.$http.post('@ROOT_API/cooperationUserController/validCompany', {
          id: this.userInfo.userId,
          companyName: this.formData.name,
          companyProvince: this.formData.region.province.name,
          companyProvinceCode: this.formData.region.province.code,
          companyCity: this.formData.region.city.name,
          companyCityCode: this.formData.region.city.code,
          companyZone: this.formData.region.area.name,
          companyZoneCode: this.formData.region.area.code,
          companyAddress: this.formData.address,
          companyLicense: this.formData.enclosure
        }).then((res) => {
          if (!res) return false
          setTimeout(() => {
            this.$emit('close')
          }, 500)
        })
      })
    },
    /**
     * 上传前校验
    */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片格式有误')
        return false
      }
    },
    /**
     * 上传成功
     */
    uploadSuccessHandle (res, file) {
      // console.log(res)
      if (res.status !== '1') {
        this.$message.error(res.msg)
        alert()
        return false
      }
      this.formData.enclosure = res.data
    }
  }
}
</script>

<style lang='less' scoped>
.auth-enterprise-wrap{
  padding: 0 70px;

  .text-gray{
    color: #999;
    font-size: 14px;
  }

  .btn-wrap{

    .el-button{
      width: 120px;
      height: 38px;
      font-size: 16px;
      padding: 0;
      margin: 0 25px;
    }

    .confirm-btn{
      border-color: #33719b;
      background: #33719b;
    }
  }
}
</style>

<style lang='less'>
.auth-enterprise-wrap{

  .el-form{

    .el-form-item.address-wrap{
      .el-textarea{
        width: 215px;
        margin-top: 20px;
      }

      .character-wrap{
        top: 60px;
      }
    }

    .el-form-item{
      margin-bottom: 20px;

      .inp-name{
        width: 215px;
      }

      .character-wrap{
        color: #999;
        font-size: 16px;
        right: 0;
        top: 0;
      }

      .el-form-item__label{
        font-size: 16px;
        text-align: right;
        padding-left: 0;
      }

      .el-form-item__content{
        font-size: 16px;

        .el-button{
          width: 100px;
          height: 38px;
          padding: 0;
          right: 0;
          top: 0;
        }

      }
    }
  }
}
</style>
