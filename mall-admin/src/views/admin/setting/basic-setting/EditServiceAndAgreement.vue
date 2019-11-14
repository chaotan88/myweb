<template>
  <div class="add-customer-service-wrap">
    <div class="content-wrap">
      <span class="title" v-if="contentId === '2'">编辑售后服务</span>
      <span class="title" v-if="contentId === '1'">编辑注册协议</span>
      <!-- 富文本编辑器 -->
      <div class="rich-editor-wrap">
        <quill-editor
          id="quill-editor"
          v-model="content"
          :options="editorOptions">
        </quill-editor>
      </div>
      <div class="button-group">
        <el-button @click="confirm">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { editorOptions } from '@/assets/js/vue-quill-editor-config'
  export default {
    data: function () {
      return {
        contentId: '',
        content: '',
        editorOptions: editorOptions
      }
    },
    methods: {
      getContentById: function () {
        // 获取内容详情
        this.$http.post('/admin/content/getContentById', this.qs.stringify({
          contentId: this.contentId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.content = res.data.obj.content
          } else if (res.data.res === 0) {
            this.content = ''
          }
        })
      },
      confirm: function () {
        // 确定
        this.$http.post('/admin/content/updateContent', this.qs.stringify({
          contentId: this.contentId,
          content: this.content
        }))
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('编辑成功')
          } else {
            this.$message.error('编辑失败')
          }
        })
      }
    },
    watch: {
      '$route': function (to, from) {
        // 在这里监视路由的变化
        this.contentId = to.params.contentId
        this.getContentById()
      }
    },
    mounted: function () {
      this.contentId = this.$route.params.contentId
      this.getContentById()
    }
  }
</script>

<style lang="less" scoped>
  .add-customer-service-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .title {
        display: inline-block;
        margin-bottom: 10px;
      }
      .button-group {
        margin-top: 10px;
      }
      #quill-editor {
        width: 800px;
        min-height: 500px;
      }
    }
  }
</style>

<style lang="less">

</style>
