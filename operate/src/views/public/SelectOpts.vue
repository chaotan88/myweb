<template>
  <div class="attribute-select-wrap">
    <el-select v-model="selDataId" clearable :placeholder="placeholder" @change="handleSelect">
      <el-option v-for="item in listData"
                 :key="item.id"
                 :label="item.attributeTypeName"
                 :value="item.id"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    reset: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    placeholder: {
      type: String,
      default: '请选择主营业务'
    }
  },

  watch: {
    'id' () {
      if (!this.id) {
        this.selDataId = null
        this.$emit('change', null)
      }
    }
  },

  data () {
    return {
      listData: [],     // 下拉列表数据
      selDataId: null
    }
  },
  mounted () {
    this.getListData()
    this.selDataId = this.id !== null ? parseInt(this.id) : null
  },
  methods: {
    /**
     * 获取下拉菜单列表
     */
    getListData () {
      this.$http.get('@ROOT_API/shopManageController/getAttributeList', {
      }).then(res => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.listData = resData.data
      })
    },
    /**
     * 选择事件
     */
    handleSelect (value) {
      let obj = {}
      obj = this.listData.find(item => {
        return item.id === parseInt(value)
      })
      this.$emit('change', obj)
    }
  }
}
</script>

<style scoped lang="less">
.attribute-select-wrap{
  .el-select{
    width: 100%;
  }
}
</style>
