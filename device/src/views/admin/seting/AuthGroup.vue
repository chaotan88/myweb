<!-- 权限组 -->
<template>
  <div class="group">
    <div class="group-wrap">
      <h3>List</h3>
      <div class="list">
        <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" width="55"></el-table-column> -->
          <el-table-column prop="groupName" label="Group Name" show-overflow-tooltip></el-table-column>
          <el-table-column prop="operation" label="Operation" class="handle" show-overflow-tooltip width="160">
            <template slot-scope="scope">
              <template v-if="scope.row.groupType === 1">Editing not allowed</template>
              <template v-else>
                <el-button size="mini" @click="$router.push({path:'/admin/seting/auth/group/edit', query: { id: scope.row.id, type: 'update' }})" class="green">Modify</el-button>
                <el-button type="danger" size="mini" @click="handleDelete = true, deleteId = [scope.row.id]" class="orange">Delete</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div style="margin-top: 20px" v-if="totalPages">
          <el-button type="danger" class="btn-theme-red delete" @click="deleteBeforeHandle">删除</el-button>
        </div> -->
      </div>
    </div>
    <div class="paging" v-if="totalPages">
      <el-pagination background layout="prev, pager, next" :page-count="totalPages" @current-change="pageChange"></el-pagination>
    </div>
    <!-- 删除键 -->
    <el-dialog title="Info" :visible.sync="handleDelete" width="30%">
      <span>Confirm to delete permission group？</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="handleDelete = false">{{$t("common.cancel")}}</el-button>
      <el-button type="primary" @click="deleteHandle">{{$t("common.sure")}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>


<script>
export default {
  data () {
    return {
      token: '',
      tableData3: [],
      multipleSelection: [],
      handleDelete: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      deleteId: ''
    }
  },
  mounted () {
    let adminInfo = JSON.parse(localStorage.getItem('deviceAdminInfo'))
    this.token = adminInfo.token
    this.getGroup()
  },
  methods: {
    // 1.列表
    getGroup () {
      this.$http.post('@ROOT_API/auth/list', {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId
      }).then((res) => {
        // console.log(res)
        if (res.data.status === '1') {
          this.totalPages = res.data.data.totalPages
          this.tableData3 = res.data.data.dataList
        }
      })
    },

    /**
     * 删除前操作
     */
    deleteBeforeHandle () {
      if (!this.deleteId.length) {
        this.$message({
          message: 'Please select data',
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.handleDelete = true
    },

    // 2.删除
    deleteHandle (done) {
      this.$http.post('@ROOT_API/manageAuthController/delete', {
        ids: this.deleteId.join(',')
      }).then((res) => {
        if (res.data.status === '0') {
          this.handleDelete = false
          this.$message({
            message: res.data.msg,
            type: 'error',
            duration: 2000
          })
          return false
        }
        if (res.data.status !== '1') {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: res.data.msg,
          type: 'success'
        })
        this.handleDelete = false
        this.getGroup()
      })
    },

    handleSelectionChange (item) {
      this.deleteId = []
      item.forEach((row) => {
        this.deleteId.push(row.id)
      })
    },

    pageChange (index) {
      this.currentPage = index
      this.getGroup()
    }
  }
}
</script>

<style lang="less" scoped>
.group{
  .group-wrap{
    padding-bottom: 50px;
    background: #fff;
    border-radius: 3px;
    h3{
      padding:35px 0 25px 60px;
      font-weight: initial;
    }
    .list{
      padding: 0 40px;
      .handle{
        text-align: right;
      }
    }

    .btn{
      width: 100%;
      line-height: 70px;
      position: absolute;
      left:0;
      top:0;
      z-index: 1;
      text-align: center;
        button{
        color: #33719b;
        font-size: 18px;
        margin-right: 16px;
        background: #f0f0f0;
        padding:4px 27px;
        border: none;
        border: 1px solid #33719b;
        border-radius: 5px;
        .adminUser{
          color: #fff;
          background: #33719b;
        }
        }
      }
  }
  .paging{
    width: 100%;
    text-align: center;
    padding-top: 30px;
  }
  .green{
    color:#8dca44;
    border:1px solid #8dca44;
    padding: 6px 10px;
    font-size: 12px;
  }
  .orange{
    color: #f5a739;
    border:1px solid #f5a739;
    padding: 6px 10px;
    font-size: 12px;
    background: #fff;
  }

  .delete{
    font-size: 16px;
    border: 0;
    padding: 7px 20px;
  }
}
</style>
<style lang="less">
  .group{
    .el-table-column--selection .cell{
      padding:20px;
    }
    .el-button.delete:hover{
      color: #fff;
      background: #e62a21;
    }
    .el-checkbox__inner{
      box-sizing: border-box;
    }
    /*.el-button--danger{
      color:#f5a739;
      background: #fff;
      border: 1px solid #f5a739;
    }*/
    .handle.el-table_1_column_3 is-leaf{
      text-align: right;
    }

    .el-pager li{
      margin:0 6px;
      }
    .el-pager li.active{
      color: #fff;
      background: #da251d;
    }
    .el-table{
      border:1px solid #eff2f6;
      border-bottom: none;
    }
    .el-table--fit{
      border: 1px solid #eef1f5;
      border-bottom: none;
      .el-table{
      th{
        background: #f4f8f9;
        padding:0;
      }

      .el-table__row{
        position: relative;
        z-index: 1;
      }
      }
    }
    .el-checkbox{
      cursor: none;
    }
    .el-table td, .el-table th{
      // padding:0;
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
    .el-dialog__body{
    font-size: 16px;
    text-align: center;
    }
  }
  .el-dialog__footer{
    text-align: center;
    .el-button{
      margin:0 20px;
      font-size: 16px;
      border: none;
    }
    .el-button--default{
      color: #33719b;
      border: 1px solid #33719b;
    }
    .el-button--primary{
      color: #fff;
      background:#33719b;
    }

  }
</style>
