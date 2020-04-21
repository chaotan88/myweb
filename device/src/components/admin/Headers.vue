<template>
  <div class="pos-r admin-header-wrap" style="display: flex;">
    <h2 class="d-ib fw-n va-t logo-wrap" style="height: 80px;">
      <div style="height: 62px; margin-top: 10px; background: #fff; border-radius: 10px; margin-left: 60px;">
        <img class="d-ib" src="../../../static/img/admin-logo.png" style="height: 60px; margin: 0 7px;"></div>
    </h2>
    <h2 style="line-height: 80px; color: #fff; font-size: 24px; font-weight: normal; margin-left: 35px;">{{$t("common.logo")}}</h2>
    <div :class="['d-ib va-t ta-c', this.$i18n.locale === 'zh' ? 'admin-nav-wrap' : 'admin-nav-wrap-en']">
      <template v-for="item in currentRoutes">
        <!-- {{filterPath(item).path.indexOf('/seting')}} -->
        <!-- <router-link class='d-ib' :to="item.path">{{item.meta.nav}}</router-link> -->
        <router-link class='d-ib' :class="{'active': subIsActive(activeLink,filterPath(item).path)}" :to="filterPath(item)"
          v-if="item.meta.menuCode && menuData.indexOf(item.meta.menuCode) !== -1">{{$t(item.meta.nav)}}</router-link>
      </template>
    </div>
    <div class="pos-a personal">
        <!-- <div class="user">
            <img src="../../../static/img/user-face01.png">
        </div> -->
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{$t('common.hello')}}: {{adminInfo.userName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="c">{{$t('common.accountSetting')}}</el-dropdown-item>
            <el-dropdown-item command="a">{{$t('common.updatePassword')}}</el-dropdown-item>
            <el-dropdown-item command="b">{{$t('common.loginout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <span class="name"></span> -->
        <!-- <ul>
            <li @click="$router.push('/admin/seting/account/update')">{{$t('common.updatePassword')}}</li>
            <li class="quit" @click="loginOut">{{$t('common.loginout')}}</li>
        </ul> -->
        <el-select :value="currentLang" placeholder="Please Select" popper-class="dropdown" class="dropdown-menu" @change="languageChange">
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
      ],
      adminInfo: {},          // 用户信息
      currentRoutes: [],
      activeLink: [], // 父路由的path
      currentLang: 'EN'
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
      this.$message.success('Sucess')
      // localStorage.clear()
      localStorage.removeItem('deviceAdminInfo')
      this.$router.push('/login')
    },
    languageChange (val) {
      this.$i18n.locale = val
      this.currentLang = this.$i18n.locale === 'zh' ? '中文' : 'EN'
    },
    handleCommand (command) {
      if (command === 'a') {
        this.$router.push('/admin/seting/account/update')
      } else if (command === 'b') {
        this.loginOut()
      } else if (command === 'c') {
        this.$router.push('/admin/seting/account/index')
      }
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
  // background: #3360bb;
  .logo-wrap{
    color: #fff;
    height: 36px;
    font-size: 24px;
    // padding: 22px 0;

    img{
      // height: 100%;
      height: 75px;
      margin-top: -22px;
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
      margin: 0 15px;
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
    right: 0px;
    top: 0;
   .user{
      cursor: pointer;
      width: 48px;
      height: 48px;
      border: 1px solid #cfd1d4;
      margin-top: 15px;
      margin-right: 50px;
      float: left;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
      .user-show-container {
        width: 100px;
        height: 300px;
        background: #fff;
        position: absolute;
        // display: none;
        top: 50px;
      }
      .user:hover {
        .user-show-container {
          display: inline;
        }
      }
    }
   span.name{
    color: #fff;
    font-size: 14px;
    padding: 0 30px 0 15px;
    float: left;
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
    .el-dropdown {
      color: #ff6a00;
    }
  }
}
</style>
