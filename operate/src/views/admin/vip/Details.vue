<!-- 会员详情 -->
<template>
  <common-tpl class="purchase-wrap" footer back>
    <template slot="main">
      <!-- 商品分类 -->
      <div class="wares-wrap">
        <el-row v-if="detailsData">
          <gray-title title="会员信息"></gray-title>
          <table class="admin-gray-table">
            <tr>
              <td>手机号：</td>
              <td>{{detailsData.phone}}</td>
            </tr>
            <tr>
              <td>证件类型：</td>
              <td>{{detailsData.cardType | filterCardType}}</td>
            </tr>
            <tr>
              <td>会员姓名：</td>
              <td>{{detailsData.cardName | filterEmpty}}</td>
            </tr>
            <tr>
              <td>性别：</td>
              <td>{{detailsData.sex | filterSex}}</td>
            </tr>
            <tr>
              <td>生日：</td>
              <td>{{detailsData.birthday | filterDate}}</td>
            </tr>
            <tr>
              <td>注册时间：</td>
              <td>{{detailsData.registerTime | filterDateDot}}</td>
            </tr>
            <tr>
              <td>最后登录时间：</td>
              <td>{{detailsData.lastLoginTime | filterDateDot}}</td>
            </tr>
            <tr>
              <td>所在地区：</td>
              <td>{{detailsData.region | filterEmpty}}</td>
            </tr>
          </table>
          <br>
          <br>
          <br>
        </el-row>
        <no-data style="padding: 150px 0;" v-if="!detailsData"></no-data>
      </div>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        detailsData: {}    // 详情数据
      }
    },
    mounted () {
      // 获取详情
      this.detailsData = JSON.parse(localStorage.getItem(this.$global.SYSTEM + 'VipDetails'))
    }
  }
</script>

<style lang='less' scoped>
.purchase-wrap{

  /*-----------------商品分类------------*/

  .wares-wrap{
    color: #666;

    .admin-gray-table{
      td:nth-child(odd){
        width: 5%;
      }
    }

    .el-col{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ebeef5;
    }
  }
}
</style>
