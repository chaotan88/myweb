<!-- 阿里字体图标组件 -->
<template>
  <svg class="icon va-m d-ib ali-cion" :class="icon" aria-hidden="true" :fill="color" :style="customStyle" v-if="icon">
    <use :xlink:href="'#' + icon"></use>
  </svg>
</template>

<script>
export default {
  props: {
    icon: { // 图标名称
      type: String,
      default: ''
    },

    color: {  // 图标颜色
      type: String,
      default: ''
    },

    size: {
      type: Number,
      default: 20
    }
  },

  watch: {
    'size' () {
      this.initSzie()
    }
  },

  data () {
    return {
      customStyle: {
        width: '',
        height: ''
      }
    }
  },

  mounted () {
    this.initSzie()
  },

  methods: {
    /**
     * 初始化图标大小
     */
    initSzie () {
      if (this.size) {
        let sizeUnit = this.size + 'px'
        this.customStyle.width = sizeUnit
        this.customStyle.height = sizeUnit
      } else {
        this.customStyle.width = ''
        this.customStyle.height = ''
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
