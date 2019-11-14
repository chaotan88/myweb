<!-- 高级搜索组件 -->
<template>
  <common-tpl class="search-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="搜索区域"></el-input>
          <i class="ta-c pos-a el-icon-search"></i>
        </div>
        <div slot="edit">
          <el-button>新增</el-button>
          <el-button>编辑</el-button>
        </div>
        <el-button slot="btn">清空</el-button>
        <div slot="main">自定义主体内容</div>
      </high-search>
    </template>

    <template slot="main"></template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      visible: true         // 显示高级搜索按钮
    }
  },
  methods: {
    /**
     * 搜索
     */
    searchHandle () {
      this.visible = !this.visible
      this.$emit('search')
    }
  }
}
</script>
