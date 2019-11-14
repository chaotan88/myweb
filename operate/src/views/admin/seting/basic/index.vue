<!-- 基础设置 -->
<template>
  <common-tpl class="setting-basic-wrap" footer>
    <!-- 头部 -->
    <template slot="header">
    </template>

    <!-- 主体 -->
    <template slot="main">
      <el-form label-position="right" :model="formData"  ref="formData" label-width="" >
        <table border="0" cellspacing="0" cellpadding="0"  v-if="currentRouter === 'shoppingMall'"  :key="formKey">
          <tr>
            <td class="td-padding td-title">网站logo：</td>
            <td class="td-padding">
              <el-form-item prop="imgs0" :rules="{required: true, type: 'array', message: '不能为空'} ">
                <thumbnail-component :empty="false" :styles="img70" :link="true" del :auto-delete="true" :list="formData.imgs0" style="width: 100%;height: 100%;" @change="deleteImg($event, 0)">
                  <template slot="other">
                    <upload-component :styles="img70" @success="uploadImgSuccess($event, 'imgs0', 0)"  v-if="formData.imgs0.length === 0"></upload-component>
                  </template>
                </thumbnail-component>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">网店名称：</td>
            <td class="td-padding">
              <el-form-item label="" prop="">
                <span>{{formData.webName}}</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">版本信息：</td>
            <td class="td-padding">
              <el-form-item label="" prop="versionInfo" :rules="{required: true, message: '不能为空', trigger: 'change'}">
                <el-input v-model="formData.versionInfo" placeholder='限20字符以内' maxLength="20"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="td-padding td-title">客服信息：</td>
            <td class="td-padding">
              <el-form-item label="" prop="customerInfo" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
                <el-input v-model="formData.customerInfo" placeholder='限20字符以内' maxLength="20"></el-input>
              </el-form-item>
            </td>
          </tr>
        <!--  <tr>
            <td class="td-padding td-title">免邮设置：</td>
            <td class="td-padding">
              <el-form-item label="" prop="webName">
                <el-row type="flex">
                  <span>订单金额>=</span>
                  <el-input v-model="formData.webName" placeholder="" style="width:100px;padding: 0 10px;"></el-input>
                  <span>元，免运费；订单金额>=</span>
                  <el-input v-model="formData.webName" placeholder="" style="width: 100px;padding: 0 10px;"></el-input>
                  <span>元，提示买家免运费。（提示语：再买xx元可以免运费）</span>
                </el-row>
              </el-form-item>
            </td>
          </tr>-->
          <tr>
            <td class="td-padding td-title">首页Banner背景：</td>
            <td class="td-padding">
              <el-row type="flex">
                <el-form-item label="" prop="imgs1"   class="mr-10" :rules="{required: true, type: 'array', message: '不能为空'} ">
                  <thumbnail-component :empty="false" :styles="img70" :link="true" del :auto-delete="true" :list="formData.imgs1" style="width: 100%;height: 100%;" @change="deleteImg($event, 1)">
                    <template slot="other">
                      <upload-component :styles="img70" @success="uploadImgSuccess($event, 'imgs1', 1)"  v-if="formData.imgs1.length === 0"></upload-component>
                    </template>
                  </thumbnail-component>
                  <div class="align-center">iPhone留海屏</div>
                </el-form-item>
                <el-form-item label="" prop="imgs2"  class="mr-20" :rules="{required: true, type: 'array', message: '不能为空'} ">
                  <thumbnail-component :empty="false" :styles="img70" :link="true" del :auto-delete="true" :list="formData.imgs2" style="width: 100%;height: 100%;" @change="deleteImg($event, 2)">
                    <template slot="other">
                      <upload-component :styles="img70" @success="uploadImgSuccess($event, 'imgs2', 2)"  v-if="formData.imgs2.length === 0"></upload-component>
                    </template>
                  </thumbnail-component>
                  <div class="align-center">非留海屏</div>
                </el-form-item>
                <el-form-item label="" prop="imgs3" :rules="{required: true, type: 'array', message: '不能为空'} ">
                  <thumbnail-component :empty="false" :styles="img70" :link="true" del :auto-delete="true" :list="formData.imgs3" style="width: 100%;height: 100%;" @change="deleteImg($event, 3)">
                    <template slot="other">
                      <upload-component :styles="img70" @success="uploadImgSuccess($event, 'imgs3', 3)"  v-if="formData.imgs3.length === 0"></upload-component>
                      <div class="va-t d-ib" style="color: #f5a74a; line-height: 20px;padding:60px 0 0 20px">
                        <template>留海屏高度多48px，安卓及H5少40px，宽度统一为750p</template>
                      </div>
                    </template>
                  </thumbnail-component>
                  <div class="ml-10">安卓/H5</div>
                </el-form-item>
              </el-row>
            </td>
          </tr>
        </table>
        <div v-if="currentRouter === 'registrationAgreement'" >
          <el-form-item label="" prop="content" label-width="0px" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <editor v-model="formData.content" @change="editorChange"></editor>
          </el-form-item>
        </div>
        <div v-if="currentRouter === 'afterSaleService'" class="afterSaleService">
          <el-form-item label="输入客服电话：" prop="customerPhone" :rules="customerPhone">
            <el-input v-model="formData.customerPhone" placeholder=''></el-input>
          </el-form-item>
          <el-form-item label="服务说明：" prop="content" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-row></el-row>
            <editor v-model="formData.content" @change="editorChange"></editor>
          </el-form-item>
        </div>
      </el-form>
    </template>

    <template slot="other">
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitFormData('formData')">确 定</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateNumber = (rule, value, callback) => {
      if (value === '') return callback(new Error('不能为空'))
      // / \d{2,4}-\d{7,8}/
      if (value && !value.toString().match(/^\d+$|\d+(-)$/g)) return callback(new Error('请输入正确的电话格式'))
      callback()
    }
    return {
      loading: false,                 // loading
      confirmLoading: false,                 // loading
      img70: {width: '80px', height: '80px'}, // 图片大小
      formData: {
        webName: '',
        versionInfo: '',
        bannerUrl: '',
        bannerIPxUrl: '',
        bannerIPUrl: '',
        content: '',
        customerInfo: '',
        customerPhone: '',
        imgs0: [],     // 网站logo
        imgs1: [],     // iPhone留海屏
        imgs2: [],    // 非留海屏
        imgs3: []     // 安卓/H5
      },
      tableData: [{
        webName: 111
      }],
      pageData: {                 // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      customerPhone: [{ required: true, validator: validateNumber, trigger: 'blur' }],
      currentRouter: 'currentRouter',   // 当前路由名
      type: 0,
      formKey: ''
    }
  },
  mounted () {
    this.formKey = new Date().getTime()
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.currentRouter = this.$route.path.match(/shoppingMall|registrationAgreement|afterSaleService/gi)[0]
    this.type = this.currentRouter === 'shoppingMall' ? 0 : this.currentRouter === 'registrationAgreement' ? 1 : this.currentRouter === 'afterSaleService' ? 2 : ''
    this.getListData()
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/baseinfo/getBaseInfoList', {
        type: this.type
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        if (!results.data) return false
        this.formData = results.data
        if (results.data.webLogo !== '' && results.data.webLogo !== null) {
          this.formData.imgs0 = [{url: this.$Utils.filterImgUrl(results.data.webLogo), img: results.data.webLogo}]
        } else {
          this.formData.imgs0 = []
        }
        if (results.data.bannerIPxUrl !== '' && results.data.bannerIPxUrl !== null) {
          this.formData.imgs1 = [{url: this.$Utils.filterImgUrl(results.data.bannerIPxUrl), img: results.data.bannerIPxUrl}]
        } else {
          this.formData.imgs1 = []
        }
        if (results.data.bannerIPUrl !== '' && results.data.bannerIPUrl !== null) {
          this.formData.imgs2 = [{url: this.$Utils.filterImgUrl(results.data.bannerIPUrl), img: results.data.bannerIPUrl}]
        } else {
          this.formData.imgs2 = []
        }
        if (results.data.bannerUrl !== '' && results.data.bannerUrl !== null) {
          this.formData.imgs3 = [{url: this.$Utils.filterImgUrl(results.data.bannerUrl), img: results.data.bannerUrl}]
        } else {
          this.formData.imgs3 = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 商品图片上传成功
     */
    uploadImgSuccess (url, imgsList, type) {
      this.$set(this.formData, imgsList, [{url: this.$Utils.filterImgUrl(url), img: url}])
      // this.formData.imgs = [{url: this.$Utils.filterImgUrl(url), img: url}]
      type === 0 ? this.formData.webLogo = url : type === 1 ? this.formData.bannerIPxUrl = url : type === 2 ? this.formData.bannerIPUrl = url : type === 3 ? this.formData.bannerUrl = url : ''
       // console.log(this.formData.imgs)
      this.formKey = new Date().getTime()
    },
    /**
     * 商品图片删除
     */
    deleteImg (val, type) {
     // this.formData.key = ''
      type === 0 ? this.formData.webLogo = '' : type === 1 ? this.formData.bannerIPxUrl = '' : type === 2 ? this.formData.bannerIPUrl = '' : type === 3 ? this.formData.bannerUrl = '' : ''
      this.formKey = new Date().getTime()
    },
    /**
     * 编辑器内容改变
     */
    editorChange (value) {
      this.formData.content = value
    },
    /**
     * 提交表单
     */
    submitFormData (formwebName) {
      this.$refs[formwebName].validate((valid) => {
        if (valid) {
          this.$http.post('@ROOT_API/baseinfo/saveOrUpdateBaseInfo', this.formData).then(res => {
            let results = res.data
            if (parseInt(results.status) !== 1) {
              this.$message({
                message: results.msg,
                type: 'error',
                duration: 1500
              })
              return false
            }
            this.$message({
              message: results.msg,
              type: 'success',
              duration: 1500
            })
            this.getListData()
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.setting-basic-wrap{

}
</style>

<style lang="less">
.setting-basic-wrap {
  .el-input{
    width: 280px;
  }
  .tips-text{
    color: orange;
  }
  .gray-text{
    color: #999;
    line-height: 20px !important;

    strong{
      color: orange;
      padding: 0 3px;
    }
  }
  .td-title{
    background: #f8f8f8;
  }
  .td-padding{
    font-size: 14px;
    padding: 40px 10px;
    border-bottom: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
  }
  .td-title{
    width:140px;
    text-align: center;
  }
  .td-bg{
    background: #EEF1F9;
  }
  table {
    border: 1px solid #dcdfe6;
    border-left: none;
    border-bottom: none;
    width: 100%;
    margin: 0;
    tr{
      height: 81px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .flex1{
    flex: 1;
  }
  .color-999{
    color: #999999;
    font-size: 14px;
  }
  .afterSaleService{
    .el-form-item__error{
      left: 120px;
    }
  }
  .mr-10{
    margin-right: 10px;
  }
  .ml-10{
    margin-left: 10px;
  }
  .mr-20{
    margin-right: 20px;
  }
  .align-center{
    text-align: center;
  }
}
</style>
