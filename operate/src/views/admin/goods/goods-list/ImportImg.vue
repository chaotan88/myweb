<template>
  <common-tpl :footer="false" class="goods-import-img">

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
          <strong class="fw-n va-m tips"><i class="el-icon-warning"></i> 只支持导入.zzi p格式的压缩包，压缩包200M以内。</strong>
        </div>
        <div slot="main"></div>
      </high-search>
    </template>

    <template slot="main">
      <el-table :data="tableData" class="full-w">
        <el-table-column prop="main" label="导入须知">
          <template slot-scope="scope">
            <p class="title">这样创建图片压缩包：</p>
            <div class="flowchart-wrap">
              <img src="./assets/img/import-img-flowchart.png">
            </div>
            <ul>
              <li>1.本次上传图片的商品，如商品已有图片，则已有图片将全部清除，以本次上传的图片为准</li>
              <li>2.商品图片以“商品编码-X.jpg”命名，“X”为“1”、“2”、“3”、“4”、“5”,“商品编码-1.jpg”为主图，命名不可以重复。</li>
              <li>3.每个商品最多支持5张图片，图片格式仅支持JPG,JPEG,BMP,PNG,GIF格式。</li>
              <li>4.每个商品图片放在同一个文件下，文件夹以商品编码命名。例如商品编码为IRC3333，则对应文件名应为：IRC3333。</li>
              <li>5.单张图片建议大小为100KB以内。</li>
              <li>6.多个图片文件夹梳理好后放在同一文件夹下然后压缩文件夹为.ZIP格式，压缩包200M以内，压缩包名称为：商品图片.ZIP。</li>
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
.goods-import-img{
 
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

  .title{
    margin-bottom: 10px;
  }

  .flowchart-wrap{
    border: 1px solid #c8d0da;
    padding: 15px;
    background: #f8f8f8;
    border-radius: 3px;

    img{
      max-width: 100%;
    }
  }

}
</style>

<style lang="less">
.goods-import-img{

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
