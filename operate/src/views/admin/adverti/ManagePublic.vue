<!-- 广告位设置 - 移动端 & PC端 -->
<template>
  <common-tpl class="pos-r adverti-edit-wrap" footer back>
    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main" class="Purchase-wrap-box">

      <el-form :model="formData" ref="formData" label-width="200px" class="demo-formData">
        <el-form-item label="应用端：" class="commodity">
          <div>{{formData.applicationTerminal | filterAppType}}</div>
        </el-form-item>
        <el-form-item label="投放位置：" class="commodity">{{formData.advertName | filterEmpty}}</el-form-item>

        <!-- 商城首页定制广告位 -->
        <div class="img-wrap mobile" v-if="parseInt(formData.applicationTerminal) === 1 && parseInt(formData.putLocation) === 2">
          <el-form-item label="广告位图片：" required class="img-main">
            <div class="pos-r upload-wrap" :class="'upload' + index" v-for="(item, index) in formData.advertPositionDetailList">
              <div @click="imgWrapClick(index)">
                <el-form-item :prop="'advertPositionDetailList.' + index + '.image'" :rules="{required: true, message: '请上传图片', trigger: 'change'}">
                  <el-upload
                    list-type="picture-card"
                    :action="uploadUrl"
                    :limit="1"
                    :file-list="item.uploadFileList"
                    :on-exceed="exceedHandle"
                    :before-upload="beforeAvatarUpload"
                    :on-preview="pictureCardPreviewHandle"
                    :on-success="uploadSuccessHandle"
                    :on-remove="removeHandle">
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <div class="pos-a tips-text">
                    <template v-if="index === 0">建议尺寸：370 * 468px</template>
                    <template v-if="index === 1">建议尺寸：370 * 180px <br/></template>
                    <template v-if="index === 2">建议尺寸：370 * 279px <br/></template>
                    建议大小：100KB以内
                  </div>
                 <!-- <el-input v-model="item.image" style="display: none;"></el-input>-->
                </el-form-item>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="内部链接（左图）：" :rules="validatorLink" class="mobile-link-wrap">
            <el-input placeholder="200个字符以内" class="d-ib" v-model="formData.advertPositionDetailList[0].link"></el-input>
          </el-form-item>
          <el-form-item label="内部链接（右上图）：" :rules="validatorLink" class="mobile-link-wrap">
            <el-input placeholder="200个字符以内" class="d-ib" v-model="formData.advertPositionDetailList[1].link"></el-input>
          </el-form-item>
          <el-form-item label="内部链接（右下图）：" :rules="validatorLink" class="mobile-link-wrap">
            <el-input placeholder="200个字符以内" class="d-ib" v-model="formData.advertPositionDetailList[2].link"></el-input>
          </el-form-item>
        </div>

        <!-- 公用广告位 -->
        <div class="img-wrap" @click="imgWrapClick(index)" v-for="(item, index) in formData.advertPositionDetailList" v-else>
          <el-form-item label="广告位图片：" :prop="'advertPositionDetailList.' + index + '.image'" :rules="{required: true, message: '请上传图片', trigger: 'change'}" class="picture w100">
            <div class="pos-r upload-wrap">
              <el-upload
                list-type="picture-card"
                :action="uploadUrl"
                :limit="1"
                :file-list="item.uploadFileList"
                :on-exceed="exceedHandle"
                :before-upload="beforeAvatarUpload"
                :on-preview="pictureCardPreviewHandle"
                :on-success="uploadSuccessHandle"
                :on-remove="removeHandle">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <div class="pos-a tips-text">
                <i class="el-icon-warning"></i>
                 图片建议尺寸：
                 <template v-if="formData.putLocation === 4">750 * 1334px 建议大小：150KB以内</template>
                 <template v-if="formData.putLocation === 5">620 * 800px 80KB以内</template>
                 <template v-if="formData.putLocation !== 4 && formData.putLocation !== 5">750 * 475px 建议大小：100KB以内</template>
                <div class="gray-text">共<strong class="fw-n">{{imgLength}}</strong>张，还能上传<strong class="fw-n">{{imgMaxLength - imgLength}}</strong>张</div>
              </div>
              <el-input v-model="item.image" style="display: none;"></el-input>
            </div>
            <div class="pos-a edit-btns" v-if="imgMaxLength > 1">
              <el-button type="primary" icon="el-icon-plus" circle @click="addImgItemHandle"></el-button>
              <el-button type="primary" icon="el-icon-minus" circle @click="removeImgItemHandle(index)" v-if="formData.advertPositionDetailList.length !== 1"></el-button>
              <el-button type="primary" icon="el-icon-arrow-up" circle @click="handleSort(1, index, item)" v-if="index !== 0"></el-button>
              <el-button type="primary" icon="el-icon-arrow-down" circle @click="handleSort(2, index, item)" v-if="formData.advertPositionDetailList.length !== 1 && index !== formData.advertPositionDetailList.length - 1"></el-button>
            </div>
          </el-form-item>

          <!-- <el-form-item label="链接类型：">
            <el-radio-group v-model="item.linkType">
              <el-radio :label="1">内部链接</el-radio>
              <el-radio :label="0">外部链接</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="指定链接：" v-if="item.linkType === 1">
            <el-input v-model="item.relationUrl" class="d-n"></el-input>
            <internal-link :initData="item" @change="internalLinkChange"></internal-link>
          </el-form-item>

          <el-form-item label="指定链接：" v-else>
            <el-input placeholder='输入url地址，500个字符以内，格式"http://"' v-model="item.link"></el-input>
          </el-form-item> -->

          <el-form-item label="内部链接：" :prop="'advertPositionDetailList.' + index + '.link'" :rules="validatorLink" v-if="formData.putLocation !== 4">
            <el-input placeholder="200个字符以内" class="d-ib" v-model="item.link"></el-input>
          </el-form-item>
          <!-- 共1张，还能添加 4张 -->
        </div>

        <el-form-item label="是否启用：" class="sale-wrap">
          <el-radio-group v-model="formData.isShow" class="pos-a">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="clear"></div>
    </template>

    <template slot="other">
      <el-dialog title="查看大图" :visible.sync="dialogVisible" width="1000px">
        <img class="full-w" :src="dialogImageUrl">
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" :loading="loading" @click="submitForm('formData')">确认</el-button>
    </template>
  </common-tpl>
