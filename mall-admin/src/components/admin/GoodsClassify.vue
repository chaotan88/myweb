<!-- 商品分类组件 -->
<template>
  <div class="goods-classify-menu-wrap">
    <div class="goods-classify-menu-down">
      <div class="multiple-menu-tips">
        <span class="va-t title" v-if="selectType === 1">选择大类：</span>
        <span class="va-t title" v-if="selectType === 2">选择中类：</span>
        <span class="va-t title" v-if="selectType === 3">选择小类：</span>
        <el-tag closable class="va-t d-ib" :key="goodsClassify.large.id" @close="closeTag(goodsClassify.large.id, 1)" v-if="goodsClassify.large.id">{{goodsClassify.large.name}}</el-tag>
        <el-tag closable class="va-t d-ib" :key="goodsClassify.middle.id" @close="closeTag(goodsClassify.middle.id, 2)" v-if="goodsClassify.middle.id">{{goodsClassify.middle.name}}</el-tag>
        <el-tag closable class="va-t d-ib" :key="goodsClassify.small.id" @close="closeTag(goodsClassify.large.id, 3)" v-if="goodsClassify.small.id">{{goodsClassify.small.name}}</el-tag>
      </div>
      <div class="multiple-menu-c">
        <template v-if="goodsClassifyData && goodsClassifyData.length">
          <span class="d-ib list" v-for="item in goodsClassifyData" @click="selectChange(item)">{{item.goodsType}}</span>
        </template>
        <no-data v-else></no-data>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initData: Object
  },
  data () {
    return {
      selectType: 1,              // 选择类型[1、大类, 1、中类, 1、小类]
      goodsClassify: {             // 多选菜单
        large: {                  // 大类
          id: '',
          name: ''
        },
        middle: {                 // 中类
          id: '',
          name: ''
        },
        small: {                  // 小类
          id: '',
          name: ''
        }
      },
      copyMultipleMenu: {},       // 拷贝多选菜单
      goodsClassifyData: [],      // 商品分类列表
      copyMultipleMenuData: [],   // 拷贝商品分类列表
      largeData: [],              // 大类数据
      middleData: [],             // 中类数据
      smallData: []               // 小类数据
    }
  },
  watch: {
    initData: {
      handler () {
        if (!this.initData.large.id && !this.initData.large.name) {
          this.selectType = 1
          this.goodsClassify = this.$Utils.deepCopy(this.copyMultipleMenu)
          this.goodsClassifyData = this.$Utils.deepCopy(this.copyMultipleMenuData)
        }
      },
      deep: true
    }
  },
  mounted () {
    this.copyMultipleMenu = this.$Utils.deepCopy(this.goodsClassify)
    this.getClassifyData()
  },
  methods: {
    /**
     * 获取商品分类数据
     */
    getClassifyData () {
      this.$http.post('@ROOT_API/goodsType/getGoodsTypeList').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        let data = []
        resData.data.forEach((level1) => {      // 大类
          level1.title = level1.goodsType
          level1.expanded = true

          if (level1.goodsTypeChildList) {
            level1.children = level1.goodsTypeChildList
            level1.title = level1.goodsType
            level1.goodsTypeChildList.forEach(level2 => {      // 中类
              var level3Arr = []
              level2.expanded = true
              if (level2.goodsTypeChildList) {
                level2.children = level2.goodsTypeChildList
                level2.title = level2.goodsType
                level2.goodsTypeChildList.forEach(level3 => {      // 小类
                  level3.expanded = true
                  level3.title = level3.goodsType
                  level3Arr.push(level3)
                })
              }
            })
          }
          data.push(level1)

          // let childrenFlag = true
          // if (level1.goodsTypeChildList && level1.goodsTypeChildList.length !== 0) {
          //   level1.children = level1.goodsTypeChildList
          //   level1.title = level1.goodsType
          //   level1.goodsTypeChildList.forEach(level2 => {      // 中类
          //     var level3Arr = []
          //     level2.expanded = true
          //     if (level2.goodsTypeChildList && level2.goodsTypeChildList.length !== 0) {
          //       level2.children = level2.goodsTypeChildList
          //       level2.title = level2.goodsType
          //       level2.goodsTypeChildList.forEach(level3 => {      // 小类
          //         level3.expanded = true
          //         level3.title = level3.goodsType
          //         level3Arr.push(level3)
          //       })
          //     } else {
          //       childrenFlag = false
          //     }
          //   })
          // } else {
          //   childrenFlag = false
          // }
          // if (childrenFlag === true) data.push(level1)
        })
        this.goodsClassifyData = data
        this.copyMultipleMenuData = data
      })
    },

    /**
     * 选择
     */
    selectChange (item) {
      let id = item.id ? item.id : ''
      let goodsType = item.goodsType ? item.goodsType : ''
      switch (parseInt(item.goodsTypeLevel)) {
        case 1:
          this.goodsClassify.large.id = id
          this.goodsClassify.large.name = goodsType
          this.largeData = item
          // this.$emit('change', this.goodsClassify)
          break
        case 2:
          this.middleData = item
          this.goodsClassify.middle.id = id
          this.goodsClassify.middle.name = goodsType
          // this.$emit('change', this.goodsClassify)
          break
        case 3:
          this.smallData = item
          this.goodsClassify.small.id = id
          this.goodsClassify.small.name = goodsType
          this.$emit('change', this.goodsClassify)
          this.goodsClassify = this.$Utils.deepCopy(this.copyMultipleMenu)
          break
      }
      this.selectType = parseInt(item.goodsTypeLevel) + 1
      if (item.goodsTypeChildList.length) {
        this.goodsClassifyData = item.goodsTypeChildList
      } else if (item.goodsTypeLevel < 3) {
        this.goodsClassifyData = []
      } else {
        this.selectType = 1
        this.goodsClassifyData = this.$Utils.deepCopy(this.copyMultipleMenuData)
      }
    },

    /**
     * 关闭标签
     */
    closeTag (id, level) {
      switch (parseInt(level)) {
        case 1:
          this.selectType = 1
          this.goodsClassifyData = this.$Utils.deepCopy(this.copyMultipleMenuData)
          this.goodsClassify = this.$Utils.deepCopy(this.copyMultipleMenu)
          break
        case 2:
          this.selectType = 2
          this.goodsClassify.middle.id = ''
          this.goodsClassify.middle.name = ''
          this.goodsClassify.small.name = ''
          this.goodsClassify.small.name = ''
          this.goodsClassifyData = this.largeData.goodsTypeChildList
          break
        case 3:
          this.selectType = 3
          this.goodsClassify.middle.id = ''
          this.goodsClassify.middle.name = ''
          this.goodsClassifyData = this.middleData.goodsTypeChildList
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.goods-classify-menu-wrap{
  background: #fff;
}
</style>

<style lang="less" scoped>
.goods-classify-menu-down{
  /*width: 100%;*/
  min-width: 400px;
  max-width: 600px;

  .multiple-menu-tips{
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    border-bottom: 1px solid #eee;

    .title{
      color: #666;
      line-height: 30px;
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
