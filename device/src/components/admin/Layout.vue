<template>
  <div class="admin-layout-wrap pos-a">
    <headers :menuData="menuData"></headers>
    <div class="pos-r admin-layout-main">
      <router-view :menuData="menuData"/>
    </div>
  </div>
</template>

<script>
import Headers from './Headers'

export default {
  components: { Headers },
  data () {
    return {
      menuData: []
    }
  },
  mounted () {
    this.getAuthData()
  },
  methods: {
    /**
     * 获取权限信息
     */
    getAuthData () {
      this.$http.get('@ROOT_API/auth/getMenuByRole').then((res) => {
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
      // this.menuData = ['201010', '201010', '201040', '201020', '201030', '201011', '201041', '201021', '201031', '201022']
      // localStorage.setItem('menuList', JSON.stringify(this.menuData))
      })
    }
  }
}
</script>

<style lang='less' scoped>
.admin-layout-wrap{
  width: 100%;
  min-width: 1360px;
  height: 100%;
  padding-top: 80px;
  box-sizing: border-box;

  .admin-layout-main{
    height: 100%;
  }
}
</style>
