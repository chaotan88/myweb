<!-- 商品采购-详情 -->
<template>
  <common-tpl class="purchase-wrap pos-r">

    <!-- 主体 -->
    <template slot="main">
      <!-- 属性分类 -->
      <div class="attribute-wrap">
        <table cellspacing="0" width="100%">
          <tr>
            <td>
              <div class="list" style="width: 50%">
                <span class="d-ib">商品属性：</span>
                <span class="d-ib" style="width: 70%">{{formData.attribute}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="list">
                <span class="d-ib">商品分类：</span>
                <el-button type="primary" plain disabled>主要按钮</el-button>
                <el-button disabled>默认按钮</el-button>
                <el-button disabled>默认按钮</el-button>
              </div>
            </td>
          </tr>
           <tr>
            <td>
              <div class="list">
                <span class="d-ib">品牌：</span>
                <el-button type="primary" plain disabled>主要按钮</el-button>
                <el-button disabled>默认按钮</el-button>
                <el-button disabled>默认按钮</el-button>
              </div>
            </td>
          </tr>
           <tr>
            <td>
              <div class="list">
                <span class="d-ib">屏幕尺寸：</span>
                <el-button type="primary" plain disabled>主要按钮</el-button>
                <el-button disabled>默认按钮</el-button>
                <el-button disabled>默认按钮</el-button>
              </div>
            </td>
          </tr>
           <tr>
            <td>
              <div class="list">
                <span class="d-ib">型号：</span>
                <el-button type="primary" plain disabled>主要按钮</el-button>
                <el-button disabled>默认按钮</el-button>
                <el-button disabled>默认按钮</el-button>
              </div>
            </td>
          </tr>
           <tr>
            <td>
              <div class="list">
                <span class="d-ib">内存：</span>
                <el-button type="primary" plain disabled>主要按钮</el-button>
                <el-button disabled>默认按钮</el-button>
                <el-button disabled>默认按钮</el-button>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- 商品分类 -->
      <div class="wares-wrap">
        <table cellspacing="0">
          <tr>
            <td>
              <div class="list">
                <span class="d-ib">商品分类：</span>
                <span class="d-ib">{{formData.attribute}}</span>
              </div>
            </td>
            <td>
              <div class="list">
                <span class="d-ib">商品名称：：</span>
                <span class="d-ib">{{formData.attribute}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="list">
                <span class="d-ib">商品编码：</span>
                <span class="d-ib">{{formData.attribute}}</span>
              </div>
            </td>
            <td>
              <div class="list">
                <span class="d-ib">价格：</span>
                <span class="d-ib">{{formData.attribute}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="list">
                <span class="d-ib">特卖价格：</span>
                <span class="d-ib">{{formData.attribute}}</span>
                <strong class="d-ib"><i class="el-icon-warning"></i>如果维护了特卖价格，商品销售时以特卖价格为准</strong>
              </div>
            </td>
            <td>
              <div class="list">
                <span class="d-ib">预计收益：</span>
                <span class="d-ib">{{formData.attribute}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="picture">
              <div class="list">
                <span class="d-ib fl-l">商品图片：</span>
                <div class="picture-box fl-l"></div>
                <div class="picture-box fl-l"></div>
                <span class="d-ib">共2张</span>
                <strong class="d-ib"><i class="el-icon-warning"></i>图片建议尺寸：500 * 500px ；建议大小：100KB以内</strong>
              </div>
            </td>
          </tr>
          <tr>
            <td class="details">
             <div class="list">
                <span class="d-ib fl-l">详情描述：</span>
                <div class="details-box fl-l"></div>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span>是否推荐商品：</span>
              <span>
                <el-radio disabled v-model="radio" label="1">是</el-radio>
                <el-radio disabled v-model="radio" label="2">否</el-radio>
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div class="clear"></div>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">取消</el-button>
      <el-button>审核驳回</el-button>
      <el-button>审核通过</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          attribute: '8888888888',         // 属性分类
          radio: '1'
        },
        dialogImageUrl: '',          // 上传图片路径
        dialogVisible: false         // 上传
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
        })
      }
    }
  }
</script>

<style lang='less' scoped>
.purchase-wrap{
  padding: 30px 30px 0 30px;
  background: #fff;

  /*-----------------全局table样式-----------------*/
  table{
    width: 100%;
    border-collapse: collapse;
    td{
      width: 50%;
      color: #6c6c6c;
      height: 60px;
      /*line-height: 55px;*/
      /*border: 1px solid #c8d0da;*/
      padding-left: 20px;

      .list{
        height: 70px;
        overflow: hidden;
        span{
          width: 110px;
          height: 35px;
        }
        span:nth-child(2){
          width: 70%;
          height: 35px;
          line-height: 35px;
          text-align: left;
          border: 1px solid #c8d0da;
          border-radius: 3px;
          background: #f8f8f8;
          padding-left: 20px;
        }
        strong{
          color: #f39817;
          font-size: 12px;
          font-weight: normal;
          margin-left: 110px;

          i{
            margin: 0 5px;
          }
        }
      }
    }

    .picture{
      height: 180px;
      .list{
        height: 180px;
      }
      
      .picture-box{
        width: 150px;
        height: 150px;
        border: 1px solid #c8d0da;
        background: #f8f8f8;
      }
      .picture-box:nth-child(2){
        margin-right: 20px;
      }
    }

    .details{
      height: 180px;
      .list{
        height: 180px;
      }
      .details-box{
        width: 80%;
        height: 178px;
        border: 1px solid #c8d0da;
      }
    }

    td:nth-child(1){
    }

    td:nth-child(2){
    }
  }
  /*-----------------商品属性------------*/

  .attribute-wrap{
    padding: 30px;
    border-bottom: 2px solid #f0f0f0;
  }

  /*-----------------商品分类------------*/

  .wares-wrap{
    padding: 30px;
  }

  .button-wrap{
    bottom: 25px;
    left: 50%;
    margin-left: -100px;
  }
}
</style>
