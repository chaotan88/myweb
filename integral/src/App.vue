<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" :key="key"></router-view>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'app',
  watch: {
    '$route' (to, from) {
      // 百度商桥
      if (to.path === '/home') {
        (function () {
          var hm = document.createElement('script')
          hm.src = 'https://hm.baidu.com/hm.js?3e7746d030a9b70db41becdd717cdade'
          var s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(hm, s)
        })()
      } else {
        var m = document.getElementById('newBridge')
        if (m) {
          m.parentNode.removeChild(m)
        }
      }
      // 获取积分来源
      if (to.path === '/myEarning') {
        this.$http.get(`${this.api.getSysDictionaryList}`, {
          params: {
            dataType: 1        // 1:积分来源
          }
        }).then((res) => {
          let resData = res.data
          if (res.data.status === this.api.ERR_OK || !res) {
            Vue.filter('integralSourceFilter', function (val) {
              let arr = []
              arr = resData.data.filter((row) => parseInt(row.dataCode) === parseInt(val))
              if (arr.length > 0) {
                return arr[0].dataValue
              } else {
                return val
              }
            })
          }
          this.$router.push('/myEarning')
        })
      }
    }
  },
  computed: {
    // 处理一个页面中的链接点击再次跳入当前页面(只是后面参数有变化)url变化页面不刷新问题
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
