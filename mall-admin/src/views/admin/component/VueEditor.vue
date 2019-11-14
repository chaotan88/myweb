<!-- 编辑器 -->
<template>
  <common-tpl>
    <template slot="main">
      <vue-editor v-model="content"></vue-editor>
    </template>
  </common-tpl>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  components: {VueEditor},
  data () {
    return {
      content: '',
      msg: 'Hello word'
    }
  }
}
</script>

<style lang="less" scoped></style>
