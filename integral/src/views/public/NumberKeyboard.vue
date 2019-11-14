<template>
  <div class="number-keyboard-wrap">
    <div class="keyboard-box">
      <i v-for="(item, index) in keyArr" :key="index" @click="keyTrigger(item, index)" :class="{active: keyArr[index].keyActive, borderNo: (index + 1) % 3 === 0}">{{item.value}}</i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyArr: [
        {value: '1', keyActive: false},
        {value: '2', keyActive: false},
        {value: '3', keyActive: false},
        {value: '4', keyActive: false},
        {value: '5', keyActive: false},
        {value: '6', keyActive: false},
        {value: '7', keyActive: false},
        {value: '8', keyActive: false},
        {value: '9', keyActive: false},
        {value: '.', keyActive: false},
        {value: '0', keyActive: false},
        {value: '-', keyActive: false}
      ],
      curVal: ''            // 当前输入值
    }
  },
  mounted () {
  },
  methods: {
    /**
     * 键盘点击
     */
    keyTrigger (val, key) {
      val.keyActive = true
      setTimeout(() => {
        val.keyActive = false
      }, 50)
    }
  }
}
</script>

<style scoped lang="less">
.number-keyboard-wrap{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  animation-timing-function: ease-out;
  -webkit-animation-timing-function: ease-out;

  .keyboard-box{
    i{
      display: inline-block;
      width: 33.33333%;
      height: .8rem;
      line-height: .8rem;
      text-align: center;
      box-sizing: border-box;
      border-right: 1px solid #e5e5e5;
      border-top: 1px solid #e5e5e5;
    }

    i.borderNo{
      border-right: none;
    }
    
    i.active{
      background: #eee;
    }
  }
}
</style>
