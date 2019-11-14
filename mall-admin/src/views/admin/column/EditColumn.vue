<template>
  <div class="edit-column-wrap">
    <div class="content-wrap">
      <div class="column-form-wrap">
        <span class="form-wrap-title">添加栏目</span>
        <el-form :model="form" :rules="rules" ref="columnForm">
          <el-row>
            <span class="form-item-title">栏目名称：</span>
            <el-form-item class="input-group" prop="columnName">
              <el-input v-model="form.columnName"></el-input>
            </el-form-item>
          </el-row>
          <!-- <el-row>
            <span class="form-item-title">开始时间：</span>
            <el-form-item class="input-group">
              <el-date-picker
                v-model="form.createTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">结束时间：</span>
            <el-form-item class="input-group">
              <el-date-picker
                v-model="form.updateTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row> -->
          <el-row>
            <span class="form-item-title">栏目排序：</span>
            <el-form-item class="input-group" prop="sort">
              <el-input v-model="form.sort"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">商品默认排序：</span>
            <el-form-item class="input-group">
              <el-select v-model="form.goodsSort" clearable>
                <el-option
                  v-for="item in goodsSortOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <span class="form-item-title">首页显示商品数：</span>
            <el-form-item class="input-group" prop="showGoodsNum">
              <el-input v-model.number="form.showGoodsNum"></el-input>
            </el-form-item>
          </el-row>
          <el-row style="position: relative;">
            <span class="form-item-title" style="position: absolute;">栏目图标：</span>
            <el-form-item style="margin-left: 160px;">
              <el-upload
                class="avatar-uploader"
                :action="this.$api.MAIN_API + this.$api.UPLOAD_API"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadErr">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <p class="upload-advice">图片建议尺寸：100 * 100px ；建议大小：100KB以内</p>
          </el-row>
          <el-row>
            <span class="form-item-title">栏目是否推荐首页：</span>
            <el-form-item prop="columnRecommend">
              <el-radio v-model="form.isRecommendIndex" label="1">是</el-radio>
              <el-radio v-model="form.isRecommendIndex" label="2">否</el-radio>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      <div class="column-form-wrap">
        <span class="form-wrap-title">关联商品</span>
        <div class="table-group-wrap clear-float">
          <div class="table-group">
            <div class="table-search-wrap clear-float">
              <span class="table-title">未添加</span>
              <el-input v-model="goodsNameLeft" placeholder="商品编号/商品名称" clearable @clear="getColumnGoodsPageLeft">
                <el-button slot="append" icon="el-icon-search" @click="getColumnGoodsPageLeft"></el-button>
              </el-input>
            </div>
            <div class="table-wrap">
              <el-table :data="tableDataLeft" height="300" @select="selectLeftGoods" @select-all="selectLeftGoods">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
              </el-table>
              <el-pagination
                small
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="totalDataLeft"
                @current-change="leftCurrentPageChange">
              </el-pagination>
            </div>
          </div>
          <div class="transfer">
            <i class="el-icon-back" title="添加" @click="add"></i>
            <i class="el-icon-back" title="移除" @click="remove"></i>
          </div>
          <div class="table-group">
            <div class="table-search-wrap clear-float">
              <span class="table-title">已添加</span>
              <el-input v-model="goodsNameRight" placeholder="商品编号/商品名称" disabled>
                <el-button slot="append" icon="el-icon-search" disabled></el-button>
              </el-input>
            </div>
            <div class="table-wrap">
              <el-table :data="tableDataRight" height="300" @select="selectRightGoods" @select-all="selectRightGoods">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="goodsNo" label="商品编码"></el-table-column>
                <el-table-column prop="goodsName" label="商品名称"></el-table-column>
              </el-table>
              <el-pagination
                small
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="totalDataRight"
                @current-change="rightCurrentPageChange">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="button-group">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="confirm('columnForm')">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        columnId: '',
        form: {
          columnName: '',
          sort: '',
          goodsSort: '1',
          showGoodsNum: '',
          columnLogo: '',
          isRecommendIndex: '',
          list: []
        },
        goodsSortOptions: [{
          value: '1',
          label: '按上架时间降序排列'
        }, {
          value: '2',
          label: '按商品价格降序排列'
        }, {
          value: '3',
          label: '按商品价格升序排列'
        }],
        tableDataLeft: [],  // 左边栏商品数据
        tableDataRight: [], // 右边栏商品数据
        tableDataRightCopy: [], // 右边栏商品数据
        goodsNameLeft: '',
        goodsNameRight: '',
        selectedRowLeft: [],  // 左边栏选中的数据
        selectedRowRight: [], // 右边栏选中的数据
        imageUrl: '',
        pageNoLeft: 1,
        totalDataLeft: 0,
        pageNoRight: 1,
        totalDataRight: 0,
        pageSize: 5,
        rules: {
          columnName: [
            { required: true, message: '栏目名称需要在8个字以内', trigger: 'blur' },
            { pattern: /^[\u4e00-\u9fa5\w]{1,8}$/g, message: '栏目名称需要在8个字以内', trigger: 'blur' }
          ],
          // startTime: [
          //   { type: 'date', required: true, message: '请选择开始时间', trigger: 'change' }
          // ],
          // endTime: [
          //   { type: 'date', required: true, message: '请选择结束时间', trigger: 'change' }
          // ],
          sort: [
            { required: true, message: '栏目排序是0-99的整数，0的排序最高', trigger: 'blur' },
            { pattern: /^([0]|[1-9][0-9]?)$/g, message: '栏目排序是0-99的整数，0的排序最高', trigger: 'blur' }
          ],
          showGoodsNum: [
            { type: 'number', required: true, message: '请输入首页显示商品数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getColumnById: function () {
        // 获取栏目详情
        this.$http.post('/admin/column/getColumnById', this.qs.stringify({
          columnId: this.columnId
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.form = res.data.obj  // res.data.obj => 栏目详情
            this.imageUrl = this.$api.IMG_API + res.data.obj.columnLogo // 图片
          } else {
            this.$message.error('获取栏目详情失败')
          }
        })
        this.getColumnGoodsPageLeft()
        this.getColumnGoodsPageRight()
      },
      getColumnGoodsPageLeft: function () {
        // 获取左边栏的商品
        this.$http.post('/admin/column/getColumnGoodsPageLeft', this.qs.stringify({
          goodsName: this.goodsNameLeft,
          columnId: this.columnId,
          pageNo: this.pageNoLeft,
          pageSize: this.pageSize
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableDataLeft = res.data.obj.dataList  // res.data.obj.dataList => 左边栏商品
            this.totalDataLeft = res.data.obj.total
          } else if (res.data.res === 0) {
            this.tableDataLeft = []
            this.totalDataLeft = 0
          }
        })
      },
      leftCurrentPageChange: function (currentPage) {
        // 左侧页码改变
        this.pageNoLeft = currentPage
        this.getColumnGoodsPageLeft()
      },
      getColumnGoodsPageRight: function () {
        // 获取右边栏的商品
        this.$http.post('/admin/column/getColumnGoodsPageRight', this.qs.stringify({
          goodsName: this.goodsNameLeft,
          columnId: this.columnId,
          pageNo: this.pageNoRight,
          pageSize: this.pageSize
        }))
        .then((res) => {
          if (res.data.res === 1) {
            this.tableDataRight = res.data.obj.dataList // res.data.obj.dataList => 右边栏商品
            this.tableDataRightCopy = res.data.obj.dataList.concat()
            this.totalDataRight = res.data.obj.total
          } else if (res.data.res === 0) {
            this.tableDataRight = []
            this.totalDataRight = 0
          }
        })
      },
      rightCurrentPageChange: function (currentPage) {
        // 右侧页码改变
        this.pageNoRight = currentPage
        this.getColumnGoodsPageRight()
      },
      // ---------------------- 关联商品 ----------------------- //
      selectLeftGoods: function (selection, row) {
        // 选择左边栏商品
        this.selectedRowLeft = selection
      },
      add: function () {
        // 添加
        if (this.selectedRowLeft.length !== 0) {
          this.selectedRowLeft.forEach((item) => {
            var index = this.tableDataLeft.indexOf(item)
            if (index !== -1) {
              this.tableDataLeft.splice(index, 1)
            }
          })
          this.selectedRowLeft.forEach((item) => {
            this.tableDataRight.push(item)
          })
          this.selectedRowLeft = [] // 清空左边栏选中的数据
        } else {
          this.$message.error('您还没有选择左侧的商品，添加商品关联失败')
        }
      },
      selectRightGoods: function (selection, row) {
        // 选择右边栏商品
        this.selectedRowRight = selection
      },
      remove: function () {
        // 移除
        if (this.selectedRowRight.length !== 0) {
          this.selectedRowRight.forEach((item) => {
            var index = this.tableDataRight.indexOf(item)
            if (index !== -1) {
              this.tableDataRight.splice(index, 1)
            }
          })
          this.selectedRowRight.forEach((item) => {
            this.tableDataLeft.push(item)
          })
          this.selectedRowRight = [] // 清空右边栏选中的数据
        } else {
          this.$message.error('您还没有选择右侧的商品，移除商品关联失败')
        }
      },
      // ---------------------- 关联商品 ----------------------- //
      cancel: function () {
        // 取消
        this.$router.go(-1)
      },
      handleTableList: function () {
        // 处理右边栏列表数据
        var list = []
        var isExist
        this.tableDataRightCopy.forEach(oldItem => {
          isExist = false
          this.tableDataRight.forEach(newItem => {
            if (oldItem.goodsId === newItem.goodsId) {
              isExist = true
            }
          })
          if (!isExist) {
            list.push({
              goodsName: '',
              columnGoodsId: oldItem.columnGoodsId
            })
          }
        })
        this.tableDataRight.forEach(item => {
          list.push(item)
        })
        return list
      },
      confirm: function (formName) {
        // 确定
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.form.columnId = this.columnId
            this.form.list = this.handleTableList()
            this.$http.post('/admin/column/addOrUpdateOrDeleteColumn', this.form)
            .then((res) => {
              if (res.data.res === 1) {
                this.$message.success('编辑成功')
                setTimeout(() => {
                  this.$router.go(-1)
                }, 1000)
              } else if (res.data.res === 701) {
                this.$message.error(res.data.result + '，请重新输入栏目排序。')
              }
            })
          } else {
            this.$message.error('表单项填写不合法')
          }
        })
      },
      uploadSuccess: function (res, file) {
        // 上传图片成功
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.columnLogo = file.response.obj
      },
      uploadErr: function () {
        // 上传图片失败
        this.$message.error('图片上传失败，请重新上传')
      }
    },
    mounted: function () {
      this.columnId = this.$route.params.columnId  // 获取栏目ID
      this.getColumnById()
    }
  }
