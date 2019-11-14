<!-- 前台框架容器 -->
<template>
  <div class="home-layout">
    <!-- 头部 -->
    <headers></headers>
    <router-view></router-view>
    <footers></footers>
  </div>
</template>

<script>
import Headers from './Headers'
import Footers from './Footers'

export default {
  components: { Headers, Footers },

  beforeRouteLeave (to, from , next) {
    this.$message({
      message: '不能关闭弹窗',
      type: 'error'
    })
    next(false)
  }
}
</script>

<style lang='less' scoped>
.home-layout{
  min-width: 1200px;
  padding-top: 80px;
}
</style>
