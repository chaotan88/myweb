button
<template>
  <button class="button-item" @click="handleSubmit">{{title}}</button>
</template>
<script>
export default {
  props: ['title', 'path'],
  methods: {
    handleSubmit () {
      this.$emit('submit', this.path)
    }
  }
}
</script>
<style lang="less">
.button-item{
  width: 6.7rem;
  height: .8rem;
  background-image: linear-gradient(141deg,
    #7acce5 0%,
    #5894de 100%),
  linear-gradient(
    #f6f6f6,
    #f6f6f6);
  background-blend-mode: normal,
    normal;
  box-shadow: 0 .03rem .07rem 0
    rgba(88, 148, 222, 0.35);
  border-radius: .12rem;
  font-size: .36rem;
  color: #ffffff;
  //消除button的默认样式
  margin: 0;
  padding: 0;
  border: .01rem solid transparent;  //自定义边框
  outline: none;    //消除默认点击蓝色边框效果
}
</style>
