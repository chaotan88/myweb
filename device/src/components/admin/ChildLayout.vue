<template>
  <div :class="leftHide ? 'admin-childlayout-wrap-left-hide' : 'admin-childlayout-wrap'">
    <div class="pos-a slide-nav-wrap" v-if="!leftHide">
      <template v-for="item in childRouter">
        <router-link class='d-b' :to="item.path" v-if="item.meta.menuCode && menuData.indexOf(item.meta.menuCode) !== -1"
          :title="$t(item.meta.nav)">
          <i class="d-ib" :class='item.meta.icon'></i>
          {{$t(item.meta.nav)}}
        </router-link>
      </template>
    </div>
    <div class="left-show" v-if="!leftHide" @click="leftHide = !leftHide" title="hide">
      <img src="../../../static/img/left-arrow.png"/>
    </div>
    <div class="left-hide" v-else @click="leftHide = !leftHide" title="show">
      <img src="../../../static/img/right-arrow.png"/>
    </div>
    <div class="admin-child-cen">
      <!-- <breadcrumb></breadcrumb> -->
      <div class="pos-f d-b mask-wrap"></div>
      <div class="pos-r admin-child-main">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'

export default {
  components: { Breadcrumb },
  props: {
    menuData: {
      type: Array
    }
  },
  data () {
    return {
      childRouter: [],             // 侧边栏 - 子路由
      leftHide: false
    }
  },
  mounted () {
    this.routerChange()
  },
  watch: {
    '$route' () {
      this.routerChange()
    }
  },
  methods: {
    /**
     * 路由改变动态显示侧边导航栏
     */
    routerChange () {
      let adminRouter = this.$router.options.routes.filter((row) => row.path === '/admin')[0].children
      let curPath = this.$route.path
      let splitPath = curPath.charAt(0) === '/' ? curPath.slice(1).split('/') : curPath.split('/')
      let filterPath = [splitPath[0], '/', splitPath[1]].join('')
      this.childRouter = adminRouter.filter((row) => row.path.match(filterPath))[0].children
    }
  }
}
</script>

<style lang='less' scoped>
.admin-childlayout-wrap, .admin-childlayout-wrap-left-hide{
  height: 100%;
  padding-left: 210px;
  background: #f0f0f0;
  position: relative;
  .mask-wrap{
    width: 100%;
    height: 70px;
    background: #f0f0f0;
    top: 80px;
    left: -20px;
    z-index: 2;
  }

  .slide-nav-wrap{
    width: 210px;
    height: 100%;
    padding: 20px 0;
    background: #fff;
    left: 0;
    z-index: 5;
    box-sizing: border-box;
    box-shadow: 0 0 16px rgba(0, 0, 0, .05);

    a{
      color: #367299;
      height: 60px;
      line-height: 60px;
      font-size: 16px;
      border-left: 4px solid #fff;
      padding-left: 35px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      i{
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 24px;
        vertical-align: -4px;
        margin-right: 5px;
      }
    }

    a.active{
      border-left: 4px solid #33719b;
      background: #d6e3ea;
    }

    /* -------------------- { 导航小图标 } ---------- */
    /*1.控制台*/
    .console-icon{
      background: url(../../../static/img/icons.png) no-repeat 0 0 ;
    }
    .console-icon2{
      background: url(../../../static/img/icons.png) no-repeat -26px 2px ;
    }
    .console-icon3{
      background: url(../../../static/img/icons.png) no-repeat -50px -0 ;
    }
    /*2.设置*/
    .seting-icon1{
      background: url(../../../static/img/icons.png) no-repeat -379px -0 ;
    }
    .seting-icon2{
      background: url(../../../static/img/icons.png) no-repeat -25px -0 ;
    }
    .seting-icon3{
      background: url(../../../static/img/icons.png) no-repeat -478px -0 ;
    }
    /*3.合作*/
    .cooperation-icon1{
      background: url(../../../static/img/icons.png) no-repeat -406px -0 ;
    }
    /*4.终端*/
    .terminal-icon1{
      background: url(../../../static/img/icons.png) no-repeat -74px -0 ;
    }
    .terminal-icon2{
      background: url(../../../static/img/icons.png) no-repeat -98px -0 ;
    }
    .terminal-icon3{
      background: url(../../../static/img/icons.png) no-repeat -120px -0 ;
    }
    .terminal-icon4{
      background: url(../../../static/img/icons.png) no-repeat -145px -0 ;
    }
    .terminal-icon5{
      background: url(../../../static/img/icons.png) no-repeat -430px -0 ;
    }
    .terminal-icon6{
      background: url(../../../static/img/icons.png) no-repeat -170px -0 ;
    }
    .terminal-icon7{
      background: url(../../../static/img/icons.png) no-repeat -455px -0 ;
    }
    .Order-icon{
      background: url(../../../static/img/icons.png) no-repeat -286px -0 ;
    }
    .operate-icon1{
      background: url(../../../static/img/icons.png) no-repeat -310px -0 ;
    }
    .operate-icon2{
      background: url(../../../static/img/icons.png) no-repeat -330px -0 ;
    }
     .advertising-icon1{
      background: url(../../../static/img/icons.png) no-repeat -190px -0 ;
    }
     .advertising-icon2{
      background: url(../../../static/img/icons.png) no-repeat -215px -0 ;
    }
     .advertising-icon3{
      background: url(../../../static/img/icons.png) no-repeat -239px -0 ;
    }
    .advertising-icon4{
      background: url(../../../static/img/icons.png) no-repeat -264px -0 ;
    }
    .vip-icon{
      background: url(../../../static/img/icons.png) no-repeat -353px -0 ;
    }
  }

  .admin-child-cen{
    width: 100%;
    height: 100%;
    padding: 0 30px 30px 30px;
    overflow-y: auto;
    box-sizing: border-box;

    .admin-child-main{
      margin-top: 70px;
    }
  }
  .left-show, .left-hide {
    background: #fff;
    position: absolute;
    top: 50%;
    cursor: pointer;
  }
}
.admin-childlayout-wrap-left-hide {
  padding-left: 0px;
}
</style>

<style lang='less'>
.admin-childlayout-wrap, .admin-childlayout-wrap-left-hide{
  .el-pagination{
    text-align: center;
    padding: 20px 0;

    .btn-prev, .btn-next, .number{
      min-width: 28px;
      margin: 0 5px;
    }

    .btn-prev, .btn-next{
      border: 1px solid #e6e9ed;
      padding-left: 0;
      padding-right: 0;
      margin: 0 6px;
    }

    .btn-prev:hover, .btn-next:hover{
      color: #da251d;
    }

    .btn-prev.disabled, .btn-next.disabled{
      color: #ccc;
    }

    .number{
      color: #666;
      font-weight: normal;
      border: 1px solid #e6e9ed;
    }

    .number:hover{
      color: #da251d;
    }

    .number.active{
      color: #fff;
      background: #da251d;
    }
  }
}
</style>
