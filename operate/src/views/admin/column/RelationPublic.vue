<template>
  <div class="pos-r relation-public-wrap">
    <!-- 商品库 -->
    <div class="table-left fl-l">
      <div class="ta-l title">商品库</div>
      <div class="pos-r tabs-wrap">
        <el-tabs type="card" v-model="leftTabs" @tab-click="handleTabsClick">
          <el-tab-pane label="自营商品" name="self">自营商品</el-tab-pane>
          <el-tab-pane label="店铺商品" name="shop">店铺商品</el-tab-pane>
        </el-tabs>
        <el-select placeholder="请选择店铺" class="pos-a" v-model="leftShopId" v-if="leftTabs === 'authentication'" @change="shopidChange">
          <el-option v-for="item in shopList" :key="item.id" :label="item.shopName" :value="item.id"></el-option>
        </el-select>
      </div>
      <div class="pos-r search-wrap">
        <h2 class="fw-n pos-a">商品类型：</h2>
        <el-input placeholder="商品编号/商品名称" v-model="leftSearchText" @keyup.enter.native="getRelationAllGoodsList(1)">
          <el-select v-model="listLeftPoints" placeholder="请选择" slot="prepend">
            <el-option label="全部" value=""></el-option>
            <el-option label="支持积分兑换" :value="1"></el-option>
            <el-option label="不支持积分兑换" :value="0"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search cursor-p" @click="getRelationAllGoodsList(1)"></el-button>
        </el-input>
      </div>
      <el-table ref="multipleTable" :data="listLeftData" max-height="500" class="full-w" @selection-change="selectLeftHandle" v-elmore="handleLoadmore">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination background layout="prev, pager, next" :current-page="leftPageData.currentPage" :page-size="leftPageData.pageSize" :total="leftPageData.total" @current-change="pageChange" v-if="leftPageData.total">
      </el-pagination> -->
    </div>

    <!-- 添加/移除商品按钮 -->
    <div class="relation-btns fl-l pos-a">
      <el-button @click="moveToRightHandle" :disabled="!listLeftRes.length"><span class="fl-l d-b">添加<span class="el-icon-arrow-right"></span></span></el-button>
      <el-button @click="moveLeftHandle" :disabled="!listRightRes.length"><span class="el-icon-arrow-left fl-l d-b">移除</span></el-button>
    </div>

    <!-- 已添加商品 -->
    <div class="table-right fl-r">
      <div class="ta-l title"></div>
      <div class="pos-r tabs-wrap">
        <div class="ta-l title">已添加商品</div>
      </div>
      <div class="pos-r search-wrap">
        <h2 class="fw-n pos-a">商品类型：</h2>
        <el-input placeholder="商品编号/商品名称" v-model="rightSearchText" @keyup.enter.native="searchRightHandle()">
          <el-select v-model="listRightPoints" placeholder="请选择" slot="prepend">
            <el-option label="全部" value=""></el-option>
            <el-option label="支持积分兑换" :value="1"></el-option>
            <el-option label="不支持积分兑换" :value="0"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search cursor-p" @click="searchRightHandle()"></el-button>
        </el-input>
      </div>
      <!-- <el-table ref="multipleTable" :data="listRightData" tooltip-effect="dark" max-height="500" class="full-w" @selection-change="selectRightHandle" v-loading="loading" element-loading-text="加载中"> -->
      <el-table ref="multipleTable" :data="listRightData" tooltip-effect="dark" max-height="500" class="full-w" @selection-change="selectRightHandle" v-loading="loading" element-loading-text="加载中">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
        <el-table-column prop="goodsName" label="商品名称"></el-table-column>
        <!-- 暂无数据 -->
        <div slot="empty">
          <no-data></no-data>
        </div>
      </el-table>

      <!-- 分页 -->
      <!-- <el-pagination background layout="prev, pager, next" :current-page="rightPageData.currentPage" :page-size="rightPageData.pageSize" :total="rightPageData.total" @current-change="pageChange" v-if="rightPageData.total">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    relationKey: Number,
    columnId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: false,           // 加载中..
      loaded: false,            // 加载完毕
      ajaxLeftFlag: false,      // 左边加载标识
      leftTabs: 'self',         // 左边选项卡
      leftShopId: '',           // 左边店铺id
      listLeftData: [],         // 关联商品库
      listLeftPoints: '',       // 是否支持积分兑换(0 : 否，1 ：是)
      ajaxRightFlag: false,     // 右边加载标识
      listRightData: [],        // 关联商品
      listRightPoints: '',      // 是否支持积分兑换(0 : 否，1 ：是)
      listRightInitData: [],    // 关联商品初始化数据
      listLeftRes: [],          // 左边选中结果
      listRightRes: [],         // 右边选中结果
      leftSearchText: '',       // 关联商品库搜索
      rightSearchText: '',      // 关联商品搜索
      leftPageData: {           // 商品库列表分页
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      rightPageData: {          // 关联商品列表分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      shopList: [],             // 店铺列表
      userInfo: {},             // 用户信息
      deleteListData: []        // 删除列表数据
    }
  },
  watch: {
    /**
     * 判断重新打开窗口
     */
    relationKey () {
      this.loaded = false
      this.leftPageData.currentPage = 1
      this.leftTabs = 'self'
      this.leftSearchText = ''
      this.leftShopId = this.userInfo.shopId
      this.listLeftPoints = ''
      this.rightSearchText = ''
      this.listLeftData = []
      this.listRightData = []
      this.listRightPoints = ''
      this.listRightInitData = []
      this.getRelationAllGoodsList(1)
      this.getRelationGoodsList()
    },
    /**
     * 栏目ID变化
     */
    columnId () {
      this.loaded = false
      this.leftPageData.currentPage = 1
      this.leftTabs = 'self'
      this.leftSearchText = ''
      this.leftShopId = this.userInfo.shopId
      this.listLeftPoints = ''
      this.rightSearchText = ''
      this.listLeftData = []
      this.listRightData = []
      this.listRightPoints = ''
      this.listRightInitData = []
      this.getRelationAllGoodsList(1)
      this.getRelationGoodsList()
    },

    /**
     * 监听左边调用接口
     */
    ajaxLeftFlag (val) {
      if (val === true && (this.listRightData.length)) {
        this.filterListData()
        this.ajaxLeftFlag = false
      }
    },

    /**
     * 监听右边调用接口
     */
    ajaxRightFlag (val) {
      if (val === true && (this.listLeftData.length || this.listRightInitData.length)) {
        this.filterListData()
        this.ajaxRightFlag = false
      }
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
    this.leftShopId = this.userInfo.shopId
    this.getRelationAllGoodsList()
    if (this.columnId) {
      this.getRelationGoodsList()
      this.filterListData()
    }
    this.getShopList()
  },
  methods: {
    /**
     * table 加载更多
     */
    handleLoadmore () {
      if (this.loading || this.loaded) return false
      this.getRelationAllGoodsList()
    },

    /**
     * 获取所有商品列表
     */
    getRelationAllGoodsList (page) {
      if (page) this.leftPageData.currentPage = page
      this.loading = true
      this.$http.post('@ROOT_API/column/allGoodsList', {
        start: this.leftPageData.currentPage,
        pageSize: this.leftPageData.pageSize,
        whetherPoints: this.listLeftPoints,
        searchText: this.leftSearchText,
        shopId: this.leftShopId,
        columnId: this.columnId
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listLeftData = []
          return false
        }
        if (page) this.listLeftData = []
        let results = resData.data
        results.list.forEach((row) => {
          row.action = null
          row.isDefault = false
          row.defaultNum = row.goodsNum
          this.listLeftData.push(row)
        })
        this.ajaxLeftFlag = true
        setTimeout(() => {
          this.filterListData()
        }, 30)
        // 判断是否加载完毕
        if (this.leftPageData.currentPage < results.pages) {
          this.leftPageData.currentPage++
        } else {
          this.loaded = true
        }
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 店铺列表
     */
    getShopList () {
      this.$http.post('@ROOT_API/shopManageController/getHomeShopList').then((res) => {
        let resData = res.data
        if (resData.status !== '1') {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.shopList = []
          return false
        }
        resData.data.forEach((row) => {
          if (parseInt(row.id) !== 1) this.shopList.push(row)
          // if (parseInt(row.id) !== parseInt(this.userInfo.shopId)) this.shopList.push(row)
        })
      })
    },

    /**
     * tabs切换
     */
    handleTabsClick (value) {
      this.loaded = false
      if (this.leftTabs === 'self') {
        this.leftShopId = this.userInfo.shopId
        this.listLeftData = []
        this.getRelationAllGoodsList(1)
      } else {
        this.leftShopId = ''
      }
    },

    /**
     * 选择店铺
     */
    shopidChange (value) {
      this.loaded = false
      this.leftShopId = value
      this.listLeftData = []
      this.getRelationAllGoodsList(1)
    },

    /**
     * 过滤列表数据
     */
    filterListData () {
      if (this.listRightData.length !== this.listRightInitData.length) {
        if (this.rightSearchText === '' && this.listRightPoints === '') {
          this.listRightData = this.$Utils.deepCopy(this.listRightInitData)
        } else {
          let ids = []
          let results = []
          this.listRightInitData.forEach((row) => {
            ids.push(row.id)
          })
          this.listRightData.forEach((row) => {
            if (ids.indexOf(row.id) !== -1) results.push(row)
          })
          this.listRightData = results
        }
      }
      this.listRightInitData.forEach((row) => {
        this.listLeftData.forEach((list, index) => {
          if (row.id === list.id) this.listLeftData.splice(index, 1)
        })
      })
    },

    /**
     * 关联商品列表搜索
     */
    searchRightHandle () {
      if (!this.rightSearchText && this.listRightPoints === '') {
        this.listRightData = this.$Utils.deepCopy(this.listRightInitData)
        return false
      }
      this.getRelationGoodsList()
    },

    /**
     * 获取关联商品列表
     */
    getRelationGoodsList () {
      if (!this.columnId) return false
      this.listRightData = []
      this.$http.post('@ROOT_API/column/columnGoodsList', {
        columnId: parseInt(this.columnId) || '',
        searchText: this.rightSearchText,
        whetherPoints: this.listRightPoints
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1 && parseInt(resData.status) !== 9998) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listRightData = []
          this.listRightInitData = []
          return false
        }
        this.listRightData = resData.data
        if (!this.listRightInitData.length) {
          resData.data.forEach((row) => {
            row.action = null
            row.isDefault = true
            row.defaultNum = row.goodsNum
          })
          this.listRightInitData = this.$Utils.deepCopy(resData.data)
          this.$emit('change', this.listRightInitData, this.deleteListData)
        }
        this.ajaxRightFlag = true
      })
    },

    /**
     * 关联商品左边选择
     */
    selectLeftHandle (val) {
      this.listLeftRes = val
    },

    /**
    * 关联商品移动到右边关联事件
    */
    moveToRightHandle () {
      this.listLeftRes.forEach((row) => {
        this.deleteListData.forEach((deletes, index) => {
          if (row.id === deletes.id) this.deleteListData.splice(index, 1)
        })
        // 设置类型
        if (!row.isDefault) row.action = 'add'
        this.listRightData.push(row)
        this.listRightInitData.push(row)
        this.listLeftData.forEach((list, index) => {
          if (row.id === list.id) this.listLeftData.splice(index, 1)
        })
      })
      this.listLeftRes = []
      if (this.listLeftData.length < 20) this.getRelationAllGoodsList()
      this.$emit('change', this.listRightInitData, this.deleteListData)
    },

    /**
     * 关联商品右边选择
     */
    selectRightHandle (val) {
      this.listRightRes = val
    },

    /**
     * 关联商品移动到左边选择关联事件
     */
    moveLeftHandle () {
      this.listRightRes.forEach((row) => {
        this.listLeftData.push(row)
        this.listRightData.forEach((list, index) => {
          if (row.id === list.id) this.listRightData.splice(index, 1)
        })
        this.listRightInitData.forEach((list, index) => {
          if (row.id === list.id) this.listRightInitData.splice(index, 1)
        })
      })
      this.listRightRes = []
      this.$emit('change', this.listRightInitData)
    }
  }
}
</script>

