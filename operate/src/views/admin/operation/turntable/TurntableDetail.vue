<!--查看活动详情-->
<template>
  <common-tpl class="turntable-detail-wrap" footer>
    <template slot="header">
    </template>

    <!-- 表单数据 -->
    <template slot="main">
      <template>
        <gray-title title="活动信息"></gray-title>
        <el-form :model="formData"   label-width="100px" class="mb-20">
          <el-form-item label="活动名称：" prop="turnName">{{formData.turnName | filterEmpty}}</el-form-item>
          <el-form-item label="活动时间：">
            <span>{{formData.beginTime | filterDate}}&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;{{formData.endTime | filterDate}}</span>
          </el-form-item>
          <el-form-item label="活动规则：" prop="turnRule" >{{formData.endTime | filterEmpty}}</el-form-item>
        </el-form>
        <gray-title title="奖品信息" class="mb-20"></gray-title>
        <el-table border :data="formData.turnPrizeRequestList" style="width: 100%" v-loading="loading" element-loading-text="加载中" class="mb-20">
          <el-table-column prop="awardName" label="奖项" min-width="100"></el-table-column>
          <el-table-column prop="awardExplain" label="奖项说明" min-width="280"></el-table-column>
          <el-table-column prop="prizeName" label="奖品名称" min-width="280"></el-table-column>
          <el-table-column prop="prizeNum" label="奖品数量" width="180" ></el-table-column>
          <el-table-column prop="prizeOdds" label="中奖几率%" width="180"></el-table-column>
          <el-table-column prop="maxNum" label="每天最多派发" width="180" ></el-table-column>
        </el-table>
        <gray-title title="参与信息" ></gray-title>
        <el-form :model="formData"   label-width="100px" >
          <el-form-item label="参与次数：" prop="canJoinNum">{{formData.canJoinNum | filterEmpty}}</el-form-item>
          <el-form-item label="可参与总数：" prop="joinSumPeople" >{{formData.joinSumPeople | filterEmpty}}</el-form-item>
        </el-form>
      </template>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button  @click="$router.go(-1)" >返 回</el-button>
    </template>
  </common-tpl>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        formData: {      // 活动表单数据
        },
        activityId: ''   // 编辑活动id
      }
    },
    beforeRouteEnter (to, from, next) {
      next()
    },
    mounted () {
      this.activityId = this.$route.query.id
      this.getActivityData()
    },
    methods: {
      getActivityData () {
        this.loading = true
        this.$http.get('@ROOT_API/turn/getTurnDetail', {
          params: {
            id: this.activityId
          }}
        ).then((res) => {
          let results = res.data
          if (parseInt(results.status) !== 1) {
            this.$message({
              message: res.msg,
              type: 'error',
              duration: 1500
            })
            return false
            // ...
          }
          this.formData = results.data
        }).finally(() => {
          this.loading = false
        })
        // ....
      }
    }
  }
</script>

<style lang="less" scope>
  .mb-20{
    margin-bottom: 20px;
  }
</style>
<style lang="less">
  .el-form-item{
    margin-bottom: 0;
  }
</style>

