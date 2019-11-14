<!-- 编辑器 -->
<template>
  <common-tpl>
    <template slot="main">
      <editor id="editor_id" height="500px" width="100%" :content="editorText" uploadJson="asp.net/upload_json.ashx"
        pluginsPath="/static/kindeditor/plugins/"
        :allowFileManager="false"
        :loadStyleMode="false"
        @on-content-change="onContentChange"></editor>
    </template>
  </common-tpl>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      editorText: ''
    }
  },
  methods: {
    onContentChange (data) {
      this.editorText = data.value // data.value;data.id
    }
  }
}
</script>

<style lang="less" scoped></style>
