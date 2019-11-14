<!-- 售后 -->
<template>
  <common-tpl :footer="false" class="aftersale-index-wrap">

  <!-- 头部 -->
  <template slot="header">
    <!-- 高级搜索组件 -->
    <high-search :textVisible="false">
      <template slot="edit">
        <el-button v-if="!content" @click="$router.push('/admin/aftersale/service/add')"><i class="el-icon-plus fw-b"></i> 添加售后服务</el-button>
         <el-button v-else @click="$router.push('/admin/aftersale/service/edit')"><i class="el-icon-edit fw-b"></i> 编辑售后服务</el-button>
      </template>
    </high-search>
  </template>

  <!-- 主体内容 -->
  <template slot="main">
    <gray-title title="售后服务管理"></gray-title>
    <div class="ql-editor editor-content" v-html="content"></div>
    <no-data v-if="!content" text="暂无售后服务设置，请添加" style="padding: 100px 0;"></no-data>
  </template>

  <!-- 底部 -->
  <template slot="footer"></template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      type: 2,      // 默认售后
      content: ''
    }
  },
  mounted () {
    this.getContent()
  },
  methods: {
    getContent () {
      this.$http.post('@ROOT_API/cotentController/getContent', {
        type: this.type
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.content = resData.data.content
      })
    }
  }
}
</script>

<style lang="less" scoped>
.aftersale-index-wrap{
  .editor-content{
    padding-top: 30px;
  }
}
</style>
