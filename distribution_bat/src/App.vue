<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
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
