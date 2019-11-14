<template>
  <div class="security-code-wrap">
    <label :for="`code-${uuid}`">
      <ul :class="`block-container security-code-container`">
        <li class="field-wrap"  :class="values.length == index ? 'blink' : ''" v-for="(item, index) in length" :key="index">
          <i class="char-field" v-if="values[index]"></i>
        </li>
      </ul>
       <input ref="input" class="input-code" @keyup="handleInput($event)" v-model="values" :id="`code-${uuid}`"  type="tel" :maxlength="length" autocorrect="off" autocomplete="off" autocapitalize="off" readonlyunselectable="on" autofocus>
    </label>

  </div>
</template>

<script>
  export default {
    name: 'codeComponent',
    // values: {
    //   type: String,
    //   default: 4
    // }
    props: {
      length: {
        type: Number,
        default: 4
      },
      value: {
        type: String,
        default: ''
      }
    },
    // variables
    data () {
      return {
        values: ''
      }
    },
    watch: {
      value (val) {
        if (!this.value) this.values = ''
      }
    },
    computed: {
      uuid () {
        return Math.random().toString(36).substring(3, 8)
      }
    },
    mounted () {
      this.$refs.input.focus()
    },
    methods: {
      hideKeyboard () {
        // 输入完成隐藏键盘
        this.$emit('confirmEvent')
      },
      handleSubmit () {
        this.$emit('input', this.values)
      },
      handleInput (e) {
        this.handleSubmit()
        if (e.target.value.length >= this.length) {
          this.hideKeyboard()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .blink:after {
      content: '';
      height: 18px;
      display: inline-block;
      width: 2px;
      background: #666;
      vertical-align: middle;
      -webkit-animation-name: blink;
      animation-name: blink;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite;
      -webkit-animation-timing-function:ease-in-out  ;
      animation-timing-function: ease-in-out ;
  }
  @-webkit-keyframes blink{
    0%{
      opacity: 1;
    }
    100%{
      opacity: 0;
    }
  }
  .security-code-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .security-code-container {
    margin: 0;
    padding: 0;
    display: flex;
    .field-wrap {
      list-style: none;
      display: block;
      height: 1rem;
      width: 1rem;
      line-height: 1rem;
      font-size: 16px;
      .char-field {
        font-style: normal;
        width: 12px;
        height: 12px;
        background: #000;
        display: inline-block;
        border-radius: 10px;
      }
    }
  }
  .block-container {
    justify-content: center;
    .field-wrap {
      background-color: #fff;
      margin-right: .3rem;
      color: #000;
      border: 1px solid #d4d4d4;
      text-align: center;
      &:last-child{
        margin-right: 0;
      }
    }
  }

  .input-code {
    position: absolute;
    left: -100px;
    top: 0;
    background: red;
    z-index: 3000;
    opacity: 0;
    color:transparent;
    text-shadow:0 0 0 red;
  }
</style>
