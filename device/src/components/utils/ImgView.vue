<!-- 上传组件 -->
<template>
  <div class="image-container">
    <img :src="`${$dm.ROOT_IMG}/device/static/img/device/${src}`" :style="{width: `${width}px`, height: `${height}px`}"/>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 60
    },
    height: {
      type: Number,
      default: 50
    }
  }
}
</script>

<style lang="less">
.image-container {
  margin: 0 !important;
  img {
    margin-right: 10px;
  }
}
</style>
