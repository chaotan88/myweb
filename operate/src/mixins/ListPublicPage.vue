<!-- 带分页列表页面 -->
<template></template>

<script>
export default {
  data () {
    return {
      formData: {},     // 表单数据
      copyFormData: {}, // 拷贝表单数据
      pageData: {       // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  mounted () {
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
  },

  methods: {
    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 清空重置搜索
     */
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.formData = this.$Utils.deepCopy(this.copyFormData)
      localStorage.removeItem(this.$global.FORM_DATA)
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      if (this.pageData.currentPage === page) {
        this.getListData()
      } else {
        this.pageData.currentPage = page
        this.$router.push({query: {page: this.pageData.currentPage}})
      }
    }
  }
}
</script>

<style></style>
