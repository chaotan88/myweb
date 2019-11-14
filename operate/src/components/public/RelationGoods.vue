<!-- 关联商品 -->
<template>
  <div class="pos-r public-relation-goods-wrap">
    <!-- 左边列表 -->
    <div class="fl-l table-wrap">
      <div class="ta-l fw-b" style="font-size: 16px; margin-bottom: 10px;">商品库</div>
      <div class="pos-r table-t">
        <span class="pos-a" style="line-height: 40px; left: 0;">商品来源：</span>
        <el-input class="fl-l" placeholder="商品编号/商品名称" v-model.trim="leftSearchText" @keyup.enter.native="getRelationAllGoodsList(1)">
          <supplier-select class="fl-l current-supplier-select" text="" slot="prepend" @change="leftSupplierChange"></supplier-select>
          <el-button slot="append" icon="el-icon-search cursor-p" @click="getRelationAllGoodsList(1)"></el-button>
        </el-input>
      </div>
      <el-table :data="leftData" @selection-change="handleSelectLeft" max-height="525" v-elmore="leftLoadMore">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>
        <el-table-column label="缩略图" width="70px">
          <template slot-scope="scope">
            <img style="width: 50px; height: 50px;" :src="scope.row.mainImage | filterImgUrl" v-if="scope.row.mainImage">
          </template>
        </el-table-column>
        <el-table-column prop="goodsNo" label="商品编码">
          <template slot-scope="scope"><div class="truncate">{{scope.row.goodsNo}}</div></template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称">
          <template slot-scope="scope"><div class="truncate">{{scope.row.goodsName}}</div></template>
        </el-table-column>
        
        <el-table-column slot="empty">
          <no-data></no-data>
        </el-table-column>
      </el-table>
    </div>

    <!-- 右边列表 -->
    <div class="fl-r table-wrap">
      <div class="ta-l fw-b" style="font-size: 16px; margin-bottom: 10px;">已添加商品</div>
      <div class="pos-r table-t">
        <span class="pos-a" style="line-height: 40px; left: 0;">商品来源：</span>
        <el-input class="fl-l" placeholder="商品编号/商品名称" v-model.trim="rightSearchText" @keyup.enter.native="getRelationGoodsList(1)">
          <supplier-select class="fl-l current-supplier-select" text="" slot="prepend" @change="rightSupplierChange"></supplier-select>
          <el-button slot="append" icon="el-icon-search cursor-p" @click="getRelationGoodsList(1)"></el-button>
        </el-input>
      </div>
      <el-table :data="rightData" max-height="525" @selection-change="handleSelectRight" v-elmore="rightLoadMore">
        <el-table-column type="selection" width="50" fixed="left"></el-table-column>

        <el-table-column label="缩略图" width="70px">
          <template slot-scope="scope">
            <img style="width: 50px; height: 50px;" :src="scope.row.mainImage | filterImgUrl" v-if="scope.row.mainImage">
          </template>
        </el-table-column>

        <el-table-column prop="goodsNo" label="商品编码">
          <template slot-scope="scope"><div class="truncate" :class="{'red-color': relationType === 2 && scope.row.discount > compareDiscount}">{{scope.row.goodsNo}}</div></template>
        </el-table-column>

        <el-table-column prop="goodsName" label="商品名称">
          <template slot-scope="scope"><div class="truncate" :class="{'red-color': relationType === 2 && scope.row.discount > compareDiscount}">{{scope.row.goodsName}}</div></template>
        </el-table-column>

        <!-- 栏目关联商品 -->
        <template v-if="sort">
          <el-table-column label="排序" width="90px">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-input size="medium" min="0" v-model.number="scope.row.sort" @blur="sortChangeBefore(scope.row)" ></el-input>
                <span style="width: 14px; height: 36px; position: absolute; right: 5px; top: 0;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== rightData.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== rightData.length - 1"></i>
                </span>
              </div>
            </template>
          </el-table-column>
        </template>

        <!-- 套餐关联商品 -->
        <template v-if="setNum">
          <el-table-column label="设置数量">
            <template slot-scope="scope">
              <el-input size="medium" min="0" maxlength="10" v-model.number="scope.row.goodsNum" @blur="numberChange(scope.row)"></el-input>
            </template>
          </el-table-column>
        </template>
        
        <el-table-column slot="empty">
          <no-data></no-data>
        </el-table-column>
      </el-table>
    </div>

    <div class="clear"></div>

    <!-- 操作按钮 -->
    <div class="pos-a btns">
      <el-button @click="handleAddGoods" :loading="addLoading" :disabled="!leftRes.length"><span class="fl-l d-b">添加<span class="el-icon-arrow-right"></span></span></el-button>
      <el-button @click="handleRemoveGoods" :loading="delLoading" :disabled="!rightRes.length"><span class="el-icon-arrow-left fl-l d-b">移除</span></el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    relationId: Number,   // 关联id
    sort: {               // 是否设置排序
      type: Boolean,
      default: false
    },
    relationType: {       // 关联类型  [1、栏目，2、套餐，3、社群主题]
      type: Number,
      default: 1
    },
    relationUrl: {
      type: String,
      default: ''
    },
    setNum: {             // 是否设置数量
      type: Boolean,
      default: false
    },
    setmealType: Number,  // 套餐类型 [1、固定套餐，2、自选套餐]
    limit: Number         // 最大关联个数商品
  },
  data () {
    return {
      leftLoading: false,   // 加载中..
      leftLoaded: false,    // 加载完毕
      leftData: [],         // 左边列表数据
      leftRes: [],          // 左边选择集合
      leftSupplierId: '',   // 左边供应商id
      leftSearchText: '',   // 左边搜索
      leftPageData: {       // 左边分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      rightLoading: false,  // 加载中..
      rightLoaded: false,   // 加载完毕
      rightData: [],        // 左边列表数据
      rightRes: [],         // 右边选择集合
      rightSupplierId: '',  // 右边供应商id
      rightSearchText: '',  // 右边搜索
      rightPageData: {      // 左边分页数据
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      addLoading: false,    // 添加loading
      delLoading: false,    // 移除loading

      supplierData: [],     // 供应商列表

      compareDiscount: ''   // 折扣比例
    }
  },

  watch: {
    'relationId' (val) {
      this.getRelationAllGoodsList(1)
      this.getRelationGoodsList(1)
    }
  },

  mounted () {
    this.getRelationAllGoodsList(1)
    if (this.relationId) this.getRelationGoodsList(1)
    if (this.relationType === 2) this.getSetmealDetailsData()
  },

  methods: {
    /**
     * 获取套餐规则设置详情
     */
    getSetmealDetailsData () {
      this.$http.post('@ROOT_API/column/getSetMealInfo', {}).then((res) => {
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
        this.compareDiscount = results.setMealDiscount
      })
    },

    /**
     * 获取关联商品所有数据
     */
    getRelationAllGoodsList (page) {
      if (page) this.leftPageData.currentPage = page
      let url = ''
      switch (this.relationType) {
        case 1:
          url = '@ROOT_API/column/allGoodsList'
          break
        case 3:
          url = '@ROOT_API/shareTheme/getShareThemeNoGoodsPage'
          break
        case 5:
          url = '@ROOT_API/shareTheme/getShareThemeNoGoodsPage'
          break
        default:
          url = '@ROOT_API/column/allSetMealGoodsList'
      }
      this.leftLoading = true
      this.$http.post(url, {
        start: this.leftPageData.currentPage, // 是 int 当前页
        pageSize: this.leftPageData.pageSize, // 是 int 每页条数
        supplierId: this.leftSupplierId,      // 否 int 供应商id
        themeId: this.relationId,             // 关联主题id
        columnId: this.relationId,            // 关联栏目id
        searchText: this.leftSearchText,      // 否 String  商品编号/商品名称
        whetherPoints: ''                     // 否 int 是否支持积分兑换 (0 否 , 1 是)
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        // 重置搜索条件
        if (page) {
          this.leftRes = []
          this.leftData = []
          this.leftLoaded = false
        }
        let results = resData.data
        // 栏目 || 套餐 关联商品
        if (this.relationType === 1 || this.relationType === 2) {
          let rightIds = this.rightData.map(row => row.id)
          results.list.forEach((row) => {
            if (rightIds.indexOf(row.id) === -1) this.leftData.push(row)
          })
        } else {
          // 社区运营关联商品
          let rightIds = this.rightData.map(row => row.goodsId)
          results.list.forEach((row) => {
            if (rightIds.indexOf(row.id) === -1) this.leftData.push(row)
          })
        }
        // 判断是否加载完毕
        if (this.leftPageData.currentPage < results.pages) {
          this.leftPageData.currentPage++
        } else {
          this.leftLoaded = true
        }
        if (this.leftData.length <= 7 && this.leftPageData.currentPage !== 1) {
          this.getRelationAllGoodsList(1)
        }
      }).finally(() => {
        this.leftLoading = false
      })
    },

    /**
     * 左边加载更多
     */
    leftLoadMore () {
      if (this.leftLoading || this.leftLoaded) return false
      this.getRelationAllGoodsList()
    },

    /**
     * 左边供应商选择
     */
    leftSupplierChange (id) {
      this.leftSupplierId = id
    },

    /**
     * 左边数据选择
     */
    handleSelectLeft (selection, row) {
      this.leftRes = selection
    },

    /**
     * 获取已关联商品数据
     */
    getRelationGoodsList (page) {
      if (!this.relationId || isNaN(this.relationId)) return false
      if (page) this.rightPageData.currentPage = page
      let url = this.relationUrl || 'column/columnGoodsList'
      this.rightLoading = true
      this.$http.post('@ROOT_API/' + url, {
        start: this.rightPageData.currentPage,
        pageSize: this.rightPageData.pageSize,
        themeId: this.relationId,
        columnId: this.relationId,        // 是 int 栏目ID
        supplierId: this.rightSupplierId, // 否 int 供应商Id
        searchText: this.rightSearchText, // 否 String  商品编号/商品名称
        whetherPoints: ''                 // 否 int 是否支持积分兑换(0 : 否，1 ：是)
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        // 重置搜索条件
        if (page) {
          this.rightRes = []
          this.rightData = []
          this.rightLoaded = false
        }
        let ids = this.rightData.map(row => row.goodsId)
        let results = resData.data.list || resData.data
        results.forEach((row) => {
          if (ids.indexOf(row.goodsId) === -1) this.rightData.push(row)
        })
        // 社群主题 拼团主题
        if (this.relationType === 3 || this.relationType === 5) {
          // 判断是否加载完毕
          if (this.rightPageData.currentPage < resData.data.pages) {
            this.rightPageData.currentPage++
          } else {
            this.rightLoaded = true
          }
        }
        this.$emit('change', this.rightData)
      }).finally(() => {
        this.rightLoading = false
      })
    },

    /**
     * 右边加载更多
     */
    rightLoadMore () {
      if (this.rightLoading || this.rightLoaded) return false
      this.getRelationGoodsList()
    },

    /**
     * 右边供应商选择
     */
    rightSupplierChange (id) {
      this.rightSupplierId = id
    },

    /**
     * 右边数据选择
     */
    handleSelectRight (selection, row) {
      this.rightRes = selection
    },

    /**
     * 添加
     */
    handleAddGoods () {
      // 判断限制数量
      if (this.limit && (this.rightData.length + this.leftRes.length) >= this.limit) {
        this.$message({
          message: '最多添加' + this.limit + '个商品',
          type: 'error',
          duration: 1500
        })
        return false
      }
      if (this.relationType === 3 || this.relationType === 5 || this.relationType === 8) {
        this.communityOperationAddGoods()
      } else {
        this.columnAddGoods()
      }
    },

    /**
     * 社群运营关联商品
     */
    communityOperationAddGoods () {
      let ids = this.leftRes.map(row => row.goodsId)
      this.addLoading = true
      this.$http.post('@ROOT_API/shareTheme/addShareThemeGoodsisJoinStatus', {
        themeId: this.relationId,
        goodslist: ids
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
        this.leftRes.forEach((row, index) => {
          resData.data.forEach((list, i) => {
            if (row.goodsId === list.goodsId) {
              row.id = list.id
              row.goodsId = list.goodsId
              row.goodsPrice = list.goodsPrice
              row.buyingPrice = list.buyingPrice
            }
            if (index === (this.leftRes.length - 1) && i === (resData.data.length - 1)) {
              this.$emit('add', this.leftRes)
              setTimeout(() => {
                this.handleAddGoodsAfter()
              }, 300)
            }
          })
        })
      }).finally(() => {
        setTimeout(() => {
          this.addLoading = false
        }, 200)
      })
    },

    /**
     * （栏目管理、关联产品参数、套餐管理）关联商品
     */
    columnAddGoods () {
      let goodsColumnIds = []
      this.leftRes.forEach((row) => {
        goodsColumnIds.push({
          goodsColumnId: row.goodsColumnId,
          goodsId: row.id,
          sort: row.sort
        })
      })
      this.addLoading = true
      this.$http.post('@ROOT_API/column/relateGoods', {
        id: this.relationId,
        goodsColumnIds
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
        this.leftRes.forEach((row, index) => {
          resData.data.forEach((list, i) => {
            if (row.id === list.goodsId) {
              row.id = list.id
              row.goodsId = list.goodsId
            }
            if (index === (this.leftRes.length - 1) && i === (resData.data.length - 1)) {
              this.$emit('add', this.leftRes)
              setTimeout(() => {
                this.handleAddGoodsAfter()
              }, 300)
            }
          })
        })
        // this.leftRes.forEach((row, index) => {
        //   resData.data.forEach((list, i) => {
        //     if (row.goodsId === list.goodsId) {
        //       row.goodsId = list.goodsId
        //       row.goodsId = list.goodsId
        //       row.goodsPrice = list.goodsPrice
        //       row.buyingPrice = list.buyingPrice
        //     }
        //     if (index === (this.leftRes.length - 1) && i === (resData.data.length - 1)) {
        //       this.$emit('add', this.leftRes)
        //       setTimeout(() => {
        //         this.handleAddGoodsAfter()
        //       }, 300)
        //     }
        //   })
        // })
      }).finally(() => {
        setTimeout(() => {
          this.addLoading = false
        }, 200)
      })
    },

    /**
     * 合并左边数据
     * @return {[type]} [description]
     */
    handleLeftMergeData () {},

    /**
     * 接口请求完成将数据移动到右边
     */
    handleAddGoodsAfter () {
      this.leftRes.forEach((row) => {
        row.sort = 0
        this.rightData.length ? this.rightData.unshift(row) : this.rightData.push(row)
        this.leftData.forEach((list, index) => {
          // 栏目 || 套餐 关联商品
          if (this.relationType === 1 || this.relationType === 2) {
            if (row.id === list.id) this.leftData.splice(index, 1)
          } else {
            // 社群运营关联商品
            if (row.goodsId === list.goodsId) this.leftData.splice(index, 1)
          }
        })
      })
      this.$emit('change', this.rightData)
      if (this.leftData.length <= 7) {
        this.getRelationAllGoodsList()
      }
    },

    /**
     * 通过接口移除数据
     */
    handleRemoveGoods () {
      let ids = this.rightRes.map(row => row.id)
      let url = (this.relationType === 3 || this.relationType === 5 || this.relationType === 8) ? '/shareTheme/deleteShareThemeGoodsisJoinStatus' : '/column/delColGoods'
      this.$http.get('@ROOT_API' + url, {
        params: {
          ids: ids.join(',')
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
        this.handleRemoveGoodsList()
      })
    },

    /**
     * 移除数据到左边
     */
    handleRemoveGoodsList () {
      this.$emit('remove', this.rightRes)
      this.rightRes.forEach((row) => {
        this.rightData.forEach((list, index) => {
          // 栏目 || 套餐 关联商品
          if (this.relationType === 1 || this.relationType === 2) {
            if (row.id === list.id) this.rightData.splice(index, 1)
          } else {
            // 社群运营关联商品
            if (row.goodsId === list.goodsId) this.rightData.splice(index, 1)
          }
        })
        if (this.relationType === 1 || this.relationType === 2) {
          row.goodsColumnId = ''
          row.id = row.goodsId
          row.goodsId = ''
        }
        this.leftData.push(row)
      })
      this.$emit('change', this.rightData)
      setTimeout(() => {
        if (this.rightData.length <= 7) this.getRelationGoodsList()
      }, 100)
    },

    /**
     * 向上移动
     */
    handleSortUp (index) {
      let temp = this.rightData[index]
      let sort = temp.sort
      let res = [
        {
          goodsColumnId: this.rightData[index - 1].goodsColumnId,
          goodsId: this.rightData[index - 1].goodsId,
          sort: temp.sort
        },
        {
          goodsColumnId: temp.goodsColumnId,
          goodsId: temp.goodsId,
          sort: this.rightData[index - 1].sort
        }
      ]
      this.sortChange(res).then(() => {
        temp.sort = this.rightData[index - 1].sort
        this.rightData[index - 1].sort = sort
        this.$set(this.rightData, index, this.rightData[index - 1])
        this.$set(this.rightData, index - 1, temp)
      })
    },

    /**
     * 向下移动
     */
    handleSortDown (index) {
      let temp = this.rightData[index]
      let sort = temp.sort
      let res = [
        {
          goodsColumnId: this.rightData[index + 1].goodsColumnId,
          goodsId: this.rightData[index + 1].goodsId,
          sort: temp.sort
        },
        {
          goodsColumnId: temp.goodsColumnId,
          goodsId: temp.goodsId,
          sort: this.rightData[index + 1].sort
        }
      ]
      this.sortChange(res).then(() => {
        temp.sort = this.rightData[index + 1].sort
        this.rightData[index + 1].sort = sort
        this.$set(this.rightData, index, this.rightData[index + 1])
        this.$set(this.rightData, index + 1, temp)
      })
    },

    /**
     * 设置排序前过滤数据
     */
    sortChangeBefore (row) {
      console.log('row: ', row)
      row.sort = row.sort || 0
      let res = [{
        goodsColumnId: row.id,
        goodsId: row.goodsId,
        sort: row.sort || 0
      }]
      this.sortChange(res)
    },

    /**
     * 排序操作
     */
    sortChange (res) {
      return new Promise((resolve, reject) => {
        this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
          goodsColumnList: res
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'success'
          })
          resolve()
        }).catch((err) => {
          reject(err)
        })
      })
    },

    /**
     * 设置商品数量
     */
    numberChange (row) {
      console.log('row: ', row)
      this.$http.get('@ROOT_API/column/updateSetMealGoodsNum', {
        params: {
          goodsColumnId: row.id,
          goodsNum: row.goodsNum
        }
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            duration: 1500,
            type: 'error'
          })
          return false
        }
        this.$message({
          message: resData.msg,
          duration: 1500,
          type: 'success'
        })
      })
      // let matchVal = row.goodsNum.toString().match(/[1-9]{1,}\d*/g)
      // this.rightData.forEach((list) => {
      //   if (row.goodsId === list.goodsId) {
      //     list.goodsNum = !matchVal ? 1 : matchVal[0]
      //   }
      // })
      // this.rightData.forEach((list, index) => {
      //   if (row.goodsId === list.goodsId) {
      //     list.goodsNum = !matchVal ? 1 : matchVal[0]
      //     if (row.goodsNum < 0) {
      //       list.goodsNum = parseInt(row.goodsNum)
      //     } else {
      //       list.goodsNum = row.goodsNum
      //     }
      //     if (row.isDefault) list.action = 'edit'
      //   }
      // })
      this.$emit('change', this.rightData)
    }
  }
}
</script>

<style lang="less">
.public-relation-goods-wrap{
  min-height: 400px;

  .half-wrap{
    width: 50%;
  }

  .current-supplier-select{
    min-width: 90px;
  }

  /* -------------------- { table列表 } -------------------- */
  .table-wrap{
    width: 50%;
    box-sizing: border-box;

    .table-t{
      height: 40px;
      padding-left: 85px;
      margin-bottom: 15px;

      .el-input-group__append{
        button{
          padding: 0 10px;
        }
      }
    }

    .el-table{
      text-align: left;
    }

    .sort-wrap{
      .el-icon{
        color: #ccc;
      }

      .el-icon.cursor-p{
        color: #666;
      }

      .el-icon.cursor-p:hover{
        color: #2eaaf7;
      }
    }

    .red-color{
      color: red;
    }
  }

  .table-wrap:nth-child(1){
    padding-right: 70px;
  }

  .table-wrap:nth-child(2){
    padding-left: 70px;
  }

  /* -------------------- { 添加&删除按钮 } -------------------- */
  .btns{
    width: 84px;
    height: 120px;
    margin-left: -42px;
    margin-top: -60px;
    left: 50%;
    top: 50%;

    button{
      margin: 10px 0;
    }
  }
}
</style>
