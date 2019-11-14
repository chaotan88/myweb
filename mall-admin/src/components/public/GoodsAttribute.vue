<!-- 商品分类组件 -->
<template>
  <div class="pos-r full-h goods-attribute-component" v-loading="loading">
    <div class="pos-a classify-tree-t">类目管理
      <el-input size="small" class="pos-a" placeholder="搜索类目" style="width: 140px; right: 10px;" v-model="formData.classifyName" @change="handleSearchTree" clearable prefix-icon="el-icon-search"></el-input>
    </div>
    <div class="full-h classify-tree-c">
      <el-tree
        class="el-tree-wrap"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :default-expanded-keys="[formData.classifyId]"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="classify-tree"
        v-if="treeData[0].children.length">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="cursor-p" :class="{active: data.id === formData.classifyId}" @click="classifyNodeClick(data)">
            {{ node.label }} 
            <template v-if="data.attributeTypeLevel === 0">({{data.children.length}})</template>
            <template v-if="data.attributeTypeLevel === 1 || data.attributeTypeLevel === 2">({{data.attributeTypeChildList.length}})</template>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    defaultId: {      // 默认选中ID
      type: Number,
      default: 0
    },

    deleteId: Number  // 删除分类ID
  },

  data () {
    return {
      loading: false,       // 加载中
      treeData: [{
        id: 0,
        label: '我的商品类目',
        expanded: true,
        selected: false,
        parentId: 0,
        attributeTypeLevel: 0,
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formData: {
        classifyName: '',   // 搜索类目名称
        classifyId: 0       // 当前分类id
      },
      tableData: [],        // 列表数据
      currentClassify: ''   // 当前类目
    }
  },

  watch: {
    'defaultId' () {
      this.formData.classifyId = this.defaultId
      let treeData = this.treeData[0].children
      if (treeData.length) this.filterResultsData(treeData, 1)
    },

    'deleteId' (value) {
      if (value) {
        let copyData = this.$Utils.deepCopy(this.treeData[0].children)
        this.treeData[0].children = []
        setTimeout(() => {
          this.treeData[0].children = this.filterResultsData(copyData, 1)
        }, 10)
      }
    }
  },

  mounted () {
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/attributeType/getAttributeTypeList').then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        let results = resData.data

        this.treeData[0].children = this.filterResultsData(results)
        if (this.treeData[0].children.length) {
          setTimeout(() => {
            if (this.formData.classifyId === 0) {
              this.currentClassify = this.treeData[0]
              this.tableData = this.treeData[0].children
              this.$emit('change', {}, this.currentClassify)
            }
            this.handleSearchTree()
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 遍历列表过滤数据
     */
    filterResultsData (lists) {
      lists.forEach((row, index) => {
        row.label = row.attributeTypeName
        row.children = row.attributeTypeChildList
        // 移除数据
        if (this.deleteId && this.deleteId === row.id) lists.splice(index, 1)
        if (this.formData.classifyId === row.id) {
          this.currentClassify = row
          this.$emit('change', {}, this.currentClassify)
          setTimeout(() => {
            this.tableData = parseInt(row.attributeTypeLevel) === 3 || !row.attributeTypeChildList || !row.attributeTypeChildList.length ? [row] : row.attributeTypeChildList
          }, 30)
        }
        // 如果存在子集列表，递归操作
        if (row.attributeTypeChildList && row.attributeTypeChildList.length) this.filterResultsData(row.attributeTypeChildList)
      })
      return lists
    },

    /**
     * 类目名称搜索
     */
    handleSearchTree () {
      this.$refs['classify-tree'].filter(this.formData.classifyName)
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 过滤节点显示
     */
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    /**
     * 商品类目点击
     */
    classifyNodeClick (node) {
      this.tableData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentClassify = node
      this.formData.classifyId = node.id
      // localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      this.$emit('change', this.formData, this.currentClassify)
    }
  }
}
</script>

<style lang="less" scoped>
.goods-attribute-component{
  color: #666;
  border: 1px solid #eee;
  padding-top: 48px;
  left: 0;
  top: 0;

  &, .classify-tree-t, .classify-tree-c{
    box-sizing: border-box;
  }

  .classify-tree-t{
    color: #333;
    width: 100%;
    height: 48px;
    line-height: 48px;
    padding-left: 10px;
    background: #eef1f9;
    top: 0;
  }

  .classify-tree-c{
    overflow: auto;
    padding-top: 10px;
  }

  .classify-tree-c::-webkit-scrollbar{
    width: 8px;
    background-color: rgba(0, 0, 0, .03);
  }

  .classify-tree-c::-webkit-scrollbar-thumb{
    background: rgba(0, 0, 0, .3);
    border-radius: 10px;
  }

  .node-selected{
    color: #fff;
    border: 0;
    padding-left: 5px;
    padding-right: 5px;
    background-color: #56ade8;
  }

  /* -------------------- { 树列表 } -------------------- */
  .el-tree-wrap{
    font-size: 14px;
    .el-tree-node__content{
      cursor: default;
    }

    .custom-tree-node{

      span{
        border: 0;
        padding: 1px 5px;
      }
    }

    .active{
      color: #fff;
      background-color: #56ade8;
      border-radius: 3px;
    }
  }
}
</style>
