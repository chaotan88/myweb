<template>
  <div class="carousel">
    <!-- <el-carousel indicator-position="outside">
      <el-carousel-item v-for="(item, index) in banner" :key="index">
        <img :src="`${$config.rootPath}${item.image}`"/>
      </el-carousel-item> -->
      <video
        id="myVideo"
        class="video-js"
        >
        <source
            src="http://112.74.203.16/static/bst.mp4"
            type="video/mp4"
        >
        </video>
    <!-- </el-carousel> -->
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
    initVideo() {
        //初始化视频方法
        let myPlayer = this.$video(myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: "muted",
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "400px",
            loop: true
        });
        }
  },
  mounted() {
    this.initVideo()
  }
}
</script>

<style lang="less" scoped>
.carousel {
  margin-top: 5px;
  // width: 100%;
  .video-js {
    width: 100%;
  }
  img {
    width: 100%;
    height: 300px;
  }
}
</style>