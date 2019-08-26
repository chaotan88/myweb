<template>
  <div class="index">
    <carousel></carousel>
    <div class="content">
      <div class="title">
        <img src="../../static/images/home1.png"/>
        <span>限时优惠</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted() {
    console.log('indexxxxx')
  }
}
</script>

<style lang="less" scoped>
  .index {
    .content {
      width: 1200px;
      margin: auto;
      margin-top: 20px;
      .title {
        font-family: 微软雅黑;
        font-size: 22px;
        color: #555555;
        font-weight: 400;
        line-height: 1.3;
      }
    }
  }
</style>