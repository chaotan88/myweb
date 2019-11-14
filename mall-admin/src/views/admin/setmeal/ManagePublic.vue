<!-- 百事贝管理系统后台商品-商品管理 -->
<template>
  <common-tpl class="column-public-wrap">
    <template slot="main">
      <gray-title :title="pageType === 1 ? '新增套餐分组' : '编辑套餐分组'"></gray-title>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
        <!-- 新增套餐分组 -->
        <div class="commodity-details pos-r">
          <el-form-item label="套餐类型: " class="setmeal-type-wrap" v-if="pageLevel === 0 || pageLevel === 1 && pageType === 2">
            <el-radio-group v-model="formData.setmealType">
              <el-radio :label="1" border>固定套餐</el-radio>
              <el-radio :label="2" border>自选套餐</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分组名称: " prop="name">
            <el-input v-model="formData.name" placeholder="50个字符以内" ></el-input>
          </el-form-item>
          <el-form-item label="分组图标: " class="full-w picture">
            <div class="pos-r upload-wrap" :class="{max: formData.uploadFileList.length === 1}">
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
              <span><span class="el-icon-warning"></span> 建议尺寸：100 * 100px 建议大小：100KB以内</span>
            </div>
          </el-form-item>
          <el-form-item label="分组主图: " class="full-w picture" prop="columnMainImg">
            <div class="pos-r upload-wrap" :class="{max: formData.columnMainImgFileList.length === 1}">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="formData.columnMainImgFileList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="handleMainImgPreview"
                :on-success="handleUploadImgSuccess"
                :on-remove="handleRemoveColumnImg">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span><span class="el-icon-warning"></span> 建议尺寸：100 * 100px 建议大小：100KB以内</span>
            </div>
          </el-form-item>
          <el-form-item label="内部链接：" prop="columnMainImgLink">
            <el-input v-model="formData.columnMainImgLink" placeholder="200个字符以内"></el-input>
          </el-form-item>
          <el-form-item label="排序：" prop="sort">
            <el-input v-model="formData.sort" placeholder="0-99的整数，0的排序最高"></el-input>
          </el-form-item>
        </div>

        <!-- 关联商品 一级套餐分组时隐藏 -->
        <div class="relation pos-r" v-if="pageType === 1 && pageLevel === 1 || pageLevel === 2">
          <gray-title title="关联商品"></gray-title>

          <!-- 关联商品组件 -->
          <relation-public :columnId="columnId" :setmealType="formData.setmealType" @change="relationChange"></relation-public>

        </div>

      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="图标预览" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
