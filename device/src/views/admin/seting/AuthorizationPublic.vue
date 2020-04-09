<!-- 代理商授权共用页面 -->
<template>
  <div class="authorization-public-wrap">
    <div class="authorization-con">
      <div class="authorization-con-serch">
        <el-form :inline="true" :model="searchData" class="demo-form-inline">
          <el-form-item label="选择区域" class="areaChoose">
            <el-select v-model="searchData.province" placeholder="请选择省份" class="select-group" clearable @change="provinceChange">
              <el-option v-for="item in provinceData" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <el-select v-model="searchData.cityData" placeholder="请选择市" class="select-group" clearable @change="cityChange">
              <el-option v-for="item in cityData" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
            <el-select v-model="searchData.area" placeholder="请选择区" class="select-group" clearable @change="areaChange">
              <el-option v-for="item in areaData" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间" class="RepairTime">
            <el-col :span="11">
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="开始时间" v-model="searchData.StartTime" style="width: 100%;"></el-date-picker>
            </el-col>

            <el-col class="line" :span="2">-</el-col>

            <el-col :span="11">
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="结束日期" v-model="searchData.EndTime" style="width: 100%;"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="" class="selectChoose">
            <el-select v-model="searchData.cooperation" placeholder="选择合作类型" clearable>
              <el-option  v-for="item in searchData.cooperationList" :key="item.val" :label="item.name" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" class="selectChoose">
            <el-select v-model="searchData.agentName" placeholder="选择代理名称" clearable>
              <el-option  v-for="item in searchData.agentNameList" :key="item.val" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="pageNum = 1, currentPage = 1,  getAgentList()">查找</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--表格内容-->
      <el-table :data="AgentData" style="width: 100%" class="authorization-table">
        <el-table-column type="index" :index="filterIndex" label="序号" width="60"></el-table-column>
        <el-table-column prop="recommendName" label="推荐人姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号" ></el-table-column>
        <el-table-column prop="wherearea" label="所在地区"></el-table-column>
        <el-table-column prop="contactsName" label="联系人"></el-table-column>
        <el-table-column prop="applyTime" label="合作时间"></el-table-column>
        <el-table-column prop="applyType" label="合作类型"></el-table-column>
        <el-table-column prop="ruleName" label="代理名称"></el-table-column>
        <el-table-column prop="joinFee" label="加盟费"></el-table-column>
        <el-table-column prop="groupName" label="权限组"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="props">
            <el-button type="text" class="edit-button" @click="$router.push({path:'/admin/seting/authorization/detail', query: { id: props.row.id}})">详情</el-button>
            <el-button type="text" class="delete-button" @click="centerDialogVisible = true, JurisdictionSing = '', userid = props.row.userId">授权</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--授权弹窗-->
    <el-dialog
      title="代理商授权"
      :visible.sync="centerDialogVisible"
      width="480px"
      center class="grant-pop">
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item label="指定权限组">
          <el-select  placeholder="选择权限组" clearable v-model="JurisdictionSing">
              <el-option v-for="item in JurisdictionList" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorization">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页-->
    <el-pagination
      background
      layout="prev, pager, next"
      :page-count="totalPages"
      :current-page.sync="currentPage"
      @current-change="pageChange" v-if="totalPages">
    </el-pagination>
  </div>
</template>

