<!-- 共用详情页 -->
<template>
  <common-tpl class="NFC-detail-wrap" footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <!-- 统计 -->
      <div class="NFC-count-table">
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcReadCount | filterEmpty}}</p>
            <p>NFC总读取次数</p>
          </div>

        </div>
        <div class="count-box">
          <div class="box-item">
            <p class="count">{{nfcVerifyCount | filterEmpty}}</p>
            <p>NFC总验证次数</p>
          </div>
        </div>
      </div>
      <div class="goods-common-details">
        <goods-details></goods-details>
      </div>
    </template>
  </common-tpl>
</template>

<script>
import GoodsDetails from '../PublicDetails'
export default {
  components: {
    GoodsDetails
  },
  data () {
    return {
      nfcReadCount: null,       // nfc查询次数
      nfcVerifyCount: null,       // nfc验证次数
      // 审核结果
      formData: {
        checkResult: '2',       // 审核结果
        description: ''
      },
      applyId: '',              // 申请id
      detailsData: {},          // 详情数据
      fxUserInfo: {},           // 用户信息
      passVisible: false        // 审核弹窗
    }
  },
  mounted () {
    this.goodsId = parseInt(this.$route.query.goodsId) || ''
    this.nfcReadCount = parseInt(this.$route.query.readNum) || ''
    this.nfcVerifyCount = parseInt(this.$route.query.verifyNum) || ''
    this.fxUserInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // this.getDetails()
  },
  methods: {
    /**
     * 详情
     */
    // getDetails () {
    //   this.$http.post('@ROOT_API/goods/getGoodsDetail', {
    //     id: this.goodsId          // long  申请ID
    //   }).then(res => {
    //     let resData = res.data
    //     if (parseInt(resData.status) !== 1) {
    //       this.$message({
    //         message: resData.msg,
    //         type: 'error',
    //         duration: 1500
    //       })
    //       return false
    //     }
    //     let results = resData.data
    //     if (results) {
    //       if (results.paymentVoucher) {
    //         results.paymentVoucher = results.paymentVoucher.split(',')
    //       } else {
    //         results.paymentVoucher = []
    //       }
    //       this.detailsData = resData.data
    //       console.log('detailsData: ', this.detailsData)
    //       this.detailsData.classify = results.grandParentName + '-' + results.parentName + '-' + results.attributeTypeName
    //       // this.detailsData.whetherSpecial = this.detailsData.whetherSpecial ? '否' : '是'
    //       // this.detailsData.whetherPoints = this.detailsData.whetherPoints ? '否' : '是'
    //       // this.detailsData.whetherRecommend = this.detailsData.whetherRecommend ? '推荐' : '不推荐'
    //     }
    //   })
    // },

    /**
     * 查询NFC总读取次数
     */
    getReadCount () {
      this.$http.get('@ROOT_API/goodsNfc/getGoodsNfcCountList', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.nfcReadCount = resData.data
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 查询NFC总验证次数
     */
    getVerifyCount () {
      this.$http.get('@ROOT_API/goodsNfc/getGoodsNfcVerifyNum', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.nfcVerifyCount = resData.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .NFC-detail-wrap{

    .NFC-count-table{
      width: 100%;
      background: #fff;
      padding: 10px 0;
      box-sizing: border-box;

      .count-box{
        float: left;
        width: 50%;
        text-align: center;
        padding-bottom: 20px;

        .box-item{
          height: 120px;
          margin-right: 10px;
          background: #c2e0fe;
          font-size: 14px;
          overflow: hidden;

          .count{
            font-size: 24px;
            margin: 30px 0 0;
          }
        }
      }
      .count-box:last-child{
        .box-item{
          margin-right: 0;
          margin-left: 10px;
        }
      }
    }
    .NFC-count-table:after{
      content: '';
      display: block;
      clear: both;
    }

    .admin-gray-title{
      margin-bottom: 0;
    }

    .goods-common-details{

      .img-detail{
        /*width: */
      }

      table{
        width: 100%;
        border: 1px;
        border-collapse: collapse;
        margin-bottom: 20px;

        .img-box{
          img{
            width: 100px;
            height: 100px;
          }
        }

        td{
          font-size: 14px;
          padding: 10px;
          border: 1px solid #eee;
        }

        td:nth-child(odd) {
          width: 160px;
          text-align: right;
          border-right: none;
        }

        td:nth-child(even) {
          color: #999;
          border-left: none;
        }

      }
    }
    .inner-table{
      margin-top: 20px;
      tr{
        td:first-child{
          background: #eef1f9;
        }
      }
    }
  }
</style>
<style lang="less">
</style>
