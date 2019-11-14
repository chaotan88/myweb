<!-- 溯源管理 -->
<template>
  <common-tpl class="goods-traceability-wrap">
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle" :textVisible = "false">
        <div class="pos-r" slot="search">
          <div class="d-ib pos-r">
            <el-input placeholder="输入信息名称" v-model.trim="formData.originsName" @keyup.enter.native="searchHandle"></el-input>
            <i class="ta-c pos-a el-icon-search" title="搜索" @click="searchHandle"></i>
          </div>
        </div>
        <template slot="edit">
          <el-button @click="handleAddBefore"><i class="el-icon-plus fw-b"></i>溯源信息</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体 -->
    <template slot="main">
      <div style="min-height: 400px; max-height: 525px; padding-left: 260px; padding-bottom: 60px; overflow: hidden;" class="pos-r full-h">

        <!-- 商品类目 -->
        <div class="pos-a" style="width: 240px; height: 100%; max-height: 525px; left: 0; top: 0;">
          <goods-attribute :defaultId="formData.classifyId" @change="goodsAttributeChange"></goods-attribute>
        </div>
        <el-form :model="formData" :rules="rules" ref="formData">
          <!-- 列表 -->
          <el-table border :data="formData.tableData" style="width: 100%" max-height="525" ref="multipleTable" v-loading="loading" element-loading-text="加载中">
            <el-table-column prop="originsName" label="信息名称" min-width="200"></el-table-column>
            <el-table-column prop="originsDesc" label="信息说明" min-width="220"></el-table-column>
            <el-table-column label="排序" min-width="80">
              <template slot-scope="scope">
                <div class="pos-r sort-wrap" style="padding-right: 20px;">
                  <el-form-item class="d-ib margin-none" :prop="'tableData.' + scope.$index + '.sort'" :rules="ruleSort">
                    <el-input maxlength="3" size="medium" v-model="scope.row.sort" @blur="rowBlur(scope.row)"></el-input>
                  </el-form-item>
                  <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 20px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.tableData.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.tableData.length - 1"></i>
                </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-dropdown class="d-b">
                  <div class="ta-c d-b el-dropdown-link">
                    <span class="d-b va-m">...</span>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <template>
                      <el-dropdown-item>
                        <div @click="$router.push({path: '/admin/goods/traceability/edit', query: {levelId: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="deleteBeforeHandle(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <!-- 暂无数据 -->
            <div slot="empty">
              <no-data></no-data>
            </div>
          </el-table>
        </el-form>
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
      </div>

    </template>

    <template slot="other">
      <el-dialog title="删除信息？" :visible.sync="deleteVisible" width="480px">
        <span style="color: red;">删除后将影响已设置的商品信息？</span><br/>
        <span>确定是否删除溯源信息？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary"  @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import GoodsAttribute from '@/components/public/GoodsAttribute'
import pagePaper from '@/mixins/ListPublicPage'
export default {
  components: { GoodsAttribute },
  data () {
    // 校验排序
    let validateSort = (rule, value, callback) => {
      if (value === '' || value === null) return callback(new Error('不能为空'))
      if (value && (isNaN(value) || value < 0 || value > 255 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~255正整数'))
      callback()
    }
    return {
      defaultId: 0,
      isEdited: false,                 //
      loading: false,                 // loading
      deleteVisible: false,           // 删除弹窗
      formData: {
        originsName: '',     // 参数类型
        classifyLevel: 0,    // 选中分类等级
        classifyId: 0,      // 选中分类Id
        tableData: []      // 表格数据
      },
      ruleSort: [{validator: validateSort, trigger: 'blur'}],
      rules: [],      // 表格数据
      id: ''                   // 当前信息id
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    // 获取tab标签类型
  //  let getPagetype = localStorage.getItem(this.$global.SYSTEM + 'PageType', this.pageStatus)
  //  localStorage.setItem(this.$global.SYSTEM + 'PageType', this.pageStatus)

    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData(['/admin/goods/traceability/list', '/admin/goods/traceability/add', '/admin/goods/traceability/edit'], (res) => {
      this.formData = res
    })
    this.getListData()
  },
  mixins: [pagePaper],
  methods: {
    /**
     * 获取列表数据
     */
    getListData () {
      this.loading = true
      this.$http.post('@ROOT_API/origins/getOriginsListPage', {
        originsName: this.formData.originsName,
        attributeTypeId: this.formData.classifyId,
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }).then((res) => {
        let results = res.data
        if (parseInt(results.status) !== 1) {
          this.$message({
            message: res.msg,
            type: 'error',
            duration: 1500
          })
          this.formData.tableData = []
          this.pageData.total = 0
          return false
        }
        let data = results.data
        this.formData.tableData = data.list
        this.pageData.total = data.total
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 更改排序
     */
    handleUpdateSort (list) {
      if (!list) return false
      this.$http.post('@ROOT_API/origins/updateOriginsSort', {
        originsRequestList: list
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
      })
    },
    /**
     * 修改分类排序
     */
    rowBlur (row) {
      if (!row.sort || isNaN(row.sort) || row.sort < 0) return false
      let list = [{
        id: row.id,
        sort: row.sort
      }]
      this.handleUpdateSort(list)
    },
    /**
     * 向上移动
     */
    handleSortUp (index) {
      if (index === 0) return false
      let temp = this.formData.tableData[index]
      let sort = temp.sort

      // 排序操作
      let arr = [
        {
          id: temp.id,
          sort: this.formData.tableData[index - 1].sort
        },
        {
          id: this.formData.tableData[index - 1].id,
          sort: temp.sort
        }
      ]
      if (temp.sort === this.formData.tableData[index - 1].sort) arr.pop()
      this.handleUpdateSort(arr)

      // 移动位置
      temp.sort = this.formData.tableData[index - 1].sort
      this.formData.tableData[index - 1].sort = sort
      this.$set(this.formData.tableData, index, this.formData.tableData[index - 1])
      this.$set(this.formData.tableData, index - 1, temp)
    },

    /**
     * 向下移动
     */
    handleSortDown (index) {
      if (index === this.formData.tableData.length - 1) return false
      let temp = this.formData.tableData[index]
      let sort = temp.sort

      // 排序操作
      let arr = [
        {
          id: this.formData.tableData[index + 1].id,
          sort: temp.sort
        },
        {
          id: temp.id,
          sort: this.formData.tableData[index + 1].sort
        }
      ]
      if (temp.sort === this.formData.tableData[index + 1].sort) arr.pop()
      this.handleUpdateSort(arr)

      // 移动位置
      temp.sort = this.formData.tableData[index + 1].sort
      this.formData.tableData[index + 1].sort = sort
      this.$set(this.formData.tableData, index, this.formData.tableData[index + 1])
      this.$set(this.formData.tableData, index + 1, temp)
    },
    /**
     * 内容改变
     */
    contentChange () {
      this.isEdited = true
    },
    /**
     * 删除提示
     */
    deleteBeforeHandle (row) {
      this.id = row.id
      this.deleteVisible = true
    },

    /**
     * 删除操作
     */
    deleteHandle () {
      this.$http.post('@ROOT_API/origins/deleteOrigins', {
        id: this.id
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
        this.deleteVisible = false
        this.getListData()
      })
    },

    /**
     * 添加溯源信息
     */
    handleAddBefore () {
      if (!this.formData.classifyLevel || parseInt(this.formData.classifyLevel) !== 3) {
        this.$message({
          message: '请选择三级分类',
          duration: 2000,
          type: 'error'
        })
        return false
      }
      this.$router.push({
        path: '/admin/goods/traceability/add',
        query: {levelId: this.formData.classifyId, level: this.classifyLevel}
      })
    },
    /**
     * 分类选择
     */
    goodsAttributeChange (data, currentData) {
    //  alert(currentData.id)
      console.log(data)
      console.log(currentData)
      this.formData.classifyLevel = currentData.attributeTypeLevel || 0
      this.formData.classifyId = currentData.id
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    }
  },
  watch: {
    'formData.classifyId': {
      handler (val, oldVal) {
        if (parseInt(this.formData.classifyLevel) === 3 && oldVal === 0) {
          this.getListData()
        } else if (parseInt(this.formData.classifyLevel) === 3 && oldVal !== 0) {
          this.pageChange(1)
        }
      },
      deep: false
    }
  }
}
</script>

<style lang="less" scoped>
.goods-traceability-wrap{

  .search-wrap{
    .search-edit-wrap{
      .el-dropdown{
        height: 36px;
        line-height: 36px;
        vertical-align: -2px;
        margin: 0 5px;

        .el-button{
          height: 100%;
          margin-top: 1px;
        }
      }
    }
  }

  .thumbnail-wrap{
    width: 50px;
    height: 50px;
  }
}
</style>

<style lang="less">
.goods-traceability-wrap{
  .select-wrap{
    z-index: 2001 !important;
    .el-icon--right{
      line-height: 40px;
      right: 5px;
    }
  }

  /* -------------------- { 调整库存 } -------------------- */
  .adjustment-sku-wrap{
    margin-bottom: 30px;

    .el-form-item{
      margin-bottom: 0;

      .el-form-item__error{
        width: 100%;
      }
    }

    .adjustment-sku-search{
      height: 36px;
      line-height: 36px;
      margin-bottom: 20px;

      .el-icon-search{
        color: #999;
        margin-top: -8px;
        right: 10px;
        top: 50%;
      }

      .el-icon-search:hover{
        color: #56ade8;
      }
    }

    .adjustment-sku-table{
      width: 100%;
      border: 1px solid #ebeef5;
      border-collapse: collapse;

      th, td{
        text-align: center;
        font-size: 15px;
        border: 1px solid #ebeef5;
        padding: 0 10px;
      }

      th{
        height: 40px;
        font-weight: normal;
        background: #eef1f9;
      }

      td{
        padding: 10px 0;
        .el-input__inner{
          width: 100px;
          text-align: center;
        }

        .btn{
          color: #409eff;
          font-size: 14px;
        }
      }

      td.pd-l{
        padding-left: 35px;
      }

      td.pd-r{
        padding-right: 15px;
      }

      .sync-btn{
        fill: #2eaaf7;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        right: 0;
        top: 50%;
      }

    }
  }
  .el-table{
    .el-form-item{
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>
