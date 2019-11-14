<!-- 参数类目 -->
<template>
  <common-tpl class="property-classify-wrap">
    <!-- 头部 -->
    <template slot="header" v-if="pageType === 1">
      <!-- 高级搜索组件 -->
      <high-search :textVisible="false">
        <template slot="edit">
          <el-button @click="addHandle()"><i class="el-icon-plus fw-b"></i> 新增类目</el-button>
        </template>
      </high-search>
    </template>

    <!-- 主体内容 -->
    <template slot="main">

      <el-form :model="formData" ref="form">
        <div class="pos-r common-table-wrap">
          <!-- 类目菜单 -->
          <div class="pos-a" style="width: 240px; height: 100%; max-height: 525px; left: 0; top: 0;">
            <goods-attribute :defaultId="formData.classifyId" :deleteId="deleteId" @change="goodsAttributeChange"></goods-attribute>
          </div>

          <!-- 列表 -->
          <el-table border :data="formData.tableData" width="100%" max-height="525">
            <el-table-column prop="attributeTypeName" label="类目名称"></el-table-column>
            <el-table-column prop="attributeTypeLevel" label="类目层级">
              <template slot-scope="scope">{{scope.row.attributeTypeLevel | filterGoodsTypeLevel}}</template>
            </el-table-column>
            <el-table-column prop="sort" label="上级类目">
              <template slot-scope="scope">
                {{!scope.row.parentId || parseInt(scope.row.parentId) === 0 ? '--' : scope.row.parentName}}
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">
                <div class="pos-r sort-wrap" style="width: 100px; padding-right: 25px;" v-if="pageType === 1">
                  <el-form-item :prop="'tableData.' + scope.$index + '.sort'" :rules="ruleInt" style="margin-bottom: 0;">
                    <el-input maxlength="10" v-model="scope.row.sort" @blur="rowBlur(scope.row)"></el-input>
                  </el-form-item>
                  <span style="width: 14px; height: 36px; position: absolute; right: 5px; top: 0;">
                    <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)"></i>
                    <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.tableData.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.tableData.length - 1"></i>
                  </span>
                </div>
                <template v-else>{{scope.row.sort}}</template>
              </template>
            </el-table-column>
            <el-table-column label="是否显示">
              <template slot-scope="scope">{{scope.row.whetherDisplay === 0 ? '是' : '否'}}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="70" v-if="pageType === 1 || currentClassify.attributeTypeLevel === 3">
              <template slot-scope="scope">
                <el-dropdown class="d-b">
                  <div class="ta-c d-b el-dropdown-link">
                    <span class="d-b va-m">...</span>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="pageType !== 1 && scope.row.attributeTypeLevel === 3">
                      <div @click="relationBeforeHandle(scope.row)" size="small"><i class="icon el-icon-sort"></i>关联产品参数</div>
                    </el-dropdown-item>
                    <template v-if="pageType === 1">
                      <el-dropdown-item>
                        <div @click="pushLinkHandle('edit', scope.row)" size="small"><i class="icon el-icon-edit"></i>编辑</div>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <div @click="deleteBeforeHandle(scope.row)" size="small"><i class="icon el-icon-delete"></i>删除</div>
                      </el-dropdown-item>
                    </template>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <el-table-column slot="empty">
              <no-data></no-data>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination
            background
            layout="prev, pager, next"
            :current-page="pageData.currentPage"
            :page-size="pageData.pageSize"
            :total="pageData.total"
            @current-change="pageChange"
            v-if="pageData.total">
          </el-pagination> -->
        </div>
      </el-form>
    </template>

    <!-- 其它 -->
    <template slot="other">
      <!-- 新增类目未选择弹窗提示 -->
      <el-dialog
        title="提示"
        :visible.sync="addVisible"
        width="480px">
        <span>{{ tipMessage }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除提示 -->
      <el-dialog
        title="删除类目"
        :visible.sync="deleteVisible"
        width="480px">
        确定是否删除类目？
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" :loading="deleteLoading" @click="deleteHandle">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联产品参数 -->
      <el-dialog :visible.sync="relationVisible" class="classify-associate-box">
        <!-- 添加产品参数 -->
        <div class="table-left fl-l">
          <div class="pos-r search-wrap">
            <span class="pos-a text">添加产品参数</span>
            <el-input size="small" class="fl-r" placeholder="请输入参数名称/参数值" v-model="leftSearchText">
              <template slot="append">
                <i class="cursor-p el-icon-search" @click="getLeftListData"></i>
              </template>
            </el-input>
          </div>
          <el-table ref="multipleTable" max-height="400" :data="listLeftData" @selection-change="selectLeftHandle" tooltip-effect="dark" class="ta-l full-w">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="attributeName" label="参数名称" width="100"></el-table-column>
            <!-- <el-table-column prop="attributeVals" label="参数值" width="100"></el-table-column> -->
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">{{scope.row.remark ? scope.row.remark : '--'}}</template>
            </el-table-column>

            <!-- 暂无数据 -->
            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
          </el-pagination> -->
        </div>

        <!-- 添加/移除商品按钮 -->
        <div class="relation-button fl-l pos-a">
          <el-button @click="moveToRightHandle" :disabled="!listLeftRes.length"><span class="fl-l d-b">添加<span class="el-icon-arrow-right"></span></span></el-button>
          <el-button @click="moveLeftHandle" :disabled="!listRightRes.length"><span class="el-icon-arrow-left fl-l d-b">移除</span></el-button>
        </div>

        <!-- 已添加商品 -->
        <div class="table-right fl-r">
          <div class="pos-r search-wrap">
            <span class="pos-a text">已加入产品参数</span>
            <el-input size="small" class="fl-r" placeholder="请输入参数名称/参数值" v-model="rightSearchText">
              <template slot="append">
                <i class="cursor-p el-icon-search" @click="getRightListData"></i>
              </template>
            </el-input>
          </div>
          <el-table ref="multipleTable" max-height="400" :data="listRightData" tooltip-effect="dark" class="full-w ta-l" @selection-change="selectRightHandle">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="attributeName" label="参数名称" width="100"></el-table-column>
            <!-- <el-table-column prop="attributeVals" label="参数值" width="100"></el-table-column> -->
            <el-table-column prop="remark" label="备注">
              <template slot-scope="scope">{{scope.row.remark ? scope.row.remark : '--'}}</template>
            </el-table-column>

            <!-- 暂无数据 -->
            <template slot="empty">
              <no-data></no-data>
            </template>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination background layout="prev, pager, next" :current-page="pageData.currentPage" :page-size="pageData.pageSize" :total="pageData.total" @current-change="pageChange" v-if="pageData.total">
          </el-pagination> -->
        </div>
        <div class="clear"></div>

        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="relationVisible = false">取 消</el-button>
          <el-button type="primary" @click="relationHandle">确 定</el-button>
        </span> -->
      </el-dialog>
    </template>
  </common-tpl>
</template>

<script>
import GoodsAttribute from '@/components/public/GoodsAttribute'
export default {
  components: { GoodsAttribute },

  data () {
    let validateInt = (rule, value, callback) => {
      if (!value) return callback(new Error('请输入排序值'))
      if (value < 0 || !value.toString().match(/^\d{1,10}$/gi)) return callback(new Error('请输入正整数'))
      callback()
    }
    return {
      deleteLoading: false,       // 删除loading
      pageType: 1,                // 页面类型 [1、商品类目，2、商品参数]
      treeData: [{
        id: 0,
        label: '我的商品类目',
        expanded: true,
        selected: false,
        parentId: 0,
        attributeTypeLevel: 0,
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formData: {
        classifyName: '',         // 搜索类目名称
        classifyId: 0,            // 当前分类id
        classifyLevel: '',        // 当前分类等级
        tableData: []             // 列表数据
      },
      ruleInt: [{required: true, validator: validateInt, trigger: 'blur'}],
      isReset: false,             // 是否重置数据
      isClassify: true,           // 是否可以进行类目
      currentClassify: '',        // 当前类目
      operateGoodsClassify: {},   // 本地存储类目信息
      addVisible: false,          // 新增弹窗提示
      tipMessage: '请先选择左侧类目架构树再新增商品类目！',        // 新增提示内容
      deleteData: '',             // 删除数据
      deleteId: 0,                // 删除id
      deleteVisible: false,       // 删除弹窗
      relationVisible: false,     // 关联窗口显示/隐藏

      ajaxLeftFlag: false,        // 左边加载标识
      listLeftData: [],           // 左边列表数据
      listLeftRes: [],            // 左边选中结果
      leftSearchText: '',         // 关联商品库搜索

      ajaxRightFlag: false,       // 右边加载标识
      listRightData: [],          // 右边列表数据
      listRightRes: [],           // 右边选中结果
      rightSearchText: '',        // 关联商品搜索

      relationData: {},           // 关联数据

      multipleSelection: [],
      pageData: {                 // 分页
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },

  mounted () {
    this.pageType = this.$route.path.toString().match(/goods\/classify/gi) ? 1 : 2
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData(['/admin/goods/classify/index', '/admin/goods/classify/add', '/admin/goods/classify/edit'], (res) => {
      this.formData = res
    })
  },

  methods: {
    /**
     * 修改分类排序
     */
    rowBlur (row) {
      if (!row.sort || isNaN(row.sort) || row.sort < 0) return false
      let list = [{
        id: row.id,
        sort: row.sort
      }]
      this.handleUpdateSort(list)
    },

    /**
     * 更改排序
     */
    handleUpdateSort (list) {
      if (!list) return false
      this.$http.post('@ROOT_API/attributeType/updateAttributeTypeSort', {
        attributeTypeSortList: list
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
    },

    /**
     * 分类选择
     */
    goodsAttributeChange (results, currentData) {
      this.$nextTick(() => {
        setTimeout(() => {
          this.deleteId = 0
          this.deleteData = {}
          this.formData.classifyLevel = currentData.attributeTypeLevel || 0
          Object.assign(this.formData, results)
          localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
          this.currentClassify = currentData
          this.formData.tableData = !currentData.children || currentData.children.length === 0 ? [currentData] : currentData.children
        })
      })
    },

    /**
     * 向上移动
     */
    handleSortUp (index) {
      if (index === 0) return false
      let temp = this.formData.tableData[index]
      let sort = temp.sort

      // 排序操作
      let arr = [
        {
          id: temp.id,
          sort: this.formData.tableData[index - 1].sort
        },
        {
          id: this.formData.tableData[index - 1].id,
          sort: temp.sort
        }
      ]
      if (temp.sort === this.formData.tableData[index - 1].sort) arr.pop()
      this.handleUpdateSort(arr)

      // 移动位置
      temp.sort = this.formData.tableData[index - 1].sort
      this.formData.tableData[index - 1].sort = sort
      this.$set(this.formData.tableData, index, this.formData.tableData[index - 1])
      this.$set(this.formData.tableData, index - 1, temp)
    },

    /**
     * 向下移动
     */
    handleSortDown (index) {
      if (index === this.formData.tableData.length - 1) return false
      let temp = this.formData.tableData[index]
      let sort = temp.sort

      // 排序操作
      let arr = [
        {
          id: this.formData.tableData[index + 1].id,
          sort: temp.sort
        },
        {
          id: temp.id,
          sort: this.formData.tableData[index + 1].sort
        }
      ]
      if (temp.sort === this.formData.tableData[index + 1].sort) arr.pop()
      this.handleUpdateSort(arr)

      // 移动位置
      temp.sort = this.formData.tableData[index + 1].sort
      this.formData.tableData[index + 1].sort = sort
      this.$set(this.formData.tableData, index, this.formData.tableData[index + 1])
      this.$set(this.formData.tableData, index + 1, temp)
    },

    /**
     * 列表数据显示过滤
     */
    filterTableData (obj) {
      if (obj) this.tableAllData = obj
      this.pageData.total = this.tableAllData.length
      this.formData.tableData = []
      this.tableAllData.forEach((row, index) => {
        if (index >= (this.operateGoodsClassify.page - 1) * this.pageData.pageSize && index < this.operateGoodsClassify.page * this.pageData.pageSize) {
          this.formData.tableData.push(row)
        }
      })
    },

    /**
     * 过滤列表数据
     */
    filterListData () {
      this.listRightData.forEach((row) => {
        this.listLeftData.forEach((list, index) => {
          if (row.attributeId === list.id) {
            this.listLeftData.splice(index, 1)
          }
        })
      })
    },

    /**
     * 关联产品参数
     */
    relationBeforeHandle (row) {
      this.relationData = row
      this.relationVisible = true
      this.getLeftListData()
      this.getRightListData()
      this.filterListData()

      this.listLeftData = []
      this.listLeftRes = []
      this.listRightData = []
      this.listRightRes = []
    },

    /**
     * 关联参数
     */
    relationHandle () {},

    /**
     * 获取左边数据
     */
    getLeftListData () {
      this.$http.post('@ROOT_API/attribute/getAttributeList', {
        attributeTypeId: this.relationData.id,
        attributeName: this.leftSearchText
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
        this.listLeftData = []
        resData.data.forEach((row) => {
          let arr = row.attributeValList.map(row => row.attributeVal)
          row.attributeVals = arr.join(',')
        })
        this.listLeftData = resData.data
        this.ajaxLeftFlag = true
      })
    },

    /**
     * 获取右边数据
     */
    getRightListData () {
      this.$http.post('@ROOT_API/attributeType/getAttrTypeRelationAtrribute', {
        attributeTypeId: this.relationData.id,
        attributeName: this.rightSearchText
      }).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          this.listRightData = []
          return false
        }
        this.listRightData = []
        this.listRightData = resData.data
        this.ajaxRightFlag = true
      })
    },

    /**
     * 商品类目点击
     */
    classifyNodeClick (node) {
      this.formData.tableData = !node.children || node.children.length === 0 ? [node] : node.children
      this.currentClassify = node
      this.formData.classifyId = node.id
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 分页操作
     */
    pageChange (page) {
      this.pageData.currentPage = page
      this.operateGoodsClassify.page = page
      localStorage.setItem(this.$global.SYSTEM + 'GoodsClassify', JSON.stringify(this.operateGoodsClassify))
      this.filterTableData()
    },

    /**
     * 跳转链接
     */
    pushLinkHandle (type, obj) {
      let path = type === 'add' ? '/admin/goods/classify/add' : '/admin/goods/classify/edit'
      let id = type === 'add' ? '' : obj.id
      this.$router.push({
        path,
        query: {
          id,
          attributeTypeLevel: type === 'add' ? parseInt(obj.attributeTypeLevel) + 1 : parseInt(obj.attributeTypeLevel),
          // attributeTypeLevel: obj.attributeTypeLevel ? parseInt(obj.attributeTypeLevel) + 1 : 0,
          parentId: parseInt(obj.attributeTypeLevel) === 0 ? 0 : type === 'add' ? obj.id : obj.parentId
        }
      })
    },

    /**
     * 添加类目
     */
    addHandle () {
      if (!this.currentClassify) {
        this.addVisible = true
        this.tipMessage = '请先选择左侧类目架构树再新增商品类目！'
      } else if (this.currentClassify.attributeTypeLevel === 3) {
        this.addVisible = true
        this.tipMessage = '商品小类不支持新增下级类目！'
      } else {
        this.pushLinkHandle('add', this.currentClassify)
      }
    },

    /**
     * 删除前操作
     */
    deleteBeforeHandle (row) {
      if (this.formData.tableData.length === 1) {
        this.$message({
          message: '至少保留一个类目',
          duration: 1500,
          type: 'error'
        })
        return false
      }
      this.deleteData = row
      this.deleteVisible = true
    },

    /**
     * 删除操作
     */
    deleteHandle (row) {
      this.deleteLoading = true
      this.$http.post('@ROOT_API/attributeType/deleteBuyAttributeType', {
        id: this.deleteData.id
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
          duration: 1000,
          type: 'success'
        })
        this.deleteId = this.deleteData.id
        this.deleteVisible = false
        // 是否选中上级
        if (this.deleteData.attributeTypeLevel === 3 || !this.deleteData.attributeTypeChildList || !this.deleteData.attributeTypeChildList.length) {
          this.formData.classifyId = this.deleteData.parentId
        }
        this.getRightListData()
        this.getLeftListData()
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
      }).finally(() => {
        this.deleteLoading = false
      })
    },

    /**
     * 左边选择
     */
    selectLeftHandle (val) {
      this.listLeftRes = val
    },

    /**
     * 移动到右边关联事件
     */
    moveToRightHandle () {
      let attributeTypeAttributeRequestList = []
      this.listLeftRes.forEach((row) => {
        attributeTypeAttributeRequestList.push({
          id: '',
          attributeId: row.id
        })
      })
      this.$http.post('@ROOT_API/attributeType/saveAttrTypeRelationAtrribute', {
        attributeTypeId: this.relationData.id,
        attributeTypeAttributeRequestList
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
        this.listLeftRes.forEach((row) => {
          row.attributeId = row.id
          this.listRightData.push(row)
        })
        this.listLeftRes.forEach((list) => {
          this.listLeftData.forEach((row, index) => {
            if (row.id === list.id) {
              this.listLeftData.splice(index, 1)
            }
          })
        })
        this.listLeftRes = []
      })
    },

    /**
     * 右边选择
     */
    selectRightHandle (val) {
      this.listRightRes = val
    },

    /**
     * 移动到右边选择关联事件
     */
    moveLeftHandle () {
      let attributeTypeAttributeRequestList = []
      this.listRightRes.forEach((row) => {
        attributeTypeAttributeRequestList.push({
          id: row.id,
          attributeId: row.attributeId
        })
      })
      this.$http.post('@ROOT_API/attributeType/deleteAttriTypeRelationAttribute', {
        attributeTypeAttributeRequestList
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
        this.listRightRes.forEach((row) => {
          this.listLeftData.push(row)
        })
        this.listRightRes.forEach((list) => {
          this.listRightData.forEach((row, index) => {
            if (row.id === list.id) {
              this.listRightData.splice(index, 1)
            }
          })
        })
        this.listRightRes = []
      })
    }
  }
}
</script>

<style lang="less">
.property-classify-wrap{

  .common-table-wrap{
    min-height: 525px;
    padding-left: 260px;
  }

  .table-left, .table-right{
    width: 400px;

    .el-table{
      border: 1px solid #ebeef5;
    }
  }

  .table-left::before, .table-right::before{
    .el-table{
      background: none !important;
    }
  }

  .classify-associate-box {

    .search-wrap {
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      font-weight: normal;
      text-align: left;
      margin-bottom: 15px;
      padding-left: 120px;

      .text{
        font-size: 16px;
        left: 0;
      }

      .el-input{
        width: 270px;
      }

      .el-input-group__append{
        padding-left: 0;
        padding-right: 0;
      }

      .el-icon-search{
        padding: 0 10px;
      }
    }

    .relation-button {
      width: 120px;
      margin-top: -40px;
      margin-left: -60px;
      top: 50%;
      left: 50%;

      .el-button {
        font-size: 16px;
        padding: 10px 20px;
        margin: 0;
        margin-bottom: 30px;
      }
    }
  }

  /* -------------------- { 排序 } -------------------- */
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

}
</style>

<style lang="less">
.property-classify-wrap{

  .classify-associate-box {
    .el-dialog {
      width: 1000px;
    }

    .el-dialog__body{
      padding: 30px;
    }

    .el-dialog__header {
      border-bottom: none;
    }
  }
}
</style>
