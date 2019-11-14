<!-- 编辑器 -->
<template>
  <common-tpl>
    <template slot="main">
      <editor class="editor" :value="content"  :setting="editorSetting" @input="(content)=> content = content"></editor>
    </template>
  </common-tpl>
</template>

<script>
import editor from './Tinymce'
export default {
  name: 'editor-demo',
  data () {
    return {
      content: '我是富文本编辑器的内容',
      // tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
      editorSetting: {
        height: 400
      }
    }
  },
  components: {
    'editor': editor
  }
}
</script>

<style lang="less" scoped></style>
