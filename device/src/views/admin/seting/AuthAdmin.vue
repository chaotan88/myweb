<!-- 管理员 -->
<template>
  <div class="setting">
    <div class="shadow-common-wrap setting-wrap">
      <h3>列表</h3>
      <div class="list">
        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @select="selectChange" @selection-change="handleSelectionChange" :class="{selectionHide: tableData[0] && tableData[0].roleType === 1}">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="loginName" label="登录名"></el-table-column>
          <el-table-column prop="tmpTime" label="上次登录">
            <template slot-scope="scope" v-if="scope.row.tmpTime">{{ scope.row.tmpTime | dateFilter('YYYY-MM-DD HH:mm:ss')}}</template>
          </el-table-column>
          <el-table-column prop="loginAmount" label="登录次数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="groupName" label="权限组" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.groupName}}</template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <template v-if="scope.row.roleType === 1">超级管理员不可编辑</template>
              <template v-else>
                <el-button type="danger" size="mini" @click="$router.push({path:'/admin/seting/auth/admin/edit', query: { id: scope.row.id }})" class="green">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete = true, deleteId = [scope.row.id]" class="orange">删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="margin-top: 20px" v-if="totalPages">
          <el-button type="danger" class="btn-theme-red btn-delete" @click="deleteBeforeHandle">删除</el-button>
        </div> -->
      </div>
    </div>
    <div class="paging" v-if="totalPages">
        <el-pagination background layout="prev, pager, next" :total="totalPages" @current-change="pageChange"></el-pagination>
    </div>
    <!-- 删除键 -->
    <el-dialog title="提示" :visible.sync="handleDelete" width="480px">
      <span>确认是否删除账号？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data () {
    return {
      token: '',
      tableData: [],
      multipleSelection: [],
      handleDelete: false,
      currentPage: 1,
      pageSize: 5,
      totalPages: 0,
      deleteId: '',
      selectAdminFlag: false            // 是否选中超级管理员
    }
  },
  mounted () {
    let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    this.token = adminInfo.token
    this.getAdmin()
  },
  methods: {
    // 1.列表
    getAdmin () {
      this.$http.post('@ROOT_API/admin/list', {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then((res) => {
        let resData = res.data
        console.log(resData)
        if (resData.status !== '1') {
          this.$message.error(resData.msg)
          return false
        }
        // 分页数，把后台给的数乘以10   乘10等于页面总条数
        this.totalPages = resData.data.totalPages * 2
        this.tableData = resData.data.dataList
      })
    },

    /**
     * 批量删除前操作
     */
    deleteBeforeHandle () {
      if (!this.deleteId.length) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.handleDelete = true
    },

    /**
     * 2.删除
     */
    deleteHandle (done) {
      this.$http.post('@ROOT_API/admin/delete', {
        id: parseInt(this.deleteId) // this.deleteId.join(',')
      }).then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          type: 'success'
        })
        this.handleDelete = false
        this.getAdmin()
      })
    },

    /**
     * 多选操作
     */
    handleSelectionChange (item) {
      this.deleteId = []
      item.forEach((row) => {
        if (row.roleType !== 1) this.deleteId.push(row.id)
      })
    },

    /**
     * 判断超级管理员不可选择
     */
    selectChange (row, item) {
      if (item.roleType === 1) {
        this.$message({
          message: '超级管理员不可编辑',
          type: 'error',
          duration: 1500
        })
        this.$refs.multipleTable.toggleRowSelection(item, false)
      }
    },

    /**
     * 分页
     */
    pageChange (index) {
      this.currentPage = index
      this.getAdmin()
    }
  }
}
</script>

<style lang="less" scoped>
.setting{
  .setting-wrap{
    padding: 30px 40px 50px 40px;
    background: #fff;
    border-radius: 4px;

    h3{
      font-weight: initial;
      padding-bottom:24px;
    }
    .list{
      .el-table--fit{
        border: 1px solid #eff2f6;
        border-bottom: none;
      }
    }
  }
}
</style>
<style lang="less">
.setting{
  .setting-wrap{

    .el-table.selectionHide{
      .el-table__row:first-child{
        .el-table-column--selection{
          .el-checkbox__input{
            display: none !important;
          }
        }
      }
    }

    .el-table-column--selection .cell{
      padding: 20px;
    }
    .el-checkbox__inner{
      box-sizing: border-box;
    }
    .el-message-box__btns{
      text-align: center;
    }
    // .el-table td, .el-table th{
    //   padding:0;
    // }
    .el-table__row:hover{
      border: 1px solid red;
    }
    .el-table{
      th{
        background: #f4f8f9;
      }

    .el-table__row{
      position: relative;
      z-index: 1;
    }
  }
  .green{
    color:#8dca44;
    border:1px solid #8dca44;
    padding: 6px 10px;
    font-size: 12px;
    background:#fff;
  }
  .orange{
    color: #f5a739;
    border:1px solid #f5a739;
    padding: 6px 10px;
    font-size: 12px;
    background:#fff;
  }

  .delete{
    font-size: 16px;
    padding: 10px 20px;
  }
  .el-pagination{
    text-align: center;
    }
  }
  .el-pager li{
    margin:0 6px;
  }
  .el-pager li.active{
    color: #fff;
    background: #da251d;
  }
  .el-dialog__body{
    text-align: center;
    span{
      font-size: 18px;
    }
  }
}

.el-dialog__footer{
  text-align: center;
  font-size: 16px;

  .el-button{
    color: #33719b;
    background: none;
    border: 1px solid #33719b;
    margin: 0 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid #33719b;
  }
  .el-button--primary{
      color: #fff;
      background: #33719b;
    }
}

</style>