</template>

<script>
import InternalLink from '@/components/public/InternalLink'
export default {
  components: {InternalLink},

  data () {
    // 校验内部链接长度
    let validateLink = (rule, value, callback) => {
      if (value && value.length > 200) return callback(new Error('200个字符以内'))
      callback()
    }

    return {
      loading: false,
      shopId: null,
      imgLength: 0,
      imgMaxLength: 5,
      uploadIndex: '',
      formData: {
        id: '',                           // 广告位id
        advertName: '',                   // 投放位置
        applicationTerminal: '',          // 应用终端(1：移动端，2 : PC端）
        putLocation: '',                  // 投放位置（为移动端时 ：1：移动端商城首页，2移动端商城首页定制广告位， 为PC端时：1：PC端商城首页，2：PC端商品分类页，3：PC端创客中心）
        // advertPositionDetailList: [       // 上传图片
        //   {
        //     image: '',
        //     link: '',
        //     sort: '',
        //     uploadFileList: []
        //   }
        // ],
        advertPositionDetailList: [],
        isShow: 1           // 是否启用
      },
      validatorLink: {
        validator: validateLink, trigger: 'blur'
      },
      dialogImageUrl: '',          // 上传图片路径
      dialogVisible: false,        // 上传
      multipleMenu: {     // 多选菜单
        large: {          // 大类
          id: '',
          name: ''
        },
        middle: {         // 中类
          id: '',
          name: ''
        },
        small: {          // 小类
          id: '',
          name: ''
        }
      },
      selectValue: '',    // 选择商品分类结果
      userInfo: {}
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.shopId = parseInt(this.$route.query.id)
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/advertPosition/info', {
        id: this.shopId
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
        this.formData.id = results.id
        this.formData.advertName = results.advertName
        this.formData.applicationTerminal = results.applicationTerminal
        this.formData.putLocation = results.putLocation
        this.formData.isShow = results.isShow
        let arr = []
        // 手机端
        if (parseInt(results.applicationTerminal) === 1) {
          if (results.advertPositionDetailList.length) {
            results.advertPositionDetailList.forEach((row, index) => {
              if (row.image) {
                row.sort = row.sort || ''
                row.link = row.link || ''
                row.uploadFileList = [{
                  name: index,
                  url: this.$Utils.filterImgUrl(row.image)
                }]
                arr.push(row)
                this.imgLength++
              }
            })
          } else {
            arr.push({
              image: '',
              link: '',
              sort: '',
              uploadFileList: []
            })
          }
          if (parseInt(results.putLocation) === 1 && arr.length !== 3) {
            for (let i = 0; i <= 3 - arr.length; i++) {
              arr.push({
                image: '',
                link: '',
                sort: '',
                uploadFileList: []
              })
            }
          }
          results.advertPositionDetailList = arr
        }
        arr.forEach((row) => {
          this.formData.advertPositionDetailList.push(row)
        })
        // app启动广告位限制最大限制1张
        if (results.putLocation === 4 || results.putLocation === 6 || results.putLocation === 8 || results.putLocation === 9) this.imgMaxLength = 1
      })
    },

    /**
     * 多级菜单选择
     */
    classifySelectChange (results) {
      this.multipleMenu = results
      this.selectValue = [results.large.name, results.middle.name, results.small.name].join(' / ')
      if (results.small.id || results.small.name) {
        let obj = document.getElementById('dropdownLink')
        this.$Utils.triggerEvent(obj)
      }
    },

    /**
     * 排序
     * @param  {[Number]} type  [1、向上，2、向下]
     * @param  {[Number]} index [下标索引]
     */
    handleSort (type, index, obj) {
      let temp = this.formData.advertPositionDetailList[index]
      if (type === 1) {
        this.$set(this.formData.advertPositionDetailList, index, this.formData.advertPositionDetailList[index - 1])
        this.$set(this.formData.advertPositionDetailList, index - 1, temp)
      } else {
        this.$set(this.formData.advertPositionDetailList, index, this.formData.advertPositionDetailList[index + 1])
        this.$set(this.formData.advertPositionDetailList, index + 1, temp)
      }
    },

    /**
     * 上传图片点击
     */
    imgWrapClick (index) {
      this.uploadIndex = index
    },

    /**
     * 添加图片上传
     */
    addImgItemHandle () {
      if (this.formData.advertPositionDetailList.length < 5) {
        this.formData.advertPositionDetailList.push({
          image: '',
          link: '',
          sort: '',
          uploadFileList: []
        })
      } else {
        this.$message({
          message: '最多只能上传5张图片',
          type: 'error'
        })
      }
    },

    /**
     * 移除图片上传
     */
    removeImgItemHandle (index) {
      this.formData.advertPositionDetailList.splice(index, 1)
      this.imgLength = 0
      this.formData.advertPositionDetailList.forEach((row) => {
        if (row.image) this.imgLength++
      })
    },

    /**
     * 内部链接改变
     */
    internalLinkChange () {},

    /**
     * 表单提交
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        this.loading = true
        this.formData.advertPositionDetailList.forEach((row, index) => {
          row.sort = index
        })
        this.$http.post('@ROOT_API/advertPosition/update', this.formData).then((res) => {
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
          this.$router.back()
        }).finally(() => {
          setTimeout(() => {
            this.loading = false
          })
        })
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
     * 文件上传成功
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
      let data = {
        image: res.data,
        uploadFileList: [{url: this.$Utils.filterImgUrl(res.data)}]
      }
      this.$set(this.formData.advertPositionDetailList, this.uploadIndex, data)
      this.imgLength++
    },

    /**
     * 文件预览
     */
    pictureCardPreviewHandle (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    /**
     * 文件被移除
     */
    removeHandle (file, fileList) {
      setTimeout(() => {
        this.formData.advertPositionDetailList[this.uploadIndex].image = ''
        this.imgLength--
      }, 30)
    },

    /**
     * 追加一条商品分类
     */
    addRuleListHandle () {
      this.formData.goodsClassify.push({id: this.formData.goodsClassify[this.formData.goodsClassify.length - 1].id + 1})
    },

    /**
     * 移除一条商品分类
     */
    removeRuleListHandle (index) {
      this.formData.goodsClassify.splice(index, 1)
    },

    /**
    * 输入框自动补全价格
    */
    inpBlur () {
      // Utils.blurAutoCompletion(this.formData, 'sale')
    }
  }
}
</script>

