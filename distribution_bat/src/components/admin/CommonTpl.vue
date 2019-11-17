<!-- 公共模板组件 -->
<template>
  <div class="admin-common-tpl" :class="{'has-footer': footer === true}">
    <!-- 头部内容 -->
    <div class="admin-common-tpl-header">
      <slot name="header"></slot>
    </div>
    
    <!-- 主体内容 -->
    <div class="admin-common-main admin-common-tpl-main">
      <slot name="main"></slot>
    </div>

    <!-- 其它内容 -->
    <div class="admin-common-tpl-other">
      <slot name="other"></slot>
    </div>

    <!-- 底部按钮 -->
    <div class="pos-f admin-common-tpl-footer" v-if="footer === true">
      <div class="full-wrap pos-r cen">
        <template v-if="collapse">
          <div @click="collapseVisible = !collapseVisible" class="ta-c cursor-p pos-a collapse-btn">
            {{collapseVisible ? '收起' : '展开'}}
            <i class="el-icon-caret-top" v-if="collapseVisible"></i>
            <i class="el-icon-caret-bottom" v-else></i>
          </div>
          <div class="pos-r" v-show="collapseVisible">
            <slot name="collapse"></slot>
          </div>
        </template>
        <el-button @click="$router.back()" v-if="back">返回</el-button>
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footer: {   // 是否显示底部
      type: Boolean,
      default: false
    },
    back: {     // 底部返回按钮
      type: Boolean,
      default: false
    },
    collapse: { // 折叠面板
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      collapseVisible: false     // 底部折叠
    }
  }
}
</script>
