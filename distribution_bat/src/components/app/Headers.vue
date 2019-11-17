<!-- 前台头部 -->
<template>
  <div class="pos-f index-header-wrap">
    <div class="index-header-cen">

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    /**
     * 退出登录
     */
    logoutHandle () {
      localStorage.removeItem('userInfo')
      this.$message({
        message: '退出成功',
        type: 'success',
        duration: 1000
      })
    }
  }
}
</script>

<style lang='less' scoped>
.index-header-wrap{
  width: 100%;
  height: 80px;
  background: #fff;
  top: 0;
  z-index: 999;
  box-sizing: border-box;
  box-shadow: 0 3px 10px rgba(0, 0, 0, .05);

  .index-header-cen{

  }
}
</style>
