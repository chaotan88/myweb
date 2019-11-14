<!-- 内部链接 -->
<template>
  <div class="internal-link-component">
    <!-- 一级栏目 -->
    <el-select :size="size" v-model="formData.grandNode" @change="grandNodeChange" clearable>
      <template v-for="item in firstList">
        <el-option :label="item.activityName" :value="item.id"></el-option>
      </template>
    </el-select>
    &nbsp;

    <!-- 二级栏目 -->
    <el-select :size="size" v-model="formData.parentNode" @change="parentNodeChange" clearable v-if="secondList.length">
      <template v-for="item in secondList">
        <el-option :label="item.activityName" :value="item.id"></el-option>
      </template>
    </el-select>
    &nbsp;

    <!-- 三级级栏目 -->
    <el-select :size="size" v-model="formData.childNode" @change="childNodeChange" clearable v-if="thirdList.length">
      <template v-for="item in thirdList">
        <el-option :label="item.activityName" :value="item.id"></el-option>
      </template>
    </el-select>

  </div>
</template>

<script>
export default {
  props: {
    initData: { // 初始化数据
      type: Object,
      default () {
        return {
          grandNode: '',
          parentNode: '',
          childNode: '',
          relationUrl: ''
        }
      }
    },

    size: {
      type: String,
      default: 'medium'
    }
  },

  watch: {
    'initData': {
      handler () {
        this.formData.grandNode = this.initData.grandNode
        this.formData.parentNode = this.initData.parentNode
        this.formData.childNode = this.initData.childNode
        if (this.formData.grandNode && this.firstList.length) this.grandNodeChange(this.formData.grandNode, true)
      },
      deep: true
    }
  },

  data () {
    return {
      formData: {
        grandNode: '',    // 一级id
        parentNode: '',   // 二级id
        childNode: '',    // 三级id
        relationUrl: ''   // 关联地址
      },

      firstList: [],    // 一级列表
      secondList: [],   // 二级列表
      thirdList: []     // 三级列表
    }
  },

  mounted () {
    this.formData.grandNode = this.initData.grandNode
    this.formData.parentNode = this.initData.parentNode
    this.formData.childNode = this.initData.childNode
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$http.post('@ROOT_API/column/getActivityLinkList', {
        parentId: this.formData.currentId
      }).then((res) => {
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
        this.firstList = results
        if (this.formData.grandNode) this.grandNodeChange(this.formData.grandNode, true)
      })
    },

    /**
     * 一级地址选择
     */
    grandNodeChange (id, type) {
      this.thirdList = []
      this.secondList = []
      // 手动触发方法不清空选择结果
      if (!type) {
        this.formData.parentNode = ''
        this.formData.childNode = ''
      }
      this.formData.relationUrl = ''
      this.firstList.forEach((row) => {
        if (parseInt(row.id) === parseInt(id)) {
          this.formData.relationUrl = row.activityUrl
          if (row.childLinkList && row.childLinkList.length) this.secondList = row.childLinkList
        }
      })
      this.$emit('change', this.formData)
      if (this.formData.parentNode) this.parentNodeChange(this.formData.parentNode, true)
    },

    /**
     * 二级地址选择
     */
    parentNodeChange (id, type) {
      this.thirdList = []
      // 手动触发方法不清空选择结果
      if (!type) this.formData.childNode = ''
      this.formData.relationUrl = ''
      this.secondList.forEach((row) => {
        if (parseInt(row.id) === parseInt(id)) {
          this.formData.relationUrl = row.activityUrl
          if (row.childLinkList && row.childLinkList.length) this.thirdList = row.childLinkList
        }
      })
      this.$emit('change', this.formData)
      if (this.formData.childNode) this.childNodeChange(this.formData.childNode)
    },

    /**
     * 三级地址选择
     */
    childNodeChange (id) {
      this.thirdList.forEach((row) => {
        if (parseInt(row.id) === parseInt(id)) {
          this.formData.relationUrl = row.activityUrl
        }
      })
      this.$emit('change', this.formData)
    }
  }
}
</script>

<style lang="less">
.internal-link-component{
  .el-input{
    width: inherit !important;
    max-width: 150px;
  }
}
</style>
