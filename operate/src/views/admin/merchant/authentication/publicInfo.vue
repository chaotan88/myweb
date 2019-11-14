<template>
  <common-tpl class="shop-detail-wrap" footer back>
    <!-- 主体 -->
    <template slot="main">
      <gray-title :title="subTitle" style="margin-bottom: 20px;"></gray-title>
      <el-form :model="formData"  label-width="140px">
        <el-form-item label="认证申请编号：">
          {{formData.applyNo | filterEmpty}}
        </el-form-item>
        <el-form-item label="申请时间：">
          {{formData.applyTime | filterDate}}
        </el-form-item>
        <el-form-item label="会员姓名：">
          {{formData.userName | filterEmpty}}
        </el-form-item>
        <el-form-item label="会员手机号：">
          {{formData.userPhone | filterEmpty}}
        </el-form-item>
        <el-form-item label="">
          <div style="display: flex">
            <a :href="formData.cardFront | filterImgUrl" target="_blank" v-if="formData.cardFront">
              <img :src="formData.cardFront | filterImgUrl" style="width: 320px;height: 300px;margin: 5px;" v-if="formData.cardFront" title="查看大图">
            </a>
            <a :href="formData.cardBack | filterImgUrl" target="_blank" v-if="formData.cardBack">
              <img :src="formData.cardBack | filterImgUrl" style="width: 320px;height: 300px;margin: 5px;" v-if="formData.cardBack" title="查看大图">
            </a>
            <a :href="formData.businessLicense | filterImgUrl" target="_blank" v-if="formData.businessLicense">
              <img :src="formData.businessLicense | filterImgUrl" style="width: 320px;height: 300px;margin: 5px;" v-if="formData.businessLicense" title="查看大图">
            </a>
          </div>
        </el-form-item>
        <el-form-item label="审核状态：">
          {{formData.status | filterShopStatus}}
        </el-form-item>
        <el-form-item label="审核不通过原因：" v-if="formData.status === 3">
          {{formData.description | filterEmpty}}
        </el-form-item>
      </el-form>
    </template>
    <template slot="footer">
      <template v-if="pageType === 1">
        <el-button type="primary" @click="checkoutBefore(2)">审核通过</el-button>
        <el-button type="primary" @click="checkoutBefore(3)">审核不通过</el-button>
      </template>
    </template>
    <template slot="other">
      <!-- 审核 -->
      <el-dialog :title="checkType === 2 ? '确认' : '填写审核不通过原因'" :visible.sync="visible" width="540px" @close="description = ''">
        <p v-if="checkType === 2">确认审核通过吗？</p>
        <div v-else>
          <el-input v-model="description" type="textarea" rows="4" maxLength="50" placeholder="填写审核不能过原因（8-50个字）"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="dialogLoading" @click="submitForm">确 定</el-button>
          </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          id: 1          // 。。
        },
        dialogLoading: false,
        visible: false,
        subTitle: '',
        pageType: '',            // 1 审核 2 详情
        description: '',
        checkType: 2
      }
    },
    watch: {

    },
    mounted () {
      this.formData.id = this.$route.query.id
      this.pageType = this.$route.path.match(/check|detail/gi) + '' === 'check' ? 1 : 2
      this.subTitle = this.$route.path.match(/check|detail/gi) + '' === 'check' ? '商户认证审核' : '商户认证详情'
      this.getDetailsData()
    },
    methods: {
      /**
       * 获取统计数据
       */
      getDetailsData () {
        this.$http.get('@ROOT_API/merchant/getMerchantCaDetail?id=' + this.formData.id).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.formData = resData.data
        })
      },
      checkoutBefore (type) {
        this.checkType = type
        this.visible = true
      },
      /**
       * 审核
       */
      submitForm () {
        if (this.checkType === 3 && (!this.description || this.description.length < 8)) {
          this.$message({
            message: '审核原因不能为空且不能小于8个字',
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.dialogLoading = true
        this.$http.post('@ROOT_API/merchant/updateMerchantCaStatus', {
          id: this.formData.id,
          status: this.checkType,
          description: this.description
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.visible = false
          this.$router.go(-1)
        }).finally(() => {
          this.dialogLoading = false
        })
      }
    }
  }
</script>

<style lang="less">

</style>
