<template>
  <div class="goods-list-wrap">
    <div class="content-wrap">
      <!-- 搜索 -->
      <div class="search-module clear-float">
        <div class="function-button-wrap">
          <el-button class="function-button" @click="addGoods">新增商品</el-button>
          <el-button class="function-button" @click="goodsOperate(goodsIds, 1)">批量上架</el-button>
          <el-button class="function-button" @click="goodsOperate(goodsIds, 2)">批量下架</el-button>
        </div>
        <div class="search-wrap">
          <el-select v-model="search.saleState" placeholder="商品状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="search.goodsName" placeholder="商品编号/商品名称" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table-module">
        <el-table :data="goodsData" @select="selectSingleOrAllRows" @select-all="selectSingleOrAllRows">
          <el-table-column type="selection" width="90"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width="190"></el-table-column>
          <el-table-column prop="goodsPrice" label="价格(元)"></el-table-column>
          <el-table-column label="最新上架时间">
            <template slot-scope="scope">
              <span v-if="scope.row.upSaleTime">{{ scope.row.upSaleTime | dateFilter }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="上架状态">
            <template slot-scope="scope">
              <span v-if="scope.row.saleState === '1'">上架</span>
              <span v-if="scope.row.saleState === '2'">下架</span>
              <el-switch
                @change="changeSaleState(scope.row.goodsId, scope.row.saleState)"
                v-model="scope.row.saleState === '1' ? true : false">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="216">
            <template slot-scope="scope">
              <el-button type="text" @click="viewGoodsDetail(scope.row.goodsId)">详情</el-button>
              <el-button type="text" @click="editGoodsDetail(scope.row.goodsId)">编辑</el-button>
              <el-button type="text" @click="copyGoods(scope.row.goodsId)">复制</el-button>
              <el-button type="text" @click="deleteGood(scope.row.goodsId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pagination-module">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 删除弹窗 -->
    <el-dialog
      title="删除商品"
      :visible.sync="dialogVisible"
      width="30%">
      <span>确定是否删除商品？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data: function () {
      return {
        options: [{
          value: '1',
          label: '上架中'
        }, {
          value: '2',
          label: '下架中'
        }],
        search: { // 搜索
          saleState: '',
          goodsName: ''
        },
        goodsData: [],
        dialogVisible: false,
        goodsIds: [],  // 保存商品ID的数组
        currentPage: 1, // 当前页码
        pageNo: 1,       // 默认开始页码
        pageSize: 10,    // 默认每页数量
        total: 0       // 分页总数
      }
    },
    filters: {
      // 时间过滤器
      dateFrm: function (el) {
        return moment(el).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    methods: {
      getGoodsList: function () {
        // 获取商品列表
        this.$http.post('/admin/goods/getGoodsPage', this.qs.stringify({
          saleState: this.search.saleState,
          goodsName: this.search.goodsName,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        })).then((res) => {
          if (res.data.res === 1) {
            this.goodsData = res.data.obj.dataList  //  res.data.obj.dataList => 商品列表
            this.total = res.data.obj.total         //  res.data.obj.total => 分页总数
          } else {
            this.goodsData = []
          }
        })
      },
      addGoods: function () {
        // 添加商品
        this.$router.push('/admin/goods/management/add-goods')
      },
      editGoodsDetail: function (goodsId) {
        // 编辑商品
        this.$router.push(`/admin/goods/management/goods-edit/${goodsId}`)
      },
      viewGoodsDetail: function (goodsId) {
        // 查看商品详情
        this.$router.push(`/admin/goods/management/goods-detail/${goodsId}`)
      },
      copyGoods: function (goodsId) {
        // 复制
        this.$http.post('/admin/goods/copyGoods', this.qs.stringify({
          goodsId: goodsId
        }))
        .then(res => {
          if (res.data.res === 1) {
            this.$message.success('复制成功')
          } else if (res.data.res === 0) {
            this.$message.error('复制失败')
          }
          this.getGoodsList()
        })
      },
      deleteGood: function (goodsId) {
        // 删除商品
        this.dialogVisible = true // 显示删除弹窗
        localStorage.setItem(this.$global.SYSTEM + 'GoodsId', goodsId)  // 保存商品ID
      },
      cancel: function () {
        // 删除-取消
        this.dialogVisible = false
        localStorage.removeItem(this.$global.SYSTEM + 'GoodsId')
      },
      confirm: function () {
        // 删除-确定
        var goodsId = localStorage.getItem(this.$global.SYSTEM + 'GoodsId')
        this.$http.post('/admin/goods/updateSaleState', this.qs.stringify({
          goodsIds: goodsId,
          delState: '1'
        })).then((res) => {
          if (res.data.res === 1) {
            this.getGoodsList() // 重新获取商品列表
            localStorage.removeItem(this.$global.SYSTEM + 'GoodsId')
          }
        })
        this.dialogVisible = false
      },
      selectSingleOrAllRows: function (selection, row) {
        // 勾选商品的Checkbox和勾选全选Checkbox
        this.goodsIds = []
        selection.forEach(item => {
          this.goodsIds.push(item.goodsId)
        })
      },
      goodsOperate: function (goodsIds, saleState) {
        // 商品批量上架时 saleState=1
        // 商品批量下架时 saleState=2
        goodsIds = goodsIds.toString()
        if (goodsIds.length) {
          this.$http.post('/admin/goods/updateSaleState', this.qs.stringify({
            goodsIds: goodsIds,
            saleState: saleState
          })).then((res) => {
            if (res.data.res === 1) {
              this.getGoodsList() // 重新获取商品列表
            }
          })
        } else {
          this.$message.error('您还没有选择商品')
        }
      },
      changeSaleState: function (goodsIds, saleState) {
        // 改变上下架状态
        saleState = saleState === '1' ? '2' : '1'
        this.$http.post('/admin/goods/updateSaleState', this.qs.stringify({
          goodsIds: goodsIds,
          saleState: saleState
        })).then(res => {
          if (res.data.res === 1) {
            this.getGoodsList()
          }
        })
      },
      handleSizeChange: function (val) {
        // pageSize 改变
        this.pageNo = 1 // 初始化页码
        this.pageSize = val // 改变每页数量
        this.getGoodsList()
      },
      handleCurrentChange: function (val) {
        // currentPage 改变
        this.pageNo = val // 改变当前页码
        this.getGoodsList()
      }
    },
    mounted: function () {
      this.getGoodsList()
    }
  }
</script>

<style lang="less" scoped>
  .goods-list-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      /* 搜索 */
      .search-module {
        /* 功能按钮 */
        .function-button-wrap {
          float: left;
          .function-button {
            width: 100px;
            height: 36px;
            font-size: 14px;
            color: #33719b;
            border: 1px solid #33719b;
            background-color: #d0dee8;
          }
        }
        /* 搜索框 */
        .search-wrap {
          float: right;
        }
      }
      /* 表格 */
      .table-module {
        margin-top: 20px;
      }
    }
    /* 分页器 */
    .pagination-module {
      margin-top: 30px;
    }
    /* 清除浮动类 */
    .clear-float::after {
      content: '';
      display: block;
      clear: both;
    }
  }
