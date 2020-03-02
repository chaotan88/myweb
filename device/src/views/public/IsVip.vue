<template>
    <el-dialog
        :title="$t('common.buyVip')"
        :visible="true"
        width="30%"
        class="isVip"
        :before-close="closeDialog">
        <span>{{$t("common.buyVipDesc")}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeDialog">{{$t("common.cancel")}}</el-button>
          <el-button type="primary" @click="gotoVip">{{$t("common.sure")}}</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {}
  },
  mounted () {},
  methods: {
    gotoVip () {
      this.$router.push({
        path: '/admin/recharge/rechargeVip'
      })
    },
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.isVip{
  
}
</style>