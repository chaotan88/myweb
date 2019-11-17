<!-- 灰色标题 -->
<template>
  <div class="fw-n admin-gray-title">{{title}}</div>
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
