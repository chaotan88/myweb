<!-- 暂无数据 -->
<template>
  <div class="ta-c no-data-wrap">
    <svg class="icon" :class="icon" aria-hidden="true">
      <use :xlink:href="'#' + icon"></use>
    </svg>
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  props: {
    icon: {               // 图标
      type: String,
      default: 'icon-no-data'
    },
    text: {               // 显示文案
      type: String,
      default: '暂无数据！'
    }
  }
}
</script>
