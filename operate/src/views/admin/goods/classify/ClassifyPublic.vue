<!-- 新增商品 -->
<template>
  <common-tpl class="classify-public-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="public-wrap-box">
        <gray-title :title="pageType === 1 ? '新增分类' : '编辑分类'"></gray-title>
        <el-form :model="formData" :rules="rules" ref="formData" label-position="right" label-width="140px" class="demo-formData">
          <!-- 添加栏目 -->
          <div class="commodity-details pos-r">
            <el-form-item label="分类名称：" prop="name">
              <el-input v-model="formData.name" placeholder="限50个字符" ></el-input>
            </el-form-item>
            <el-form-item label="分类图标：" prop="picture" class="full-w picture">
              <div class="pos-r upload-wrap">
                <el-upload
                  list-type="picture-card"
                  :action="uploadUrl"
                  :limit="1"
                  :file-list="uploadFileList"
                  :on-exceed="exceedHandle"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="pictureCardPreviewHandle"
                  :on-success="uploadSuccessHandle"
                  :on-remove="removeHandle">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="pos-a tips">
                  <p>建议尺寸：120 * 70px</p>
                  <p>建议大小：100KB以内</p>
                </div>
              </div>
              <el-dialog title="预览" :visible.sync="viewVisible">
                <img width="100%" :src="formData.logo | filterImgUrl">
              </el-dialog>
            </el-form-item>
            <el-form-item label="排序：" prop="sort" class="fl-l">
              <el-input v-model="formData.sort" placeholder="0-99的整数，0的排序最高" ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="submitForm('formData')">确定</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 验证排序
    let validateSort = (rule, value, callback) => {
      if (!value && parseInt(value) < 0 || value === null) return callback(new Error('请输入分类排序'))
      let reg = /^\d{1,2}$/gi
      if (!value.toString().match(reg)) return callback(new Error('限0-99的整数，0的排序最高'))
      callback()
    }

    return {
      pageType: 1,             // 页面类型 [1、新增，2、编辑]
      formData: {
        name: '',              // 栏目名称
        logo: '',              // 分类图标
        sort: '',              // 分类排序
        id: '',                // 分类id 添加的时候为空，编辑的时候需要传递
        goodsTypeLevel: '',    // 商家分类级别 1 大类 2中类 3小类
        parentId: ''           // 上级分类 id 上级分类id（大类 parentId 0 其他要根据选择的上级分类id）
      },
      uploadFileList: [],      // 上传列表
      viewVisible: false,      // 查看图片
      rules: {
        // 栏目名称
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 50, message: '限50个字符', trigger: 'blur' }
        ],
        // 栏目排序
        sort: [{ required: true, validator: validateSort, trigger: 'change' }]
      },
      userInfo: {}             // 用户信息
    }
  },
  computed: {
    /**
     * 上传路径
     */
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/goods/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    this.formData.id = this.$route.query.id && this.$route.query.id === '0' ? 0 : parseInt(this.$route.query.id)
    this.formData.goodsTypeLevel = this.$route.query.goodsTypeLevel && this.$route.query.goodsTypeLevel === '0' ? 0 : parseInt(this.$route.query.goodsTypeLevel)
    this.formData.parentId = this.$route.query.parentId && this.$route.query.parentId === '0' ? 0 : parseInt(this.$route.query.parentId)
    if (this.pageType === 2) this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/goodsType/getGoodsTypeDetail', {
        id: this.formData.id
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        let results = resData.data
        if (results.logo) {
          this.formData.logo = results.logo
          this.uploadFileList.push({name: results.goodsType, url: this.$Utils.filterImgUrl(results.logo)})
        }
        this.formData.name = results.goodsType
        this.formData.sort = results.sort
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
      this.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.logo = res.data
    },

    /**
     * 图片预览
     */
    pictureCardPreviewHandle (file) {
      this.viewVisible = true
    },

    /**
     * 图片被移除
     */
    removeHandle (file, fileList) {
      this.uploadFileList = []
      this.formData.logo = ''
    },

    /**
     * 提交表单验证
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        if (this.formData.goodsTypeLevel > 3) {
          this.$message({
            message: '商品分类等级不得大于3级',
            type: 'error',
            duration: 1500
          })
          return false
        }
        // ajax ...
        this.$http.post('@ROOT_API/goodsType/saveOrUpdateGoodsType', {
          id: this.formData.id,                             // 否 int 分类id 添加的时候为空，编辑的时候需要传递
          goodsType: this.formData.name,                    // 是 String  商家分类名称
          goodsTypeLevel: this.formData.goodsTypeLevel,     // 是 int 商家分类级别 1 大类 2中类 3小类
          parentId: this.formData.parentId,                 // 是 int 上级分类 id 上级分类id（大类 parentId 0 其他要根据选择的上级分类id）
          logo: this.formData.logo,                         // 是 int logo 图片路径
          sort: this.formData.sort                          // 是 int 排序
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
          this.$message({
            message: '成功',
            type: 'success',
            duration: 1000
          })
          setTimeout(() => {
            this.$router.back()
          }, 500)
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.classify-public-wrap{

  .admin-gray-title{
    margin-bottom: 20px;
  }

  .public-wrap-box{

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
        width: 500px;
      }

      .data{
        overflow: hidden;
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

      .el-form-item:nth-child(even){
        float: right;
      }
    }

  }
}
</style>

<style lang="less">
.classify-public-wrap{

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

  .upload-wrap{
    .el-upload-list{
      position: absolute;
    }
  }
}
</style>
