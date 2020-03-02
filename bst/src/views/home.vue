<template>
  <div class="home">
    <div class="set-site">
      <!-- <a id="SetHome" href="javascript:" onclick="_g.setHomeIfNecessary(false)" style="behavior: url(#default#homepage)">设为首页</a>    <em>|</em><a href="#" onclick="AddFavorite(window.location,document.title)">加入收藏</a>    <em>|</em><a  href="/self_define/guest_book.php?username=wanyouair">在线留言</a>    <em>|</em><a  target="target"  href="/self_define/phone.php?username=wanyouair">手机站</a> -->
    </div>
    <div class="home-header">
      <div class="home-header-left">
        <img :src="`${$config.rootPath}logo.png`">
        <div>为您旅行服务，是我的不懈追求！</div>
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
          <div>{{$config.phone}}</div>
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
      <div>服务热线：{{$config.phone}}      公司地址：{{$config.address}}</div>
      <div>
        <span>Copyright © 2019-2020 {{$config.companyName}}</span>
        <span style="cursor: pointer; margin-left: 10px" @click="toBeian()">粤ICP备19115371号-1</span></div>
    </div>
    <div class="concat-tips">
      <!-- <el-dialog
        title="在线客服"
        :visible.sync="qqShow"
        width="30%"
        :modal="false">
        <span>这是一段信息</span>
      </el-dialog> -->
      <div @click="concatShow = true">
        <img :src="`${$config.rootPath}/iconBack10.png`"/>
        <img :src="`${$config.rootPath}/iconWord2.png`"/>
        <!-- <a target="_blank" :href="`http://wpa.qq.com/msgrd?v=3&amp;uin=${$config.qq1}&amp;site=qq&amp;menu=yes`">
          <img border="0" :src="`http://wpa.qq.com/pa?p=2:${$config.qq1}:51 alt='点击这里给我发消息' title='点击这里给我发消息'`">
        </a> -->
      </div>
    </div>
    <el-dialog
      title="在线客服"
      :visible.sync="concatShow"
      width="40%"
      :modal="false">
      <div class="concat-dialog">
        <div class="first-line">
          <div class="wechart-img">
            <img :src="`${$config.rootPath}concat-wechart1.jpg`"/>
            <div>官方微信1</div>
          </div>
          <div class="wechart-img">
            <img :src="`${$config.rootPath}concat-wechart2.jpg`"/>
            <div>官方微信2</div>
          </div>
        </div>
        <div class="second-line">
          <div><a target="_blank" :href="`http://wpa.qq.com/msgrd?v=3&amp;uin=${$config.qq1}&amp;site=qq&amp;menu=yes`">
            <img border="0" :src="`http://wpa.qq.com/pa?p=2:${$config.qq1}:51 alt='点击这里给我发消息' title='点击这里给我发消息'`">
          </a></div>
          <div class="phone">
            <span>联系电话: </span>
            <span>{{$config.phone}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Footer from '@/views/components/footer.vue';
import {airs} from '@/views/datas/airData';

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
        // {
        //   title: '机票信息',
        //   child: [{title: '美洲机票信息'}, {title: '欧洲机票信息'}, {title: '澳洲机票信息'}]
        // },
        {
          title: '服务优势'
        }, {
          title: '新闻动态',
          child: [{title: '公司新闻'}, {title: '行业新闻'}, {title: '常见问题'}]
        }, {
          title: '关于我们'
        }, {
          title: '联系我们'
        }
      ],
      qqShow: false,
      concatShow: false
    }
  },
  created() {
    const IsPC = () => {    
      let userAgentInfo = navigator.userAgent;  
      let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");    
      let flag = true;    
      for (let v = 0; v < Agents.length; v++) {    
          if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }    
      }    
      return flag;    
    }
    if (!IsPC()) this.$router.push({path: '/moblie'});
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      if (results.length > 10) {
        results = results.splice(0, 10)
        results.forEach(da => {
          da.value = da.name
        })
      }
      cb(results);
    },
    handleSelect(item) {
      sessionStorage.setItem('air_detail', JSON.stringify(item));
      this.$router.push({ path: '/airDetail' });
    },
    createFilter(queryString) {
      return (restaurant) => {
        return ((restaurant.to.indexOf(queryString.toLowerCase()) !== 0)
        || (restaurant.from.indexOf(queryString.toLowerCase()) !== 0)
        || (restaurant.name.indexOf(queryString.toLowerCase()) !== 0));
      };
    },
    // loadAll() {
    //   return [
       
    //   ];
    // },
    menuSelect(key, keyPath) {
      console.log(key, keyPath);
      const links = [
        {id: '0', path: '/index'},
        {id: '1', path: '/airTicketsList'},
        // {id: '2', path: '/airTicketsInfo'},
        {id: '2', path: '/service'},
        {id: '3', path: '/news'},
        {id: '4', path: '/about'},
        {id: '5', path: '/concat'}
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
    },
    showConcat() {

    },
    toBeian() {
      window.open('http://www.beian.miit.gov.cn/');
    }
    // executeSearch() {
    //   if (!this.keyword) return false
    //   let searchData = airs.filter(da => (da.from.indexOf(this.keyword) !== -1 || da.to.indexOf(this.keyword) !== -1))
    //   if (searchData && searchData.length > 0) {
    //     this.restaurants = searchData;
    //   }
    // }
  },
  mounted() {
    this.restaurants = airs
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
    height: 100%;
    min-width: 1300px;
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
          cursor: pointer;
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
  .concat-tips {
    position: fixed;
    right: 20px;
    top: 50%;
    width: 140px;
    height: 50px;
    margin-left: -68px;
    margin-top: -25px;
    background: #4587e8;
    cursor: pointer;
    border-radius: 3px;
    z-index: 999;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
      img:nth-child(1) {
        height: 50px;
      }
      img:nth-child(2) {
        height: 30px;
        margin-top: 10px;
      }
      a {
        position: absolute;
        opacity: 0;
        z-index: 100;
      }
    }
  }
  .concat-dialog {
    .first-line {
      display: flex;
      justify-content: space-around;
    }
    .second-line {
      display: flex;
      justify-content: flex-start;
      padding: 0 20px;
      .phone {
        margin-left: 200px;
      }
    }
    .wechart-img {
      margin-right: 20px;
      margin-bottom: 20px;
      img {
        width: 200px;
        height: 200px;
      }
      div {
        text-align: center;
      }
    }
  }
</style>