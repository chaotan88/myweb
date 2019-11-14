<template>
  <common-tpl class="order-delivery-bulk-wrap">
    <template slot="main" class="search-wrap">
      <div class="box-top pos-r">
        <div class="box-top-cen pos-r">
          <div class="browse-box pos-r">
            <el-upload
              class="upload-demo upload pos-r"
              ref="upload"
              :limit="1"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="formData.fileList"
              :auto-upload="false"
              :before-upload="uploadBefore"
              :on-success="uploadSuccess">
              <el-button class="browse pos-a va-t" slot="trigger" size="small" type="primary">浏览</el-button>
              <el-button class="determine pos-a" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定</el-button>
              <span>选择导入的文件</span>
            </el-upload>
          </div>
          <a href="http://oss-zxtx-operate.oss-cn-shenzhen.aliyuncs.com/%E6%89%B9%E9%87%8F%E5%8F%91%E8%B4%A7%E6%A8%A1%E7%89%88.xlsx" target="_blank">
            <span class="pos-a d-ib" style="width: 200px;  left: 100%; top: 10px; padding-left: 20px;">
              <i class="el-icon-download"></i> 下载批量发货导入模版
            </span>
          </a>
          <span class="pos-a d-ib" style="color: #999; margin-top: 10px;">
            <i class="el-icon-warning" style="color: #f5a74a;"></i> 导入前请先下载批量发货导入模块。
          </span>
        </div>
      </div>
      <div class="box-main">
        <h3 class="fw-n">导入须知</h3>
        <p class="title-subheading">批量发货导入模版：</p>
        <!-- <h1><img src="./img/order-delivery-table.png"></h1> -->
        <p>
        1.导入文件仅支持xls或xlsx格式，大小不超过2M。<br>

        2.表头中带<span>“*”</span>为必填项。<br>

        3.快递类型必须为系统中已经存在的快递类型；如果快递类型在系统中不存在，导入时统一用<span>“其他”</span>代替。否则会导入失败。
        </p>
      </div>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          template: '',
          fileList: []
        },
        userInfo: {}
      }
    },

    computed: {
      uploadUrl () {
        return this.$dm.ROOT_API + 'upload/uploadimg/operate/source' + this.$global.PARAMS + this.userInfo.token
      }
    },

    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    },

    methods: {
      /**
     * 上传前校验格式
     */
      uploadBefore (file) {
        const pattern = /xls|xlsx|officedocument/ig
        const isLegalPhoto = pattern.test(file.type)
        const fileSize = file.size / 1024 / 1024 < 2

        if (!isLegalPhoto) {
          this.$message.error('上传模版格式不合法，请重新上传')
          return false
        }
        if (!fileSize) {
          this.$message.error('上传模版不能超过 2MB!')
          return false
        }
        return isLegalPhoto && fileSize
      },

      handleRemove (file, fileList) {
        console.log('handleRemove: ', file, fileList)
      },

      handlePreview (file) {
        console.log('handlePreview: ', file)
      },

      submitUpload () {
        this.$refs.upload.submit()
      },

      /**
       * 确定上传
       */
      uploadSuccess (file) {
        if (parseInt(file.status) !== 1) {
          this.$message({
            message: file.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        console.log('file: ', file)
        this.$http.get('@ROOT_API/orderLogistics/batchSendOrderLogistics', {
          params: {
            filePath: file.data
          }
        }).then((res) => {
          console.log('res: ', res)
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 2000
            })
            return false
          }
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
        })
      }
    }
  }
</script>

<style lang="less">
.order-delivery-bulk-wrap{
  .box-top{
    border: 2px dashed #eee;
    margin-bottom: 20px;
    border-radius: 3px;

    .box-top-cen{
      width: 400px;
      margin: 100px auto;
      /*overflow: hidden;*/

      .browse-box{
        width: 400px;
        border: 1px solid #eee;
        overflow: hidden;

        .upload{
          height: 40px;
          z-index: 100;

          .browse-box{
            width: 400px;
            border: 1px solid #eee;


          }
          .browse{
            width: 120px;
            height: 40px;
            border-radius: 0;
            left: 0;
            top: 0;
          }

          .determine{
            width: 100px;
            height: 40px;
            right: 0;
            top: 0;
            border-radius: 0;
          }

          .el-upload-list{
            width: 175px;
            left: 120px;
            position: absolute;
            top: 0;
          }

          .el-upload-list__item:hover{
            background: none;
          }
        }
      }
    }
  }

  .box-main{
    padding: 10px;
    border: 2px dashed #eee;
    border-radius: 3px;

    img{
      width: 611px;
      height: 52px;
      margin: 10px 0;
    }

    h3{
      color: red;
      line-height: 45px;
    }

    p{
      font-size: 14px;
      line-height: 30px;
    }

    span{
      color: red;
    }
  }
}
</style>
