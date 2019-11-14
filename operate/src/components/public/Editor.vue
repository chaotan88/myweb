<!-- 编辑器 -->
<template>
  <div class="vue-ueditor-piblic-wrap" v-loading="visible">

    <vue-ueditor-wrap class="pos-r vue-ueditor-wrap" ref="ueditor" v-model="formData.editorText" :config="editorConfig" @ready="editorReady" :init="editorInit" @input="$emit('change', formData.editorText)" :destroy="true" v-if="!visible"></vue-ueditor-wrap>

    <!-- 图片上传 -->
    <el-dialog
      title="图片上传"
      :visible.sync="dialogVisible"
      width="600px">
      <thumbnail-component class="d-ib" :list="uploadList" drag move del :empty="false" :styles="{width: '130px', height: '130px', 'margin-right': '10px', 'margin-bottom': '10px'}" @delete="handleDeleteImg">
        <template slot="other">
          <upload-component :multiple="true" :limit="999" :styles="{width: '130px', height: '130px'}" @success="handleUploadSuccess">
          </upload-component>
          <!-- :file-list="uploadList" -->
          <!-- :on-preview="handlePreview" -->
          <!-- :on-remove="handleRemoveImg" -->
          <!-- list-type="picture-card" -->
          <!-- <el-upload
            class="d-ib va-t pos-r"
            :action="uploadUrl"
            :multiple="true"
            :on-success="handleUploadSuccess"
            >
            <i class="pos-a icon el-icon-plus"></i>
          </el-upload> -->
        </template>
      </thumbnail-component>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="handlePushImg">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import ThumbnailComponent from './ThumbnailComponent'
export default {
  components: {
    VueUeditorWrap,
    ThumbnailComponent
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    imgIcon: {
      type: String,
      default: 'block'
    }
  },

  computed: {
    /**
     * 上传地址
     */
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },

  data () {
    return {
      visible: true,
      loading: true,
      dialogVisible: false,   // 上传图片弹窗
      uploadLoading: false,   // 上传loading
      formData: {
        editorText: ''
      },
      editorConfig: {
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: './static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      editorObj: {},    // 编辑器对象
      uploadList: [
        // {
        //   url: 'https://oss-zxtx-shopadmin.oss-cn-shenzhen.aliyuncs.com/shopadmin-source-2018101540438677198.png'
        // }, {
        //   url: 'https://oss-zxtx-shopadmin.oss-cn-shenzhen.aliyuncs.com/shopadmin-source-2018101540448971406.png'
        // }, {
        //   url: 'https://oss-zxtx-shopadmin.oss-cn-shenzhen.aliyuncs.com/shopadmin-source-2018101540438677198.png'
        // }
      ],   // 上传列表
      userInfo: {}      // 用户信息
    }
  },

  watch: {
    value () {
      this.formData.editorText = this.value
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.$nextTick(() => {
      this.formData.editorText = this.value
      setTimeout(() => {
        this.visible = false
      }, 800)
    })
  },

  methods: {
    /**
     * 编辑器内容改变
     */
    ueditorChange (value) {
      // this.formData.editorText = ''
      // this.$emit('change', value)
      // console.log('value: ', value)
    },
    // 5、 你可以在ready方法中拿到editorInstance实例,之后的所有API就和官方的实例一样了,Just Do What You Want! http://fex.baidu.com/ueditor/#api-common
    editorReady (editorInstance) {
      this.editorObj = editorInstance
    },

    // 7. 结合init方法,自定义按钮
    editorInit () {
      if (this.imgIcon === 'none') return false
      this.$refs.ueditor.registerButton({
        name: 'upload',
        icon: require('@/../static/UEditor/img/upload.png'),
        tip: '上传图片',
        handler: (editor, name) => {
          this.editorObj = editor
          this.dialogVisible = true
        }
      })
    },

    /**
     * 删除图片
     */
    handleDeleteImg (item, index) {
      this.uploadList.splice(index, 1)
    },

    /**
     * 文件预览
     */
    handlePreview (file) {
      window.open(file.url, '_blank')
    },

    /**
     * 移除图片
     */
    handleRemoveImg (file, fileList) {
      this.uploadList = []
      fileList.forEach((row) => {
        this.uploadList.push({
          url: row.url
        })
      })
    },

    /**
     * 上传成功操作
     */
    handleUploadSuccess (url) {
      setTimeout(() => {
        // if (parseInt(res.status) !== 1) {
        //   this.$message({
        //     message: res.msg,
        //     type: 'error',
        //     duration: 1000
        //   })
        //   return false
        // }
        this.uploadList.push({
          url: this.$Utils.filterImgUrl(url)
        })
      }, 30)
    },

    /**
     * 将图片插入编辑器
     */
    handlePushImg () {
      this.uploadLoading = true
      let res = ''
      this.uploadList.forEach((row) => {
        res += ('<img src="' + row.url + '"/>')
      })
      this.editorObj.execCommand('inserthtml', res)
      this.dialogVisible = false
      this.uploadList = []
      setTimeout(() => {
        this.uploadLoading = false
      }, 100)
    }
  }
}
</script>

<style lang="less">
.vue-ueditor-piblic-wrap{
  z-index: 10;

  .edui-default{
    line-height: 20px;
  }

  .el-upload{
    width: 130px;
    height: 130px;
    border: 1px dashed #c0ccda;
    background: #fbfdff;
    position: relative;
    border-radius: 6px;
    box-sizing: border-box;

    .icon{
      color: #999;
      width: 30px;
      height: 30px;
      font-size: 30px;
      margin-left: -15px;
      margin-top: -15px;
      left: 50%;
      top: 50%;
    }

    &:hover{
      color: #409eff;
      border-color: #409eff;

      i{
        color: #409eff;
      }
    }
  }

  .el-upload-list{
    display: none;
  }

  .vue-ueditor-wrap{
    z-index: 10 !important;
    .edui-editor{
      width: auto !important;

      img{
        max-width: 100%;
      }
    }
  }

  .el-dialog__body{
    text-align: left;
  }
}
</style>