</script>

<style lang="less" scoped>
  .edit-column-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .form-item-title {
        display: inline-block;
        width: 140px;
        text-align: right;
        font-size: 14px;
        color: rgb(102, 102, 102);
        margin-right: 16px;
      }
      .column-form-wrap {
        background-color: rgb(245, 245, 245);
        border-radius: 4px;
        padding-bottom: 30px;
        .form-wrap-title {
          display: inline-block;
          margin-top: 10px;
          margin-left: 10px;
          font-size: 16px;
        }
        .input-group {
          width: 300px;
          .el-select, .el-date-editor {
            width: 300px;
          }
        }
        .upload-advice {
          font-size: 14px;
          color: rgb(153, 153, 153);
          margin-left: 160px;
          padding: 10px 0;
        }
      }
      .column-form-wrap+.column-form-wrap {
        padding-bottom: 90px;
      }
      .column-form-wrap:first-child {
        margin-bottom: 10px;
      }
      .button-group {
        margin-top: 50px;
      }
      .table-group-wrap {
        width: 810px;
        height: 383px;
        margin-top: 20px;
        margin-left: 30px;
        .table-group {
          width: 42%;
          border: 1px dashed rgb(218, 218, 218);
          border-radius: 4px;
          background-color: rgb(245, 245, 245);
          float: left;
          .table-title {
            margin-left: 20px;
            font-size: 20px;
            position: relative;
            top: 8px;
          }
          .table-search-wrap {
            margin-top: 10px;
            margin-right: 30px;
            .el-input {
              width: 210px;
              float: right;
            }
          }
          .table-wrap {
            margin-top: 10px;
          }
        }
        .transfer {
          float: left;
          width: 15%;
          height: 100%;
          position: relative;
          .el-icon-back {
            font-size: 60px;
            color: rgb(153, 153, 153);
            position: absolute;
            left: 20px;
            cursor: pointer;
          }
          .el-icon-back:first-child {
            transform: rotate(180deg);
            top: 56px;
          }
          .el-icon-back:last-child {
            bottom: 56px;
          }
        }
      }
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
  .edit-column-wrap {
    .el-form {
      .el-row {
        padding-top: 20px;
      }
      .el-form-item {
        display: inline-block;
        margin-bottom: 0;
      }
    }
    .button-group {
      .el-button {
        width: 120px;
        padding: 0;
        height: 40px;
        background-color: rgb(242, 242, 242);
        border-color: rgb(204, 204, 204);
        color: rgb(51, 51, 51);
        border-radius: 0;
        margin-right: 12px;
      }
    }
    .el-table {
      .el-table__header-wrapper {
        th {
          background-color: rgb(232, 232, 232);
          font-size: 16px;
          color: rgb(67, 67, 67);
          height: 50px;
          padding: 0;
        }
      }
      .el-table__body-wrapper {
        td {
          height: 60px;
          padding: 0;
        }
      }
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background-color: #fff;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 148px;
      height: 148px;
      line-height: 148px;
      text-align: center;
    }
    .avatar {
      width: 148px;
      height: 148px;
      display: block;
    }
  }
</style>
