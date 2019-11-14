<template>
  <div class="admin-childlayout-wrap">
    <div class="pos-a slide-nav-wrap">
      <!-- <el-menu :collapse="isCollapse" :default-openeds="currentRouters" :unique-opened="true">
        <template v-for="(item) in routerData" v-if="item.path && item.meta.visible !== false">
          <el-submenu :index="item.path">
            <template slot="title">
              <svg class="icon" :class="item.meta.icon" aria-hidden="true">
                <use :xlink:href="'#' + item.meta.icon"></use>
              </svg>
              <span slot="title">{{item.meta.nav}}</span>
            </template>

            <template v-for="list in item.children">
              <el-menu-item-group v-if="list.path && list.meta.visible !== false">
                <router-link :to="list.path" :class="{active: list.path === $route.path}">
                  <el-menu-item :index="list.path">
                    <svg class="icon" :class="list.meta.icon" aria-hidden="true">
                      <use :xlink:href="'#' + list.meta.icon"></use>
                    </svg>
                    {{list.meta.nav}}
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </template>
          </el-submenu>
        </template>
      </el-menu> -->

      <el-menu :collapse="isCollapse" :default-openeds="currentRouters" :unique-opened="true">
        <template v-for="(item) in routerData" v-if="item.path && item.meta.visible !== false && item.meta.authCode && menuData.indexOf(item.meta.authCode.toString()) !== -1">
          <el-submenu :index="item.path">
            <template slot="title">
              <svg class="icon" :class="item.meta.icon" aria-hidden="true">
                <use :xlink:href="'#' + item.meta.icon"></use>
              </svg>
              <span slot="title">{{item.meta.nav}}</span>
            </template>

            <template v-for="list in item.children">
              <el-menu-item-group v-if="list.path && list.meta.visible !== false && list.meta.authCode && menuData.indexOf(list.meta.authCode.toString()) !== -1">
                <router-link :to="list.path" :class="{active: list.path === $route.path}">
                  <el-menu-item :index="list.path">
                    <svg class="icon" :class="list.meta.icon" aria-hidden="true">
                      <use :xlink:href="'#' + list.meta.icon"></use>
                    </svg>
                    {{list.meta.nav}}
                  </el-menu-item>
                </router-link>
              </el-menu-item-group>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </div>

    <div class="admin-child-cen">
      <!-- 面包屑 -->
      <breadcrumb></breadcrumb>

      <div class="pos-r admin-child-main">
        <div class="admin-child-c">
          <template v-if="$route.meta.authCode && menuData.length && menuData.indexOf($route.meta.authCode.toString()) === -1">
            <div class="ta-c no-authority-wrap">
              <img src="../../assets/img/no-authority-icon.png">
              <p>您当前的账户无权限~</p>
            </div>
          </template>
          <template v-else>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
export default {
  components: {Breadcrumb},
  props: {
    menuData: {
      type: Array
    }
  },

  data () {
    return {
      currentRouters: [],   // 当前路由组
      routerData: [],       // 路由
      isCollapse: false
    }
  },

  mounted () {
    this.routerData = this.$router.options.routes.filter((row) => row.path === '/admin')[0].children
    // this.routerData.forEach((row) => {
    //   if (row.path.match(/order/)) {
    //     row.children.forEach((list) => {
    //       if (list.path.match(/supply/)) {
    //         let mallAdminUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO)) || {}
    //         list.meta.visible = parseInt(mallAdminUserInfo.shopId) !== 1 ? !!false : !!true
    //       }
    //     })
    //   }
    // })
    this.currentRouters.push(this.routerData.filter((row) => this.$route.path.indexOf(row.path) !== -1)[0].path)
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
  }
}
</script>

