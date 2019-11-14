<template>
    <div class="cartcontrol" @click.stop>
      <ul class="cartcontrol-box">
        <!--减-->
        <!-- :class="reduceSte ? 'notap' : ''" -->
        <li class="cart-decrease" @click.stop.prevent="onChange('reduce')" :class="reduceSte ? 'notap' : ''">
          <x-icon type="ios-minus-empty" size="20"></x-icon>
        </li>
        <input type="tel" v-model="currentValue" class="cart-count" @blur="onBlur" :disabled="disableInput || disabled" @input="handleInput($event)">
        <!--加-->
        <li class="cart-add" @click.stop.prevent="onChange('increase')" :class="increaseSte ? 'notap' : ''">
          <x-icon type="ios-plus-empty" size="20"></x-icon>
        </li>
      </ul>
    </div>
</template>

<script>
  export default {
    /**
     * @value 输入框的值 默认1
     * @integer是否只允许输入整数  默认true
     * @min 最小值 默认1
     * @max 最大值
     * @disabled 是否禁用      默认false
     * @disableInput 是否禁用input 默认false
     * @change  值改变时触发(val)val输入的值
    */
    props: {
      value: {
        type: [String, Number],
        default: 1
      },
      integer: {
        type: Boolean,
        default: true
      },
      min: {
        type: [String, Number],
        default: 1
      },
      max: {
        type: [String, Number],
        default: Infinity
      },
      disabled: {
        type: Boolean,
        default: false
      },
      disableInput: {
        type: Boolean,
        default: false
      }
    },
    data () {
      var value = this.value
      var correctedValue = this.correctValue(value)
      if (value !== correctedValue) {
        value = correctedValue
        this.$emit('input', value)
      }
      return {
        currentValue: value // 输入框值
      }
    },
    watch: {
      'value': function () {
        if (this.value !== '') {
          var value = this.correctValue(this.value)
          if (value !== this.currentValue) {
            this.currentValue = value
          }
        }
      },
      // 'currentValue': function () {
      //   this.emitInput()
      // },
      'max': function () {
        if (this.value !== '') {
          var value = this.correctValue(this.value)
          if (value !== this.currentValue) {
            this.currentValue = value
          }
        }
      }
    },
    computed: {
      /**
       * 监听减少按钮是否可点击
      */
      reduceSte () {
        return this.currentValue === this.min || this.disabled
      },
      /**
       * 监听增加按钮是否可点击
      */
      increaseSte () {
        return this.currentValue === this.max || this.disabled
      }
    },
    mounted: function () {
    },
    methods: {
      /**
       * 检测输入的值是否超过最大最小值
      */
      correctValue (value) {
        return isNaN(value) ? this.min : Math.max(this.min, Math.min(this.max, value))
      },
      /**
       * 输入框键盘按下
      */
      handleInput (e) {
        var value = event.target.value
        if (this.integer) {
          value = value.replace(/[^\d]/g, '')       // 只允许输入数字
        } else {
          value = value.replace(/[^\d.]/g, '')      // 允许输入数字小数点
        }
        this.currentValue = value ? this.correctValue(value) : value
        this.emitInput()
      },
      /**
       * 失去焦点
      */
      onBlur (event) {
        if (!this.value || !this.currentValue) {
          this.currentValue = this.min
          this.emitInput()
        }
        this.$emit('blur', event)
      },
      /**
       * 增加按钮、减少按钮点击
      */
      onChange (type) {
        if (type === 'reduce') {
          if (this.currentValue > this.min) {
            this.currentValue--
          }
        } else {
          if (this.currentValue < this.max) {
            this.currentValue++
          }
        }
        this.emitInput()
        this.$emit(type, this.currentValue) // 暴露增加、减少按钮方法
      },
      /**
       * 提交input
      */
      emitInput () {
        this.$emit('input', this.currentValue)
        this.$emit('change', this.currentValue)
      }
    }
  }
</script>

<style scoped lang=less>
    .cartcontrol {
      .cartcontrol-box{
        width:1.8rem;
        height: 0.5rem;
        line-height: 0.5rem;
        border:1px solid #eee;
        border-radius: 0.05rem;
        li, input{
          float: left;
          height: 0.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        li.notap{
          background-color: #f8f8f8;
        }
        input[disabled]{
          background: #f8f8f8;
        }
        /*减*/
        .cart-decrease{
          width: 0.5rem;
        }
        .cart-count{
          width: 0.75rem;
          border-left: 1px solid #eee;
          border-right: 1px solid #eee;
          color:#333;
        }
        /*加*/
        .cart-add{
          width:0.5rem;
        }
        .vux-x-icon {
          fill: #333;
        }
      }
      &:after{
        display: block;
        content: ".";
        height: 0;
        line-height: 0;
        clear: both;
        visibility: hidden;
      }
    }
</style>
