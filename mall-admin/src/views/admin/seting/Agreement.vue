<!-- 注册协议首页 -->
<template>
  <common-tpl :footer="false" class="agreement-index-wrap">

  <!-- 头部 -->
  <template slot="header">
    <!-- 高级搜索组件 -->
    <high-search :textVisible="false">
      <template slot="edit">
        <el-button v-if="!content" @click="$router.push('/admin/seting/basics/agreement/add')"><i class="el-icon-plus fw-b"></i> 添加注册协议</el-button>
         <el-button v-else @click="$router.push('/admin/seting/basics/agreement/edit')"><i class="el-icon-edit fw-b"></i> 编辑注册协议</el-button>
      </template>
    </high-search>
  </template>

  <!-- 主体内容 -->
  <template slot="main">
    <gray-title title="注册协议管理"></gray-title>
    <div v-html="content" class="ql-editor"></div>
    <no-data v-if="!content" text="暂无注册协议设置，请添加" style="padding: 100px 0;"></no-data>
  </template>

  <!-- 底部 -->
  <template slot="footer"></template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      type: 1,      // 默认注册协议
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
        if (resData.data) this.content = resData.data.content
      })
    }
  }
}
</script>

<style lang="less" scoped>
.agreement-index-wrap{
  .admin-gray-title{
    margin-bottom: 20px;
  }
}
</style>
