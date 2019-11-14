<template>
  <div>
    <div class="top-btn" @click="goTop"><img :src="topImg"/></div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        topImg: require('../../assets/images/groupBooking/topImg.png')
      }
    },
    computed: {
    },
    watch: {
    },
    mounted: function () {
    },
    methods: {
      /**
       *一键回到顶部
       * */
      goTop () {
        scrollTo(0, 0)
      }
    }
  }
</script>
<style scoped lang="less">
  .top-btn{
    width: 0.72rem;
    height: 0.72rem;
    /*background: rgba(0,0,0,0.6);*/
    img{
      width: 100%;
      height: 100%;
    }
  }
</style>
