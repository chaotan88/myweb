<template>
  <transition name="message-fade">
    <div class="message-tip-wrap pos-a"
         v-if="show"
         :message="message" :type="type" :duration="duration">
      <div class="message-tip-box pos-r ta-c">
        <!--提示-->
        <div class="message-tip pos-f">
          <i ref="icon" class="el-icon-info"></i>
          <p>{{ message }}</p>
        </div>
        <!--遮罩-->
        <div class="mask"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '提示信息'
    },
    type: {
      type: String,
      default: 'info'
    },
    duration: {
      type: Number,
      default: 1500
    }
  },
  data () {
    return {
      show: true,
      timer: null
    }
  },
  methods: {
    _init () {
      // if (this.timer) {
      //   clearTimeout(this.timer)
      // } else {
      setTimeout(() => {
        this.show = false
      }, this.duration)
      // }
    }
  },
  mounted () {
    this.$refs.icon.className = 'icon el-icon-' + this.type
    this._init()
  }
}
</script>

<style lang="less" scoped>
.message-tip-wrap{
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;

  .message-tip-box{
    width: 100%;
    height: 100%;

    .message-tip{
      width: 140px;
      padding: 20px;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      background: #303030;
      border-radius: 4px;
      box-shadow: 0 0 0 #eee;

      .icon{
        font-size: 24px;
      }

      p{
        margin-top: 10px;
      }
    }

    .mask{
      width: 100%;
      height: 100%;
      background: #777;
      opacity: .2;
    }
  }

}
</style>
