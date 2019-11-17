<template>
  <div class="title-wrap">
    <div class="pos-r title-cen">
      <span class="pos-a">{{title}}</span>
      <div class="pos-a bg-line"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.title-wrap{
  height: 60px;
  line-height: 60px;
  padding: 0 25px;

  .title-cen{
    height: 100%;
  }

  span{
    height: 100%;
    font-size: 18px;
    padding-right: 15px;
    background: #f0f0f0;
    left: 0;
    top: 0;
    z-index: 5;
  }

  .bg-line{
    width: 100%;
    height: 1px;
    background: #cdcdcf;
    top: 50%;
  }
}
</style>
