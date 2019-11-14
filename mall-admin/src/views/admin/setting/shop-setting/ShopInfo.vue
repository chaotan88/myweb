<template>
  <div class="shop-info-wrap">
    <div class="content-wrap">
      <el-form :model="form" :rules="rules" ref="shopForm" label-width="100px">
        <el-form-item label="网店logo：">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="this.$api.MAIN_API + this.$api.UPLOAD_API"
            :on-success="uploadSuccess"
            :on-error="uploadErr">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="upload-advice">建议尺寸：80 * 80px&nbsp;建议大小：100KB以内</p>
        </el-form-item>
        <el-form-item label="网店名称：" prop="shopName">
          <el-input v-model="form.shopName"></el-input>
        </el-form-item>
        <el-form-item label="网店域名：" prop="shopDomain">
          <el-input v-model="form.shopDomain"></el-input>
        </el-form-item>
        <el-form-item label="版权信息：" prop="copyright">
          <el-input v-model="form.copyright"></el-input>
        </el-form-item>
        <el-form-item label="客服电话：" prop="customerPhone">
          <el-input v-model="form.customerPhone"></el-input>
        </el-form-item>
        <el-form-item label="免邮设置：" class="special">
          <span>订单金额>=</span>
          <el-input v-model="form.freeShipping"></el-input>
          <span>元，免运费；</span>
          <span>订单金额>=</span>
          <el-input v-model="form.freeShippingPrompt"></el-input>
          <span>元，提示买家免运费。（提示语：再买xx元可以免运费）</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="save('shopForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        form: {},
        imageUrl: '',
        rules: {
          shopName: [
            { required: true, message: '请输入网店名称', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5\w]{1,20}$/g, message: '网店名称的长度要在20字以内', trigger: 'blur' }
          ],
          shopDomain: [
            { required: true, message: '请输入网店域名', trigger: 'blur' },
            { pattern: /https?:\/\/[\w./]+/g, message: '网店域名的格式不合法', trigger: 'blur' }
          ],
          copyright: [
            { required: true, message: '请输入版权信息', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5\w]{1,100}$/g, message: '版权信息的长度要在100字以内', trigger: 'blur' }
          ],
          customerPhone: [
            { required: true, message: '请输入客服电话', trigger: 'blur' },
            { pattern: /(^0\d{2,3}-\d{7,8}$)|(^1(3[0-9]|4[579]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$)/g, message: '客服电话的内容不合法', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getShopById: function () {
        // 获取网店详情
        this.$http.post('/admin/shop/getShopById', this.qs.stringify({
          shopId: 1
        })).then(res => {
          if (res.data.res === 1) {
            this.form = res.data.obj // 网店详情
            this.imageUrl = this.$api.IMG_API + res.data.obj.logo // 图片
          }
        })
      },
      uploadSuccess: function (res, file) {
        // 上传图片成功
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.logo = file.response.obj
      },
      uploadErr: function () {
        // 上传图片失败
        this.$message.error('图片上传失败，请重新上传')
      },
      save: function (formName) {
        // 保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.shopId = 1
            delete this.form.adminId
            delete this.form.createTime
            delete this.form.updateTime
            delete this.form.delState
            this.$http.post('/admin/shop/addOrUpdateOrDelShop', this.qs.stringify(this.form))
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('保存成功')
                setTimeout(() => {
                  this.$router.go(0)
                }, 1000)
              }
            })
          } else {
            this.$message.error('表单项填写不正确')
          }
        })
      }
    },
    mounted: function () {
      this.getShopById()
    }
  }
</script>

<style lang="less" scoped>
  .shop-info-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .upload-advice {
        font-size: 14px;
        color: #999;
      }
    }
  }
</style>

<style lang="less">
  .shop-info-wrap {
    .el-form {
      .el-input {
        width: 300px;
      }
    }
    .special {
      .el-input {
        width: 100px;
      }
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
    }
    .avatar {
      width: 148px;
      height: 148px;
      display: block;
    }
  }
</style>
