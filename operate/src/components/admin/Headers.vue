<!-- 头部 -->
<template>
  <div class="pos-a header-layout-wrap">
    <div class="fl-l ta-c logo-wrap">
      <img src="../../assets/img/admin-logo.png">
    </div>
    <div class="fl-r user-info-wrap">
      <dl class="d-ib">
        <dt class="va-m d-ib"><img src="../../assets/img/user-face01.png"></dt>
        <dd class="va-m d-ib">您好：<a class="cursor-p" @click="$router.push('/admin/seting/account/index')">{{userInfo.loginName | filterEmpty}}</a></dd>
      </dl>
      <div class="d-ib va-m link-wrap">
        <a @click="$router.push('/admin/seting/account/index')">修改密码</a>
        <a @click="logout">安全退出</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },

  methods: {
    /**
     * 安全退出
     */
    logout () {
      localStorage.removeItem(this.$global.USER_INFO)
      this.$message({
        message: '退出成功',
        type: 'success',
        duration: 500
      })
      setTimeout(() => {
        this.$router.push('/login')
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
.header-layout-wrap{
  width: 100%;
  height: 80px;
  background: #0c2739;
  left: 0;
  top: 0;
  z-index: 100;

  .logo-wrap{
    width: 210px;
    height: 100%;
    padding: 20px 0;
    /*background: #0a1f2e;*/
    box-sizing: border-box;

    img{
      height: 100%;
    }
  }

  .user-info-wrap{
    font-size: 14px;
    padding-right: 20px;

    dl{
      color: #fff;
      padding: 15px 0;

      dt{
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 100%;

        img{
          width: 100%;
          height: 100%;
        }
      }

      a{
        color: #fff;
      }
    }

    .link-wrap{
      margin: 0 10px;

      a{
        color: #fff;
        margin-left: 15px;
        cursor: pointer;
      }
    }
  }
}
</style>
