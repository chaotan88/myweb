<template>
  <div class="edit-classification-wrap">
    <div class="content-wrap">
      <div class="classification-form-wrap">
        <el-form :model="form" :rules="rules">
          <el-row>
            <span class="form-item-title">分类名称：</span>
            <el-form-item class="input-group" prop="goodsType">
              <el-input v-model="form.goodsType"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="position: relative;">
            <span class="form-item-title" style="position: absolute;">分类图标：</span>
            <el-form-item style="margin-left: 140px;">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :action="this.$api.MAIN_API + this.$api.UPLOAD_API"
                :on-success="uploadSuccess"
                :on-error="uploadErr">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <p class="upload-advice">图片建议尺寸：100 * 100px ；建议大小：100KB以内</p>
          </el-row>
          <el-row>
            <span class="form-item-title">排序：</span>
            <el-form-item class="input-group" prop="sort">
              <el-input v-model="form.sort"></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm">确认</el-button>
      </div>
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
          goodsType: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,50}/g, message: '分类名称限50个字，不含特殊字符', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空', trigger: 'blur' },
            { pattern: /^([0]|[1-9][0-9]?)$/g, message: '排序为0-99的整数，0的排序最高', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      uploadSuccess: function (res, file) {
        // 上传图片成功
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.logo = file.response.obj
      },
      uploadErr: function () {
        // 上传图片失败
        this.$message.error('图片上传失败，请重新上传')
      },
      cancel: function () {
        // 取消
        localStorage.removeItem(this.$global.SYSTEM + 'ClassItemOfEdit')
        this.$router.go(-1)
      },
      confirm: function () {
        // 确定
        this.$http.post('/admin/goodsType/addOrUpdateGoodsType', this.qs.stringify(this.form))
        .then((res) => {
          if (res.data.res === 1) {
            localStorage.removeItem(this.$global.SYSTEM + 'ClassItemOfEdit')
            this.$router.go(-1)
          }
        })
      }
    },
    mounted: function () {
      var classItemOfEdit = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'ClassItemOfEdit'))
      this.form = classItemOfEdit
      this.imageUrl = this.$api.IMG_API + this.form.logo // 图片
    }
  }
</script>

<style lang="less" scoped>
  .edit-classification-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .form-item-title {
        display: inline-block;
        width: 120px;
        text-align: right;
        font-size: 14px;
        color: rgb(102, 102, 102);
        margin-right: 16px;
      }
      .classification-form-wrap {
        background-color: rgb(245, 245, 245);
        border-radius: 4px;
        padding-bottom: 30px;
        margin-bottom: 16px;
        .input-group {
          width: 300px;
        }
        .upload-advice {
          font-size: 14px;
          color: rgb(153, 153, 153);
          margin-left: 140px;
          padding: 10px 0;
        }
      }
    }
  }
</style>

<style lang="less">
  .edit-classification-wrap {
    .content-wrap {
      .el-form {
        .el-row {
          padding-top: 40px;
        }
        .el-form-item {
          display: inline-block;
          margin-bottom: 0;
        }
      }
      .el-button {
        width: 120px;
        padding: 0;
        height: 40px;
        background-color: rgb(242, 242, 242);
        border-color: rgb(204, 204, 204);
        color: rgb(51, 51, 51);
        border-radius: 0;
        margin-right: 12px;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        background-color: #fff;
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
  }
</style>
