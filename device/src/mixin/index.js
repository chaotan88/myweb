const pageMixin = {
  data: () => {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      itemList: []
    }
  },
  methods: {
    changePage (val) {
      this.pageNum = val
      this.findData()
    },
    deleteItem (row) {
      this.$confirm(this.$t('common.isSubmitDelete'), this.$t('common.prompt'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.deleteSubmit(row)
      }).catch(() => {})
    }
  }
}

export {pageMixin}
