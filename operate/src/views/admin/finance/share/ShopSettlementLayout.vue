<!-- 店补结算-tab分页 -->
<template class="shop-settlement-layout-warp">
  <div class="tab-box">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all">
        <!--<router-link class='d-ib ta-c' to="/admin/sale/balance/authentication/all"></router-link>-->
      </el-tab-pane>
      <el-tab-pane label="待结算" name="await">
        <!--<router-link class='d-ib ta-c' to="/admin/sale/balance/authentication/await"></router-link>-->
      </el-tab-pane>
      <el-tab-pane label="已结算" name="already">
        <!--<router-link class='d-ib ta-c' to="/admin/sale/balance/authentication/already"></router-link>-->
      </el-tab-pane>
    </el-tabs>

    <!--<router-view></router-view>-->
  </div>

</template>
<script>
  export default {
    data () {
      return {
        activeName: 'all'
      }
    },
    mounted () {
      let path = this.$route.path.match(/all|await|already/gi)[0]
      this.activeName = path
    },
    methods: {
      handleClick (tab, event) {
        let tabName = tab.$options.propsData.name
        this.$router.push('/admin/sale/balance/authentication/' + tabName)
      }
    }
  }
</script>
<style lang="less" scoped>
  .shop-settlement-layout-warp{
    padding: 20px;
    .el-tabs__item{
      width: 49px;
      height: 16px;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 100px;
      letter-spacing: 0px;
      color: #9c9c9c;
    }
  }
</style>
<style lang="less">
  .tab-box{
    .el-tabs{
      .el-tabs__header{
        .el-tabs__nav-wrap{
          padding-left: 20px !important;
        }
      }
      .el-tabs__content{
        display: none !important;
      }
    }

  }
  .shop-settlement-list-wrap{
    .admin-common-tpl-main{
      padding: 0;
    }
  }
</style>
