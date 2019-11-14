<!-- 商品采购 -->
<template>
  <common-tpl class="manage-wrap">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入商品名称/商品编码" @click.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search"></i>
        </div>
        <div slot="edit">
          <template v-if="pageType === 1">
            <el-button @click="batchHandle(1)">批量下架</el-button>
            <el-button @click="batchHandle(2)">批量上架</el-button>
          </template>
        </div>
        <div class="reset-btn" slot="btn">清空</div>
        <div slot="main">
          <el-form ref="form" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="商品名称">
              <el-input v-model.trim="formData.name" placeholder="请输入商品名称/商品编码"></el-input>
            </el-form-item>
            <el-form-item label="" class="pos-r">
              <el-dropdown class="ta-r pos-a time-type-wrap" @command="commandHandle">
                <span class="cursor el-dropdown-link">
                  {{formData.timeTypeMsg}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">新增时间</el-dropdown-item>
                  <el-dropdown-item command="2">上下架时间</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-date-picker
                v-model.trim="formData.time"
                type="daterange"
                range-separator="至"
                start-placeholder="2018-1-22"
                end-placeholder="2018-1-23">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="上下架状态">
              <el-select v-model="formData.status" placeholder="选择上下架状态">
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性分类">
              <el-select v-model.trim="formData.classify" placeholder="选择属性分类">
                <template v-for="item in 5">
                  <el-option :label="'分类名称' + item" :value="item"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="clear"></div>
        </div>
      </high-search>
      
    </template>
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%"
        @select="selectionChange">
        <el-table-column type="selection" width="40" fixed="left"></el-table-column>
        <el-table-column prop="pictrue" label="商品图片"></el-table-column>
        <el-table-column prop="code" label="商品编码"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="300"></el-table-column>
        <el-table-column prop="price" label="采购价（元）" width="120"></el-table-column>
        <el-table-column prop="price" label="分佣比例（%）" width="120"></el-table-column>
        <el-table-column prop="price" label="销售价（元）" width="120"></el-table-column>
        <el-table-column prop="shelves" label="上下架状态" width="120" fixed="right">
          <template slot-scope="scope">
            <template v-if="pageType === 1">
              {{scope.row.shelves ? '上架' : '下架'}}
              <el-switch
                v-model="scope.row.shelves"
                active-color="#56ade8"
                inactive-color="#ccc"
                @change="statusChange(scope.row)">
              </el-switch>
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push('/admin/goods/purchase/details')"><i class="icon el-icon-view"></i>详情</div>
                </el-dropdown-item>
                <template v-if="pageType === 1">
                  <el-dropdown-item v-if="scope.row.shelves">
                    <div @click="deleteTipsHandle(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                  </el-dropdown-item>
                </template>
                <template v-else>
                  <el-dropdown-item>
                    <div @click="purchaseBeforeHandle(scope.row)"><i class="icon el-icon-delete"></i>采购</div>
                  </el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange"
        v-if="pageData.total">
      </el-pagination>
    </template>

    <template slot="other">
      <!-- 删除提示 -->
      <el-dialog
        title="删除商品"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除商品？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 采购提示 -->
      <el-dialog
        title="采购商品"
        :visible.sync="purchaseVisible"
        width="480px">
        确定是否采购此商品？
        <span slot="footer" class="dialog-footer">
          <el-button @click="purchaseVisible = false">取 消</el-button>
          <el-button type="primary" @click="purchaseHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 上架 选择商品分类 -->
      <el-dialog
        title="选择商品分类"
        :visible.sync="selectClassifyVisible"
        width="480px">
        <div>
          <el-dropdown trigger="click" placement="bottom-start">
            <div class="pos-r select-wrap" ref="dropdownLink" id="dropdownLink">
              <el-input placeholder="请选择商品分类" class="pos-r" readonly v-model="selectValue" clearable>
                <i class="pos-a el-icon-arrow-down el-icon--right" slot="suffix"></i>
              </el-input>
            </div>
            <el-dropdown-menu slot="dropdown">
              <goods-classify :initData="multipleMenu" :resData="multipleMenuData" @change="classifySelectChange"></goods-classify>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="selectClassifyVisible = false">取 消</el-button>
          <el-button type="primary" @click="selectClassifyHandle()">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import ClassifyData from '@/assets/js/ClassifyData'
import Utils from '@/global/function'
export default {
  data () {
    return {
      pageType: 1,            // 页面类型［1、已采购，2、待采购]
      // 列表数据
      tableData: [{
        pictrue: '../img/',
        code: '123321',
        name: '东阿阿胶桃花姬阿胶糕',
        price: '2333',
        status: 1,
        shelves: true,
        time: '2018-3-22 21:24:50'
      }, {
        pictrue: '../img/',
        code: '123321',
        name: '东阿阿胶桃花姬阿胶糕',
        price: '2333',
        status: 1,
        shelves: true,
        time: '2018-3-22 21:24:50'
      }],
      formData: {
        name: '',
        time: [],
        timeType: '',
        timeTypeMsg: '新增时间',
        status: '',
        classify: ''
      },
      deleteVisible: false,   // 删除弹窗
      deleteId: '',           // 删除id
      purchaseVisible: false, // 采购弹窗
      purchaseId: false,      // 采购id
      selectClassifyVisible: false, // 采购弹窗
      selectClassifyId: false,      // 采购id
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      statusData: {},     // 上下架对象
      multipleMenu: {     // 多选菜单
        large: {          // 大类
          id: '',
          name: ''
        },
        middle: {         // 中类
          id: '',
          name: ''
        },
        small: {          // 小类
          id: '',
          name: ''
        }
      },
      multipleMenuData: [],   // 商品分类数据
      selectValue: '',        // 选择商品分类结果
      selectionRes: []        // 多选结果
    }
  },
  mounted () {
    if (!this.$route.path.match(/index/gi)) {
      this.pageType = 2
    }
    this.pageData.currentPage = this.$route.query.page || 1
    // this.getListData()
    this.multipleMenuData = ClassifyData
  },
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.$http.post('@ROOT_API/', {
        currentPage: this.pageData.currentPage
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
      })
    },

    /**
     * 高级搜索时间类型选择
     */
    commandHandle (command) {
      this.formData.timeType = command
      this.formData.timeTypeMsg = parseInt(command) === 1 ? '新增时间' : '上下架时间'
    },

    /**
     * 分页操作
     */
    pageChange () {},

    /**
     * 搜索
     */
    searchHandle () {
      this.pageData.currentPage = 1
      // this.getListData()
    },

    /**
     * table 多选
     */
    selectionChange (selection, row) {
      this.selectionRes = selection
    },

    /**
     * 批量上下架
     */
    batchHandle (type) {
      if (!type) return false
      let text = ''
      if (type === 1) {
        text = '下架'
      } else {
        text = '上架'
      }
      if (!this.selectionRes.length) {
        this.$message({
          message: '请选择需要' + text + '的商品',
          type: 'error',
          duration: 1500
        })
        return false
      }
      this.$http.post('@ROOT_API/', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
      })
    },

    /**
     * 状态改变
     */
    statusChange (row) {
      this.statusData = row
      if (row.shelves === true) {
        row.shelves = false
        this.selectClassifyVisible = true
      }
    },

    /**
     * 多级菜单选择
     */
    classifySelectChange (results) {
      this.multipleMenu = results
      this.selectValue = [results.large.name, results.middle.name, results.small.name].join(' / ')
      if (results.small.id || results.small.name) {
        let obj = document.getElementById('dropdownLink')
        Utils.triggerEvent(obj)
      }
    },

    /**
     * 确定选择商品分类
     */
    selectClassifyHandle () {
      if (!this.multipleMenu.small.name) {
        this.$message({
          message: '请选择商品分类',
          type: 'error',
          duration: 1500
        })
        return false
      }
      // 测试
      this.selectClassifyVisible = false
      this.statusData.shelves = true

      // this.$http.post('@ROOT_API/', {}).then((res) => {
      //   let resData = res.data
      //   if (resData.status !== '1') {
      //     this.$message({
      //       message: resData.msg,
      //       type: 'error',
      //       duration: 1500
      //     })
      //     return false
      //   }
      //   // success...
      // })
    },

    /**
     * 复制
     */
    copyHandle (row) {},

    /**
     * 删除提示
     */
    deleteTipsHandle (row) {
      this.deleteVisible = true
      // this.deleteId = row.id
    },

    /**
     * 删除操作
     */
    deleteHandle () {
      this.$http.post('@ROOT_API/', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
      })
    },

    /**
     * 点击采购弹窗提示
     */
    purchaseBeforeHandle (row) {
      this.purchaseVisible = true
      this.purchaseId = row.id
    },

    /**
     * 采购
     */
    purchaseHandle (row) {
      this.$http.post('@ROOT_API/', {}).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        // success...
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage-wrap{

  .search-form{

    .el-form-item{
      width: 50%;
      float: left;

      .el-input, .el-select, .el-date-editor{
        width: 280px;
      }

      .time-type-wrap{
        width: 100px;
        padding-right: 10px;
        box-sizing: border-box;
        left: -100px;
      }
    }
  }

  .admin-common-main{
    padding-top: 20px;
  }

  .select-wrap{
    height: 36px;
    line-height: 36px;

    .el-icon-arrow-down{
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: -10px;
      top: 50%;
      right: 0;
    }
  }
}
</style>

