<!-- 多级菜单组件 -->
<template>
  <div class="multiple-menu-wrap">
    <div class="custom-multiple-menu-down">
      <div class="multiple-menu-tips">
        <span class="title" v-if="selectType === 1">选择大类：</span>
        <span class="title" v-if="selectType === 2">选择中类：</span>
        <span class="title" v-if="selectType === 3">选择小类：</span>
        <span>{{multipleMenu.large.name}}</span>
        <span>{{multipleMenu.middle.name}}</span>
        <span>{{multipleMenu.small.name}}</span>
      </div>
      <div class="multiple-menu-c">
        <span class="d-ib list" v-for="item in copyResData" @click="selectChange(item)">{{item.goodsType}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    resData: Array,
    initData: Object
  },
  data () {
    return {
      selectType: 1,          // 选择类型[1、大类, 1、中类, 1、小类]
      copyResData: [],        // 拷贝结果集数据
      copyMultipleMenu: [],   // 拷贝结果格式数据
      multipleMenu: {         // 多选菜单
        large: {              // 大类
          id: '',
          name: ''
        },
        middle: {             // 中类
          id: '',
          name: ''
        },
        small: {              // 小类
          id: '',
          name: ''
        }
      }
    }
  },
  watch: {
    'resData' () {
      this.copyResData = this.deepCopy(this.resData)
    }
  },
  mounted () {
    this.copyResData = this.deepCopy(this.resData)
    this.copyMultipleMenu = this.deepCopy(this.multipleMenu)
  },
  methods: {
    /**
     * 选择
     */
    selectChange (item) {
      switch (parseInt(item.goodsTypeLevel)) {
        case 1:
          this.multipleMenu.large.id = item.goodsTypeId
          this.multipleMenu.large.name = item.goodsType
          break
        case 2:
          this.multipleMenu.middle.id = item.goodsTypeId
          this.multipleMenu.middle.name = item.goodsType
          break
        case 3:
          this.multipleMenu.small.id = item.goodsTypeId
          this.multipleMenu.small.name = item.goodsType
          this.$emit('change', this.multipleMenu)
          this.multipleMenu = this.deepCopy(this.copyMultipleMenu)
          break
      }
      this.selectType = parseInt(item.goodsTypeLevel) + 1
      if (item.childList) {
        this.copyResData = item.childList
      } else {
        this.selectType = 1
        this.copyResData = this.deepCopy(this.resData)
      }
    },

    /**
     * 深拷贝
     */
    deepCopy (o) {
      if (o instanceof Array) {
        let n = []
        for (let i = 0; i < o.length; ++i) {
          n[i] = this.deepCopy(o[i])
        }
        return n
      } else if (o instanceof Object) {
        let n = {}
        for (let i in o) {
          n[i] = this.deepCopy(o[i])
        }
        return n
      } else {
        return o
      }
    }
  }
}
</script>

<style lang="less" scoped>
.multiple-menu-wrap{
  background: #fff;
}
</style>

<style lang="less" scoped>
.custom-multiple-menu-down{
  width: 300px;

  .multiple-menu-tips{
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;

    .title{
      color: #666;
    }
  }

  .multiple-menu-c{
    padding: 10px 20px;

    .list{
      color: #333;
      margin: 0 5px 5px 8px;
      cursor: pointer;
    }
  }
}
</style>