import RelationPublic from './RelationPublic'
export default {
  components: {RelationPublic},
  data () {
    // --------分组排序
    let validateSort = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('请输入分组排序'))
      let reg = /^\d{1,2}$/gi
      if (value < 0 || isNaN(value) || value >= 100 || !value.toString().match(reg)) return callback(new Error('限0-99的整数，0的排序最高'))
      callback()
    }

    // 内部链接
    let validateLink = (rule, value, callback) => {
      if (value && value.length > 200) return callback(new Error('200个字符以内'))
      callback()
    }

    // -----------穿梭框
    const generateData = _ => {
      const data = []
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i
        })
      }
      return data
    }

    return {
      pageLevel: null,         // 页面等级
      pageType: 1,             // 页面类型 [1、新增 2、编辑]
      formData: {
        setmealType: 1,        // 套餐类型
        name: '',              // 分组名称
        sort: '',              // 分组排序
        logo: '',              // logo地址
        uploadFileList: [],    // 上传logo地址
        columnMainImg: '',     // 分组主图
        columnMainImgLink: '', // 分组主图 - 内部链接
        columnMainImgFileList: [],    // 分组主图地址
        setmeal: 0             // 是否套餐专区
      },
      dialogImageUrl: '',      // 上传图片路径
      dialogVisible: false,    // 上传
      data: generateData(),
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      rules: {
        // 属性
        attribute: [{ required: true, message: '请选择属性', trigger: 'blur' }],

        // 分组名称
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 50, message: '限50个字符', trigger: 'blur' }
        ],

        // 分组排序
        sort: [{ required: true, validator: validateSort, trigger: 'change' }],

        // 图片
        logo: [{ required: true, message: '请上传分组图标', trigger: 'change' }],

        columnMainImg: [{required: true, message: '请上传分组主图', trigger: 'change'}],

        columnMainImgLink: [{validator: validateLink, trigger: 'blur'}],

        // 详情
        details: [{ required: true, message: '请描述详情', trigger: 'change' }]
      },

      columnId: '',             // 分组id
      relationListData: [],     // 接收关联数据
      deleteListData: [],       // 删除列表
      userInfo: {}              // 用户信息
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.columnId = (this.$route.query.id && this.$route.query.id.toString()) || ''
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    this.pageLevel = parseInt(this.$route.query.level)
    if (this.pageType === 2) this.getDetailsHandle()
    if (this.pageLevel !== 0 && this.$route.query.setmealType) this.formData.setmealType = parseInt(this.$route.query.setmealType)
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsHandle () {
      this.$http.get('@ROOT_API/column/infoSetMeal', {
        params: {
          id: parseInt(this.columnId)
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
        let results = resData.data
        this.formData.name = results.columnName
        this.formData.sort = results.sort
        this.formData.setmeal = parseInt(results.ifSetmeat)
        this.formData.logo = results.columnLogo
        if (results.columnLogo) this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(results.columnLogo)})
        if (results.mainImage) this.formData.columnMainImgFileList.push({url: this.$Utils.filterImgUrl(results.mainImage)})
        this.formData.columnMainImg = results.mainImage
        this.formData.columnMainImgLink = results.relateUrl
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
      this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.logo = res.data
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
      this.formData.logo = ''
      this.formData.uploadFileList = []
    },

    /**
     * 分组主图预览
     */
    handleMainImgPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /*
     * 分组主图上传成功
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
     * 移除分组主图
     */
    handleRemoveColumnImg (file, fileList) {
      this.formData.columnMainImgFileList = []
      this.formData.columnMainImg = ''
    },

    /**
     * 接收关联数据
     */
    relationChange (results, deletes) {
      this.relationListData = results
      this.deleteListData = deletes
    },

    /**
     * 提交表单验证
     */
    submitForm (formName) {
      let addGoodsColumnPieces = []
      let updateGoodsColumnPieces = []
      let deleteGoodsColumnPieces = []
      this.relationListData.forEach((row) => {
        let json = {
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum
        }
        if (row.action === 'edit') updateGoodsColumnPieces.push(json)
        if (row.action === 'add') addGoodsColumnPieces.push(json)
      })
      this.deleteListData.forEach((row) => {
        deleteGoodsColumnPieces.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum
        })
      })
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let url = this.pageType === 1 ? '@ROOT_API/column/addSetMeal' : '@ROOT_API/column/updateSetMeal'
        this.$http.post(url, {
          id: this.columnId && this.pageType === 2 ? this.columnId : '',    // 分组ID
          type: 1,                                                          // int 类型 用于区分是栏目还是套餐 1表示套餐
          parentId: parseInt(this.$route.query.parentId),                   // int 父级id 一级套餐为0 其他为一级套餐的id
          setmealType: this.formData.setmealType,                           // int 1 固定套餐，2自选套餐
          operType: this.pageType === 1 ? 2 : 1,                            // 否 int 操作类型：1 修改栏目基本信息 ，2 不修改栏目基本信息，只修改商品关联关系
          columnType: 1,                                                    // int 套餐类型 1 套餐
          columnName: this.formData.name,                                   // 是 String  分组名称
          sort: parseInt(this.formData.sort),                               // 是 int 分组排序
          columnLogo: this.formData.logo,                                   // 是 String 分组图标
          mainImage: this.formData.columnMainImg,                           // 否 string 分组主图
          relateUrl: this.formData.columnMainImgLink,                       // 是 String 栏目关联的URL(当columnType为2时传)
          addGoodsColumnPieces,
          updateGoodsColumnPieces,
          deleteGoodsColumnPieces
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
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.column-public-wrap{

  .button-wrap{
    margin-left: 0;
    height: 40px;
  }

  .commodity-details, .relation-public-wrap{
    border: 1px solid #f0f0f0;
    border-top: 0;
    margin-bottom: 20px;
    padding-top: 20px;
  }

  /*------添加分组--------*/
  .commodity-details{
    overflow: hidden;

    .el-form-item{
      width: 50%;

      .el-select{
        width: 70%;
      }

      .el-input{
        width: 70%;
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
.column-public-wrap{

  .setmeal-type-wrap{
    .el-radio-group{
      .is-bordered{
        .el-radio__input{
          display: none;
        }
      }

      .is-checked{
        background: #2eaaf7;

        .el-radio__label{
          color: #fff !important;
        }
      }
    }
  }

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
    font-size: 20px;
    i{
      font-size: 20px;
    }
  }

  .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
