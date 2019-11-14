<!-- 共用详情页 -->
<template>
  <common-tpl footer back>
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details" v-if="detailsData.platformTypeGrandParentId">

        <gray-title title="基本信息"></gray-title>
        <table>
          <tr>
            <td>主营类目：</td>
            <td>{{detailsData.platformTypeGrandParentName}} - {{detailsData.platformTypeParentName}} - {{detailsData.platformTypeName}}</td>
          </tr>
          <tr>
            <td class="va-t">商品参数：</td>
            <td>
              <template v-if="!platformAttributeData.length">{{'' | filterEmpty}}</template>
              <template v-else>
                <dl class="goods-spec-wrap" v-for="item in platformAttributeData" v-if="item.isSelected && item.attributeValList.length">
                  <dt class="d-ib">{{item.attributeName}}：</dt>
                  <dd class="d-ib">
                    <span v-for="list in item.attributeValList" v-if="list.isSelected">{{list.attributeVal}}</span>
                  </dd>
                </dl>
              </template>
            </td>
          </tr>
          <tr>
            <td>品牌：</td>
            <td>{{detailsData.brandName | filterEmpty}}</td>
          </tr>
          <tr>
            <td>商品名称：</td>
            <td>{{detailsData.goodsName | filterEmpty}}</td>
          </tr>
          <!-- <tr>
            <td>商品分类：</td>
            <td>{{detailsData.goodTypeGrandParentName}} - {{detailsData.goodTypeParentName}} - {{detailsData.goodTypeName}}</td>
          </tr> -->
          <tr>
            <td>商品编码：</td>
            <td>{{detailsData.goodsNo | filterEmpty}}</td>
          </tr>
          <tr>
            <td class="va-t">商品主图：</td>
            <td>
              <div class="pictrue-wrap">
                <a :href="detailsData.mainImage | filterImgUrl" target="_blank" class="d-ib">
                  <span class="d-ib cursor list">
                    <img :src="detailsData.mainImage | filterImgUrl">
                  </span>
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td class="va-t">商品图片：</td>
            <td>
              <div class="d-ib pictrue-wrap" v-for="item in detailsData.imageList">
                <a style="margin-right: 10px;" :href="item.imageUrl | filterImgUrl" target="_blank">
                  <span class="d-ib cursor list">
                    <img :src="item.imageUrl | filterImgUrl">
                  </span>
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td>商品视频：</td>
            <td>
              <template v-if="!detailsData.goodsVideoUrl">{{'' | filterEmpty}}</template>
              <video :src="detailsData.goodsVideoUrl | filterImgUrl" controls="controls" height="150" v-else>您的浏览器不支持 video 标签。</video>
            </td>
          </tr>
          <!-- <tr v-for="item in platformAttributeData" v-if="item.attributeValList.length">
            <td>{{item.attributeName}}：</td>
            <td>
              <span v-for="list in item.attributeValList" v-if="list.isSelected">{{list.attributeVal}}</span>
            </td>
          </tr> -->
        </table>

        <gray-title title="规格设置"></gray-title>
        <table>
          <tr>
            <td>规格设置：</td>
            <td>{{parseInt(detailsData.multStandard) === 1 ? '多规格' : '统一规格'}}</td>
          </tr>
          <template v-if="parseInt(detailsData.multStandard) === 0">
            <tr>
              <td>条形码：</td>
              <td>{{detailsData.goodsSkuList[0].externalNo | filterEmpty}}</td>
            </tr>
            <tr>
              <td>当前库存：</td>
              <td>{{detailsData.goodsSkuList[0].goodsNum | filterEmpty}}</td>
            </tr>
            <tr>
              <td>进货价：</td>
              <td>{{detailsData.goodsSkuList[0].buyingPrice | filterMoney | numToFixed | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>销售价：</td>
              <td>{{detailsData.goodsSkuList[0].goodsPrice | filterMoney | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>利润率：</td>
              <td>
                <template v-if="detailsData.whetherSpecial === 1">
                   {{((detailsData.goodsSkuList[0].goodsSpecialPrice - detailsData.goodsSkuList[0].buyingPrice) / detailsData.goodsSkuList[0].goodsSpecialPrice * 100).toFixed(2) | filterEmpty('%')}}
                </template>
                <template v-else>
                  {{((detailsData.goodsSkuList[0].goodsPrice - detailsData.goodsSkuList[0].buyingPrice) / detailsData.goodsSkuList[0].goodsPrice * 100).toFixed(2) | filterEmpty('%')}}
                </template>
                <!-- {{detailsData.discount | filterEmpty('%')}} -->
                <!-- <template v-if="parseInt(detailsData.goodsSkuList[0].whetherSpecial) === 1">
                  {{((detailsData.goodsSkuList[0].goodsSpecialPrice - detailsData.goodsSkuList[0].buyingPrice) / detailsData.goodsSkuList[0].goodsSpecialPrice).toFixed(2) | filterEmpty}}
                </template>
                <template v-else>
                  {{((detailsData.goodsSkuList[0].goodsPrice - detailsData.goodsSkuList[0].buyingPrice) / detailsData.goodsSkuList[0].goodsPrice).toFixed(2) | filterEmpty}}
                </template> -->
              </td>
              <td >
                
              </td>
            </tr>
            <tr>
              <td>是否特卖商品：</td>
              <td>{{parseInt(detailsData.goodsSkuList[0].whetherSpecial) === 1 ? '是' : '否'}}</td>
            </tr>
            <tr v-if="parseInt(detailsData.goodsSkuList[0].whetherSpecial) === 1">
              <td>特卖价格：</td>
              <td>{{detailsData.goodsSkuList[0].goodsSpecialPrice | filterEmpty('元')}}</td>
            </tr>
            <tr>
              <td>积分兑换：</td>
              <td>{{parseInt(detailsData.goodsSkuList[0].whetherPoints) === 1 ? '是' : '否'}}</td>
            </tr>
            <tr v-if="parseInt(detailsData.goodsSkuList[0].whetherPoints) === 1">
              <td>积分兑换价格：</td>
              <td>{{detailsData.goodsSkuList[0].points | filterMoney | filterEmpty}}</td>
            </tr>
            <tr>
              <td>获得积分：</td>
              <td>{{parseInt(detailsData.goodsSkuList[0].whetherGetPoint) === 1 ? '是' : '否'}}</td>
            </tr>
            <tr v-if="parseInt(detailsData.goodsSkuList[0].whetherGetPoint) === 1">
              <td>获得积分数：</td>
              <td>{{parseInt(detailsData.goodsSkuList[0].consumeGetPoint) | filterMoney | filterEmpty}}</td>
            </tr>
          </template>
          <template v-else>
            <!-- <tr>
              <td>默认销售价：</td>
              <td>{{detailsData.goodsPrice | filterMoney | filterEmpty('元')}}</td>
            </tr> -->
            <tr>
              <td class="va-t">规格值：</td>
              <td>
                <table class="sku-table">
                  <tr>
                    <th v-for="item in skuTitle">{{item}}</th>
                    <th>条形码</th>
                    <th>当前库存</th>
                    <th>进货价</th>
                    <th>销售价</th>
                    <th>利润率</th>
                    <th>是否特卖</th>
                    <th>积分兑换</th>
                    <th>获得积分</th>
                  </tr>
                  <tr v-for="item in detailsData.goodsSkuList" v-if="detailsData.goodsSkuList.length">
                    <td v-for="list in item.valueList">{{list}}</td>
                    <td>{{item.externalNo}}</td>
                    <td>{{item.goodsNum}}</td>
                    <td>{{item.buyingPrice}}</td>
                    <td>{{item.goodsPrice}}</td>
                    <td>
                      <template v-if="item.whetherSpecial ===1">
                        {{((item.goodsSpecialPrice - item.buyingPrice) / item.goodsSpecialPrice * 100).toFixed(2) | filterEmpty('%')}}
                      </template>
                      <template v-else>
                        {{((item.goodsPrice - item.buyingPrice) / item.goodsPrice) * 100 | numToFixed | filterEmpty('%')}}
                      </template>
                      <!-- {{item.discount | filterEmpty('%')}} -->
                      <!-- <template v-if="item.whetherSpecial === 1">{{((item.goodsSpecialPrice - item.buyingPrice) / item.goodsSpecialPrice) * 100 | numToFixed | filterEmpty('%')}}</template>
                      <template v-else>{{((item.goodsPrice - item.buyingPrice) / item.goodsPrice) * 100 | numToFixed | filterEmpty('%')}}</template> -->
                    </td>
                    <td>
                      <template v-if="parseInt(item.whetherSpecial) === 1">{{item.goodsSpecialPrice | filterMoney | filterEmpty}}</template>
                      <template v-else>否</template>
                    </td>
                    <td>{{item.whetherPoints ? item.points : '否'}}</td>
                    <td>{{item.whetherGetPoint ? item.consumeGetPoint : '否'}}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="10">
                      <no-data></no-data>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </template>
        </table>

        <gray-title title="其它信息"></gray-title>
        <table>
          <tr>
            <td class="va-t">详细描述：</td>
            <td>
              <template v-if="!detailsData.remark">--</template>
              <div class="remark" v-html="detailsData.remark" v-else></div>
            </td>
          </tr>
          <!-- <tr>
            <td>排序：</td>
            <td>
              <template v-if="detailsData.goodsSort === null || isNaN(detailsData.goodsSort)">{{'' | filterEmpty}}</template>
              <template v-else>{{detailsData.goodsSort}}</template>
            </td>
          </tr> -->
          <tr>
            <td>关 键 词：</td>
            <td>{{detailsData.keyWords | filterEmpty}}</td>
          </tr>
        </table>
      </div>
      <no-data style="padding: 150px 0;" v-else></no-data>
    </template>

    <template slot="other">
      <!-- 审核不通过 -->
      <el-dialog
        title="审核驳回"
        :visible.sync="rejectVisible"
        width="480px">
        确定是否审核驳回？
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectVisible = false">取 消</el-button>
          <el-button type="primary" @click="examineHandle(2)">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 通过提示 -->
      <el-dialog
        title="审核通过"
        :visible.sync="passVisible"
        width="480px">
        确定是否审核通过？
        <span slot="footer" class="dialog-footer">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="examineHandle(1)">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  
    <!-- 底部 -->
    <template slot="footer">
      <!-- <el-button type="primary" @click="$router.push({path: '/admin/goods/manage/edit', query: {id: goodsId}})" v-if="!$route.path.match(/examine/gi)">编辑</el-button> -->
      <!-- <template v-if="detailsData.reviewStatus === 0">
        <el-button type="danger" @click="rejectVisible = true">审核不通过</el-button>
        <el-button type="primary" @click="passVisible = true">审核通过</el-button>
      </template> -->
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      goodsId: '',                // 商品id
      detailsData: {},            // 商品详情
      platformAttributeData: [],  // 平台属性
      skuTitle: [],               // sku标题
      passVisible: false,         // 审核通过弹窗
      passId: '',                 // 审核通过id
      rejectVisible: false,       // 审核不通过弹窗
      rejectId: ''                // 审核不通过id
    }
  },
  mounted () {
    this.goodsId = parseInt(this.$route.query.id) || ''
    if (this.goodsId) this.getDetailsData()
  },
  methods: {
    /**
     * 获取详情
     */
    getDetailsData () {
      this.$http.post('@ROOT_API/goods/getGoodsDetail', {
        id: this.goodsId
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
        let results = resData.data
        results.goodsSkuList.forEach((row, index) => {
          row.valueList = []
          row.goodsSkuValList.forEach((list) => {
            row.valueList.push(list.standardValName)
            if (index === 0) this.skuTitle.push(list.standardName)
          })
          this.inpBlur(row, 'buyingPrice')
          this.inpBlur(row, 'goodsPrice')
        })
        this.detailsData = results || {}
        this.getAttributeData(this.detailsData.id)
      })
    },

    /**
     * 根据商品id查询平台属性及属性值
     */
    getAttributeData (id) {
      this.$http.post('@ROOT_API/goods/getAttributeValByTypeByGoodsId', {
        id
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
        let flag = false
        resData.data.forEach((row) => {
          row.attributeValList.forEach((list) => {
            if (list.isSelected) {
              row.isSelected = true
              flag = true
            }
          })
        })
        this.platformAttributeData = flag === true ? resData.data : []
      })
    },

    /**
     * 商品审核 [0、未审核 1、审核通过 2、审核不通过]
     */
    examineHandle (type) {
      this.$http.post('@ROOT_API/goods/updateGoodsReviewStatus', {
        id: this.detailsData.id,
        reviewStatus: type
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
        setTimeout(() => {
          this.$router.push('/admin/goods/examine/index')
        }, 500)
        this.detailsData.reviewStatus = 1
        this.rejectVisible = false
        this.passVisible = false
      })
    },

    /**
     * 自动补全两位小数
     */
    inpBlur (obj, key) {
      this.$Utils.blurAutoCompletion(obj, key)
    }
  }
}
</script>

<style lang="less" scoped>
.goods-common-details{

  .goods-spec-wrap{
    margin-bottom: 5px;

    dd{
      span{
        margin-right: 10px;
      }
    }
  }

  table{
    width: 100%;
    border: 1px solid #f1f4f7;
    border-collapse: collapse;
    margin-bottom: 20px;

    td{
      border-bottom: 1px solid #f1f4f7;
      font-size: 15px;
      padding: 20px 10px;
    }

    td:nth-child(odd) {
      color: #666;
      width: 200px;
      text-align: right;
      /*background: #f8f8f8;*/
    }

    td:nth-child(even) {
      color: #333;
    }
  }

  .pictrue-wrap{
    font-size: 0;
    margin-right: 15px;

    .list{
      width: 80px;
      height: 80px;
      border: 1px solid #33719b;
      overflow: hidden;
      border-radius: 5px;

      img{
        width: 100%;
        height: 100%;
      }
    }
  }

  .sku-table{
    th, td{
      color: #666 !important;
    }

    th{
      height: 30px;
      line-height: 30px;
      font-weight: normal;
      background: #eef1f9;
    }

    td{
      text-align: center;
    }

    td:nth-child(odd) {
      width: auto !important;
      text-align: center;
    }
  }
}
</style>
