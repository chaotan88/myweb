<!-- 会员列表 -->
<template>
  <common-tpl class="order-index-wrap recommend-net">
    <template slot="header">
      <!-- 高级搜索组件 -->
      <high-search @search="highSearch('form')" :textVisible="false">
        <div class="pos-r" slot="search">
          <el-input v-model.trim="formData.phone" placeholder="输入申请人手机号" @keyup.enter.native="searchHandle"></el-input>
          <i class="ta-c pos-a el-icon-search" @click="searchHandle"></i>
        </div>
      </high-search>
    </template>

    <!-- 列表 -->
    <template slot="main">
        <VipDetails :data="userDetail"></VipDetails>
        <div class="net-work-chart" id="net-work-chart">
          <!-- <canvas width="1000" :height="canvasHeight" id="canvas" style="background: #afd7ff; border: 1px solid #ddd;"></canvas> -->
        </div>
    </template>
  </common-tpl>
</template>

<script>
import VipDetails from '@/views/admin/vip/vipDetails.vue'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/tree')
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
      canvasHeight: 1000
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
        this.getMemberDetail('12110000001' || phone)
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
        this.buildData(results)
      }).finally(() => {
        this.loading = false
      })
    },
    buildData (data) {
      const rootData = {
        invitationCode: this.userDetail.invitationCode,
        invitationName: this.userDetail.invitationName,
        ruleName: this.userDetail.ruleName,
        userName: this.userDetail.invitationName,
        customerPhone: this.userDetail.customerPhone,
        level: baseLevel,
        x: baseX,
        y: baseY,
        umbrellaCount: 100,
        userId: this.userDetail.customerId
      }
      if (!data || data.length === 0) {
        this.drawChart([], rootData, 0)
        return false
      }
      let datas = []
      let baseX = 200
      let baseY = 40
      let baseLevel = data[0].level - 1
      let level1Datas = data.filter(da => da.level - 1 === baseLevel) || []
      let level2Datas = data.filter(da => da.level - 2 === baseLevel) || []
      let len = level1Datas.length + level2Datas.length + 1
      this.canvasHeight = len * 30
      baseY = this.canvasHeight / 2
      data.forEach((da, index) => {
        datas.push({
          invitationCode: da.invitationCode,
          invitationName: da.invitationName || '',
          ruleName: da.disRuleName,
          userName: da.invitationName || '',
          customerPhone: da.phone,
          level: da.level,
          x: baseX + 400,
          y: 20 + (10 * index),
          umbrellaCount: da.umbrellaCount,
          userId: da.userId,
          parentId: da.parentId
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
    searchHandle () {
      this.getMemberDetail(this.formData.phone)
    },
    draw (datas, rootData, baseLevel) {
      let canvas = document.getElementById('canvas')
      let stage = new JTopo.Stage(canvas)
      let scene = new JTopo.Scene(stage)
      let height = 40
      let width = 200
      function node (obj, isRoot) {
        let node = new JTopo.Node(obj.ruleName + ' ' + obj.customerPhone)
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

        let node2 = new JTopo.Node(obj.umbrellaCount)
        // node2.setLocation(obj.x + 250, obj.y)
        node2.setSize(40, 40)
        node2.fillColor = '102,204,51'
        node2.fontColor = '0, 0, 0'
        node2.dragable = false
        node2.textPosition = 'Top_Left'
        node2.textOffsetY = 40
        node2.textOffsetX = 25
        scene.add(node2)
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
        if (da.level === baseLevel + 1) {
          linkNode(rootNode, node(da), color)
        }
      })
      scene.doLayout(JTopo.layout.TreeLayout('right', 40, 300))
    },
    drawChart (datas, rootData, baseLevel) {
      let chart = echarts.init(document.getElementById('net-work-chart'))
      chart.off('click')
      let chartData = {
        name: rootData.invitationName,
        children: []
      }
      const setChild = (da) => {
        chartData.children.forEach(cd => {
          if (da.parentId === cd.userId) {
            cd.children = cd.children || []
            cd.children.push({
              name: da.ruleName + '  ' + da.customerPhone,
              children: [],
              phone: da.customerPhone
            })
          }
        })
      }
      datas.forEach((da, index) => {
        if (da.level === baseLevel + 1) {
          chartData.children.push({
            name: da.ruleName + '  ' + da.customerPhone,
            children: [],
            userId: da.userId,
            phone: da.customerPhone
          })
        } else {
          setChild(da)
        }
      })
      chart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [chartData],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 9
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
        console.log(params)
        this.formData.phone = params.data.phone
        this.searchHandle()
        return false
      })
    }
  },
  components: { VipDetails }
}
</script>

<style lang="less" scoped>
.recommend-net{
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
}
</style>
<style lang="less">
.recommend-net{

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
  .net-work-chart {
    width: 100%;
    height: 2000px;
    margin-top: 20px;
  }
}
</style>
