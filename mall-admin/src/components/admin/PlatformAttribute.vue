<!-- 平台属性组件 -->
<template>
  <div class="platform-attribute-menu-wrap">
    <div class="platform-attribute-menu-down">
      <div class="multiple-menu-tips">
        <span class="va-t title" v-if="selectType === 1">选择大类：</span>
        <span class="va-t title" v-if="selectType === 2">选择中类：</span>
        <span class="va-t title" v-if="selectType === 3">选择小类：</span>
        <el-tag closable class="va-t d-ib" :key="platformAttribute.large.id" @close="closeTag(platformAttribute.large.id, 1)" v-if="platformAttribute.large.id">{{platformAttribute.large.name}}</el-tag>
        <el-tag closable class="va-t d-ib" :key="platformAttribute.middle.id" @close="closeTag(platformAttribute.middle.id, 2)" v-if="platformAttribute.middle.id">{{platformAttribute.middle.name}}</el-tag>
        <el-tag closable class="va-t d-ib" :key="platformAttribute.small.id" @close="closeTag(platformAttribute.large.id, 3)" v-if="platformAttribute.small.id">{{platformAttribute.small.name}}</el-tag>
      </div>
      <div class="multiple-menu-c">
        <template v-if="platformAttributeData && platformAttributeData.length">
          <span class="d-ib list" v-for="item in platformAttributeData" @click="selectChange(item)">{{item.attributeTypeName}}</span>
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
      platformAttribute: {             // 多选菜单
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
      platformAttributeData: [],  // 商品分类列表
      copyMultipleMenuData: [],   // 拷贝商品分类列表
      largeData: [],              // 大类数据
      middleData: [],             // 中类数据
      smallData: []               // 小类数据
    }
  },
  watch: {
    initData: {
      handler () {
        this.selectType = 1
        this.platformAttributeData = this.$Utils.deepCopy(this.copyMultipleMenuData)
        this.platformAttribute = this.$Utils.deepCopy(this.copyMultipleMenu)
        // if (!this.initData.large.id && !this.initData.large.name) {
        //   this.platformAttribute = this.$Utils.deepCopy(this.copyMultipleMenu)
        // } else {
        //   this.platformAttribute = this.$Utils.deepCopy(this.initData)
        // }
      },
      deep: true
    }
  },
  mounted () {
    this.copyMultipleMenu = this.$Utils.deepCopy(this.platformAttribute)
    this.getClassifyData()
  },
  methods: {
    /**
     * 获取属性分类数据
     */
    getClassifyData () {
      this.$http.post('@ROOT_API/goods/getAttributeTypeList').then((res) => {
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
          if (level1.attributeTypeChildList) {
            level1.children = level1.attributeTypeChildList
            level1.title = level1.goodsType
            level1.attributeTypeChildList.forEach(level2 => {      // 中类
              var level3Arr = []
              level2.expanded = true
              if (level2.attributeTypeChildList) {
                level2.children = level2.attributeTypeChildList
                level2.title = level2.goodsType
                level2.attributeTypeChildList.forEach(level3 => {      // 小类
                  level3.expanded = true
                  level3.title = level3.goodsType
                  level3Arr.push(level3)
                })
              }
            })
          }
          data.push(level1)
        })
        this.platformAttributeData = data
        this.copyMultipleMenuData = data
      })
    },

    /**
     * 选择
     */
    selectChange (item) {
      let id = item.id ? item.id : ''
      let attributeTypeName = item.attributeTypeName ? item.attributeTypeName : ''
      switch (parseInt(item.attributeTypeLevel)) {
        case 1:
          this.platformAttribute.large.id = id
          this.platformAttribute.large.name = attributeTypeName
          this.largeData = item
          break
        case 2:
          this.middleData = item
          this.platformAttribute.middle.id = id
          this.platformAttribute.middle.name = attributeTypeName
          break
        case 3:
          this.smallData = item
          this.platformAttribute.small.id = id
          this.platformAttribute.small.name = attributeTypeName
          this.$emit('change', this.platformAttribute)
          this.platformAttribute = this.$Utils.deepCopy(this.copyMultipleMenu)
          break
      }
      this.selectType = parseInt(item.attributeTypeLevel) + 1
      if (item.attributeTypeChildList.length) {
        this.platformAttributeData = item.attributeTypeChildList
      } else if (item.attributeTypeLevel < 3) {
        this.platformAttributeData = []
      } else {
        this.selectType = 1
        this.platformAttributeData = this.$Utils.deepCopy(this.copyMultipleMenuData)
      }
    },

    /**
     * 关闭标签
     */
    closeTag (id, level) {
      switch (parseInt(level)) {
        case 1:
          this.selectType = 1
          this.platformAttributeData = this.$Utils.deepCopy(this.copyMultipleMenuData)
          this.platformAttribute = this.$Utils.deepCopy(this.copyMultipleMenu)
          break
        case 2:
          this.selectType = 2
          this.platformAttribute.middle.id = ''
          this.platformAttribute.middle.name = ''
          this.platformAttribute.small.name = ''
          this.platformAttribute.small.name = ''
          this.platformAttributeData = this.largeData.attributeTypeChildList
          break
        case 3:
          this.selectType = 3
          this.platformAttribute.middle.id = ''
          this.platformAttribute.middle.name = ''
          this.platformAttributeData = this.middleData.attributeTypeChildList
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.platform-attribute-menu-wrap{
  background: #fff;
}
</style>

<style lang="less" scoped>
.platform-attribute-menu-down{
  /*width: 100%;*/
  max-width: 700px;
  min-width: 420px;

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
