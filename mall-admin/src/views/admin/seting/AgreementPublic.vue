<!-- 添加 & 编辑 注册协议 -->
<template>
  <common-tpl class="agreement-public-wrap">

    <!-- 头部 -->
    <template slot="header"></template>

    <!-- 主体内容 -->
    <template slot="main">
      <gray-title :title="pageType === 1 ? '添加注册协议' : '编辑注册协议'"></gray-title>

      <!-- 编辑器 -->
      <vue-ueditor-wrap ref="ueditor" v-model="formData.editorText" :config="editorConfig" @ready="editorReady" :init="editorInit"></vue-ueditor-wrap>
      <!-- <editor-wrap :initData="formData.editorText" @change="editorChange"></editor-wrap> -->
      
    </template>

    <template slot="other">
      <el-dialog
        title="图片上传"
        :visible.sync="dialogVisible"
        width="30%">
        <el-upload
          :action="uploadUrl"
          :multiple="true"
          :file-list="uploadList"
          :on-remove="handleRemoveImg"
          :on-success="handleUploadSuccess"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePushImg">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="submitHandle">确定</el-button>
    </template>
  </common-tpl>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    VueUeditorWrap
  },
  data () {
    return {
      type: 1,            // 默认注册协议
      pageType: 1,        // 页面类型 [1、新增 2、编辑]
      formData: {
        editorText: ''    // 详情信息
      },
      userInfo: {},       // 用户信息
      editorConfig: {
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: './static/UEditor/',
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 500,
        // 初始容器宽度
        initialFrameWidth: '100%'
      },
      uploadList: [],         // 上传列表
      dialogVisible: false,   // 上传图片弹窗
      editorObj: null         // 存储editor对象
    }
  },
  computed: {
    /**
     * 上传地址
     */
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source?clientType=1&token=' + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.pageType = this.$route.path.match(/add/gi) ? 1 : 2
    if (this.pageType === 2) this.getDetailsHandle()
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsHandle () {
      this.$http.post('@ROOT_API/cotentController/getContent', {
        type: this.type
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
        this.formData.editorText = resData.data.content
      })
    },

    /**
     * 编辑器内容改变
     */
    editorChange (data) {
      this.formData.editorText = data.html
    },

    // 5、 你可以在ready方法中拿到editorInstance实例,之后的所有API就和官方的实例一样了,Just Do What You Want! http://fex.baidu.com/ueditor/#api-common
    editorReady (editorInstance) {
      this.editorObj = editorInstance
    },

    // 7. 结合init方法,自定义按钮
    editorInit () {
      this.$refs.ueditor.registerButton({
        name: 'upload',
        icon: require('@/../static/UEditor/img/upload.png'),
        tip: '上传图片',
        handler: (editor, name) => {
          this.dialogVisible = true
        }
      })
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
    handleUploadSuccess (res, file, fileList) {
      setTimeout(() => {
        if (parseInt(res.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.uploadList.push({
          url: this.$Utils.filterImgUrl(res.data)
        })
      }, 30)
    },

    /**
     * 将图片插入编辑器
     */
    handlePushImg () {
      let res = ''
      this.uploadList.forEach((row) => {
        res += ('<img src="' + row.url + '"/>')
      })
      this.editorObj.execCommand('inserthtml', res)
      this.dialogVisible = false
      this.uploadList = []
    },

    /**
     * 提交
     */
    submitHandle () {
      this.$http.post('@ROOT_API/cotentController/updateContent', {
        type: this.type,
        content: this.formData.editorText
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
          message: this.pageType === 1 ? '添加成功' : '编辑成功',
          type: 'success',
          duration: 1500
        })
        this.$router.push('/admin/seting/basics/agreement')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.agreement-public-wrap{
  .admin-gray-title{
    margin-bottom: 20px;
  }

  .quill-editor-wrap{
    height: 500px;
    padding-bottom: 90px;
  }
}
</style>

<style lang="less">
.aftersale-index-wrap{
  .el-dialog .el-dialog__body{
    text-align: left !important;
  }

  .edui-default.edui-editor{
    z-index: 99 !important;

    .edui-toolbar.edui-default{
      line-height: 20px;
    }
  }
}
</style>