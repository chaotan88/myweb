<template>
  <div class="mb-wrap">
    <div id="mb-box">
      <div id="mb-marquee">
        <div class="item" v-for="(item, index) in lists" :key="index" @click="itemClick(item)">
          <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`" v-if="item.images">
          <img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
          <div class="price">{{item.to}} - &yen;{{item.offerPrice}}</div>
        </div>
      </div>
      <div id="mb-copy"></div>
    </div>
    <div id="mb-node">
      <div class="item" v-for="(item, index) in lists" :key="index" @click="itemClick(item)">
        <img :src="`${$config.rootPath}airImage/${item.images[0]}.jpg`" v-if="item.images">
        <img :src="`${$config.rootPath}airImage/1.jpg`" v-else>
        <div class="price">{{item.to}} - &yen;{{item.offerPrice}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    lists: {
      type: Array,
      default: () => ([])
    }
  }, // 父组件传入数据， 数组形式 [ "连雨不知春去"，"一晴方觉夏深"]
  data() {
    return {
      text: "" // 数组文字转化后的字符串
    };
  },
  methods: {
    move() {
      // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
      // let width = document.getElementById("node").getBoundingClientRect().width;
      let width = 1000;
      let box = document.getElementById("mb-box");
      let copy = document.getElementById("mb-copy");
      copy.innerText = this.text; // 文字副本填充
      let distance = 0; // 位移距离
      // 设置位移
      setInterval(function() {
        distance = distance - 1;
        // 如果位移超过文字宽度，则回到起点
        if (-distance >= width) {
          distance = 16;
        }
        box.style.transform = "translateX(" + distance + "px)";
      }, 40);
    },
    itemClick(item) {
      this.$emit('itemClick', item);
    }
  },
  // 把父组件传入的arr转化成字符串
  mounted: function() {
    // for (let i = 0; i < this.lists.length; i++) {
    //   this.text += " " + this.lists[i];
    // }
    console.log(this.lists)
    this.move();
  },
  // 更新的时候运动
  updated: function() {
    this.move();
  }
};
</script>
<style scoped>
/*样式的话可以写*/
.mb-wrap {
  overflow: hidden;
  background: white;
}
#mb-box {
  width: 500%;
}
#mb-box div {
  float: left;
}
#mb-marquee {
  margin: 0 16px 0 0;
}
#mb-node {
  position: absolute;
  z-index: -99;
  top: -99px;
  display: flex;
}
img {
  margin-right: 30px;
  height: 300px;
  width: 500px;
  cursor: pointer;
}
</style>