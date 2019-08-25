<template>
  <div class="home">
    <div class="set-site"></div>
    <div class="home-header">
      <div class="home-header-left">
        <img src="../../static/images/logo.jpg">
        <div>我 为 您 旅 行 服 务 而 骄 傲！</div>
      </div>
      <div class="home-header-search">
        <el-autocomplete
          class="inline-input"
          v-model="keyword"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect"
          width="380"
        ></el-autocomplete>
        <div class="search-btn">
          <i class="iconfont el-icon-search"></i>
        </div>
      </div>
      <div class="home-header-right">
        <img src="../../static/images/phone.png"/>
        <div class="phone-num">
          <div>24小时客户咨询</div>
          <div>4006-888-xxx</div>
        </div>
      </div>
    </div>
    <div class="home-menu">
      <div class="product-category">产品分类</div>
      <div class="menus">
        <div class="menu-container" v-for="(menu, pIndex) in menus" :key="pIndex">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="menuSelect">
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
      <div>服务热线：4006-888-878      公司地址：上海普陀区光新路88号中一国际商务大厦18F</div>
      <div>Copyright @ 2018    沪ICP备18040379号      万游商旅 版权所有</div>
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
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" }
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
      display: flex;
      justify-content: space-around;
      .home-header-left {
        div {
          color: #CCCCCC;
          font-size: 14px;
        }
      }
      .home-header-search {
        width: 460px;
        display: flex;
        margin-top: 20px;
        .inline-input {
          width: 380px;
          /deep/ input {
            border-radius: 3px 0 0 3px;
          }
        }
        .search-btn {
          width: 80px;
          height: 40px;
          background: #2577e3;
          border-radius: 0 3px 3px 0;
          .iconfont {
            font-size: 27px;
            color: #fff;
            line-height: 40px;
            margin-left: 20px;
          }
        }
      }
      .home-header-right {
        display: flex;
        margin-top: 13px;
        img {
          width: 47px;
          height: 43px;
        }
        .phone-num {
          margin-left: 10px;
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
      display: flex;
      .product-category {
        width: 210px;
        background: rgb(255,153,0) none no-repeat left top;
        padding: 13px 18px;
        font-size: 18px;
        font-weight: 400;
        color: #fff;
        margin-left: 200px;
        text-align: center;
      }
      .menus {
        display: flex;
        font-size: 16px;
        .menu-container {
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