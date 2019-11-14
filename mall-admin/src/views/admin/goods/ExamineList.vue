<!-- 商品审核 -->
<template>
  <common-tpl :footer="false" class="goods-examine-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入商品名称/商品编号" @click.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search"></i>
        </div>
        <div slot="edit">
          <template v-if="pageType === 1">
            <el-button @click="batchHandle(1)">审核不通过</el-button>
            <el-button @click="batchHandle(2)">审核通过</el-button>
          </template>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form ref="form" :model="formData" label-position="right" label-width="100px" class="search-form">
            <el-form-item label="商品名称">
              <el-input v-model="formData.name" placeholder="请输入商品名称/商品编码"></el-input>
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
                v-model="formData.time"
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
              <el-select v-model="formData.classify" placeholder="选择属性分类">
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
    
    <!-- 主体 -->
    <template slot="main">
      <el-table border :data="tableData" style="width: 100%"
        @select="selectionChange"
        @select-all="selectionChange">
        <el-table-column type="selection" width="55" fixed="left"></el-table-column>
        <el-table-column prop="pictrue" label="商品图片">
          <template slot-scope="scope">
            <div class="thumbnail-wrap">
              <img class="full-wrap" src="../../../assets/img/user-face01.png">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="商品编码"></el-table-column>
        <el-table-column prop="name" label="商品名称" width="300"></el-table-column>
        <el-table-column prop="price" label="单价（元）" width="120"></el-table-column>
        <el-table-column prop="status" label="商品状态" width="120">
          <template slot-scope="scope">{{scope.row.status | filterGoodsReviewStatus}}</template>
        </el-table-column>
        <el-table-column prop="shelves" label="上架状态" width="120">
          <template slot-scope="scope">
            <template v-if="pageType === 2">
              {{scope.row.shelves ? '上架' : '下架'}}
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="上/下架时间" width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/goods/examine/details', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>{{pageType === 1 ? '审核' : '详情'}}</div>
                </el-dropdown-item>
                <!-- <template v-if="pageType === 1">
                  <el-dropdown-item>
                    <div @click="rejectBeforeHandle(scope.row)"><i class="icon el-icon-circle-close-outline"></i>不通过</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="passBeforeHandle(scope.row)"><i class="icon el-icon-circle-check-outline"></i>通过</div>
                  </el-dropdown-item>
                </template> -->
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
      <!-- 审核不通过 -->
      <el-dialog
        title="审核驳回"
        :visible.sync="rejectVisible"
        width="480px">
        确定是否审核驳回？
        <span slot="footer" class="dialog-footer">
          <el-button @click="rejectVisible = false">取 消</el-button>
          <el-button type="primary" @click="rejectHandle()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 通过提示 -->
      <el-dialog
        title="通过商品"
        :visible.sync="passVisible"
        width="480px">
        确定是否审核通过？
        <span slot="footer" class="dialog-footer">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="passHandle()">确 定</el-button>
        </span>
      </el-dialog>
    </template>

  </common-tpl>
</template>

<script>
import Utils from '@/global/function'
export default {
  data () {
    return {
      pageType: 1,            // 页面类型［1／待审核，2／审核通过，3／审核驳回］
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
      copyFormData: {},       // 拷贝
      passVisible: false,     // 审核通过弹窗
      passId: '',             // 审核通过id
      rejectVisible: false,   // 审核不通过弹窗
      rejectId: '',           // 审核不通过id
      pageData: {             // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      selectionRes: []        // 多选结果
    }
  },
  mounted () {
    this.copyFormData = Utils.deepCopy(this.formData)
    if (this.$route.path.match(/pass/gi)) {
      this.pageType = 2
    }
    this.tableData.map((row) => {
      row.status = this.pageType
    })
    this.pageData.currentPage = this.$route.query.page || 1
    // this.getListData()
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
     * 批量通过/不通过
     */
    batchHandle (type) {
      if (!type) return false
      let text = ''
      if (type === 1) {
        text = '审核不通过'
      } else {
        text = '审核通过'
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
     * 审核不通过提示
     */
    rejectBeforeHandle (row) {
      this.rejectVisible = true
      this.rejectId = row.id
    },

    /**
     * 审核不通过
     */
    rejectHandle (row) {
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
     * 通过前提示
     */
    passBeforeHandle (row) {
      this.passVisible = true
      this.passId = row.id
    },

    /**
     * 通过前提示
     */
    passHandle (row) {
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
     * 重置表单
     */
    resetForm () {
      this.formData = Utils.deepCopy(this.copyFormData)
    }
  }
}
</script>

<style lang="less" scoped>
.goods-examine-wrap{

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

  .thumbnail-wrap{
    width: 40px;
    height: 40px;
  }
}
</style>
