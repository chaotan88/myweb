<template>
  <div class="noDataTip">{{title}}</div>
</template>
<script>
export default {
  name: 'codeComponent',
  props: {
    title: {
      type: String,
      default: '暂无数据'
    }
  },

  data () {
    return {
      values: ''
    }
  },
  mounted () {
  },

  methods: {
  }
}
</script>
<style lang="less">
  .noDataTip{
    text-align: center;
    color: #999;
    padding: 1rem 0;
    font-size: .28rem;
  }
</style>