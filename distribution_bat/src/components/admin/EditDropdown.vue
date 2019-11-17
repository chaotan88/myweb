<!-- table 编辑下拉 -->
<template>
  <el-dropdown class="d-b">
    <div class="ta-c d-b el-dropdown-link">
      <span class="d-b va-m">...</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <slot name="main"></slot>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script></script>

<style lang="less" scoped></style>