<style lang='less' scoped>
.admin-childlayout-wrap{
  height: 100%;

  .slide-nav-wrap{
    width: 210px;
    height: 100%;
    padding: 20px 0;
    overflow: auto;
    box-sizing: border-box;
    background: #1e3a4d;
    left: 0;
    top: 5;
    z-index: 101;
  }

  .slide-nav-wrap::-webkit-scrollbar{
    width: 6px;
    background-color: rgba(255, 255, 255, 0);
  }

  .slide-nav-wrap::-webkit-scrollbar-thumb{
    background: rgba(86, 173, 232, .3);
    border-radius: 10px;
  }

  .admin-child-cen{
    height: 100%;
    padding-left: 210px;
    z-index: 1;

    .admin-child-main{
      width: 100%;
      height: 100%;
      padding: 60px 40px 40px 40px;
      padding-right: 0;
      overflow: scroll;
      box-sizing: border-box;

      .admin-child-c{
        min-width: 990px;
        height: 100%;
        padding-right: 40px;
        box-sizing: border-box;
        z-index: 0;
      }
    }

    .admin-child-main::-webkit-scrollbar{
      width: 6px;
      height: 6px;
      background-color: rgba(255, 255, 255, 0);
    }

    .admin-child-main::-webkit-scrollbar-thumb{
      background: rgba(12, 39, 57, .3);
      border-radius: 10px;
    }
  }

  .sh-down-lr{
    position:relative;
  } 

  .sh-down-lr:before, .sh-down-lr:after{ 
    z-index: -1; 
    position: absolute; 
    content: ""; 
    bottom: 15px; 
    left: 10px; 
    width: 50%;
    height: 10px;
    bottom: 80px; 
    max-width:300px; 
    background: #fff;
    -webkit-box-shadow: 0 15px 10px #777; 
    -moz-box-shadow: 0 15px 10px #777; 
    box-shadow: 0 15px 10px #777; 
    -webkit-transform: rotate(-3deg); 
    -moz-transform: rotate(-3deg); 
    -o-transform: rotate(-3deg); 
    -ms-transform: rotate(-3deg); 
    transform: rotate(-3deg); 
  }

  .sh-down-lr:after{ 
    -webkit-transform: rotate(3deg); 
    -moz-transform: rotate(3deg); 
    -o-transform: rotate(3deg); 
    -ms-transform: rotate(3deg); 
    transform: rotate(3deg); 
    right:10px; 
    left:auto; 
  }

  .no-authority-wrap{
    padding: 150px 0;
    background: #fff;

    p{
      color: #999;
      font-size: 15px;
      margin-top: 15px;
    }
  }
}
</style>

<style lang="less">
.admin-childlayout-wrap{

  .slide-nav-wrap{

    /* -------------------- { 导航组件 } -------------------- */
    .el-menu{
      color: #fff;
      border-right: 0;
      background: none;

      .el-menu-item-group__title{
        display: none;
      }

      .icon{
        color: #56ade8;
        fill: #56ade8;
        width: 24px;
        height: 24px;
        font-size: 18px;
        margin: 0 5px 0 50px;
      }

      .el-submenu{
        text-align: left;
        border-left: 4px solid #1e3a4d;
        border-bottom: 1px solid #1b3445;
        margin-top: -1px;
      }

      .el-submenu__title{
        color: #fff;
        padding: 0 !important;

        .el-submenu__icon-arrow{
          font-size: 16px;
        }
      }

      .el-submenu__title:hover{
        background: #193141 !important;
      }

      .el-menu-item{
        color: #fff;
        padding-left: 85px !important;
        opacity: .6;
        background: none;

        .icon{
          width: 18px;
          height: 18px;
          margin-left: 0;
        }
      }

      .active{
        .el-menu-item{
          opacity: 1;
          background: #193141 !important;
        }
      }

      .el-menu-item:hover, .el-menu-item.is-active{
        opacity: 1;
        background: #193141 !important;
      }

      .el-submenu.is-opened{
        color: #fff;
        border-top: 1px solid #132532;
        border-left: 4px solid #56ade8;
        border-bottom: 0;
        background: #182e3e;

        .icon{
          color: #fff;
          fill: #fff;
        }
        
        .el-menu-item{
          background: #1b3445;
          border-bottom: 1px solid #132532;
        }
      }
    }
  }
}
</style>
