<template>
  <div>
    <div class="hallManage-wrap">
      <ul class="list">
        <li @click="tabTap(1)" :class="tabIndex === 1 ? 'activeCss': ''">全部</li>
        <li @click="tabTap(2)" :class="tabIndex === 2 ? 'activeCss': ''">等待挂售</li>
        <li @click="tabTap(3)" :class="tabIndex === 3 ? 'activeCss': ''">已挂售</li>
        <li @click="tabTap(4)" :class="tabIndex === 4 ? 'activeCss': ''">已售出</li>
        <li @click="tabTap(5)" :class="tabIndex === 5 ? 'activeCss': ''">等待提货</li>
        <li @click="tabTap(6)" :class="tabIndex === 6 ? 'activeCss': ''">已提货</li>
        <li @click="tabTap(7)" :class="tabIndex === 7 ? 'activeCss': ''">抵扣售出</li>
      </ul>
      <hall-manage-all v-if="tabIndex === 1"></hall-manage-all>
      <hall-manage-waithall v-if="tabIndex === 2"></hall-manage-waithall>
      <hall-manage-hadhall v-if="tabIndex === 3"></hall-manage-hadhall>
      <hall-manage-hadsold v-if="tabIndex === 4"></hall-manage-hadsold>
      <hall-manage-waitgoods v-if="tabIndex === 5"></hall-manage-waitgoods>
      <hall-manage-alreadygoods v-if="tabIndex === 6"></hall-manage-alreadygoods>
      <hall-manage-hadsoldTo v-if="tabIndex === 7"></hall-manage-hadsoldTo>
    </div>
  </div>
</template>

<script>
  import hallManageAll from '../../components/dayTrade/hallManageAll'                       // 全部
  import hallManageWaithall from '../../components/dayTrade/hallManageWaithall'             // 等待挂售
  import hallManageHadhall from '../../components/dayTrade/hallManageHadhall'               // 已挂售
  import hallManageHadsold from '../../components/dayTrade/hallManageHadsold'               // 已售出
  import hallManageWaitgoods from '../../components/dayTrade/hallManageWaitgoods'           // 等待提货
  import hallManageAlreadygoods from '../../components/dayTrade/hallManageAlreadygoods'     // 已提货
  import hallManageHadsoldTo from '../../components/dayTrade/hallManageHadsoldTo'             // 抵扣售出
  export default {
    name: 'hallSellManagement',
    data () {
      return {
        tabIndex: 1
      }
    },
    watch: {
    },
    methods: {
      tabTap (index) {
        this.tabIndex = index
      }
    },
    mounted: function () {
    },
    created () {
    },
    components: {
      hallManageAll,
      hallManageWaithall,
      hallManageHadhall,
      hallManageHadsold,
      hallManageWaitgoods,
      hallManageAlreadygoods,
      hallManageHadsoldTo
    }
  }
</script>

<style lang="less" scoped>
.hallManage-wrap{
  width: 100%;
  min-height: 100vh;
  background: #eff4f7;
  color: #515151;
  font-size: 0.28rem;
  ul{
    overflow-x: hidden;
    padding-left: 0.2rem;
    overflow: auto;
    white-space: nowrap;
    background: #fff;
    &::-webkit-scrollbar {/*隐藏滚轮*/
      display: none;
    }
    li{
      height: 0.88rem;
      line-height: 0.88rem;
      text-align: center;
      display: inline-block;
      margin-right: 0.68rem;
    }
  }
  .activeCss{
    color: #ba886b;
  }
}
</style>
