<template>
  <div class="partnerUpgrad">
    <!--tabBar-->
    <div class="partnerUpgrad-tab">
      <ul>
        <template v-for="(item, index) in tabBar">
          <li :class="tabBarIndex == index ? 'active' : ''" @click="tabBarTap(index, item.compent, item.name)">{{item.name}}</li>
        </template>
      </ul>
    </div>
    <component :is='currentView'></component>
  </div>
</template>
<script>
  import partnerUpgrad from './partnerUpgrad' // 合伙人升级
  import myAppliy from './myAppliy' // 我的申请
  export default {
    components: {
      partnerUpgrad,
      myAppliy
    },
    data () {
      return {
        currentView: localStorage.getItem('compent') ? localStorage.getItem('compent') : 'partnerUpgrad', // 默认合伙人升级组件
        tabBar: [{                                                  // tabBar
          compent: 'partnerUpgrad',
          name: '合伙人升级'
        },
        {
          compent: 'myAppliy',
          name: '我的申请'
        }],
        tabBarIndex: localStorage.getItem('partnerIndex') ? localStorage.getItem('partnerIndex') : 0 // tabBarIndex
      }
    },
    mounted: function () {
      document.title = localStorage.getItem('partnerTitle')
    },
    methods: {
      /**
       * tabBar点击
      */
      tabBarTap (index, compent, name) {
        this.tabBarIndex = index
        localStorage.setItem('partnerIndex', index) // 存储索引
        localStorage.setItem('compent', compent) // 存储组件
        localStorage.setItem('partnerTitle', name) // 存储title
        this.currentView = compent
        document.title = name
      }
    }
  }
</script>
<style scoped lang=less>
  .partnerUpgrad{
    .partnerUpgrad-tab{
      height:1.41rem;
      display:flex;
      align-items:center;
      background:#fff;
      border-bottom:.3rem solid #eeeeee;
      ul{
        display:flex;
        width:7.07rem;
        height:.87rem;
        border:1px solid #f95a58;
        margin:0 auto;
        line-height:.87rem;
        border-radius:5px;
        li{
          flex:1;
          text-align:center;
          color:#f95a58;
          font-size:.26rem;
          &.active{
            background:#f95a58;
            color:#fff;
          }
        }
      }
    }
  }
</style>