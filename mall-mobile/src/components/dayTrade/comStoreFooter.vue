<template>
  <div>
    <div class="storeFooter">
      <ul>
        <li v-for="(item, index) in tabList" :key="index" @click="tabFoot(item.path)">
          <img :src="item.img1" v-if="item.path !== tabIndex"/>
          <img :src="item.img2" v-else />
          <div v-if="item.path !== tabIndex">{{item.title}}</div>
          <div v-else style="color: #fd4245;">{{item.title}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'ComStoreFooter',
      data () {
        return {
          tabIndex: '',
          asd: false,
          tabList: [
            {
              path: '/shoppingSpree',
              img1: require('../../assets/images/shopLucky01/qg.png'),
              img2: require('../../assets/images/shopLucky01/qg-act.png'),
              title: '抢购'
            },
            {
              path: '/wholesalGoods',
              img1: require('../../assets/images/shopLucky01/pf.png'),
              img2: require('../../assets/images/shopLucky01/pf-act.png'),
              title: '批发'
            },
            {
              path: '/shopSellGoods',
              img1: require('../../assets/images/shopLucky01/ck.png'),
              img2: require('../../assets/images/shopLucky01/ck-act.png'),
              title: '仓库'
            },
            {
              path: '/my',
              img1: require('../../assets/images/shopLucky01/wd.png'),
              img2: require('../../assets/images/shopLucky01/wd-act.png'),
              title: '我的'
            }
          ]
        }
      },
      watch: {

      },
      methods: {
        tabFoot (path) {
          this.tabIndex = path
          if (path === '/shoppingSpree') {
            this.$router.push({path: '/shopLuckyStrike', query: {pageId: 7}})
          } else if (path === '/wholesalGoods') {
            this.$router.push({path: '/shopLuckyStrike', query: {pageId: 8}})
          } else if (path === '/my') {
            this.$router.push({path: path, query: {isShop: true}})
          } else {
            var bsbUserInfo = JSON.parse(localStorage.getItem('bsbUserInfo'))
            if (bsbUserInfo && bsbUserInfo.token) {
              this.$router.push({path: path})
            } else {
              localStorage.setItem('REDIRECT_URL', '/shopSellGoods')
              this.$router.push({
                path: '/login',
                query: {redirect: '/shopSellGoods'}
              })
            }
          }
          this.checkOut()
        },
        checkOut () {
          var titel = this.$route.path
          if (titel === '/shopLuckyStrike') {
            var i = parseInt(this.$route.query.pageId)
            this.tabIndex = i === 7 ? '/shoppingSpree' : i === 8 ? '/wholesalGoods' : '/shoppingSpree'
          } else {
            this.tabIndex = titel
          }
        }
      },
      mounted: function () {
      },
      created () {
        this.checkOut()
      },
      components: {
      }
    }
</script>

<style lang="less" scoped>
.storeFooter{
  width: 100%;
  background: #fff;
  position: fixed;
  bottom: 0;
  z-index: 200;
  box-shadow: 0px -2px 10px #efefef;
  ul{
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    li{
      text-align: center;
      font-size: .24rem;
      color: #b7b6b9;
      img{
        width: .45rem;
        height: .45rem;
        margin-top: 0.08rem;
      }
    }
  }
}
</style>
