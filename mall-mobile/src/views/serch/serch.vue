<template>
  <div class="serch-box">
    <serch-header ref="comSerch" @serchRightResult="serchRightResult"></serch-header>
    <history-data @serchRightResult="serchRightResult"></history-data>
    <!-- <div class="history" v-if="historyData && historyData.length > 0">
      <h2>历史记录</h2>
      <ul>
        <li v-for="item in historyData" @click="Serch($event, 2)">{{item}}</li>
      </ul>
      <div class="close-history" @click="clearHistory">清空历史记录</div>
    </div> -->
  </div>
</template>
<script>
  import serchHeader from '../../components/serchHeader'       // 搜索
  import historyData from '../../components/historyData'   // 历史记录
  export default {
    components: {
      serchHeader,
      historyData
    },
    data () {
      return {
        userId: '',             // 用户id
        historyData: '',       // 历史记录
        serchTxt: ''           // 搜索的内容
      }
    },
    mounted: function () {
      if (localStorage.getItem('bsbUserInfo')) {
        this.userId = JSON.parse(localStorage.getItem('bsbUserInfo')).userId.toString() // 登录了的用户
      } else {
        this.userId = 'tourist'  // 游客
      }
      this.historyData = JSON.parse(localStorage.getItem(this.userId))
      localStorage.setItem('noPageBack', 'n') // 搜索按钮点击或历史记录点击不为页面返回
    },
    methods: {
      /**
       * 搜索结果跳转
      */
      serchRightResult (val) {
        this.$router.push({name: 'goodList', query: {searchType: 1, goodsName: val}})
      },
      /**
       * 搜索
      */
      Serch (event, num) {
        this.$refs.comSerch.serchResult(event, num)
      },
      /**
       * 清空历史记录
      */
      clearHistory () {
        localStorage.removeItem(this.userId)
        this.historyData = ''
      }
    }
    /**
     * 路由返回判断
    */
    // beforeRouteLeave (to, from, next) {
    //   next()
    //   var goSerchPath = localStorage.getItem('goSerchPath')
    //   if (localStorage.getItem('noPageBack') === 'n') {
    //     this.$router.push(goSerchPath)
    //   }
    // }
  }
</script>
<style scoped lang=less>
.serch-box{
  .serch-top{
    height: 1rem;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    padding:0 0 0 .22rem;
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
      input{
        height: .6rem;
        background: none;
        flex: 1;
        color: #9c9c9c;
        font-size: .24rem;
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
  .history{
    background: #eeeeee;
    padding: .2rem;
    height: 100%;
    overflow: hidden;
    h2{
      color: #3c3c3c;
      font-size: .26rem;
      margin-bottom: .29rem;
    }
    ul{
      height: 100%;
      overflow: hidden;
      li{
        width: 1.29rem;
        height: .45rem;
        background: #dddddd;
        border-radius: 5px;
        -webkit-border-radius: 5px;
        text-align: center;
        line-height: .45rem;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        color: #6c6c6c;
        font-size: .24rem;
        float: left;
        margin-right: .63rem;
        margin-bottom: .3rem;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
    }
    .close-history{
      width: 2.96rem;
      height: .46rem;
      display: flex;
      align-items: center;
      border: 1px solid #d6d6d6;
      background: url('../../assets/images/delHistory.png') no-repeat;
      background-size: .23rem .23rem;
      color:#6c6c6c;
      font-size:.24rem;
      background-position: .57rem center;
      padding-left: .98rem;
      margin:0 auto;
      box-sizing: border-box;
      margin-top:.2rem;
      margin-bottom: .2rem;
    }
  }
}
</style>
