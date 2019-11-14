<template>
  <div class="d-ib pos-f admin-breadcrumb-wrap">
    <span class="sp">您的位置：</span>
    <el-breadcrumb separator="/">
      <template v-for="item in breadcrumb">
        <el-breadcrumb-item :to="item.path">{{item.title}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data () {
    return {
      breadcrumb: []            // 面包屑导航
    }
  },
  mounted () {
    this.breadcrumb = this.$route.meta.breadcrumb
  },
  watch: {
    '$route.meta' () {
      this.breadcrumb = this.$route.meta.breadcrumb
    }
  }
}
</script>

<style lang="less" scoped>
.admin-breadcrumb-wrap{
  color: #6b6c72;
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 12px;
  padding-left: 40px;
  background: #f0f0f0;
  top: 80px;
  z-index: 100;

  .sp{
    height: 12px;
    line-height: 12px;
    opacity: 0.6;
  }

  .el-breadcrumb{
    display: inline-block;
    vertical-align: -2px;
  }
}
</style>

<style lang="less">
.admin-breadcrumb-wrap{
  .el-breadcrumb__item__inner, .el-breadcrumb__item__inner a{
    color: #6b6c72;
    font-size: 12px;
    opacity: 0.6;
  }
  
  .el-breadcrumb__item__inner:hover{
    color: #ef8200;
  }

  .el-breadcrumb__separator, .el-breadcrumb__inner, .el-breadcrumb__inner a{
    font-weight: normal;
  }

  .el-breadcrumb__inner:hover{
    color: #d71e25;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__inner{
    color: #bbb;
  }

}
</style>
