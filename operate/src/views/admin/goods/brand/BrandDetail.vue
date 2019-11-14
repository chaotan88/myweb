<!-- 品牌管理 - 新增/编辑 -->
<template>
  <common-tpl class="brand-public-wrap" footer back>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
        <gray-title :title="pageType === 1 ? '新增品牌' : '编辑品牌'"></gray-title>
        <!-- 添加栏目 -->
        <div class="commodity-details pos-r">
          <el-form-item label="品牌名称: " prop="brandName">
            <el-input v-model="formData.brandName" placeholder="限20个字符以内" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="品牌LOGO: " prop="brandLogoList" class="full-w picture">
            <div class="pos-r upload-wrap" :class="{max: formData.brandLogoList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.brandLogoList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadSuccessHandle"
                :on-remove="removeHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span><span class="el-icon-warning"></span> 建议尺寸：150 * 150px</span>
            </div>
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
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      confirmLoading: false,          // 确定loading
      pageType: 1,                    // 页面类型 [1、新增 2、编辑]
      formData: {
        brandId: '',                  // 品牌id
        brandName: '',                // 品牌名称
        brandLogoList: [],            // 上传logo列表
        brandLogo: '',                // 上传logo地址
        columnMainImgFileList: [],    // 栏目主图地址
        columnMainImg: ''
      },
      dialogImageUrl: '',             // 上传图片路径
      dialogVisible: false,           // 上传
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 栏目名称
        brandName: [{ required: true, message: '请输入品牌名称', trigger: 'blur' }],

        // 图片
        brandLogoList: [{ required: true, type: 'array', message: '请上传品牌LOGO', trigger: 'change' }]
      },

      relationListData: [],    // 接收关联数据
      userInfo: {}             // 用户信息
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.formData.brandId = parseInt(this.$route.query.id) || ''
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    if (this.pageType === 2) this.getDetailsHandle()
    setTimeout(() => {
      this.relationKey = new Date().getTime()
    }, 100)
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsHandle () {
      this.$http.post('@ROOT_API/brand/getBrandDetail', {
        id: this.formData.brandId
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
        this.formData.brandName = results.brandName
        if (results.brandLogo) {
          this.formData.brandLogoList.push({url: this.$Utils.filterImgUrl(results.brandLogo)})
          this.formData.brandLogo = results.brandLogo
        }
      })
    },

   /**
   * 文件上传前的格式和大小校验
   */
    beforeAvatarUpload (file) {
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
        message: '最多只能上传1个图标',
        type: 'error'
      })
    },

    /*
     * 图片上传成功
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
      this.formData.brandLogoList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.brandLogo = res.data
    },

    /**
     * 图片预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /**
     * 图片被移除
     */
    removeHandle (file, fileList) {
      this.formData.brandLogo = ''
      this.formData.brandLogoList = []
    },

    /**
     * 栏目主图预览
     */
    handleMainImgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /*
     * 栏目主图上传成功
     */
    handleUploadImgSuccess (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.columnMainImgFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.columnMainImg = res.data
    },

    /**
     * 移除栏目主图
     */
    handleRemoveColumnImg (file, fileList) {
      this.formData.columnMainImgFileList = []
      this.formData.columnMainImg = ''
    },
    /**
     * 提交表单验证
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        let url = this.pageType === 1 ? '@ROOT_API/brand/addBrand' : '@ROOT_API/brand/editBrand'
        this.$http.post(url, {
          id: this.formData.brandId,            // 栏目ID
          brandName: this.formData.brandName,   // 品牌名称
          brandLogo: this.formData.brandLogo    // 是 String  栏目图标
        }).then((res) => {
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
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.confirmLoading = false
          })
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.brand-public-wrap{

  .button-wrap{
    margin-left: 0;
    height: 40px;
  }

  .commodity-details, .relation-public-wrap{
    border-top: 0;
    margin-bottom: 20px;
    padding-top: 20px;
  }

  .el-form{
    padding-top: 30px;
  }

  /*------添加栏目--------*/
  .commodity-details{
    overflow: hidden;

    .el-form-item{
      width: 50%;

      .el-select, .el-input{
        width: 400px;
      }
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
        margin-left: 80px;
      }
    }
  }
}
</style>

<style lang="less">
.brand-public-wrap{

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

  .el-form-item__label{
    margin-right: 10px;
  }

  .el-form-item__error{
    left: 160px !important;
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

  .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
