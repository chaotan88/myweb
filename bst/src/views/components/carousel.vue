<template>
  <div class="carousel">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="item.image"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  props: {
    banner: {
        type: Array,
        default: () => [
            {image: '../../static/images/baner1.png'},
            {image: '../../static/images/banner2.png'}
        ]
    }
  },
  methods: {
    
  },
  mounted() {
    
  }
}
</script>

<style lang="less" scoped>
.carousel {
    margin-top: 5px;
}
</style>