<style lang='less' scoped>
.adverti-edit-wrap{

  .el-form-item{
    border-bottom: 1px solid #eee;
    margin-bottom: 0;
    padding: 10px 0;
    box-sizing: border-box;

    .el-dropdown{
      width: 100%;
    }
  }

  .el-form-item.w100, .el-select{
    width: 100%;
  }

  .img-wrap{
    border-bottom: 1px solid #eee;

    .el-form-item{
      border-bottom: 0;

      .edit-btns{
        top: 50%;
        left: 550px;

        .el-button{
          margin: 0 10px 10px 0;
        }
      }
    }

    .el-form-item:first-child{
      padding-top: 15px;
    }

    .el-form-item:last-child{
      padding-bottom: 15px;
    }

    .el-input{
      width: 520px;
    }
  }

  .tips-text{
    color: orange;
    line-height: 30px;
    margin-top: -30px;
    left: 170px;
    top: 50%;
  }

  .gray-text{
    color: #666;
    line-height: 20px !important;
    margin-top: 15px;

    strong{
      color: orange;
      padding: 0 3px;
    }
  }

  .edit-btns-wrap{
    width: 100px;
    right: -100px;
    top: 1px;
  }

  .select-wrap{
    height: 36px;
    line-height: 36px;

    .el-icon-arrow-down{
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      top: 50%;
      right: 0;
    }
  }

  .Purchase-wrap-box{
    padding: 20px;
    overflow: hidden;
    border: 1px solid #f4f4f4;

    .commodity-details{
      width: 100%;
      padding-top: 30px;
      border-top: 1px solid #f0f0f0;
      overflow: hidden;

      /*--------商品分类-----------*/
      .commodity{
        .el-button{
          color: #56ade8;
          padding: 10px;
          margin-left: 10px;
          border:1px solid #56ade8;
          background-color: #fff !important;
        }
      }

      .picture{
        .el-form-item__content{
          height: 150px;
          border: 1px solid #c8d0da;
        }

        span{
          color: #f5a74a;
        }
      }

      .button-wrap{
        left: 0;
        bottom: -80px;
      }

      .el-form-item:nth-child(even){
        float: right;
      }
    }
  }
}
</style>

