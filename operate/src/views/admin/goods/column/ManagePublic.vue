<!-- 百事贝管理系统后台商品-商品管理 -->
<template>
  <common-tpl class="column-public-wrap" footer back>
    <template slot="main">
      <gray-title :title="pageType === 1 ? '添加栏目' : '编辑栏目'"></gray-title>
      <el-form :model="formData" :rules="rules" ref="formData" label-width="150px">
        <!-- 添加栏目 -->
        <div class="commodity-details pos-r">
          <el-form-item label="栏目类型: " prop="columnType" class="column-item">
            <el-radio-group v-model="formData.columnType">
              <el-radio :label="1" border>关联商品</el-radio>
              <el-radio :label="2" border>关联地址</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="栏目名称: " prop="name">
            <el-input v-model="formData.name" placeholder="16个字符以内" ></el-input>
          </el-form-item>
          <el-form-item label="栏目排序：" prop="sort">
            <el-input v-model="formData.sort" placeholder="0-99的整数，0的排序最高"></el-input>
          </el-form-item>
          <el-form-item label="栏目图标: " prop="logo" class="full-w picture">
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

          <el-form-item label="栏目主图: " class="full-w picture">
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
              <span><span class="el-icon-warning"></span> 建议尺寸：710 * 230px 建议大小：100KB以内</span>
            </div>
          </el-form-item>

          <el-form-item label="是否套餐专区" class="full-w" v-if="formData.columnType === 2">
            <el-radio-group v-model="formData.setmeal" @change="setmealChange">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="formData.columnType === 1">
            <el-form-item label="商品是否推荐首页" class="full-w">
              <el-radio-group v-model="formData.recommend">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品默认排序: " prop="goodsSort">
              <el-select v-model="formData.goodsSort" placeholder="选择属性分类">
                <el-option label="按上架时间降序排序" :value="1"></el-option>
                <el-option label="按商品价格降序排序" :value="2"></el-option>
                <el-option label="按商品价格升序排序" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item label="栏目链接: " prop="columnLink" v-show="formData.columnType === 2">
            <el-input v-model="formData.columnLink" placeholder="200个字符以内" v-if="formData.columnType === 2">
              <!-- <template slot="append">
                <span @click="formData.columnLink = '/setmeal'"><i class="el-icon-plus"></i>获取套餐地址</span>
              </template> -->
            </el-input>
          </el-form-item>
        </div>

        <!-- 关联商品 -->
        <div class="relation pos-r" v-if="formData.columnType === 1 && pageType === 2">
          <gray-title title="关联商品"></gray-title>
          <br>

          <!-- 关联商品组件 -->
          <relation-goods :relationKey="relationKey" :relationId="columnId" :sort="true" @change="relationDataChange"></relation-goods>
          <!-- <relation-public :columnId="columnId" @change="relationDataChange"></relation-public> -->

        </div>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="图标预览" :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">确定</el-button>
    </template>

  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import RelationPublic from './RelationPublic'