<script>
import RegionData from '../../../assets/js/ChinaRegionData'
export default {
  data () {
    return {
      centerDialogVisible: false,
      searchData: {
        province: '', // 省
        city: '', // 市
        area: '', // 区
        StartTime: '', // 开始时间
        EndTime: '', // 结束时间
        cooperation: '', // 合作类型
        cooperationList: [
          {
            name: '企业合作',
            val: '2'
          },
          {
            name: '个人合作',
            val: '1'
          }
        ],
        agentName: '', // 代理名称
        agentNameList: [
          {
            name: '省级合伙人',
            val: '1'
          },
          {
            name: '直辖市(区代理)',
            val: '2'
          },
          {
            name: '省会(区代理)',
            val: '3'
          },
          {
            name: '地级市代理',
            val: '4'
          },
          {
            name: '县级市代理',
            val: '5'
          }
        ]
      },
      currentPage: 1, // 当前页数
      JurisdictionSing: '', // 权限组选择
      JurisdictionList: '', // 权限组列表
      provinceData: [], // 省数据集合
      cityData: [], // 市数据集合
      areaData: [], // 区数据集合
      currentProvince: [],         // 当前省份数据
      currentCity: [],
      currentArea: [],
      userid: '',
      AgentData: [], // 代理商列表
      totalPages: 0, // 总页数
      pageNum: 1,
      pageSize: 20,
      hasAuth: '' // 授权标识
    }
  },
  watch: {
    '$route' (to, from) {
      this.pageNum = 1
      this.RouterMonitor(to.path)
    }
  },
  mounted: function () {
    // 省级数据过滤
    RegionData.filter((row) => {
      this.provinceData.push({ code: row.code, name: row.name })
    })
    this.RouterMonitor(this.$route.path) // 监测路由变化获取列表
    this.Jurisdiction()
  },
  methods: {
    /**
     * 过滤索引
     */
    filterIndex (index) {
      return parseInt((this.currentPage - 1) * 20) + index + 1
    },
    /**
     * 监测当前路由
    */
    RouterMonitor (rot) {
      if (rot.indexOf('all') > -1) {
        this.hasAuth = ''
      }
      if (rot.indexOf('not') > -1) {
        this.hasAuth = '1'
      }
      if (rot.indexOf('pass') > -1) {
        this.hasAuth = '0'
      }
      this.getAgentList()
    },
    /**
     * 省级选择
     */
    provinceChange (value) {
      this.cityData = []
      this.areaData = []
      this.searchData.cityData = ''
      this.searchData.area = ''
      if (value) {
        this.currentProvince = RegionData.filter((row) => row.code === value)[0]
        this.cityData = this.currentProvince.children
        // console.log(this.currentProvince.code) // 获取选中的code name child信息
      }
    },
    /**
     * 市选择
     */
    cityChange (value) {
      this.areaData = []
      this.searchData.area = ''
      if (value) {
        this.currentCity = this.cityData.filter((row) => row.code === value)[0]
        this.areaData = this.currentCity.children
      }
    },
    /**
     * 区选择
     */
    areaChange (value) {
      this.currentArea = this.areaData.filter((row) => row.code === value)[0]
    },
    /**
     *权限组列表
    */
    Jurisdiction () {
      this.$http.post('@ROOT_API/manageAuthController/groupSelectList', {
        id: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId
      }).then((res) => {
        // console.log(res)
        if (res.data.status === '1') {
          this.JurisdictionList = res.data.data.dataList
        }
      })
    },
    /**
     * 授权
    */
    authorization () {
      if (this.JurisdictionSing === '') {
        this.$message({
          showClose: true,
          message: '请选择权限组',
          type: 'warning'
        })
        return
      }
      this.centerDialogVisible = false
      this.$http.post('@ROOT_API/channelAuthorizeController/authorizeOperate', {
        groupId: this.JurisdictionSing,
        userId: this.userid
      }).then((res) => {
        if (res.data.status === '1') {
          this.$message({
            showClose: true,
            message: 'Success',
            type: 'success'
          })
          this.getAgentList()
        }
      })
    },
    /**
     * 获取代理商列表
    */
    getAgentList () {
      this.$http.post('@ROOT_API/channelAuthorizeController/list', {
        pageNum: this.pageNum, // 当前页数
        pageSize: this.pageSize, // 每页显示条数
        userProvinceCode: this.searchData.province, // 省code
        userCityCode: this.searchData.cityData, // 市code
        userZoneCode: this.searchData.area, // 区code
        beginTime: this.searchData.StartTime, // 开始时间
        endTime: this.searchData.EndTime, // 结束时间
        applyType: this.searchData.cooperation, // 合作类型
        ruleName: this.searchData.agentName, // 代理名称
        hasAuth: this.hasAuth // 授权标识
      }).then((res) => {
        // console.log(JSON.stringify(res, null, 1))
        if (res.data.status === '1') {
          res.data.data.dataList.forEach((ite) => {
            ite.userProvince = ite.userProvince ? ite.userProvince + ',' : ''
            ite.userCity = ite.userCity ? ite.userCity + ',' : ''
            ite.userZone = ite.userZone ? ite.userZone : ''
            ite.wherearea = ite.userProvince + ite.userCity + ite.userZone
            ite.applyType = ite.applyType === 1 ? '个人' : ite.applyType === 2 ? '企业' : ''
            var NewDat = new Date(ite.applyTime)
            ite.applyTime = NewDat.getFullYear() + '-' + parseInt(NewDat.getMonth() + 1) + '-' + NewDat.getDate()
          })
          this.totalPages = res.data.data.totalPages
          this.AgentData = res.data.data.dataList
          // console.log(this.AgentData)
        } else {
          this.AgentData = []
          this.totalPages = 0
        }
      })
    },
     /**
     *分页
    */
    pageChange (index) {
      this.pageNum = index
      this.getAgentList()
    }
  }
}
</script>
<style lang='less'>
.authorization-public-wrap {
  .grant-pop{
    .el-dialog--center{
      border-radius: 4px;
      -moz-border-radius: 4px;
      -ms-border-radius: 4px;
      -o-border-radius: 4px;
      -webkit-border-radius: 4px;
      .el-dialog__body{
        text-align: center;
      }
      .el-button{
        padding: 10px 34px;
        margin-right: 20px;
        margin-right: 65px;
      }
      .el-button--primary{
        margin-right: 0;
      }
    }
  }
  .authorization-con {
    background: #fff;
    padding: 40px;
    border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    -webkit-border-radius: 4px;
    .authorization-con-serch {
      .areaChoose {
        margin-right: 40px;
        .el-input {
          width: 128px;
          margin-right: 10px;
        }
      }
      .RepairTime {
        margin-right: 40px;
        .el-col {
          width: 150px;
          margin-right: 10px;
        }
        .line {
          width: 20px;
          text-align: center;
        }
      }
      .selectChoose {
        width: 148px;
      }
      .el-button {
        padding: 10px 20px;
      }
    }
    .authorization-table{
      border: 1px solid #ebeef5;
      .cell{
        text-align: center;
      }
      .el-button{
        padding: 4px 10px;
        font-size: 14px;
      }
      .edit-button{
        border: 1px solid #79d40b;
        color: #79d40b;
      }
      .delete-button{
        border: 1px solid #ff9501;
        color: #ff9501;
      }
    }
  }
}
</style>
