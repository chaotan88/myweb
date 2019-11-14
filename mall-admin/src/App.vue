<template>
  <div id="app">
    <router-view></router-view>
    <!-- <router-view :key="key"></router-view> -->
  </div>
</template>

<script>
export default {
  name: 'app',

  computed: {
    /**
     * 处理地址栏变化页面数据未变化
    */
    key () {
      let key = this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      if (this.$route.meta.refresh === false) key = ''
      return key
    }
  },

  mounted () {
    /**
     * 监听用户返回或前进操作
     */
    window.addEventListener('popstate', () => {
      localStorage.setItem(this.$global.POPSTATE, true)
    }, false)
  }
}
</script>

<style>
#app {
  color: #333;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
