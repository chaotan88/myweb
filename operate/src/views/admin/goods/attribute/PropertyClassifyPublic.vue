<!-- 新增类目 -->
<template>
  <common-tpl class="property-classify-public" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="public-wrap-box">
        <h2>{{ PropertyTitle }}</h2>
        <el-form :model="formData" :rules="rules" ref="formData" label-width="140px">
          <!-- 添加栏目 -->
          <div class="commodity-details pos-r">
            <el-form-item label="类目名称：" prop="name">
              <el-input v-model="formData.name" placeholder="限50个字符" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="类目图标：" prop="picture" class="picture w100">
              <div class="pos-r upload-wrap">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :limit="1"
                  :file-list="formData.uploadFileList"
                  :on-exceed="exceedHandle"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="pictureCardPreviewHandle"
                  :on-success="uploadSuccessHandle"
                  :on-remove="removeHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="pos-a tips">
                  <p>建议尺寸：100 * 100px</p>
                  <p>建议大小：100KB以内</p>
                </div>
              </div>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="formData.logo | filterImgUrl">
              </el-dialog>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
              <el-input v-model="formData.sort" placeholder="0-99的整数，0的排序最高" ></el-input>
            </el-form-item>
            <el-form-item label="是否显示：">
              <el-radio-group v-model="formData.whetherDisplay">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="关 键 词：">
              <el-input type="textarea" v-model="formData.keyWords" class="textarea-type" rows="6" style="min-height: 150px;" placeholder="限200个字符以内，多个关键词以“#”号分隔" maxlength="200"></el-input>
              <span style="color: #999; margin-left: 5px;">({{formData.keyWords.length}}/200)</span>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">确定</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      /**
       * 验证名称
       */
      let validateName = (rule, value, callback) => {
        if (!value) return callback(new Error('请输入类目名称'))
        // let reg = /^[a-zA-Z0-9\-_\s\u4e00-\u9fa5]*$/gi
        // if (value.length > 50 || !value.toString().match(reg)) callback(new Error('限50个字符，不含特殊字符'))
        callback()
      }

      // 验证排序
      let validateSort = (rule, value, callback) => {
        if (value === '') return callback(new Error('请输入类目排序'))
        let reg = /^\d{1,2}$/gi
        if (!value.toString().match(reg)) callback(new Error('限0-99的整数，0的排序最高'))
        callback()
      }

      return {
        confirmLoading: false,      // 确定loading
        PropertyTitle: '新增类目',  // 新增类目/编辑类目
        formData: {
          id: '',                   // 类目id
          name: '',                 // 栏目名称
          logo: '',                 // 类目图标
          uploadFileList: [],       // 上传列表
          sort: '',                 // 类目排序
          whetherDisplay: 0,        // 是否显示 0显示 1 不显示
          attributeTypeLevel: '',   // 是 int 类目级别 1 大类 2中类 3小类
          parentId: '',             // 是 int 上级类目 id 大类 parentId 0 其他要根据选择的上级类目id
          keyWords: ''              // 关键词
        },
        dialogImageUrl: '',         // 上传图片路径
        dialogVisible: false,       // 上传
        detailsData: {},            // 详情数据
        rules: {
          // 栏目名称
          name: [
            { required: true, validator: validateName, message: '', trigger: 'blur' }
          ],
          // 栏目排序
          sort: [{ required: true, validator: validateSort, trigger: 'change' }]
        },
        userInfo: {}      // 用户信息
      }
    },
    computed: {
      uploadUrl () {
        return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      this.formData.id = this.$route.query.id
      this.formData.attributeTypeLevel = parseInt(this.$route.query.attributeTypeLevel)
      this.formData.parentId = this.$route.query.parentId
      if (this.formData.id) {
        this.getDetailsData()
        this.PropertyTitle = '编辑类目'
      }
    },
    methods: {
      /**
       * 获取列表数据
       */
      getDetailsData () {
        this.$http.post('@ROOT_API/attributeType/getAttributeTypeDetail', {
          id: this.formData.id
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
          this.formData.name = results.attributeTypeName
          this.formData.logo = results.logo
          if (results.logo) this.formData.uploadFileList.push({name: '', url: this.$Utils.filterImgUrl(results.logo)})
          this.formData.attributeTypeLevel = results.attributeTypeLevel
          this.formData.parentId = results.parentId
          this.formData.sort = results.sort
          this.formData.whetherDisplay = results.whetherDisplay || 0
          this.formData.keyWords = results.keyWords || ''
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
        if (res.status !== '1') {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.formData.logo = res.data
        this.formData.uploadFileList.push({name: '', url: this.$Utils.filterImgUrl(res.data)})
      },

      /**
       * 图片预览
       */
      pictureCardPreviewHandle (file) {
        this.formData.logo = file.url
        this.previewDialogVisible = true
        window.open(file.url, '_blank')
      },

      /**
       * 图片被移除
       */
      removeHandle (file, fileList) {
        this.formData.logo = ''
        this.formData.uploadFileList = []
      },

      /**
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.confirmLoading = true
          this.$http.post('@ROOT_API/attributeType/saveOrUpdateAttributeType', {
            id: this.formData.id,                                 // 否 int 类目id 添加的时候为空，编辑的时候需要传递
            attributeTypeName: this.formData.name,                // 是 String  类目名称
            attributeTypeLevel: this.formData.attributeTypeLevel, // 是 int 类目级别 1 大类 2中类 3小类
            parentId: this.formData.parentId,                     // 是 int 上级类目 id 大类 parentId 0 其他要根据选择的上级类目id
            logo: this.formData.logo,                             // 是 int logo 图片路径
            sort: this.formData.sort,                             // 是 int 排序
            whetherDisplay: this.formData.whetherDisplay,         // 是否显示 0显示 1 不显示
            keyWords: this.formData.keyWords
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
            this.$router.back()
          }).finally(() => {
            this.confirmLoading = false
          })
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.property-classify-public{

  .public-wrap-box{

  h2{
    height: 50px;
    line-height:50px;
    font-weight: normal;
    font-size: 16px;
    padding-left: 20px;
    background: #f4f4f4;
    margin-bottom: 30px;
  }

  .button-wrap{
    height: 40px;
    left: 0;
    bottom: 0;
  }

  /*------添加栏目--------*/
  .commodity-details{
    overflow: hidden;
    border-bottom: 1px solid #f4f4f4;

    .el-form-item{
      .el-select, .el-input, .el-textarea{
        width: 400px;
      }
    }

  .data{
    overflow: hidden;
  }

  /*----------itme图片---------*/
  .w100{
    width: 100%;
  }

  .upload-wrap{
    width: 150px;
    height: 150px;

    .tips{
      color: #f5a74a;
      width: 200px;
      height: 60px;
      line-height: 30px;
      margin-top: -30px;
      left: 110%;
      top: 50%;
    }
  }

  .picture{
    .el-form-item__content{
      height: 150px;
      border: 1px solid #c8d0da;
    }
  }
  }

  }
}
</style>

<style lang="less">
.property-classify-public{
  .public-wrap{
    .el-form-item__label{
      margin-right: 30px;
    }

    .el-form-item__error{
      left: 30px !important;
    }

    .el-form-item__label{
      width: 130px !important;
    }

    .el-form-item__content{
      margin-left: 130px !important;
    }

    .el-radio__input.is-checked .el-radio__inner{
      border-color: #409EFF;
      background: #409EFF;
    }

    .el-input-group__append{
      font-size: 20px;
      i{
        font-size: 20px;
      }
    }
  }

  .upload-wrap{
    .el-upload-list{
      position: absolute;
    }
  }
}
</style>
