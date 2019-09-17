<template>
  <div class="carousel">
    <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="`${$config.rootPath}${item.image}`"/>
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
            {image: `baner1.png`},
            {image: `baner2.png`}
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