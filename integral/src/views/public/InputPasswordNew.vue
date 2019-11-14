<template>
  <div class="inp-box">
    <ul class="inp-list">
      <li v-for="(item, index) in inpArray" :key="index">
        <i class="icon" :class="{active: item.iconVisible}"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    inpLength: {
      type: Number,
      default: 6
    },
    curIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      inpArray: []
    }
  },
  watch: {
    curIndex () {
      this.renderIcon()
    }
  },
  mounted () {
    this.$on('curIndex', data => {
      this.curIndex = data
    })
    for (let i = 0; i < this.inpLength; i++) {
      this.inpArray.push({iconVisible: true})
    }
  },
  methods: {
    /**
     * 渲染几个圆点
     */
    renderIcon () {
      if (this.curIndex > 0) {
        for (let i = 0; i < this.curIndex; i++) {
          this.inpArray[i].iconVisible = false
          // this.$set(this.inpArray[i], iconVisible, false)
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.inp-box{
  width: 100%;

  .inp-list{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    height: .8rem;

    li{
      width: .8rem;
      height: .8rem;
      border: 1px solid #e5e5e5;
      border-right: none;
      background: #fff;
      position: relative;

      i{
        position: absolute;
        top: 50%;
        left: 50%;
        width: .1rem;
        height: .1rem;
        margin: -0.05rem 0 0 -0.05rem;
        border-radius: 100%;
        background: #000;
      }
      i.active{
        display: none;
      }
    }

    li:last-child{
      border-right: 1px solid #e5e5e5;
    }
  }
}
</style>
