<!-- 上传组件 -->
<template>
  <div class="va-t d-ib upload-component-wrap" @click="$emit('click')">
    <el-upload
      class="pos-r"
      :class="{disabled: disabled}"
      :style="customStyle"
      list-type="picture-card"
      :file-list="fileImgList"
      :action="uploadUrl"
      :limit="limit"
      :multiple="multiple"
      :on-exceed="uploadExceed"
      :before-upload="uploadBefore"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :show-file-list="false"
      :disabled="disabled">
      <i class="ta-c pos-a el-icon-plus default-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    limit: {  // 限制个数
      type: Number,
      default: 1
    },

    multiple: {  // 是否支持多选文件
      type: Boolean,
      default: false
    },

    beforeUpload: {
      type: Function
    },

    styles: { // 样式
      type: Object
    },

    index: {  // 索引标识
      type: Number,
      default: 0
    },

    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },

    size: { // 大小
      type: [String, Number]
    }
  },

  data () {
    return {
      customStyle: {
        width: '120px',
        height: '120px'
      },
      fileImgList: [],  // 上传列表
      userInfo: {}
    }
  },

  watch: {
    'size' () {
      this.initSzie()
    },

    'styles' (value) {
      Object.assign(this.customStyle, this.styles)
    }
  },

  computed: {
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.initSzie()
    Object.assign(this.customStyle, this.styles)
  },

  methods: {
    /**
     * 大小初始化
     */
    initSzie () {
      if (!this.size && parseInt(this.size) !== 0) return false
      let sizeUnit = parseInt(this.size) + 'px'
      this.customStyle.width = sizeUnit
      this.customStyle.height = sizeUnit
    },

    /**
     * 上传数量超过最大限制数量
     */
    uploadExceed (files, fileList) {
      this.$message({
        message: '最多只能上传' + this.limit + '张图片',
        type: 'error'
      })
    },

    /**
     * 上传前校验格式
     */
    uploadBefore (file) {
      if (this.beforeUpload) {
        return this.beforeUpload(file)
      } else {
        const pattern = /(jpg|jpeg|png)$/ig
        const isLegalPhoto = pattern.test(file.type)
        const fileSize = file.size / 1024 / 1024 < 10

        if (!isLegalPhoto) {
          this.$message.error('上传图片的格式不合法，请重新上传')
        }
        if (!fileSize) {
          this.$message.error('上传图片大小不能超过 10MB!')
        }
        return isLegalPhoto && fileSize
      }
    },

    /*
     * 图片上传成功
     */
    uploadSuccess (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.$emit('success', res.data, this.index)
      if (this.limit === 1) this.fileImgList = []
    },

    /*
     * 图片上传失败
     */
    uploadError (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.$emit('error', res, this.index)
    }
  }
}
</script>

<style lang="less">
.upload-component-wrap{
  font-size: 0;
  box-sizing: border-box;

  .el-upload{
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    &:hover{
      i{
        color: #1b8cfe;
      }
    }

    .default-icon{
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-top: -15px;
      margin-left: -15px;
      top: 50%;
      left: 50%;
    }
  }

  .disabled{
    cursor: not-allowed;

    .el-upload{
      border-color: #ccc;

      i{
        color: #ccc;
      }
    }
  }
}
</style>
