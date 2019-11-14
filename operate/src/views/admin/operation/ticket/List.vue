<!-- 票务管理列表 -->
<template>
  <common-tpl class="operation-ticket-list-wrap">
    <template slot="header" class="search-wrap">
      <!-- 高级搜索组件 -->
      <high-search @search="searchHandle">
        <div class="pos-r" slot="search">
          <el-input placeholder="输入会议名称" v-model.trim="formData.meetingName" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
        <div slot="edit">
          <el-button @click="$router.push('/admin/operation/conversion/ticket/add')"><i class="el-icon-plus"></i> 添加会务票</el-button>
        </div>
        <div class="reset-btn" slot="btn" @click="resetForm()">清空</div>
        <div slot="main">
          <el-form :model="formData" :rules="rules" ref="formData" label-width="110px">
            <el-form-item label="会议名称：" prop="customerName">
              <el-input v-model.trim="formData.meetingName" placeholder="限50个字符" maxlength="50" clearable></el-input>
            </el-form-item>
            <el-form-item label="所在地：">
              <region-select :initData="formData.region" @change="regionChange"></region-select>
            </el-form-item>
            <!-- <el-form-item label="是否获得积分：">
	            <el-select v-model="formData.whetherIntegral" placeholder="请选择是否获得积分">
	              <el-option label="是" :value="1"></el-option>
	              <el-option label="否" :value="2"></el-option>
	            </el-select>
	          </el-form-item> -->
	          <!-- <el-form-item label="是否分佣：">
	            <el-select v-model="formData.whetherMaid" placeholder="请选择是否分佣" clearable>
	              <el-option label="是" :value="1"></el-option>
	              <el-option label="否" :value="4"></el-option>
	            </el-select>
	          </el-form-item> -->
	          <el-form-item label="选择状态：">
	            <el-select v-model="formData.whetherStatus" placeholder="请选择状态" clearable>
	              <el-option label="开启" :value="1"></el-option>
	              <el-option label="关闭" :value="0"></el-option>
	            </el-select>
	          </el-form-item>
          </el-form>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" :index="filterIndex" label="排序" width="60">
          <!-- <div class="pos-r sort-wrap" style="width: 100px; padding-right: 25px;">
            <el-form-item :prop="'tableData.' + scope.$index + '.sort'" :rules="ruleInt" style="margin-bottom: 0;">
              <el-input maxlength="10" v-model="scope.row.sort"></el-input>
            </el-form-item>
            <span style="width: 14px; height: 36px; position: absolute; right: 5px; top: 0;">
              <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)"></i>
              <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.tableData.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.tableData.length - 1"></i>
            </span>
          </div> -->
        </el-table-column>
        <el-table-column label="会议名称" width="240">
          <template slot-scope="scope">{{scope.row.meetingName | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="所属地区" width="160">
          <template slot-scope="scope">{{scope.row.region | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="160">
          <template slot-scope="scope">{{scope.row.beginTime | filterDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="160">
          <template slot-scope="scope">{{scope.row.endTime | filterDate}}</template>
        </el-table-column>
        <el-table-column label="门票售价（元）" min-width="130">
          <template slot-scope="scope">{{scope.row.ticketPrice | filterMoney | filterEmpty}}</template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.ticketStatus | filterTicketStatus}}</template>
        </el-table-column>
        <!-- <el-table-column label="是否分佣">
          <template slot-scope="scope">{{(scope.row.getPointType === 1 && scope.row.getPointNum > 0) ? '是' : '否'}}</template>
        </el-table-column> -->
        <el-table-column label="积分类型" min-width="100">
          <template slot-scope="scope">{{scope.row.getPointType | filterSourceType}}</template>
        </el-table-column>
        <el-table-column label="剩余票数" min-width="100">
          <template slot-scope="scope">{{scope.row.ticketNum || 0}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <el-dropdown class="d-b">
              <div class="ta-c d-b el-dropdown-link">
                <span class="d-b va-m">...</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="$router.push({path: '/admin/operation/conversion/ticket/order', query: {id: scope.row.id}})"><i class="el-icon-document"></i> 管理订单</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.ticketStatus !== 1">
                  <div @click="$router.push({path: '/admin/operation/conversion/ticket/edit', query: {id: scope.row.id}})"><i class="icon el-icon-edit"></i>编辑</div>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.ticketStatus === 1">
                  <div @click="handleCloseBefore(scope.row)"><i class="icon el-icon-circle-close-outline"></i>关闭</div>
                </el-dropdown-item>
                <!-- <el-dropdown-item v-if="scope.row.ticketStatus !== 1">
                  <div @click="handleDeleteBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>删除</div>
                </el-dropdown-item> -->
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
      <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
      </el-pagination>
    </template>

    <!-- 删除键 -->
    <template slot="other">
      <el-dialog title="关闭会议" :visible.sync="closeVisible" width="480px">
        <br>
        <span>确认是否关闭会议？</span>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeVisible = false">取 消</el-button>
          <el-button type="primary" :loading="closeLoading" @click="handleClose">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="删除票务信息" :visible.sync="deleteVisible" width="480px">
        <br>
        <span>确认是否删除票务信息？</span>
        <br>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import RegionSelect from '@/components/utils/RegionSelect'
export default {
  components: {RegionSelect},
  data () {
    // 验证手机
    let validatePhone = (rule, value, cb) => {
      let reg = /^1\d{0,10}$/gi
      if (value && !value.toString().match(reg)) return cb(new Error('手机格式错误'))
      cb()
    }

    return {
      formData: {
        meetingName: '',      // 会议名称
        whetherIntegral: '',  // 是否获得积分
        whetherMaid: '',      // 是否分佣
        whetherStatus: '',    // 是否开启
        region: {
          province: {         // 省
            code: '',
            name: ''
          },
          city: {             // 市
            code: '',
            name: ''
          },
          area: {             // 区
            code: '',
            name: ''
          }
        }
      },
      tableData: [],
      rules: {
        customerPhone: { validator: validatePhone, trigger: 'blur' },
        customerName: [{ max: 50, message: '限50个字符', trigger: 'blur' }]
      },
      copyFormData: {},     // 拷贝
      closeLoading: false,  // 关闭loading
      closeVisible: false,  // 关闭弹窗
      currentRow: {},       // 当前操作row
      pageData: {           // 分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      deleteLoading: false, // 删除loading
      deleteVisible: false, // 删除弹窗
      deleteData: {},       // 删除数据
      userInfo: {}          // 用户信息
    }
  },

  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.copyFormData = this.$Utils.deepCopy(this.formData)
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/operation/conversion/ticket/list', (res) => {
      this.formData = res
    })
    this.pageData.currentPage = parseInt(this.$route.query.page) || 1
    this.getListData()
  },

  methods: {
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData () {
      this.loading = true
      this.$http.get('@ROOT_API/meeting/getMeetingPage', {
        params: {
          start: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          meetingName: this.formData.meetingName,            // 否 string  会议名称
          provinceCode: this.formData.region.province.code,  // 否 string  省编码
          cityCode: this.formData.region.city.code,          // 否 string  市编码
          zoneCode: this.formData.region.area.code,          // 否 string  区编码
          ticketStatus: this.formData.whetherStatus,         // 否 int 门票状态（0：关闭，1：开启）
          getPointType: this.formData.whetherMaid            // 是否分佣
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.pageData.total = 0
          this.tableData = []
          return false
        }
        this.pageData.total = resData.data.total
        resData.data.list.forEach((row) => {
          let regionArr = []
          if (row.province) regionArr.push(row.province)
          if (row.city) regionArr.push(row.city)
          if (row.zone) regionArr.push(row.zone)
          row.region = regionArr.join(', ')
        })
        this.tableData = resData.data.list
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 搜索
     */
    searchHandle () {
      this.pageChange(1)
    },

    /**
     * 关闭前操作
     */
    handleCloseBefore (row) {
      this.closeVisible = true
      this.currentRow = row
    },

    /**
     * 关闭操作
     */
    handleClose () {
      this.closeLoading = true
      this.$http.post('@ROOT_API/meeting/closeMeeting', {
        id: this.currentRow.id
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
        this.closeVisible = false
        this.getListData()
      }).finally(() => {
        setTimeout(() => {
          this.closeLoading = false
        }, 500)
      })
    },

    /**
     * 过滤索引
     */
    filterIndex (index) {
      return parseInt((this.pageData.currentPage - 1) * 10) + index + 1
    },

    /**
     * 省市区数据更新
     */
    regionChange (results) {
      this.formData.region = results
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
     * 删除票务信息前操作
     */
    handleDeleteBefore (row) {
      this.deleteLoading = false
      this.deleteVisible = true
      this.deleteData = row
    },

    /**
     * 删除票务信息
     */
    handleDelete () {
      this.deleteLoading = true
      this.$http.post('@ROOT_API/meeting/deleteMeeting', {
        id: this.deleteData.id
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
      }).finally(() => {
        setTimeout(() => {
          this.deleteLoading = true
        }, 1000)
      })
    },

    /**
     * 重置表单
     */
    resetForm () {
      this.formData = this.$Utils.deepCopy(this.copyFormData)
    }
  }
}
</script>

<style lang="less" scoped>
.operation-ticket-list-wrap {
  /*----------------搜索-----------*/
  .search-wrap {
    .el-form-item {
      .el-radio-group {
        div {
          margin-right: 20px;
        }
      }
    }

    .el-dropdown {
      width: 80px;
      top: 0;
      left: -80px;
    }
  }
}
</style>

<style lang="less">
.operation-ticket-list-wrap {

  .region-select-wrap{
    .el-input{
      width: auto !important;
    }
  }


  /*----------------删除----------*/
  .el-dialog {
    .el-dialog__header {
      text-align: center;
    }

    .el-dialog__body {
      text-align: center;

      .order-info {
        padding: 0 20px;
        border-bottom: 1px solid #eee;
        span {
          height: 35px;
          line-height: 35px;
          padding-bottom: 20px;
        }
      }

      .order-express {
        padding: 20px 0 0 0;

        .number {
          width: 46%;
        }
      }
    }

    .el-dialog__footer {
      .el-button {
        border-radius: 3px;
        border-color: none;
      }
    }
  }
}

.search-wrap .high-search-down .btn-wrap {
  margin-top: 0;
}
</style>
