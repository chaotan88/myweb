<!-- 供应商下拉选择 -->
<template>
  <div class="pos-r supplier-select-wrap">
    {{text}}
    <el-select filterable v-model="formData.supplierId" placeholder="选择供应商" @change="handleChange" clearable>
      <template v-for="item in supplierData">
        <el-option :value="item.id" :label="item.supplierName"></el-option>
      </template>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '选择供应商'
    },
    id: Number
  },

  data () {
    return {
      formData: {
        supplierId: ''      // 供应商id
      },
      supplierData: [],     // 供应商列表数据
      pageData: {           // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  watch: {
    id (value) {
      this.formData.supplierId = value
    }
  },

  mounted () {
    this.getSupplierData()
  },

  methods: {
    /**
     * 获取供应商列表
     */
    getSupplierData () {
      this.$http.get('@ROOT_API/supplier/getSupplierPage', {
        params: {
          start: this.pageData.currentPage,
          pageSize: 1000
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.supplierData = resData.data.list
      })
    },

    /**
     * 供应商选择
     */
    handleChange () {
      this.$emit('change', this.formData.supplierId)
    }
  }
}
</script>

<style lang="less"></style>