<style lang="less" scoped>
.relation-public-wrap{
  padding: 0 15px;
  overflow: hidden;

  /*------关联商品--------*/
  .el-table{
    text-align: left;
    border: 1px solid #ebeef5;
    border-bottom: none;
  }

  .el-input-group{
    margin: 0 0 30px 0;
  }

  .table-left, .table-right{
    width: 50%;
    padding-bottom: 40px;
    box-sizing: border-box;

    .title{
      height: 24px;
      font-size: 18px;
      margin-bottom: 15px;
    }
  }

  .table-left{
    padding-right: 90px;
  }

  .relation-btns{
    width: 90px;
    height: 140px;
    margin-top: -30px;
    margin-left: -45px;
    left: 50%;
    top: 50%;

    .el-button{
      font-size: 16px;
      padding: 10px 20px;
      margin-left: 0;
      margin-bottom: 60px;
    }
  }

  .table-right{
    padding-left: 90px;
  }
}

</style>

<style lang="less">
.relation-public-wrap{

  .tabs-wrap{
    height: 60px;

    .el-select{
      right: 0;
      top: 1px;
    }
  }

  .el-tabs{
    .el-tabs__header{
      margin-bottom: 30px;
    }

    .el-tabs__content{
      display: none !important;
    }
  }

  .search-wrap{
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
    padding-left: 85px;

    .el-input-group__append{
      width: 45px;
      padding-left: 0;
      padding-right: 0;
      text-align: center;
    }

    .el-select{
      width: 140px;
    }

    h2{
      font-size: 16px;
      left: 0;
      top: 0;
    }

    .el-icon-search{
      color: #999;
      font-size: 18px;
      right: 0;
      top: 0;
    }

    .el-icon-search:hover{
      color: #56ade8;
    }
  }

  .el-dialog__body{
    padding-top: 0;
  }
}
</style>
