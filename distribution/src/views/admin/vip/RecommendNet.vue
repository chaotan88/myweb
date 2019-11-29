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
        <div class="net-work-chart">
          <canvas width="1000" height="800" id="canvas" style="background: #afd7ff; border: 1px solid #ddd;"></canvas>
        </div>
    </template>
  </common-tpl>
</template>

<script>
import VipDetails from '@/views/admin/vip/vipDetails.vue'
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
      userDetail: {}
    }
  },
  mounted () {
    this.getRootRecommendPhone()
    this.draw()
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
    getListData (type) {
      let url = ''
      if (!type) {
        url = '@ROOT_API/buyMemberAccountManageController/getUpgradeList'
        this.loading = true
      } else {
        url = 'distributeApplyManage/exportPayAuditList'
      }
      let data = {
        dealWithStatus: this.pageType,           // 否 int 审核状态（1：待审核 2：审核通过 3：已打回 ）
        phone: this.formData.phone,                // 否 string  申请编号
        start: this.pageData.currentPage,
        pageSize: this.pageData.pageSize
      }
      if (!type) {
        this.$http.post(url, data).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            this.tableData = []
            this.pageData.total = 0
            return false
          }
          let results = resData.data
          this.pageData.total = results.total
          results.list.forEach((row) => {
            row.paymentVoucher = row.paymentVoucher ? row.paymentVoucher.split(',') : row.paymentVoucher ? [row.paymentVoucher] : []
          })
          this.tableData = results.list
        }).finally(() => {
          this.loading = false
        })
      } else {
        let filterParams = []
        for (let key in data) {
          filterParams.push(key + '=' + data[key])
        }
        window.open(this.$dm.ROOT_API + url + '?token=' + this.userInfo.token + '&' + filterParams.join('&'), '_blank')
      }
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
    draw () {
      let canvas = document.getElementById('canvas')
      let stage = new JTopo.Stage(canvas)
      let scene = new JTopo.Scene()
      function node (x, y, img, height, width, obj) {
        let node = new JTopo.Node(name, obj)
        node.setLocation(x, y)
        node.setSize(height, width)
        node.fillColor = '242, 242, 242'
        node.fontColor = '0, 0, 0'
        node.dragable = false
        node.textPosition = 'Top_Left'
        node.textOffsetY = 40
        node.textOffsetX = 10 * name.length + 15
        node.click(() => {
          console.log(obj)
        })
        scene.mode = 'select'
        scene.areaSelect = false
        scene.translate = false
        scene.add(node)

        let node2 = new JTopo.Node(name, obj)
        node2.setLocation(x + 250, y)
        node2.setSize(50, 50)
        node2.fillColor = '242, 242, 242'
        node2.fontColor = '0, 0, 0'
        node2.dragable = false
        node2.textPosition = 'Top_Left'
        node2.textOffsetY = 40
        node2.textOffsetX = 10 * name.length + 15
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
      let r1 = node(40, 40, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r2 = node(40, 110, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r3 = node(40, 180, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r4 = node(40, 300, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r5 = node(40, 370, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r6 = node(40, 440, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r7 = node(40, 350, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      let r8 = node(40, 270, '', 'A0002 李连杰', 250, 50, { level: '广州市市级运营中心', count: 20 })
      linkNode(r1, r2, '26, 191, 94')
      linkNode(r1, r3, '26, 191, 94')
      linkNode(r1, r4, '26, 191, 94')
      linkNode(r1, r5, '26, 191, 94')
      linkNode(r1, r6, '26, 191, 94')
      linkNode(r1, r7, '26, 191, 94')
      linkNode(r1, r8, '26, 191, 94')
      stage.add(scene)
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
    margin-top: 20px;
  }
}
</style>
