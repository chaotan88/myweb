<!-- 会员详情 -->
<template>
  <common-tpl class="purchase-wrap">
    <template slot="main">
      <!-- 商品分类 -->
      <div class="wares-wrap">
        <el-row v-if="detailsData">
          <el-col :span="12">
            <span class="d-ib label">手机号：</span>
            <span class="d-ib">{{detailsData.phone}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">证件类型：</span>
            <span class="d-ib">{{detailsData.cardType | filterCardType}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">会员姓名：</span>
            <span class="d-ib">{{detailsData.cardName | filterEmpty}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">性别：</span>
            <span class="d-ib">{{detailsData.sex | filterSex}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">生日：</span>
            <span class="d-ib">{{detailsData.birthday | filterDate}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">注册时间：</span>
            <span class="d-ib">{{detailsData.registerTime | filterDate}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">最后登录时间：</span>
            <span class="d-ib">{{detailsData.lastLoginTime | filterDate}}</span>
          </el-col>
          <el-col :span="12">
            <span class="d-ib label">所在地区：</span>
            <span class="d-ib">{{detailsData.region | filterEmpty}}</span>
          </el-col>
        </el-row>
        <no-data style="padding: 150px 0;" v-if="!detailsData"></no-data>
      </div>
    </template>

    <template slot="footer">
      <el-button @click="$router.back()">返回</el-button>
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
    padding: 30px;

    .el-col{
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #ebeef5;
    }

    .label{
      width: 200px;
      text-align: right;
      margin-right: 10px;
    }
  }
}
</style>
