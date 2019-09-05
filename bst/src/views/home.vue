<template>
  <div class="home">
    <div class="set-site">
      <!-- <a id="SetHome" href="javascript:" onclick="_g.setHomeIfNecessary(false)" style="behavior: url(#default#homepage)">设为首页</a>    <em>|</em><a href="#" onclick="AddFavorite(window.location,document.title)">加入收藏</a>    <em>|</em><a  href="/self_define/guest_book.php?username=wanyouair">在线留言</a>    <em>|</em><a  target="target"  href="/self_define/phone.php?username=wanyouair">手机站</a> -->
    </div>
    <div class="home-header">
      <div class="home-header-left">
        <img :src="`${$config.rootPath}logo.png`">
        <div>我 为 您 旅 行 服 务 而 骄 傲！</div>
      </div>
      <div class="home-header-search">
        <el-autocomplete
          class="inline-input"
          v-model="keyword"
          :fetch-suggestions="querySearch"
          placeholder="贝斯特国际"
          @select="handleSelect"
          width="380"
        ></el-autocomplete>
        <div class="search-btn">
          <i class="iconfont el-icon-search"></i>
        </div>
      </div>
      <div class="home-header-right">
        <img :src="`${$config.rootPath}phone.png`"/>
        <div class="phone-num">
          <div>24小时客户咨询</div>
          <div>13538048630</div>
        </div>
      </div>
    </div>
    <div class="home-menu">
      <div class="product-category" @click="toList()">产品分类</div>
      <div class="menus">
        <div class="menu-container" v-for="(menu, pIndex) in menus" :key="pIndex">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="menuSelect"
          :class="activeIndex == pIndex ? 'is-active' : ''">
            <el-submenu v-if="menu.child && menu.child.length > 0" :index="`${pIndex}`">
              <template slot="title">{{menu.title}}</template>
              <el-menu-item :index="`${pIndex}-${cIndex}`" v-for="(child, cIndex) in menu.child" :key="cIndex">{{child.title}}</el-menu-item>
            </el-submenu>
            <el-menu-item :index="`${pIndex}`" v-else>{{menu.title}}</el-menu-item>
          </el-menu>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <Footer></Footer>
    <div class="site-info">
      <div>服务热线：13538048630      公司地址：深圳市龙岗区龙岗街道新生社区锦城星苑</div>
      <div>Copyright @ 2018    贝斯特国际商务</div>
    </div>
  </div>
</template>

<script>
import Footer from '@/views/components/footer.vue';
export default {
  data() {
    return {
      keyword: '',
      restaurants: [],
      activeIndex: '0',
      menus: [
        {
          title: '首页'
        },
        {
          title: '国际机票',
          child: [{title: '美洲'}, {title: '欧洲'}, {title: '澳洲'}, {title: '亚洲'}]
        },
        {
          title: '机票信息',
          child: [{title: '美洲机票信息'}, {title: '欧洲机票信息'}, {title: '澳洲机票信息'}]
        }, {
          title: '服务优势'
        }, {
          title: '新闻动态',
          child: [{title: '公司新闻'}, {title: '行业新闻'}, {title: '常见问题'}]
        }, {
          title: '关于我们'
        }, {
          title: '联系我们'
        }
      ]
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    handleSelect(item) {
      
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
       
      ];
    },
    menuSelect(key, keyPath) {
      console.log(key, keyPath);
      const links = [
        {id: '0', path: '/index'},
        {id: '1', path: '/airTicketsList'},
        {id: '2', path: '/airTicketsInfo'},
        {id: '3', path: '/service'},
        {id: '4', path: '/news'},
        {id: '5', path: '/about'},
        {id: '6', path: '/concat'}
      ]
      if (key && key.indexOf('-') === -1) {
        let link = links.filter(lin => lin.id === key);
        if (link && link.length > 0)
        this.$router.push({ path:  link[0].path});
      } else {
        let link = links.filter(lin => lin.id === key.split('-')[0]);
        if (link && link.length > 0)
        this.$router.push({ path:  `${link[0].path}/${key.split('-')[1]}` });
      }
    },
    toList() {
      this.$router.push({ path: `/airTicketsList/0` });
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  components: {
    Footer
  }
}
</script>

<style lang="less">
.home {
  .home-menu {
    .el-submenu__icon-arrow {
      display: none;
    }
    .is-active {
      background-color: #0096ff !important;
    }
  }
}
</style>
<style lang="less" scoped>
  .home {
    overflow: auto;
    height: 100%;
    .set-site {
      height: 30px;
      background: #f5f5f5;
    }
    .home-header {
      width: 1200px;
      margin: auto;
      .home-header-left {
        display: inline-block;
        img {
          width: 195px;
          height: 67px;
        }
        div {
          color: #CCCCCC;
          font-size: 14px;
        }
      }
      .home-header-search {
        width: 460px;
        display: inline-block;
        margin-left: 100px;
        margin-bottom: 10px;
        .inline-input {
          width: 380px;
          /deep/ input {
            border-radius: 3px 0 0 3px;
          }
          float: left;
        }
        .search-btn {
          width: 80px;
          height: 40px;
          background: #2577e3;
          border-radius: 0 3px 3px 0;
          float: right;
          .iconfont {
            font-size: 27px;
            color: #fff;
            line-height: 40px;
            margin-left: 20px;
          }
        }
      }
      .home-header-right {
        float: right;
        margin-top: 30px;
        img {
          width: 47px;
          height: 43px;
          display: inline-block;
        }
        .phone-num {
          margin-left: 10px;
          display: inline-block;
          div:nth-child(1) {
            font-family: 微软雅黑;
            font-size: 14px;
            color: #A9A9A9;  
            font-weight: 400;
          }
          div:nth-child(2) {
            font-size: 20px;
            color: #FF9913;
            font-family: 微软雅黑;
          }
        }
      }
    }
    .home-menu {
      height: 45px;
      background-color: #2577e3;
      margin-top: 10px;
      width: 100%;
      .product-category {
        width: 210px;
        background: rgb(255,153,0) none no-repeat left top;
        padding: 13px 18px;
        font-size: 18px;
        font-weight: 400;
        color: #fff;
        margin-left: 200px;
        text-align: center;
        float: left;
        cursor: pointer;
      }
      .menus {
        float: left;
        margin-left: 165px;
        font-size: 16px;
        .menu-container {
          display: inline-block;
          ul {
            width: 100px;
            height: 45px;
            background: #2577e3;
            li {
              height: 100%;
              color: #fff;
              font-size: 16px;
              line-height: 45px;
              /deep/ .el-submenu__title {
                height: 100%;
                color: #fff;
                font-size: 16px;
                line-height: 45px;
              }
              /deep/ .el-submenu__title:hover {
                background-color: #0096ff;
              }
            }
            li:hover {
              background-color: #0096ff;
            }
          }
        }
      }
    }
    .site-info {
      margin-top: 40px;
      text-align: center;
      div:nth-child(1) {
        font-size: 14px;
        color: rgb(127, 127, 127);
      }
      div:nth-child(2) {
        padding-bottom: 10px;
        font-family: "Microsoft YaHei";
        word-spacing: -1.5px;
        color: rgb(127, 127, 127);
      }
    }
  }
</style>