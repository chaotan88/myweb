<!-- 灰色标题 -->
<template>
  <div class="fw-n pos-r admin-gray-title">
    <slot>{{title}}</slot>
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    }
  }
}
</script>