export default {
  components: {RelationPublic, RelationGoods},
  data () {
    // --------栏目排序
    let validateSort = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('请输入栏目排序'))
      let reg = /^\d{1,2}$/gi
      if (value < 0 || isNaN(value) || value >= 100 || !value.toString().match(reg)) return callback(new Error('限0-99的整数，0的排序最高'))
      callback()
    }

    // ---------- 特卖价格
    let validateSale = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入特卖价格'))
      if (value <= 0 || isNaN(value)) return callback(new Error('精确到百分位(0-100数字)'))
      callback()
    }

    // ---------- 栏目链接
    let validateColumnLink = (rule, value, callback) => {
      if (this.formData.columnType === 2) {
        if (!value) return callback(new Error('请输入栏目链接'))
        // if (!value.toString().match(/^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+(\.[\w\-_]+)+/gi)) return callback(new Error('链接不合法'))
        if (value.length > 200) return callback(new Error('200个字符以内'))
        callback()
      }
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
      confirmLoading: false,   // 确定loading
      pageType: 1,             // 页面类型 [1、新增 2、编辑]
      formData: {
        columnType: 1,         // 栏目类型（1 关联商品，2 关联地址）
        name: '',              // 栏目名称
        sort: '',              // 栏目排序
        goodsSort: 1,          // 商品默认排序
        logo: '',              // logo地址
        uploadFileList: [],    // 上传logo地址
        columnMainImgFileList: [],    // 栏目主图地址
        columnMainImg: '',     // 栏目主图
        setmeal: 0,            // 是否套餐专区
        recommend: 1,          // 是否推荐商品
        columnLink: ''         // 栏目链接
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

        // 栏目名称
        name: [
          { required: true, message: '请输入栏目名称', trigger: 'blur' },
          { min: 1, max: 16, message: '长度在16个字符', trigger: 'blur' }
        ],

        // 栏目排序
        sort: [{ required: true, validator: validateSort, trigger: 'change' }],

        // 特卖价格
        sale: [{ required: true, validator: validateSale, trigger: 'change' }],

        // 图片
        logo: [{ required: true, message: '请上传栏目图标', trigger: 'change' }],

        // 详情
        details: [{ required: true, message: '请描述详情', trigger: 'change' }],

        columnLink: [
          {required: true, validator: validateColumnLink, trigger: 'blur'}
        ]
      },

      columnId: null,          // 栏目id
      relationListData: [],    // 接收关联数据
      relationKey: '',         // 关联商品唯一key
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
    this.columnId = parseInt(this.$route.query.id) || null
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
      this.$http.get('@ROOT_API/column/info', {
        params: {
          id: parseInt(this.columnId)
        }
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
        let results = resData.data
        this.formData.name = results.columnName
        this.formData.goodsSort = results.goodsSort
        this.formData.sort = results.sort
        this.formData.recommend = results.isRecommendIndex
        this.formData.setmeal = parseInt(results.ifSetmeat)
        this.formData.logo = results.columnLogo
        this.formData.columnType = results.columnType
        this.formData.columnLink = results.relateUrl
        if (results.columnLogo) this.formData.uploadFileList.push({url: this.$Utils.filterImgUrl(results.columnLogo)})
        if (results.mainImage) this.formData.columnMainImgFileList.push({url: this.$Utils.filterImgUrl(results.mainImage)})
        this.formData.columnMainImg = results.mainImage
      })
    },

    /**
     * 是否套餐专区
     */
    setmealChange (value) {
      this.formData.columnLink = (parseInt(value) === 1) ? '/setmeal' : ''
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
     * 接收关联数据
     */
    relationDataChange (results) {
      this.relationListData = results
    },

    /**
     * 提交表单验证
     */
    submitForm (formName) {
      // let goodIds = []
      // this.relationListData.forEach((row) => {
      //   goodIds.push(row.id)
      // })
      let goodsColumnIds = []
      this.relationListData.forEach((row) => {
        goodsColumnIds.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          goodsNum: row.goodsNum,
          sort: row.sort
        })
      })
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.confirmLoading = true
        let url = this.pageType === 1 ? '@ROOT_API/column/add' : '@ROOT_API/column/update'
        this.$http.post(url, {
          id: this.columnId && this.pageType === 2 ? this.columnId : '',    // 栏目ID
          type: 0,                                                          // 是 int 类型 0 : 栏目，1 : 套餐
          columnName: this.formData.name,                                   // 是 String  栏目名称
          sort: this.formData.sort,                                         // 是 int 栏目排序
          goodsSort: this.formData.goodsSort,                               // 是 String  商品默认排序(1、上架时间降序，2、商品价格降序，3、商品价格升序）
          columnLogo: this.formData.logo,                                   // 是 String  栏目图标
          isRecommendIndex: this.formData.recommend,                        // 是 int 是否推荐到首页： 0 ：否 1：是
          ifSetmeat: parseInt(this.formData.setmeal),                       // 是 int 是否是套餐栏目： 0 ：否 1：是
          columnType: this.formData.columnType,                             // 是 栏目类型  栏目类型（1 关联商品，2 关联地址）
          relateUrl: this.formData.columnType === 2 ? this.formData.columnLink : '',
          goodsColumnIds: this.formData.columnType === 1 ? goodsColumnIds : null,         // 是 Array 栏目所关联的商品ID集合
          mainImage: this.formData.columnMainImg                            // 否  string  栏目主图
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
          this.confirmLoading = false
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
    margin-top: -20px;
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
    /*i{
      font-size: 14px;
    }*/
  }

  .el-form-item__content{
    margin-left: 0 !important;
  }
}
</style>
