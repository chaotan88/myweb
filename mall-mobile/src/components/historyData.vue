<template>
  <div class="history" v-if="historyData && historyData.length > 0">
    <h2>历史记录</h2>
    <ul>
      <li v-for="(item, index) in historyData" @click="serchRightResult($event)" v-if="index < 12">{{item}}</li>
    </ul>
    <div class="close-history" @click="clearHistory">清空历史记录</div>
  </div>
</template>
<script>
  export default {
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
    },
    created: function () {
      this.$vm.$on('storageHistory', (key) => {
        this.storageHistory(key)
      })
    },
    methods: {
      /**
       * 存储历史记录
       * @key 要存储的数据内容
      */
      storageHistory (key) {
        let searchField = ''
        searchField = key
        searchField = searchField.replace(/(^\s*)|(\s*$)/g, '')
        var userId
        if (localStorage.getItem('bsbUserInfo')) {
          userId = JSON.parse(localStorage.getItem('bsbUserInfo')).userId.toString()
        } else {
          userId = 'tourist'   // 游客
        }
        // 历史记录
        var historyData = JSON.parse(localStorage.getItem(userId)) ? JSON.parse(localStorage.getItem(userId)) : []
        if (historyData && historyData.length > 0) {
          if (historyData.indexOf(searchField) > -1) {
            let i = historyData.indexOf(searchField)
            historyData.splice(i, 1)
          }
          if (searchField) {
            historyData.unshift(searchField)
          }
        } else {
          if (searchField) {
            historyData.push(searchField)
          }
        }
        localStorage.setItem(userId, JSON.stringify(historyData))
      },
      /**
       * 搜索结果
      */
      serchRightResult (event) {
        this.storageHistory(event.currentTarget.innerHTML)
        this.$emit('serchRightResult', event.currentTarget.innerHTML)
      },
      /**
       * 清空历史记录
      */
      clearHistory () {
        localStorage.removeItem(this.userId)
        this.historyData = ''
      }
    }
  }
</script>
<style scoped lang=less>
  .history{
    background: #eeeeee;
    padding: .2rem;
    height: auto;
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
      background: url('../assets/images/delHistory.png') no-repeat;
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
</style>
