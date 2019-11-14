<template>
    <div class="specsParamer">
      <ul v-if="specsParamersData.length > 0">
        <li v-for="(v,index) in specsParamersData" class="clr">
          <!--选择属性-->
          <template v-if="v.goodsAttributeType==1">
            <i>{{v.attributeName}}</i>
            <div class="value">
              <span v-for="(item,i) in v.attributeValList">
                <em v-if="i!==0"> / </em><b>{{item.attributeVal}}</b>
              </span>
            </div>
          </template>
          <!--文本属性-->
          <template v-if="v.goodsAttributeType==2">
            <i>{{v.attributeName}}</i>
            <span>{{v.goodsAttributeVal}}</span>
          </template>
        </li>
      </ul>
      <!--无数据-->
      <template v-else>
        <div class="noData" v-if="isShowNoData">暂无内容</div>
      </template>
    </div>
</template>

<script>
  export default {
    /**
     * @basicGoodsInfor规格参数数据
     * @isShowNoData 是否显示无数据提示
    */
    props: {
      basicGoodsInfor: {
        type: Object,
        default: ''
      },
      isShowNoData: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        specsParamersData: []
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.specsParamersFillter()
      })
    },
    watch: {
      basicGoodsInfor () {
        this.specsParamersFillter()
      }
    },
    methods: {
      /**
       * 规格参数过滤
      */
      specsParamersFillter () {
        let datas = this.basicGoodsInfor.goodsAttributeList
        this.specsParamersData = []
        if (datas && datas.length > 0) {
          datas.forEach((item) => {
            if (item.attributeValList.length > 0) {
              this.specsParamersData.push(item)
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang=less>
    .noData{
      font-size: .28rem;
      text-align: center;
      margin-top: 1.5rem;
    }
    .specsParamer {
      padding-bottom: 1.0rem;
      font-size: .28rem;
      ul{
        li{
          padding:0.2rem 0.3rem;
          border-bottom: 1px solid #eee;
          display:flex;
          align-items:center;
          i{
            display: inline-block;
            width: 1.5rem;
            font-weight: bold;
          }
          span{
            display: inline-block;
            line-height: 1.6em;
          }
          .value{
            width: 5.4rem;
            float: right;
          }
        }
      }
    }
</style>
