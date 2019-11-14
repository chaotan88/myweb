<template>
  <div>
    <div class="serch-top">
      <div class="serch-top-left">
        <x-icon type="ios-search" size="0.4rem" class="serch-ico"></x-icon>
        <template v-if="serchType == 'goSerchPage'">
          <!-- <div class="ProhibitInput" @click="goSearchPage">{{serchVal}}</div> -->
          <input type="text" placeholder="输入商品名称" :value="serchTxt" @click="$router.push('/serch')" readonly unselectable="on" onfocus="this.blur()">
        </template>
        <form @submit.prevent="formSubmit" action="javascript:return true" v-else>
          <input type="serch" placeholder="输入商品名称" v-model="serchTxt" @keyup.enter="serchRightResult" @click="inputTap" id="keyWord" autocomplete="off">
        </form>
        <x-icon type="ios-close" size="0.35rem" class="serch-close" v-if="serchTxt.length > 0" @click="cleanVal"></x-icon>
      </div>
      <div class="serch-top-right" @click="$router.push('/serch')" v-if="serchType == 'goSerchPage'">{{rightTxt}}</div>
      <div class="serch-top-right" @click="serchRightResult" v-else>{{rightTxt}}</div>
    </div>
    <div class="serchD"></div>
  </div>
</template>

<script>
  export default {
    /**
     * @serchType  判断是否是搜索点击跳到搜索页
     * @showRight  是否显示右侧按钮默认 true 显示
     * @rightTxt   右侧文字显示(取消还是搜索或其他) 默认 '搜索'
     * @inputTap  input点击
     * @cleanVal 清空按钮点击
    */
    props: {
      serchType: {
        type: String,
        default: ''
      },
      showRight: {
        type: Boolean,
        default: true
      },
      rightTxt: {
        type: String,
        default: '搜索'
      }
    },
    data () {
      return {
        serchTxt: '' // 输入的文字
      }
    },
    mounted: function () {
      this.setSerchTxt()
    },
    methods: {
      /**
       * 设置搜索框内容
      */
      setSerchTxt () {
        this.serchTxt = this.$route.query.goodsName || ''
      },
      /**
       * ios 虚拟键盘右下角显示搜索
      */
      formSubmit () {
        return false
      },
      /**
       * 搜索结果
      */
      serchRightResult () {
        this.$vm.$emit('storageHistory', this.serchTxt)
        this.$emit('serchRightResult', this.serchTxt)
      },
      /**
       * input点击
      */
      inputTap () {
        this.$emit('inputTap')
      },
      /**
       * 清除按钮点击
      */
      cleanVal () {
        document.getElementById('keyWord').focus()         // input聚焦
        this.serchTxt = ''
        this.$emit('cleanVal')
      }
    }
  }
</script>

<style scoped lang=less>
.serchD{
  height: 1rem;
}
.serch-top{
  height: 1rem;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  padding:0 0 0 .22rem;
  position: fixed;
  top:0;
  background: #fff;
  width: 7.5rem;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-bottom:1px solid #eee;
  z-index: 3000;
  .serch-top-left{
    background: #eeeeee;
    border-radius: 20px;
    height: .6rem;
    display: -webkit-flex;
    display: flex;
    align-items: center;
    position: relative;
    flex: 1;
    .serch-ico{
      fill: #a3a3a3;
      margin-left: .37rem;
      margin-right: .11rem;
    }
    form{
      flex: 1;
    }
    input,.ProhibitInput{
      height: .6rem;
      background: none;
      width: 100%;
      flex: 1;
      color: #9c9c9c;
      font-size: .24rem;
      line-height: .6rem;
      overflow-x: scroll;
    }
    .ProhibitInput{
      overflow: hidden;
    }
    .ProhibitInput::-webkit-scrollbar{width:0px;display: none;}
    input::-webkit-input-placeholder{
      color:#9c9c9c;
    }
    .ProhibitInput:empty::before{
      content: '输入商品名称'      
    }
    .serch-close{
      fill: #999999;
      position: absolute;
      right: .25rem;
    }
  }
  .serch-top-right{
    width: 1.1rem;
    font-size: .28rem;
    color: #999999;
    text-align: center;
    height: .6rem;
    line-height: .6rem;
  }
}
</style>
