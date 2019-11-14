<!-- 后台框架容器 -->
<template>
  <div class="pos-a admin-layout-wrap">
    <headers></headers>
    <div class="pos-r admin-layout-main">
      <keep-alive>
        <router-view :menuData="menuData"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Headers from './Headers'

export default {
  components: {
    Headers
  },
  data () {
    return {
      menuData: []
    }
  },
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
    // let menuList = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'MenuList'))
    // if (menuList) {
    //   this.menuData = menuList
    // } else {
    // }
    this.getAuthData()
  },
  methods: {
    /**
     * 获取权限信息
     */
    getAuthData () {
      this.$http.post('@ROOT_API/auth/getMenuByRole').then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        resData.data.menuData.forEach((row) => {
          this.menuData.push(row.menuCode)
          row.childMenuList.forEach((list) => {
            this.menuData.push(list.menuCode)
          })
        })
        localStorage.setItem(this.$global.SYSTEM + 'MenuList', JSON.stringify(this.menuData))
      })
    }
  }
}
</script>

<style lang="less" scoped>
.admin-layout-wrap{
  width: 100%;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;
  left: 0;
  top: 0;

  .admin-layout-main{
    height: 100%;
    background: #f0f0f0;
  }
}
</style>
