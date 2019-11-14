<!-- 聚合组件 -->
<template>
  <!-- 公共模板 -->
  <!-- :footer="false" 是否显示底部 -->
  <common-tpl :footer="false" class="component-wrap">
    
    <!-- 头部 -->
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle('form')" :close="highSearchClose" :textVisible="true">
        <div class="pos-r" slot="search">
          <el-input placeholder="搜索区域"></el-input>
          <i class="ta-c pos-a el-icon-search"></i>
        </div>
        <div slot="edit">
          <el-button>新增</el-button>
          <el-button>编辑</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm('form')">清空</div>
        <!-- <el-button slot="btn">清空</el-button> -->
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">
      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column fixed prop="date" label="日期" width="150"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="province" label="省份"></el-table-column>
        <el-table-column prop="city" label="市区"></el-table-column>
        <el-table-column prop="address" label="地址" width="500"></el-table-column>
        <el-table-column prop="zip" label="邮编"></el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div><i class="icon el-icon-view"></i>查看</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="editHandle(scope.row)"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div><i class="icon el-icon-delete"></i>删除</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" v-if="pageData.total"
        :current-page="pageData.currentPage"
        :page-size="pageData.pageSize"
        :total="pageData.total"
        @current-change="pageChange">
      </el-pagination>
    </template>

    <!-- 底部 -->
    <template slot="footer"></template>
  </common-tpl>
</template>

<script>
import Utils from '@/global/function'
export default {
  data () {
    return {
      highSearchClose: true,         // 高级搜索收起
      formData: {
        name: ''                     // 姓名
      },
      copyFormData: {},              // 拷贝表单初始化数据
      rules: {
        name: [
          {required: true, message: '姓名不能为空', blur: 'blur'}
        ]
      },
      // 列表数据
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }],
      pageData: {         // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted () {
    this.copyFormData = Utils.deepCopy(this.formData)
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
     * 分页操作
     */
    pageChange () {},

    /**
     * 搜索
     */
    searchHandle (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.highSearchClose = false
          return false
        }
        this.highSearchClose = true
      })
    },

    /**
     * 编辑
     */
    editHandle (row) {
      // console.log(row)
    },

    /**
     * 重置表单
     */
    resetForm (formName) {
      this.formData = Utils.deepCopy(this.copyFormData)
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.component-wrap{

  .search-wrap{
    .el-form-item{
      width: 50%;
      float: left;

      .el-input{
        width: 60%;
      }
    }
  }
}
</style>