</style>

<style lang="less">
  .goods-list-wrap {
    .content-wrap {
      /* 搜索 */
      .search-module {
        /* 功能按钮 */
        .function-button-wrap {
          .el-button {
            padding: 0;
          }
          .el-button + .el-button {
            margin-left: 4px;
          }
        }
        /* 搜索框 */
        .search-wrap {
          .el-select {
            .el-input {
              width: 118px;
            }
          }
          > .el-input {
            width: 240px;
          }
          input {
            height: 36px;
            background-color: #f8f8f8;
            border-color: #c8d0da;
          }
        }
      }
      /* 表格 */
      .table-module {
        .el-table {
          border: 1px solid #eef1f5;
          border-bottom: 0;
          .el-table__header-wrapper, .el-table__body-wrapper {
            table {
              th, td {
                padding: 0;
                height: 60px;
                text-align: center;
                font-size: 14px;
              }
            }
          }
          .el-table__header-wrapper {
            table {
              th {
                background-color: #f8f8f8;
                color: #333;
              }
            }
          }
          .el-table__body-wrapper {
            table {
              td {
                color: #666;
                button {
                  color: #666;
                }
              }
            }
          }
        }
      }
    }
    /* 分页器 */
    .pagination-module {
      .el-pagination {
        padding: 0;
        text-align: center;
      }
    }
  }
</style>
