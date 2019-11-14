<!-- 套餐规则设置 -->
<template>
  <common-tpl class="pos-r setmeal-rule-wrap" footer back>
    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main" class="Purchase-wrap-box">

      <el-form :model="formData" :rules="rules" ref="form" label-width="230px">
        <el-form-item label="套餐主图名称：" class="commodity img-wrap" prop="mainName">
          <el-input class="d-ib" placeholder="50个字符以内" maxleng="50" v-model="formData.mainName"></el-input>
        </el-form-item>

        <div class="img-wrap" @click="imgWrapClick(index)" v-for="(item, index) in formData.advertPositionDetailList">
          <el-form-item label="套餐广告图：" :prop="'advertPositionDetailList.' + index + '.image'" :rules="{required: true, message: '请上传图片', trigger: 'change'}" class="picture w100">
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
                 图片建议尺寸：100 * 100px 建议大小：100KB以内
                <div class="gray-text">共<strong class="fw-n">{{imgLength}}</strong>张，还能上传<strong class="fw-n">{{5 - imgLength}}</strong>张</div>
              </div>
              <el-input v-model="item.image" style="display: none;"></el-input>
            </div>
            <el-dialog :visible.sync="dialogVisible">
              <img class="full-w" :src="dialogImageUrl">
            </el-dialog>
            <div class="pos-a edit-btns">
              <el-button type="primary" icon="el-icon-plus" circle @click="addImgItemHandle"></el-button>
              <el-button type="primary" icon="el-icon-minus" circle @click="removeImgItemHandle(index)" v-if="formData.advertPositionDetailList.length !== 1"></el-button>
            </div>
          </el-form-item>
          <el-form-item label="内部链接：" :prop="'advertPositionDetailList.' + index + '.link'" :rules="validatorLink">
            <el-input placeholder="200个字符以内" class="d-ib" v-model="item.link"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="套餐池商品只显示成本低于：" class="commodity img-wrap" prop="discount">
          <el-input class="d-ib" placeholder="10个字符以内" maxleng="50" v-model="formData.discount" @blur="inpBlur('discount')"></el-input>
          <span>&nbsp;折</span>
        </el-form-item>

        <!-- <el-form-item label="套餐池商品赠送积分比例：" class="commodity img-wrap" prop="integral">
          <el-input class="d-ib" placeholder="10个字符以内" maxleng="50" v-model="formData.integral" @blur="inpBlur('integral')"></el-input>
          <span>&nbsp;%</span>
        </el-form-item> -->
      </el-form>

      <div class="clear"></div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button type="primary" @click="submitForm('form')">确认</el-button>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    // 校验内部链接长度
    let validateLink = (rule, value, callback) => {
      if (value && value.length > 200) return callback(new Error('200个字符以内'))
      callback()
    }

    // 校验赠送积分比例
    let validateIntegral = (rule, value, callback) => {
      if (!value && parseInt(value) !== 0) return callback(new Error('不允许为空'))
      if (value.length > 10) return callback(new Error('10个字符以内'))
      if (!value.toString().match(/^\d{0,7}\.\d{0,2}$/)) return callback(new Error('仅限数字，精确到两位小数'))
      callback()
    }

    return {
      imgLength: 0,
      uploadIndex: '',
      formData: {
        id: '',                         // 套餐规则ID
        mainName: '',                   // 套餐主图名称
        advertPositionDetailList: [     // 上传图片
          // {
          //   image: '',
          //   link: '',
          //   uploadFileList: []
          // }
        ],
        discount: '',                   // 套餐池商品只显示成本低于n折
        integral: ''                    // 套餐池商品赠送积分比例
      },
      rules: {
        mainName: [
          {required: true, message: '请输入套餐主图名称', trigger: 'blur'},
          {max: 50, message: '50个字符以内', trigger: 'blur'}
        ],
        discount: [{required: true, validator: validateIntegral, trigger: 'blur'}],
        integral: [{required: true, validator: validateIntegral, trigger: 'blur'}]
      },
      validatorLink: {
        validator: validateLink, trigger: 'blur'
      },
      dialogImageUrl: '',               // 上传图片路径
      dialogVisible: false,             // 上传
      selectValue: '',                  // 选择商品分类结果
      userInfo: {}
    }
  },
  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情数据
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/column/getSetMealInfo', {}).then((res) => {
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
        let splitImg = results.setMealImage ? results.setMealImage.split('#') : ''
        let setMealUrl = results.setMealUrl ? results.setMealUrl.split('#') : ''
        if (splitImg.length) {
          splitImg.forEach((row, index) => {
            this.formData.advertPositionDetailList.push({
              image: row,
              link: setMealUrl[index],
              uploadFileList: [{url: this.$Utils.filterImgUrl(row)}]
            })
            this.imgLength++
          })
        }
        this.formData.id = results.id
        this.formData.mainName = results.setMealName
        this.formData.discount = results.setMealDiscount
        this.formData.integral = results.setMealRate
        this.inpBlur('discount')
        this.inpBlur('integral')
      })
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
      if (this.formData.advertPositionDetailList[index].image) this.imgLength--
      this.formData.advertPositionDetailList.splice(index, 1)
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
      if (res.status !== '1') {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.advertPositionDetailList[this.uploadIndex].image = res.data
      this.formData.advertPositionDetailList[this.uploadIndex].uploadFileList.push({url: this.$Utils.filterImgUrl(res.data)})
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
        this.formData.advertPositionDetailList[this.uploadIndex].uploadFileList = []
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
    inpBlur (obj) {
      this.$Utils.blurAutoCompletion(this.formData, obj)
    },

    /**
     * 表单提交
     */
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false
        let setMealImageArr = []
        let setMealUrlArr = []
        this.formData.advertPositionDetailList.forEach((row) => {
          setMealImageArr.push(row.image)
          setMealUrlArr.push(row.link)
        })
        this.$http.post('@ROOT_API/column/updateSetMealInfo', {
          id: this.formData.id,                     // 是 int 套餐规则ID
          setMealName: this.formData.mainName,      // 是 String  套餐主图名称
          setMealImage: setMealImageArr.join('#'),  // 是 String  套餐图片 多个图片用#分开
          setMealUrl: setMealUrlArr.join('#'),      // 是 String  内部链接 多个用#分开 与套餐图片对应
          setMealDiscount: this.formData.discount,  // 是 double  套餐池商品只显示成本低
          setMealRate: this.formData.integral       // 是 double  套餐池商品赠送积分比例
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
          // this.$router.back()
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.setmeal-rule-wrap{

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
        left: 600px;
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
.setmeal-rule-wrap{

  /* -------------------- { 上传 } -------------------- */
  .upload-wrap{
    height: 150px;

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
