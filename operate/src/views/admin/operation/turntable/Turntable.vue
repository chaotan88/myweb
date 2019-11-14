<!-- im -->
<template>
  <common-tpl class="turntable-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search :textVisible = "false">
        <div class="pos-r" slot="search">
          <el-input placeholder="请输入活动名称" v-model.trim="formData.turnName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <template slot="edit">
          <el-button :disabled="!tableData.length" @click="exportWinningRecord">导出中奖记录</el-button>
          <el-button  @click="$router.push('/admin/operation/conversion/turntable/add')">添加活动</el-button>
        </template>
      </high-search>
    </template>
    <template slot="main">

      <!-- 表单 -->
      <el-table border :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="加载中">
        <el-table-column prop="qrcodeImage" label="扫码访问">
          <template slot-scope="scope">
            <el-tooltip :disabled="false" placement="right" effect="light">
              <div slot="content">
                <img class="" style="width: 180px; height: 180px;" :src="scope.row.qrcodeImage | filterImgUrl">
              </div>
              <img class="" style="width: 50px; height: 50px;cursor: pointer" :src="scope.row.qrcodeImage | filterImgUrl">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="turnName" label="活动名称" min-width="200"></el-table-column>
        <el-table-column prop="beginTime" label="开始时间" min-width="160">
          <template slot-scope="scope">{{scope.row.beginTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" min-width="160">
          <template slot-scope="scope">{{scope.row.endTime | filterDate}}</template>
        </el-table-column>
        <el-table-column prop="issuedPrizeNum" label="已发放/剩余奖品数量" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.issuedPrizeNum + '/' + scope.row.surplusPrizeNum}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="testProp" label="参与/最大参与人数" min-width="200">
          <template slot-scope="scope">
            <span>{{scope.row.joinPeople + '/' + scope.row.joinSumPeople}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="活动状态" min-width="100" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="visitPeople" label="访问人数" min-width="80"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleEdit(scope.row)" v-if="scope.row.status == 0 || scope.row.status == 1"><i class="icon el-icon-edit"></i>编辑活动</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === 2">
                  <div @click="handleBeforeStop(scope.row)"><i class="icon el-icon-view"></i>停止</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === 2">
                  <div @click="handleDetails(scope.row)"><i class="icon el-icon-view"></i>查看活动</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === 1">
                  <div @click="handleBeforeStart(scope.row,1)"><i class="icon el-icon-caret-right"></i>开始活动</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status === 3">
                  <div @click="handleBeforeStart(scope.row,2)"><i class="icon el-icon-printer"></i>复制活动</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status !== 2">
                  <div @click="handleBeforeDelete(scope.row)"><i class="icon el-icon-delete"></i>删除</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.status !== 1 && scope.row.status !== 0">
                  <div @click="goToPrize(scope.row)"><i class="icon el-icon-document"></i>中奖记录</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
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

    <!-- 按钮操作 -->
    <template slot="other">
      <el-dialog title="停止活动" :visible.sync="stopVisible" width="480px">
        <span>确认是否停止活动？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="stopVisible = false">取 消</el-button>
          <el-button type="primary" :loading="stopLoading" @click="handleSwitch(3)">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="删除活动？" :visible.sync="deleteVisible" width="480px">
        <span>确认是否删除活动？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="startType === 1 ? '确认开启活动' : '复制活动'" :visible.sync="startVisible" width="550px" class="start-dialog">
        <el-form :model="activityForm"  label-width="100px" labelPosition="right" ref="activityForm" class="activityForm">
          <span class="" v-show="startType === 2">确定按照该活动内容复制一个新的活动</span>
          <el-form-item label="活动名称：" v-show="startType === 1">
            {{activityForm.turnName}}
          </el-form-item>
          <el-form-item label="活动时间：" v-show="startType === 1">
            <span>{{activityForm.beginTime | filterDate}}<span class="pd-h">至</span>{{activityForm.endTime | filterDate}}</span>
          </el-form-item>
        </el-form>
        <!--<div >
          <span>{{activityForm.turnName}}</span>
          <br/>
          <span>{{activityForm.beginTime}}<span class="pd-h">至</span>{{activityForm.endTime}}</span>
        </div>-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="startVisible = false">取 消</el-button>
          <el-button type="primary" :loading="startLoading" @click="handleSwitch(startType === 1 ? 0 : 4)">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,         // loading
        // 列表数据
        tableData: [],
        activityForm: {
          turnName: '',
          endTime: '',
          beginTime: ''
        },
        deleteLoading: false,  // 删除loading
        deleteVisible: false,  // 删除弹窗
        // ...
        stopLoading: false,  // 停止loading
        stopVisible: false,  // 停止弹窗
        // ...
        startLoading: false,  // 开始活动loading
        startVisible: false,  // 开始活动弹窗
        // ...
        startType: 1,   // 开始活动-1；重新开始-2
        currentRow: {},       // 当前操作row
        formData: {
          turnName: '' // 活动名称

        },
        pageData: {             // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}
      }
    },
    mounted () {
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData('operation/conversion/turntable/list', (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getListData()
    },
    methods: {
      /**
       * 获取列表数据
       */
      getListData () {
        this.loading = true
        this.$http.get('@ROOT_API/turn/getTurnPage', {
          params: {
            turnName: this.formData.turnName,
            start: this.pageData.currentPage,
            pageSize: this.pageData.pageSize
          }
        }).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          let data = results.data
          this.tableData = data.list
          this.pageData.total = data.total
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 格式化活动状态
       */
      statusFormatter (row, column, cellValue, index) {
        return cellValue === 1 ? '未开始' : cellValue === 0 ? '未开始' : cellValue === 2 ? '进行中' : cellValue === 3 ? '已结束' : ''
      },
      /**
       * 重新开始，开始活动前操作
       * @param row 当前行数据
       * @param type: 1-开始活动  2-重新开始
       */
      handleBeforeStart (row, type) {
        this.startType = type
        this.startVisible = true
        this.currentRow = row
        this.activityForm = row
      },
      /**
       * 停止活动前操作
       * @param row 当前行数据
       */
      handleBeforeStop (row) {
        this.stopVisible = true
        this.currentRow = row
      },

      /**
       * 删除活动前操作
       */
      handleBeforeDelete (row) {
        this.deleteVisible = true
        this.currentRow = row
      },
      /**
       * 编辑活动
       */
      handleEdit (row) {
        this.$router.push({
          path: '/admin/operation/conversion/turntable/edit',
          query: {id: row.id}
        })
      },
      /**
       * 查看活动
       */
      handleDetails (row) {
        this.$router.push({
          path: '/admin/operation/conversion/turntable/detail',
          query: {id: row.id}
        })
      },
      /**
       * 中奖记录
       */
      goToPrize (row) {
        this.$router.push({
          path: '/admin/operation/conversion/turntable/prize',
          query: {id: row.id}
        })
      },
      /**
       * 更改活动状态
       * @param 活动状态（1:未开始、2:开始、3:停止、4:复制活动）
       */
      handleSwitch (status) {
        status === 3 ? this.stopLoading = true : this.stopLoading = true
        this.$http.post('@ROOT_API/turn/changeStatus', {
          id: this.currentRow.id,
          status: status
        }).then((res) => {
          let msg = res.data.data === 1 ? '操作成功！' : '活动时间未到！'
          if (parseInt(res.data.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          status === 3 ? this.stopVisible = false : this.startVisible = false
          this.$message({
            message: msg,
            type: res.data.data === 1 ? 'success' : 'error',
            duration: 1500
          })
          this.getListData()
        }).finally(() => {
          status === 3 ? this.stopLoading = false : this.stopLoading = false
        })
      },
      /**
       * 删除操作
       */
      handleDelete () {
        this.deleteLoading = true
        this.$http.post('@ROOT_API/turn/deleteTurn', {
          id: this.currentRow.id
        }).then((res) => {
          if (parseInt(res.data.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.deleteVisible = false
          this.getListData()
        }).finally(() => {
          this.deleteLoading = false
        })
      },
      /**
       * 导出中奖记录
       */
      exportWinningRecord () {
        let url = 'turn/exportTurn'
        this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
        window.open(this.$dm.ROOT_API + url + this.$global.PARAMS + this.userInfo.token + '&' + 'turnName=' + this.formData.turnName, '_blank')
      },
      /**
       * 分页操作
       */
      pageChange (page) {
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        if (this.pageData.currentPage === page) {
          this.getListData()
        } else {
          this.pageData.currentPage = page
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      },
      /**
       * 搜索
       */
      searchHandle () {
        this.pageChange(1)
      }
    }
  }
</script>

<style lang="less" scoped>
  .turntable-wrap{
    .search{
      width: 15%;
      margin: 20px 30px;
      .el-input{
        border-radius: 30px;

      }
      .el-input__inner{
        border-radius: 30px;
      }

      i{
        right: 10px;
        top: 10px;
      }
    }
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
    .memo-info{
      color: red;
      margin-bottom: 20px;
    }
    .pd-h{
      padding: 0 10px;
    }
  }
</style>

<style lang="less">
  .turntable-wrap {
    .start-dialog{
      .el-dialog {
        .el-dialog__body {
          text-align: left;
          .el-form{
            padding: 10px 30px;
            .el-form-item{
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
</style>

