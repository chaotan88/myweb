<template>
  <div  v-if="searchType == '1' || searchType == '3' || !searchType">
    <div class="serch-top">
      <div class="serch-top-left">
        <x-icon type="ios-search" size="0.4rem" class="serch-ico"></x-icon>
        <!--判断是搜索页还是跳到搜索页-->
        <template v-if="serchType == 'goSerchPage'">
          <!-- <div class="ProhibitInput" @click="goSearchPage">{{serchVal}}</div> -->
          <input type="text" :value="serchVal" @click="goSearchPage" readonly unselectable="on" onfocus="this.blur()">
        </template>
        <template v-else>
          <input type="text" placeholder="输入商品名称" v-model="serchTxt" @keyup.enter="serchResult($event, 1)">
        </template>
        <x-icon type="ios-close" size="0.35rem" class="serch-close" v-if="serchTxt.length > 0 || serchVal" @click="clearResclearRes"></x-icon>
      </div>
      <!--判断是搜索页还是跳到搜索页-->
      <template v-if="serchType == 'goSerchPage'">
        <div class="serch-top-right" @click="goSearchPage">{{rightTxt}}</div>
      </template>
      <template v-else>
        <div class="serch-top-right" @click="serchResult($event, 1)">{{rightTxt}}</div>
      </template>    
    </div>
    <div class="serchD"></div>
  </div>
</template>

<script>
    export default {
      /**
       * @serchType  判断是否是搜索点击跳到搜索页
       * @serchVal   搜索页输入或点击关键字 进入结果页，结果页展示搜索的关键字
       * @searchType 判断搜索的类型，搜索页点击进入的结果页显示(顶部的搜索栏目) 其他点击进去的不显示
       * @rightTxt   右侧文字显示(取消还是搜索或其他) 默认 '搜索'
      */
      props: {
        serchType: {
          type: String,
          default: ''
        },
        serchVal: {
          type: String,
          default: ''
        },
        searchType: {
          type: [String, Number],
          default: ''
        },
        rightTxt: {
          type: String,
          default: '搜索'
        }
      },
      data () {
        return {
          serchTxt: '' // 输入的文字
        }
      },
      mounted: function () {
        this.serchTxt = this.$route.query.goodsName || ''
      },
      methods: {
        /**
         * 搜索结果
        */
        serchResult (event, num) {
          // 搜索按钮点击或历史记录点击不为页面返回
          localStorage.setItem('noPageBack', 'y')
          let goodsName = ''
          goodsName = num === 1 ? this.serchTxt : num === 2 ? event.currentTarget.innerHTML : ''
          goodsName = goodsName.replace(/(^\s*)|(\s*$)/g, '')
          var userId
          if (localStorage.getItem('bsbUserInfo')) {
            userId = JSON.parse(localStorage.getItem('bsbUserInfo')).userId.toString()
          } else {
            userId = 'tourist'   // 游客
          }
          // 历史记录
          var historyData = JSON.parse(localStorage.getItem(userId)) ? JSON.parse(localStorage.getItem(userId)) : []
          if (historyData && historyData.length > 0) {
            if (historyData.indexOf(goodsName) > -1) {
              let i = historyData.indexOf(goodsName)
              historyData.splice(i, 1)
            }
            if (goodsName) {
              historyData.unshift(goodsName)
            }
          } else {
            if (goodsName) {
              historyData.push(goodsName)
            }
          }
          localStorage.setItem(userId, JSON.stringify(historyData))
          // 路由跳转
          this.$router.push({name: 'goodList', query: {searchType: 1, goodsName: goodsName}})
        },
        /**
         * 清除搜索结果
        */
        clearResclearRes () {
          this.serchTxt = ''
          this.$router.push('/serch')
        },
        /**
         * 跳转到搜索页
        */
        goSearchPage () {
          // 存储路由 解决返回多层级问题
          if (this.$route.path === '/classification') {
            localStorage.setItem('goSerchPath', this.$route.fullPath)
          }
          // localStorage.getItem('goSerchPath')
          this.$router.push({name: 'serch', query: {goodsName: this.serchVal}})
        }
      }
    }
</script>

<style scoped lang=less>
.serchD{
  height: 1rem;
}
.serch-top{
  height: 1rem;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  padding:0 0 0 .22rem;
  position: fixed;
  top:0;
  background: #fff;
  width: 7.5rem;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom:1px solid #eee;
  z-index: 3000;
  .serch-top-left{
    background: #eeeeee;
    border-radius: 20px;
    height: .6rem;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    flex: 1;
    .serch-ico{
      fill: #a3a3a3;
      margin-left: .37rem;
      margin-right: .11rem;
    }
    input,.ProhibitInput{
      height: .6rem;
      background: none;
      flex: 1;
      color: #9c9c9c;
      font-size: .24rem;
      line-height: .6rem;
      overflow-x: scroll;
    }
    .ProhibitInput{
      overflow: hidden;
    }
    .ProhibitInput::-webkit-scrollbar{width:0px;display: none;}
    input::-webkit-input-placeholder{
      color:#9c9c9c;
    }
    .ProhibitInput:empty::before{
      content: '输入商品名称'      
    }
    .serch-close{
      fill: #999999;
      margin-right: .25rem;
    }
  }
  .serch-top-right{
    width: 1.1rem;
    font-size: .28rem;
    color: #999999;
    text-align: center;
    height: .6rem;
    line-height: .6rem;
  }
}
</style>