<style lang="less">
.adverti-edit-wrap{

  /* -------------------- { 上传 } -------------------- */
  .upload-wrap{
    height: 150px;

    div{
      height: 100%;
    }

    .el-upload-list{
      position: relative;
      z-index: 5;
    }

    .el-upload--picture-card{
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }

  .upload-wrap{
    .el-form-item__error{
      text-align: center;
      z-index: 10;
    }
  }

  .upload-wrap.upload0{
    .el-form-item__error{
      width: 240px;
      margin-top: -20px;
    }
  }

  .upload-wrap.upload1, .upload-wrap.upload2{
    .el-form-item__error{
      width: 210px;
      text-align: center;
      margin-top: -33px;
    }
  }

  .el-form-item.sale-wrap{
    .el-form-item__content{
      padding-left: 120px;
    }

    .el-radio-group{
      left: 0;
      top: 13px;
    }

    .el-form-item{
      width: 100%;
      padding-right: 0;

      .el-form-item__content{
        padding-left: 0;
        margin-left: 0 !important;
      }
    }
  }

  .el-radio__input.is-checked .el-radio__inner{
    border-color: #409EFF;
    background: #409EFF;
  }

  /* -------------------- { 移动端商城首页定制广告位 } -------------------- */
  .img-wrap.mobile{

    .img-main{
      height: 353px;
      overflow: hidden;

      > .el-form-item__content{
        height: 100%;
        padding-left: 262px;
      }
    }

    .el-form-item{
      vertical-align: top;
      position: relative;
    }

    .upload-wrap.upload0{
      height: 304px;
      line-height: 304px;
      position: absolute !important;
      left: 0;
      top: 0;

      .el-form-item__content{
        width: 100%;
        height: 100%;
        height: 300px;
      }

      .el-form-item{
        width: 240px;
        height: 304px;

        .el-upload, .el-upload-list__item{
          width: 240px;
          height: 304px;
          line-height: 304px;
        }

        .tips-text{
          width: 300px;
          height: 20px;
          line-height: 20px;
          margin-top: 6px;
          /*margin-top: -25px;*/
          top: 100%;
          left: 0;
        }
      }
    }

    .upload-wrap.upload1, .upload-wrap.upload2{
      width: 100%;
      margin-bottom: 10px;

      .el-form-item, .el-form-item__content{
        height: 100%;
      }

      .el-form-item{
        margin: 14px 0;
        padding: 0;

        .el-upload, .el-upload-list__item{
          width: 210px;
          height: 140px;
        }

        .tips-text{
          width: 300px;
          margin-top: -40px;
          left: 230px;
        }
      }
    }
  }
}
</style>
