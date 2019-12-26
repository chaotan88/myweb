<!-- 会员列表 -->
<template>
  <common-tpl class="order-index-wrap recommend-net">
    <!-- <template slot="other">
      
    </template> -->
    <template slot="header">
      <VipDetails :data="userDetail"></VipDetails>
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input v-model.trim="formData.phone" placeholder="输入申请人手机号" @keyup.enter.native="searchHandle(true)"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle(true)"></i>
        </div>
        <div slot="edit">
          <el-button :disabled="!historyStep || historyStep.length === 0" @click="toPre()">返回上级</el-button>
        </div>
      </high-search>
    </template>

    <template slot="main">
        
        <!-- <div class="chart-split-top"></div> -->
        <div class="net-work-chart" id="net-work-chart">
          <!-- <canvas width="1200" :height="canvasHeight" id="canvas" style="background: #afd7ff; border: 1px solid #ddd;"></canvas> -->
        </div>
    </template>
  </common-tpl>
</template>

<script>
import VipDetails from '@/views/admin/vip/vipDetails.vue'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/tree')
require('echarts/lib/component/tooltip')

export default {
  data () {
    return {
      loading: false,
      formData: {
        phone: ''
      },
      tableData: [],
      pageData: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      userDetail: {},
      start: 0,
      canvasHeight: 1550,
      historyStep: [],
      firstHeight: 0,
      rootPhone: ''
    }
  },
  mounted () {
    this.getRootRecommendPhone()
    // this.draw()
  },
  methods: {
    getRootRecommendPhone () {
      this.$http.post('@ROOT_API/buyMemberAccountManageController/getRootRecommendPhone', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        let { phone } = resData.data
        this.rootPhone = phone
        this.getMemberDetail(phone)
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 获取列表数据
     * @param  {[type]} type [数据类型，type存在表示获取导出数据]
     */
    getListData (phone) {
      this.$http.post('@ROOT_API/buyMemberAccountManageController/getMemberRecommendNet', {
        // start: this.start,
        phone: phone
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
        let results = resData.data
        let chartHeight = results.length * 50 < 500 ? 500 : results.length * 50
        if (chartHeight < this.firstHeight) chartHeight = this.firstHeight
        else this.firstHeight = chartHeight
        document.getElementById('net-work-chart').style.height = `${chartHeight}px`
        this.buildData(results)
      }).finally(() => {
        this.loading = false
      })
    },
    buildData (data) {
      let datas = []
      let baseX = 200
      let baseY = 40
      let baseLevel = data.length > 0 ? data[0].level - 1 : 0
      let level1Datas = data.filter(da => da.level - 1 === baseLevel) || []
      let level2Datas = data.filter(da => da.level - 2 === baseLevel) || []
      let len = level1Datas.length + level2Datas.length + 1
      // let len = level1Datas.length + 1
      this.canvasHeight = len * 60
      const rootData = {
        invitationCode: this.userDetail.invitationCode,
        invitationName: this.userDetail.invitationName,
        ruleName: this.userDetail.rankName,
        userName: this.userDetail.cardName,
        customerPhone: this.userDetail.customerPhone,
        level: baseLevel,
        x: baseX,
        y: baseY,
        umbrellaCount: this.userDetail.umbrellaCount,
        userId: this.userDetail.customerId,
        agentAddress: this.userDetail.agentAddress
      }
      if (!data || data.length === 0) {
        this.drawChart([], rootData, 0)
        return false
      }
      baseY = this.canvasHeight / 2
      data.forEach((da, index) => {
        datas.push({
          invitationCode: da.invitationCode,
          invitationName: da.invitationName || '',
          ruleName: da.disRuleName,
          userName: da.cardName || '',
          customerPhone: da.phone,
          level: da.level,
          x: baseX + 400,
          y: 200,
          umbrellaCount: da.umbrellaCount,
          userId: da.userId,
          parentId: da.parentId,
          agentAddress: `${da.agentProvince || ''}${da.agentCity || ''}${da.agentZone || ''}`
        })
      })
      // this.draw(datas, rootData, baseLevel)
      this.drawChart(datas, rootData, baseLevel)
    },
    getMemberDetail (phone) {
      this.$http.post('@ROOT_API/buyMemberAccountManageController/getMemberList', {
        customerPhone: phone,
        start: 1,
        pageSize: 10
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
        let { list } = res.data.data
        if (list && list.length > 0) {
          this.userDetail = list[0]
        } else {
          this.userDetail = {}
        }
        this.getListData(phone)
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 搜索
     */
    searchHandle (isClick) {
      if (isClick) this.historyStep = []
      if (this.formData.phone) {
        this.getMemberDetail(this.formData.phone)
      } else {
        this.getRootRecommendPhone()
      }
    },
    draw (datas, rootData, baseLevel) {
      let canvas = document.getElementById('canvas')
      let stage = new JTopo.Stage(canvas)
      let scene = new JTopo.Scene(stage)
      let height = 40
      let width = 200
      function node (obj, isRoot) {
        let node = new JTopo.Node(obj.ruleName + ' ' + obj.customerPhone + '')
        if (isRoot) {
          node.setLocation(obj.x, obj.y)
        }
        node.setSize(width, height)
        node.fillColor = '242, 242, 242'
        node.fontColor = '0, 0, 0'
        node.dragable = true
        node.textPosition = 'Top_Left'
        node.textOffsetY = 40
        node.textOffsetX = 160
        node.click(() => {
          console.log(obj)
        })
        scene.mode = 'select'
        scene.areaSelect = false
        scene.translate = false
        scene.add(node)

        // let node2 = new JTopo.Node(obj.umbrellaCount)
        // node2.setLocation(obj.x + 250, obj.y)
        // node2.setSize(40, 40)
        // node2.fillColor = '102,204,51'
        // node2.fontColor = '0, 0, 0'
        // node2.dragable = false
        // node2.textPosition = 'Top_Left'
        // node2.textOffsetY = 40
        // node2.textOffsetX = 25
        // scene.add(node2)
        return node
      }
      function linkNode (nodeA, nodeZ, color) {
        let link = new JTopo.FoldLink(nodeA, nodeZ)
        link.lineWidth = 3
        link.strokeColor = color
        scene.add(link)
        return link
      }
      const rootNode = node(rootData, true)
      const color = '26, 191, 94'
      datas.forEach((da, index) => {
        if ((da.level === baseLevel + 1) && index < 30) {
          linkNode(rootNode, node(da), color)
        }
      })
      scene.doLayout(JTopo.layout.TreeLayout('right', 40, 300))
    },
    drawChart (datas, rootData, baseLevel) {
      let chart = echarts.init(document.getElementById('net-work-chart'))
      chart.clear()
      chart.off('click')
      let chartData = {
        name: rootData.userName,
        children: [],
        phone: rootData.customerPhone,
        userName: rootData.userName,
        ruleName: rootData.ruleName,
        customerPhone: rootData.customerPhone,
        umbrellaCount: rootData.umbrellaCount || '',
        agentAddress: rootData.agentAddress || ''
      }
      const setChild = (da) => {
        chartData.children.forEach(cd => {
          if (da.parentId === cd.userId) {
            cd.children = cd.children || []
            cd.children.push({
              name: da.userName + '  ' + da.ruleName + '  ' + da.customerPhone,
              children: [],
              phone: da.customerPhone,
              userName: da.userName,
              ruleName: da.ruleName,
              customerPhone: da.customerPhone,
              umbrellaCount: da.umbrellaCount,
              agentAddress: da.agentAddress || ''
            })
          }
        })
      }
      datas.forEach((da, index) => {
        if (da.level === baseLevel + 1) {
          chartData.children.push({
            name: da.userName + '  ' + da.ruleName + '  ' + da.customerPhone,
            children: [],
            userId: da.userId,
            phone: da.customerPhone,
            userName: da.userName,
            ruleName: da.ruleName,
            customerPhone: da.customerPhone,
            umbrellaCount: da.umbrellaCount,
            agentAddress: da.agentAddress || ''
          })
        } else {
          setChild(da)
        }
      })
      chart.setOption({
        // tooltip: {
        //   trigger: 'item',
        //   triggerOn: 'mousemove'
        // },
        // tooltip: {
          // show: true,
          // trigger: 'item',
          // triggerOn: 'mousemove'
          // axisPointer: {
          //   'type': 'shadow'
          // },
          // formatter: function (params) {
          //   return 'aaaaa'
          // }
          // position: function (point, params, dom, rect, size) {
          //   return [point[0], '10%']
          // }
        // },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function (params) {
            let { data } = params
            let str = ''
            if (data.userName) str += `姓名: ${data.userName || ''}</br>`
            if (data.phone) str += `电话：${data.phone || ''}</br>`
            if (data.ruleName) str += `当前等级：${data.ruleName || ''}</br>`
            if (data.agentAddress) str += `身份所属区域：${data.agentAddress || '--'}`
            if (data.umbrellaCount) str += `下级会员数：${data.umbrellaCount || '--'} 人`
            return str
          }
        },
        series: [
          {
            type: 'tree',
            data: [chartData],
            top: '2%',
            left: '30%',
            bottom: '2%',
            right: '30%',
            symbolSize: 7,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 14
              }
            },
            itemStyle: {
              normal: {
                label: {
                  formatter: function (params) {
                    let { data } = params
                    let arr = []
                    if (data.userName) arr.push(data.userName)
                    if (data.phone) arr.push(data.phone)
                    if (data.ruleName) {
                      if (data.agentAddress) {
                        arr.push(`${data.ruleName}(${data.agentAddress})`)
                      } else {
                        arr.push(data.ruleName)
                      }
                    }
                    let str = arr.join('-')
                    return str
                  }
                }
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: false,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
      chart.on('click', (params) => {
        if (this.historyStep.indexOf(this.formData.phone) === -1) {
          this.historyStep.push(this.formData.phone)
        }
        this.formData.phone = params.data.phone
        this.searchHandle()
        return false
      })
    },
    toPre () {
      this.formData.phone = this.historyStep[this.historyStep.length - 1]
      this.searchHandle()
      this.historyStep.splice(this.historyStep.length - 1, 1)
    }
  },
  components: { VipDetails }
}
</script>

<style lang="less" scoped>
.recommend-net{
  height: 75%;
  .w50{
    width: 50%;
    .el-form-item{
      width: 100%;
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }

    .agent{
      .el-form-item__content{
        margin-left: 0 !important;
        /*margin-right: 140px;*/
      }
    }
  }
  .vip-search-wrap{
    width: 20%;
    padding-bottom: 20px;
  }

  .common-table-wrap{
    padding: 0;
    .el-table{
      border: 1px solid #ebeef5;
      border-bottom: none;
    }
  }
  .chart-split-top {
    height: 20px;
    margin-left: -40px;
    width: 110%;
    background: #eee;
  }
  .disabled-btn {
    cursor: not-allowed;
  }
  .disabled-btn:hover {
    background: #fff !important;
    border: 1px solid #DCDFE6 !important;
    color:#606266 !important;
  }
  .disabled-btn:active {
    background: #fff !important;
    border: 1px solid #DCDFE6 !important;
    color:#606266 !important;
  }
}
</style>
<style lang="less">
.recommend-net{
  ::-webkit-scrollbar{
    width: 6px;
    height: 6px;
    background-color: rgba(255, 255, 255, 0);
  }
  ::-webkit-scrollbar-thumb{
    background: rgba(12, 39, 57, .3);
    border-radius: 10px;
  }
  .search-head-wrap{
    .el-input__inner{
      width: 250px;
    }
  }

  .apply-date-wrap{
    .el-col-5{
      width: 130px;
    }

    .el-col-2{
      width: 41px;
    }

    .el-input--prefix{
      .el-input__inner{
        padding-right: 15px;
      }
    }
  }

  /*-----------搜索框----------*/
  .vip-search-wrap{
    width: 25%;
    padding-bottom: 20px;

    .el-input__inner{
      border-radius: 30px;
    }

    span{
      right: 20px;
      top: 12px;
      cursor:pointer
    }

    span:hover{
      color: #409EFF;
    }
  }

  .agent{
    .el-form-item__content{
      margin-left: 0 !important;
      /*margin-right: 140px;*/
    }
  }

  .senior-item{
    .el-form-item{
      width: 100%;
    }

    .el-form-item__content{
      margin-left: 0 !important;
    }

    .el-date-editor.el-input__inner{
      width: 100%;
    }
  }

  .el-form-item{
    width: 50%;
    float: left;

    .w100{
      .el-form-item__content{
        margin-left: 0 !important;
      }

      .el-input{
        width: 100%;
      }
    }

    .el-select{
      width: 100%;
    }
  }
  .admin-common-tpl-header {
    .search-wrap {
      .search-head-wrap {
        padding: 10px 30px;
      }
    }
  }
  .admin-common-main {
    height: calc(~"100% - 280px") !important;
    overflow: scroll;
    padding: 0;
  }
  .net-work-chart {
    height: 500px;
    margin-top: -30px;
    background: #AFD7FF;
    // overflow: hidden;
  }
}
</style>
