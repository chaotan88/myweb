<template>
  <div class="add-advertising-wrap">
    <div class="content-wrap">
      <div class="form-wrap">
        <el-form :model="advertising" :rules="advertisingRules" ref="advertisingForm" label-width="120px">
          <el-row>
            <el-form-item label="广告位名称：" prop="advertName">
              <el-input v-model="advertising.advertName"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <div class="outer-box" v-for="(item, index) in advertising.list" :key="index">
              <div class="inner-box-left" >
                <el-form-item label="广告位图片：">
                  <el-upload
                    class="avatar-uploader"
                    :show-file-list="false"
                    :action="api.MAIN_API + api.UPLOAD_API + '/' + item.advertPositionDetailId"
                    :on-success="uploadSuccess"
                    :on-error="uploadErr">
                    <img v-if="item.image" :src="api.IMG_API + item.image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <p style="color: #606266;">图片建议尺寸：100 * 100px ；建议大小：100KB以内</p>
                </el-form-item>
                <el-form-item label="友情链接">
                  <el-input v-model="item.link"></el-input>
                </el-form-item>
              </div>
              <div class="inner-box">
                <i class="el-icon-plus" style="margin-right: 10px;" @click="addAdvertising"></i>
                <i class="el-icon-minus" @click="removeAdvertising(item)"></i>
              </div>
            </div>
          </el-row>
          <el-row>
            <el-form-item label="是否启用：" prop="isShow">
              <el-radio v-model="advertising.isShow" label="1">是</el-radio>
              <el-radio v-model="advertising.isShow" label="2">否</el-radio>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item>
              <el-button @click="cancel">取消</el-button>
              <el-button @click="confirm('advertisingForm')">确定</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import { api } from '../../../../../config/utils.js'
  export default {
    data: function () {
      return {
        api: api,
        advertising: {
          advertName: '',
          advertPositionId: '',
          list: [],
          isShow: ''
        },
        isClickPlusButton: false, // 添加按钮的开关
        removedAdvertising: [], // 删除的广告位
        advertisingRules: {
          advertName: [
            { required: true, message: '请输入广告位名称', trigger: 'blur' },
            { pattern: /[\u4e00-\u9fa5\w]{1,8}/g, message: '广告位名称在8个字以内', trigger: 'blur' }
          ],
          isShow: [
            { required: true, message: '请选择是否启动', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      getAdvertPosition: function () {
        // 获取广告位详情
        this.$http.post('/admin/advert/getAdvertPosition', this.qs.stringify({
          advertPositionId: 1
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.advertising.advertName = res.data.obj.advertName
            this.advertising.advertPositionId = res.data.obj.advertPositionId
            this.advertising.list = res.data.obj.list
            this.advertising.isShow = res.data.obj.isShow
          }
        })
      },
      addAdvertising: function () {
        // 添加广告位
        if (!this.isClickPlusButton) {
          this.advertising.list.push({
            image: '',
            link: ''
          })
          this.isClickPlusButton = true
        } else {
          this.$message.error('上传文件成功后才能继续添加')
        }
      },
      uploadSuccess: function (res, file) {
        // 上传图片成功
        if (file.response.result === 'undefined') {
          this.advertising.list[this.advertising.list.length - 1].image = file.response.obj
        } else {
          this.advertising.list.forEach(item => {
            if (item.advertPositionDetailId === parseInt(file.response.result)) {
              item.image = file.response.obj
            }
          })
        }
        this.isClickPlusButton = false
      },
      uploadErr: function () {
        // 上传图片失败
        this.$message.error('上传图片失败，请重新上传')
      },
      removeAdvertising: function (item) {
        // 移除
        var index = this.advertising.list.indexOf(item)
        if (index !== -1) {
          this.advertising.list.splice(index, 1)
          this.removedAdvertising.push(item)
        }
        this.isClickPlusButton = false
      },
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      handleAdvertisingList: function () {
        var advertisingList = []
        this.removedAdvertising.forEach(item => {
          if (item.advertPositionDetailId) {
            advertisingList.push({
              advertPositionDetailId: item.advertPositionDetailId,
              image: ''
            })
          }
        })
        return advertisingList
      },
      confirm: function () {
        // 确定
        var advertising = {}
        advertising.advertName = this.advertising.advertName
        advertising.advertPositionId = this.advertising.advertPositionId
        advertising.list = this.advertising.list.concat(this.handleAdvertisingList())
        advertising.isShow = this.advertising.isShow
        this.$http.post('/admin/advert/updateAdvertPosition', advertising)
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('广告位修改成功')
            this.$router.go(-1)
          } else {
            this.$message.error('广告位修改失败')
          }
        })
      }
    },
    mounted: function () {
      this.getAdvertPosition()
    }
  }
</script>

<style lang="less" scoped>
  .add-advertising-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
    }
  }
</style>

<style lang="less">
  .add-advertising-wrap {
    .el-form {
      .el-input {
        width: 300px;
      }
      .el-form-item {
        margin-bottom: 0px;
      }
    }
    .el-icon-plus, .el-icon-minus {
      color: rgb(37, 157, 214);
      font-size: 24px;
      cursor: pointer;
    }
    .outer-box {
       position: relative;
       margin-top: 10px;
    }
    .inner-box {
       position: absolute;
       top: 50%;
       left: 36%;
    }
    .inner-box-left {
      width: 500px;
      padding: 8px 0;
      border: 2px dashed rgb(121, 121, 121);
      border-radius: 10px;
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
