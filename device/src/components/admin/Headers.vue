<template>
  <div class="pos-r admin-header-wrap">
    <h2 class="d-ib fw-n va-t logo-wrap"><img class="d-ib" src="../../../static/img/admin-logo.png">{{$t("common.logo")}}</h2>
    <div :class="['d-ib va-t ta-c', this.$i18n.locale === 'zh' ? 'admin-nav-wrap' : 'admin-nav-wrap-en']">
      <template v-for="item in currentRoutes">
        <!-- {{filterPath(item).path.indexOf('/seting')}} -->
        <!-- <router-link class='d-ib' :to="item.path">{{item.meta.nav}}</router-link> -->
        <router-link class='d-ib' :class="{'active': subIsActive(activeLink,filterPath(item).path)}" :to="filterPath(item)"
          v-if="item.meta.menuCode && menuData.indexOf(item.meta.menuCode) !== -1">{{$t(item.meta.nav)}}</router-link>
      </template>
    </div>
    <div class="pos-a personal">
        <div class="user">
            <img src="../../../static/img/user-face01.png">
        </div>
        <span class="name">{{$t('common.hello')}}: {{adminInfo.userName}}</span>
        <ul>
            <li @click="$router.push('/admin/seting/account/update')">{{$t('common.updatePassword')}}</li>
            <!-- <li class="vertical">|</li> -->
            <li class="quit" @click="loginOut">{{$t('common.loginout')}}</li>
        </ul>
        <el-select :value="currentLang" placeholder="请选择" popper-class="dropdown" class="dropdown-menu" @change="languageChange">
          <template v-for="item in downList">
            <el-option :label="item.name" :value="item.id"></el-option>
          </template>
        </el-select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    menuData: {
      type: Array
    }
  },
  data () {
    return {
      downList: [
        {
          id: 'en',
          name: 'EN'
        },
        {
          id: 'zh',
          name: '中文'
        }
        // {
        //   ahref: this.$dm.ROOT_IMG + '/admin/#/login?userName=' + JSON.parse(localStorage.getItem('deviceAdminInfo')).loginName + '&token=' + JSON.parse(localStorage.getItem('deviceAdminInfo')).token,
        //   name: '广告管理'
        // },
        // {
        //   ahref: this.$dm.ROOT_IMG + '/channel/#/login?userName=' + JSON.parse(localStorage.getItem('deviceAdminInfo')).loginName + '&token=' + JSON.parse(localStorage.getItem('deviceAdminInfo')).token,
        //   name: '渠道管理'
        // }
      ],
      adminInfo: {},          // 用户信息
      currentRoutes: [],
      activeLink: [], // 父路由的path
      currentLang: '中文'
    }
  },
  mounted () {
    this.adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    this.currentRoutes = this.$router.options.routes.filter((row) => row.path === '/admin')[0].children
    /**
     * 获取父路由的path
    */
    this.currentRoutes.forEach((ite) => {
      this.activeLink.push(ite.path.split('admin/')[1])
    })
  },
  methods: {
    /**
     * 子路由点击 父路由处于active状态
    */
    subIsActive (par, val) {
      const paths = Array.isArray(par) ? par : [par]
      return paths.some(path => {
        if (this.$route.path.indexOf(path) > -1 && val.indexOf(path) > -1) {
          return true
        }
      })
    },
    /**
     * 过滤路由
     */
    filterPath (item) {
      let url = null
      item.children.forEach((row) => {
        if (!url && this.menuData.indexOf(row.meta.menuCode) !== -1) url = row.path
      })
      return {
        path: url
      }
    },

    // 1.退出
    loginOut () {
      this.$message.success('退出成功')
      // localStorage.clear()
      localStorage.removeItem('deviceAdminInfo')
      this.$router.push('/login')
    },
    languageChange (val) {
      this.$i18n.locale = val
      this.currentLang = this.$i18n.locale === 'zh' ? '中文' : '英文'
    }
  }

}
</script>

<style lang='less'>
// 下拉样式
.dropdown-menu{
  width: 105px;
  input{
    background: none;
    border: none;
    color: #d7dadc;
    font-size: 12px;
  }
  .el-input__suffix{
    right: 35px;
    top: -2px;
  }
}
.dropdown{
  background: #4d697c;
  top: 50px;
  border:none;
  top: 50px !important;
  overflow: hidden;
  .el-select-dropdown__list{
    padding:0;
  }
  .el-select-dropdown__item{
    color: #fff;
    border-bottom: 1px solid #365163;
    &:hover{
     background: #497694;
    }
  }
  .popper__arrow{
    display: none;
  }
}
.admin-header-wrap{
  height: 80px;
  margin-top: -80px;
  padding: 0 35px;
  overflow: hidden;
  background: #1f3a4c;

  .logo-wrap{
    color: #fff;
    height: 36px;
    font-size: 24px;
    padding: 22px 0;

    img{
      height: 100%;
      margin-right: 15px;
    }
  }

  .admin-nav-wrap{
    height: 35px;
    line-height: 35px;
    margin-left: 5rem;
    padding-top: 22px;

    a{
      color: #fff;
      height: 100%;
      margin: 0 5px;
      padding: 0 15px;
      border-radius: 5px;
      font-size: 16px;
    }

    a.active{
      background: #d71e25;
    }
  }
  .admin-nav-wrap-en {
    height: 35px;
    line-height: 35px;
    margin-left: 5rem;
    padding-top: 22px;

    a{
      color: #fff;
      height: 100%;
      margin: 0 5px;
      padding: 0 5px;
      border-radius: 5px;
      font-size: 16px;
    }

    a.active{
      background: #d71e25;
    }
  }

  .personal{
    line-height: 80px;
    // margin-right: 35px;
    right: 0;
    top: 0;
   .user{
    width: 48px;
    height: 48px;
    border: 1px solid #cfd1d4;
    margin-top: 15px;
    float: left;
    border-radius: 50%;
    overflow: hidden;
    img{
        width: 100%;
        height: 100%;
    }
   }
   span.name{
    color: #fff;
    font-size: 14px;
    padding: 0 30px 0 15px;
    float: left;
    displey:inline-block;
   }
    a{
      color: #d7dadc;
      font-size: 12px;
      float: left;
      padding:0 15px;
    }
    ul{
      list-style: none;
      float: left;
      li{
        color: #d7dadc;
        font-size: 12px;
        float: left;
        padding:0 15px;
        cursor: pointer;
      }
      .vertical{
        padding:0;
      }
      .quit{
        // padding-right: 80px;
        cursor: pointer;
      }
    }
  }
}
</style>
