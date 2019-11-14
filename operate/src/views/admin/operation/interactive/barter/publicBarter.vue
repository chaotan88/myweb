<!-- 共用详情页 -->
<template>
  <common-tpl footer>
    <!-- 主体内容 -->
    <template slot="main">
      <gray-title title="基本信息" style="margin-bottom: 20px;"></gray-title>

      <el-form  :model="formData" label-width="120px">
        <el-form-item label="会员姓名：">{{formData.cardName | filterEmpty}}</el-form-item>
        <el-form-item label="会员手机号：">{{formData.userPhone | filterEmpty}}</el-form-item>
        <el-form-item label="会员ID号：">{{formData.invitationCode  | filterEmpty}}</el-form-item>
        <hr style="margin-bottom: 20px;">
        <el-form-item label="商品标题：">{{formData.goodsTitle | filterEmpty}}</el-form-item>
        <el-form-item label="商品价格：">{{formData.goodsPrice | filterMoney() | filterEmpty('元')}}</el-form-item>
        <el-form-item label="商品描述：">{{formData.description | filterEmpty}}</el-form-item>
        <el-form-item label="商品图片：">
<!--          <div class="d-ib picture-wrap" v-for="item in formData.imageList">-->
          <div class="picture-wrap">
            <a :href="formData.mainImage | filterImgUrl" target="_blank">
              <img :src="formData.mainImage | filterImgUrl" style="width: 160px;height: 160px;" v-if="formData.mainImage">
            </a>
            <a :href="item | filterImgUrl" target="_blank" v-for="item in formData.goodsImageUrls">
              <img :src="item | filterImgUrl" style="width: 160px;height: 160px;" v-if="item">
            </a>
          </div>
        </el-form-item>
        <el-form-item label="联系方式：">{{formData.phone | filterEmpty}}</el-form-item>
        <el-form-item label="收款码：">
          <div class="picture-wrap">
            <a :href="formData.payCodeUrl | filterImgUrl" target="_blank">
              <img :src="formData.payCodeUrl | filterImgUrl" style="width: 160px;height: 160px;" v-if="formData.payCodeUrl">
            </a>
          </div>
        </el-form-item>
        <el-form-item label="微信二维码：">
          <div class="d-ib picture-wrap">
            <a :href="formData.wxUrl | filterImgUrl" target="_blank">
              <img :src="formData.wxUrl | filterImgUrl" style="width: 160px;height: 160px;" v-if="formData.wxUrl">
            </a>
          </div>
        </el-form-item>
      </el-form>
    </template>

    <template slot="other">
    </template>

    <!-- 底部 -->
     <template slot="footer">
       <el-button type="" @click="$router.go(-1)">返回</el-button>
       <template v-if="pageType === 1">
        <el-button type="primary" @click="submit(3)">审核不通过</el-button>
        <el-button type="primary" @click="submit(2)">审核通过</el-button>
      </template>
     </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      formData: {},
      pageType: ''
    }
  },
  mounted () {
    this.pageType = this.$route.path.match(/audit/gi) ? 1 : 2
    this.formData = JSON.parse(localStorage.getItem(this.$global + 'RowData'))
    if (this.formData.goodsImageUrls) {
      this.formData.goodsImageUrls = this.formData.goodsImageUrls.split(',')
    } else {
      this.formData.goodsImageUrls = []
    }
  },
  methods: {
    /**
     * 商品审核
     */
    submit (type) {
      this.$http.post('@ROOT_API/buyAttInfoController/auditAttInfo', {
        attInfoIds: [this.formData.id],
        auditStatus: type
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
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="less">
.barter-common-details{

  .picture-wrap{
    font-size: 0;
    margin-right: 15px;
    img{
      width: 120px!important;
      height: 120px!important;
    }
    .list{
      width: 80px;
      height: 80px;
      border: 1px solid #33719b;
      overflow: hidden;
      border-radius: 5px;
    }
  }
}
</style>
