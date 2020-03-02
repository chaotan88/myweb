<!-- 上传组件 -->
<template>
  <div class="tips-container">
    <i class="icon-font el-icon-warning-outline" :title="title"></i>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.tips-container {
    line-height: 36px;
    margin-left: 10px;
}
</style>
