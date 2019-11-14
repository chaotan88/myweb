<template>
  <common-tpl :footer="false" class="goods-import-data">

    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">

        <div slot="search" class="upload-wrap">
          <dl class="d-ib va-m pos-r">
            <dt class="ta-c pos-a">浏览</dt>
            <dd>请选择导入文件
              <el-upload
                :action="uploadUrl"
                :limit="1"
                :on-remove="handleUploadRemove"
                :on-exceed="handleUploadExceed"
                :on-success="handleUploadSuccess"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </dd>
          </dl>
          <strong class="fw-n va-m tips"><i class="el-icon-warning"></i> 导入前请先下载导入模块，这里只导入商品基础资料。</strong>
        </div>
        <div slot="edit">
          <el-button>
            <svg class="icon va-m icon-msnui-download" aria-hidden="true">
              <use xlink:href="#icon-msnui-download"></use>
            </svg>
            下载导入模板
          </el-button>
          <el-button>
            <svg class="icon va-m icon-msnui-download" aria-hidden="true">
              <use xlink:href="#icon-msnui-download"></use>
            </svg>
            下载平台属性分类
          </el-button>
          <el-button>
            <svg class="icon va-m icon-msnui-download" aria-hidden="true">
              <use xlink:href="#icon-msnui-download"></use>
            </svg>
            下载商品分类
          </el-button>
        </div>
        <div slot="main"></div>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" class="full-w">
        <el-table-column prop="main" label="导入须知">
          <template slot-scope="scope">
            <p class="title">商品基础资料模版：</p>
            <table class="full-wrap example-wrap">
              <tr>
                <th></th>
                <th><i>*</i>商品编码</th>
                <th><i>*</i>商品名称</th>
                <th><i>*</i>进货价</th>
                <th><i>*</i>销售价</th>
                <th><i>*</i>特卖价格</th>
                <th><i>*</i>是否推荐商品</th>
                <th><i>*</i>是否上架</th>
                <th><i>*</i>是否支持积分兑换</th>
                <th><i>*</i>商品大类</th>
                <th><i>*</i>商品中类</th>
                <th><i>*</i>商品小类</th>
                <th><i>*</i>平台属性大类</th>
                <th><i>*</i>平台属性中类</th>
                <th><i>*</i>平台属性小类</th>
                <th><i>*</i>属性</th>
                <th><i>*</i>属性值</th>
              </tr>
              <tr>
                <td>示例：</td>
                <td>124d</td>
                <td>iphon6</td>
                <td>4788</td>
                <td>4788</td>
                <td>4788</td>
                <td>是</td>
                <td>是</td>
                <td>是</td>
                <td>3C产品</td>
                <td>智能设备</td>
                <td>智能手机</td>
                <td>3C产品</td>
                <td>智能设备</td>
                <td>智能手机</td>
                <td>颜色#尺寸#内存</td>
                <td>颜色#尺寸#内存</td>
              </tr>
            </table>
            <ul>
              <li>1.导入文件仅支持xls或xlsx格式，大小不超过2M。  </li>
              <li>2.商品编码为必填项，不允许重复，必须数字、字母或数字字母组合。</li>
              <li>3.商品名称必填，长度不能超过25个字。  </li>
              <li>4.销售价（必填）必须为大于0的数字，且只允许保留两位小数。  </li>
              <li>5.特卖价格（非必填）为商品促销价格，如果设置了特卖价格，商品销售时展示特卖价格，必须为大于0的数字，且只允许保留两位小数。</li>
              <li>6.<span>是否推荐商品（只允许填“是”、“否”）</span>表示商品是否为推荐款；<span>是否上架（只允许填“是”、“否”）</span>，是代表上架会在商城展示商品</li>
              <li>7.商品分类（商品大类、商品中类、商品小类）必填，请按照系统中已有的分类填写；<span>请下载最新的商品分类。</span></li>
              <li>8.平台属性分类（商品大类、商品中类、商品小类）必填，请按照系统中已有的平台属性分类和平台属性分类下已关联的属性填写；<span>请下载最新的商品分类。</span></li>
              <li>9.属性和属性值支持填写多个，多个以<span>“#”</span>分割。  </li>
              <li>10.表头中带<span>“*”</span>为必填项。  </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template slot="footer"></template>

  </common-tpl>
</template>

<script>
export default {
  data () {
    return {
      fileList: [],
      tableData: [{main: ''}],
      userInfo: {}         // 用户信息
    }
  },
  computed: {
    /**
     * 上传地址
     */
    uploadUrl () {
      return this.$dm.ROOT_API + 'upload/uploadimg/malladmin/source' + this.$global.PARAMS + this.userInfo.token
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
  },
  methods: {
    /**
     * 上传文件超过最大值
     */
    handleUploadExceed () {},

    /**
     * 上传成功
     */
    handleUploadSuccess () {},

    /**
     * 移除文件
     */
    handleUploadRemove () {}
  }
}
</script>

<style lang="less" scoped>
.goods-import-data{
 
  /* -------------------- { 上传 } -------------------- */
  .upload-wrap{
    dl{
      width: 260px;
      height: 36px;
      line-height: 34px;
      font-size: 14px;
      border: 1px solid #c8d0da;
      padding-left: 100px;
      margin-right: 10px;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 20px;

      dt{
        color: #fff;
        width: 80px;
        height: 36px;
        background: #c8d0da;
        left: 0;
      }

      dd{
        color: #999;
      }
    }

    .tips{
      color: #f39817;
      font-size: 12px;
    }
  }

  .title{
    margin-bottom: 10px;
  }

  .example-wrap{
    border: 1px solid #c8d0da;
    border-collapse: collapse;

    th, td{
      text-align: center;
      font-size: 12px;
    }

    th{
      color: #999;
      font-weight: normal;
      border: 1px solid  #dddfe2;
      background: #e6e6e6;

      i{
        color: #f39817;
        margin-right: 2px;
      }
    }

    td{
      border: 1px solid  #eaecef;
    }
  }

  ul{
    margin-top: 30px;

    li{
      color: #6c6c6c;
      font-size: 12px;
      margin-bottom: 5px;

      span{
        color: #f39817;
      }
    }
  }

  .icon{
    fill: #2eaaf7;
    width: 16px;
    height: 16px;
  }
}
</style>

<style lang="less">
.goods-import-data{

  .el-table{
    .el-table__body{
      .cell, .cell:hover, .el-table_1_column_1, .el-table_1_column_1:hover{
        background: #fff !important;
      }

      .cell{
        padding: 10px 20px;
      }
    }
  }
}
</style>
