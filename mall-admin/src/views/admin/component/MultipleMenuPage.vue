<!-- 多级菜单组件 -->
<template>
  <div class="goods-classify-page">
  测试
    <el-dropdown trigger="click" placement="bottom-start">
      <div class="pos-r select-wrap" ref="dropdownLink">
        <el-input placeholder="请选择商品分类" class="pos-r" readonly v-model="selectValue" clearable>
          <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
        </el-input>
      </div>
      <el-dropdown-menu slot="dropdown">
        <goods-classify :initData="multipleMenu" :resData="multipleMenuData" @change="classifySelectChange"></goods-classify>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import ClassifyData from '@/assets/js/ClassifyData'
import Utils from '@/global/function'
export default {
  data () {
    return {
      multipleMenu: {     // 多选菜单
        large: {          // 大类
          id: '',
          name: ''
        },
        middle: {         // 中类
          id: '',
          name: ''
        },
        small: {          // 小类
          id: '',
          name: ''
        }
      },
      multipleMenuData: [],
      selectValue: ''     // 选择商品分类结果
    }
  },
  mounted () {
    this.multipleMenuData = ClassifyData
  },
  methods: {
    /**
     * 多级菜单选择
     */
    classifySelectChange (results) {
      this.multipleMenu = results
      this.selectValue = [results.large.name, results.middle.name, results.small.name].join(' / ')
      if (results.small.id || results.small.name) {
        Utils.triggerEvent(this.$refs.dropdownLink)
      }
    },

    /**
     * 自动触发元素点击事件
     */
    triggerEvent (obj) {
      if (!obj) return ''
      if (document.all) {
        obj.click()
      } else {
        // 创建一个事件对象，就好像你绑定事件回调函数里获得的那个事件对象一样
        let myEvent = document.createEvent('Event')
        // 初始化这个事件对象，为它提高需要的“特性”
        myEvent.initEvent('click', true, true)
        // 按照常见的方式绑定对该事件的监听，这里的 element 可以是任何一个元素，你懂的
        obj.addEventListener('click', () => {})
        // 然后这样触发它
        obj.dispatchEvent(myEvent)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goods-classify-page{
  padding: 30px;
  background: #fff;

  .select-wrap{
    width: 240px;
    height: 36px;
    line-height: 36px;

    .el-icon-arrow-down{
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      top: 50%;
      right: 0;
    }
  }

}
</style>
