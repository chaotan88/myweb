<!-- 拼团 - 新增/编辑 -->
<template>
  <common-tpl class="luckybuy-index-wrap">
    <template slot="main" >
      <el-form :model="formData" ref="formData" label-width="120px" v-loading="loading">

        <!-- 分区管理/宣传内容 -->
        <div class="commodity-details pos-r" >
          <el-form-item label=" 分区管理：" prop="themeName" required>
            <div class="partition-list-wrap">
              <div class="partition-list-box">
                <div class="item-list" :style="{width: groupList.length * 120 + 'px', 'margin-left': -columnPage * 120 * 5 + 'px'}">
                  <div class="item" v-for="(item, index) in groupList" >
                    <div class="partition-name ta-c" @click="changePartition(item)"  :class="{'border-left': index % 5 === 0, select: formData.goodsGroupId === item.groupId}" >{{item.groupName}}</div>
                    <div class="btns-wrap ta-c" @click.stop.prevent=""  :class="{select: formData.goodsGroupId === item.groupId && item.groupId !== 1}">
                      <span class="cursor-p va-m btn" style="min-width: 50px" title="编辑" @click="handlePartitionBefore(item)">
                      <i class="el-icon-edit"></i>
                    </span>
                      <span class="cursor-p va-m btn" title="删除" @click.stop.prevent="handleDeletePartitionBefore(item)">
                      <i class="el-icon-delete"></i>
                    </span>
                    </div>
                  </div>
                </div>
              </div>
              <span class="el-icon-caret-left label-tip label-tip-left pos-a" :disabled="columnPage === 0" :class="{disabled: columnPage === 0}" @click="columnPageChange('minus')"></span>
              <span class="el-icon-caret-right label-tip label-tip-right pos-a" :disabled="columnPage >= groupList.length / 5 - 1" :class="{disabled: columnPage >= groupList.length / 5 - 1}" @click="columnPageChange('plus')"></span>
              <div class="add pos-a ta-c" @click="addVisible = true; addForm.groupStatus = 2 ;pageType = 1">
                <i class="el-icon-plus d-ib">&nbsp;&nbsp;新增分区</i>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="宣传内容："prop="disseminateType" class="data-error ml-0" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
            <el-radio-group v-model="formData.disseminateType">
              <el-radio :label="1">广告位</el-radio>
              <el-radio :label="2">宣传素材</el-radio>
            </el-radio-group>
            <el-form-item prop="imgs"  v-if="formData.disseminateType === 1" :rules="[{required: true, type: 'array', message: '不能为空', trigger: 'change'}]">
              <thumbnail-component :empty="false" :styles="img100" :link="true" del :auto-delete="true" :list="formData.imgs" style="width: 100%;height: 100%;margin-left: 120px;" @change="deleteImg($event, formData.imgs)">
                <template slot="other">
                  <upload-component :styles="img100" @success="uploadImgSuccess($event, formData.imgs)" v-if="formData.imgs.length === 0"></upload-component>
                  <div class="va-t d-ib" style="color: #f5a74a; line-height: 20px;padding:60px 0 0 20px">
                    <div>建议尺寸：750*1025px</div>
                    <div>建议大小：100KB以内</div>
                  </div>
                </template>
              </thumbnail-component>
            </el-form-item>
            <el-form-item prop="buySourceId" v-if="formData.disseminateType === 2" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
              <el-select v-model="formData.buySourceId" placeholder="请选择" style="margin-left: 120px;">
                <el-option v-for="item in materialListData" :label="item.sourceName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </div>
        <br>
      </el-form>
    </template>
    <template slot="other">
      <el-dialog title="删除分区" :visible.sync="deletePartitionVisible" width="540px" @close="">
        <p v-if="groupHasNum === 0">确认是否删除“{{deleteDialogData.groupName}}”？</p>
        <p v-else>该区存在商品不允许删除！请将商品移除后进行操作。</p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deletePartitionVisible = false">{{groupHasNum === 0 ? '取 消' : '返 回'}}</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDeletePartition" v-if="groupHasNum === 0">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="pageType === 1 ? '添加分区' : '编辑分区'" :visible.sync="addVisible" width="600px" class="dialog-data" @open="" @close="resetForm('addForm')">
        <el-form :model="addForm" label-width="120px" ref="addForm" labelPosition="right">
          <el-form-item label="分区名称：" prop="groupName" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-input v-model="addForm.groupName" placeholder="限6个字符" maxLength="6"></el-input>
          </el-form-item>
          <el-form-item label="分区状态：" class="" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-radio-group v-model="addForm.groupStatus">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="2">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序：" prop="groupSort" :rules="groupSort">
            <el-input v-model="addForm.groupSort" placeholder="限1-100正整数" maxLength="3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handlePartition('addForm')">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px" @close="getListData">
        <!-- 关联商品组件 -->
        <relation-goods :relationId="parseInt(formData.id)" :relationType="3" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
  import RelationGoods from '@/components/public/RelationGoods'
  import pagePaper from '@/mixins/ListPublicPage'
  export default {
    components: {RelationGoods},
    mixins: [pagePaper],
    data () {
      // 校验分区排序
      let validateGroupSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 1 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制1~100正整数'))
        callback()
      }
      return {
        groupList: [],              // 分区数据
        columnPage: 0,              // 分区页码
        groupHasNum: '',            // 分区倗有的商品数量
        deleteDialogData: {},       // 删除分区前保存数据
        addForm: {                  // 添加分区数据
          groupName: '',
          groupId: '',
          groupStatus: 2,
          groupSort: '',
          groupType: 8
        },
        loading: true,
        dialogTableVisible: false,
        confirmLoading: false,            // 确定loading
        pageType: 1,                      // 页面类型 [1、新增 2、编辑]
        formData: {
          disseminateType: null,          // 主题状态
          buySourceId: '',                // 素材
          id: '',                         // 主题id
          themeType: 8,                   // 主题类型
          goodsGroupId: 1,                // 分区ID  默认区： 1
          themeName: '',                  // 品牌名称
          purchaseDes: '',                // 收益说明
          themeImage: '',                 // ..
          themePresent: '-',              // ..
          themeBackdrop: '',              // ..
          sort: '',
          themeGoodsList: [],             // 商品列表
          imgs: []                        // 图片
        },
        img100: {width: '100px', height: '100px'},          // 图片大小
        disabled: {color: '#aaa', cursor: 'not-allowed'},
        form: {
          purchaseNumNow: '',
          purchaseNumTotal: '',
          grabNumNowSys: '',            // 系统
          grabNumNow: '',               // 用户
          updateNumber: '',
          date: []
        },
        groupSort: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {validator: validateGroupSort, trigger: 'blur'}
        ],
        copyFormData: {},                 // 拷贝表单数据
        relationVisible: false,           // 关联商品弹窗
        relationListData: [],             // 关联数据
        materialListData: [],             // 素材列表
        dialogLoading: false,             // 删除分区弹窗loading
        deletePartitionVisible: false,    // 删除分区弹窗
        addVisible: false,                // 添加分区弹窗
        isEdited: false,                  // 是否编辑
        dialogType: 1,                    // [1 2 3,4,5]
        userInfo: {}                      // 用户信息
      }
    },

    mounted () {
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 判断是否同一模块，带出搜索记录
      this.$Utils.filterSearchData(['/admin/warehouse/setting/index', '/admin/warehouse/setting/edit', '/admin/warehouse/setting/details'], (res) => {
        this.formData = res
      })
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getId()
      this.getMaterialListData()
      this.getListData()
    },

    methods: {

      /**
       * 获取素材列表
       */
      getMaterialListData () {
        this.$http.post('@ROOT_API/source/getSourceList', {
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
          this.materialListData = resData.data
        })
      },
      statisticsDateChange (val) {
       // console.log(val)
        this.form.startDate = val[0].getTime()
        this.form.endDate = val[1].getTime()
      },

      /**
       * 获取列表
       */
      getId () {
        this.$http.post('@ROOT_API/shareTheme/getList', {}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            return false
          }
        })
      },

      /**
       * 获取详情数据
       */
      getListData () {
        this.loading = true
        this.$http.get('@ROOT_API/shareTheme/getDetail', {
          params: {
            themeId: this.formData.id,
            themeType: this.formData.themeType,
            goodsGroupId: this.formData.goodsGroupId,
            start: this.pageData.currentPage,
            pageSize: this.pageData.pageSize
          }
        }).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              duration: 1500,
              type: 'error'
            })
            this.pageData.total = 0
            return false
          }

          this.formData.themeGoodsList = []
          let results = resData.data
          localStorage.setItem(this.$global.SYSTEM + 'ShareThemeId', results.id)
          this.formData.purchaseDes = results.purchaseDes === null ? '' : results.purchaseDes
          this.formData.themeName = results.themeName
          this.formData.id = results.id
          this.formData.disseminateType = results.disseminateType
          this.formData.buySourceId = results.buySourceId
          this.formData.themeImage = results.themeImage
          if (results.themeImage) {
            this.formData.imgs = [{url: this.$Utils.filterImgUrl(results.themeImage), imageUrl: results.themeImage}]
          } else {
            this.formData.imgs = []
          }
          this.addRelationData(results.goodsListPage.list, true)
          this.groupList = results.groupListPage.list
          this.pageData.total = results.goodsListPage.total
          setTimeout(() => {
            this.isEdited = false
          }, 500)
        }).finally(() => {
          this.loading = false
        })
      },
      /**
       * 过滤利润率
       */
      filterProfitMargin (item) {
        let goodsPrice = item.goodsPrice && !isNaN(item.goodsPrice) ? parseFloat(item.goodsPrice) : 0
        if (goodsPrice === 0) return ''
        let buyingPrice = !isNaN(item.buyingPrice) ? parseFloat(item.buyingPrice) : ''
        let res = ((goodsPrice - buyingPrice) / goodsPrice * 100).toFixed(2)
        return res
      },

      /**
       * 接收关联数据
       */
      relationDataChange (results) {
        this.relationListData = results
      },

      /**
       * 添加关联数据
       */
      addRelationData (results, type) {
        results.forEach((row) => {
         // console.log(row.ifEnable)
          if (type || !this.formData.themeGoodsList.length) {
            this.formData.themeGoodsList.push(row)
          } else {
           // row.ifEnable = (parseInt(row.ifEnable) === 1) ? !!true : !!false
          //  row.ifEnable = (parseInt(row.ifEnable) === true) ? !!true : !!false
            this.formData.themeGoodsList.unshift(row)
          }
        })
      },

      uploadImgSuccess (url, imgList) {
        imgList.push({url: this.$Utils.filterImgUrl(url), imageUrl: url})
        this.formData.themeImage = url
      },
      /**
       * 商品图片删除（除主图外，其他全部图片删除加调）
       */
      deleteImg (event, imgList) {
        imgList = event
      },
      /**
       * 移除关联数据
       */
      removeRelationData (results) {
        results.forEach((row) => {
          this.formData.themeGoodsList.forEach((list, index) => {
            if (row.id === list.goodsId || row.id === list.id) this.formData.themeGoodsList.splice(index, 1)
          })
        })
      },

      /**
       * 删除分区前操作
       */
      handleDeletePartitionBefore (row) {
        this.deleteDialogData = row
        this.$http.get('@ROOT_API/shareTheme/getGroupGoodsNum', {
          params: {
            groupId: row.groupId
          }
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
          this.groupHasNum = resData.data
          this.deletePartitionVisible = true
        }).finally(() => {
          // this.addVisible = false
        })
      },
      /**
       * 删除分区操作
       */
      handleDeletePartition (row) {
        this.$http.post('@ROOT_API/shareThemeGoodsGroup/deleteGoodsGroup', {
          groupId: this.deleteDialogData.groupId
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
          this.deletePartitionVisible = false
          this.getListData()
        }).finally(() => {
          // this.addVisible = false
        })
      },

      /**
       * 编辑分区前操作
       */
      handlePartitionBefore (row) {
        this.pageType = 2
        this.addVisible = true
        this.addForm = row
        this.$http.get('@ROOT_API/shareThemeGoodsGroup/getDetail', {params: {
          groupId: this.addForm.groupId
        }}).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.addVisible = true
          this.addForm = resData.data
        }).finally(() => {
          // this.addVisible = false
        })
      },
      /**
       * 保存分区操作
       */
      handlePartition (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.dialogLoading = true
          let url = this.pageType === 1 ? '@ROOT_API/shareThemeGoodsGroup/add' : '@ROOT_API/shareThemeGoodsGroup/edit'
          this.$http.post(url, {
            groupId: this.addForm.groupId,
            groupName: this.addForm.groupName,
            groupStatus: this.addForm.groupStatus,
            groupType: this.addForm.groupType,
            groupSort: this.addForm.groupSort
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
            this.addVisible = false
            this.getListData()
          }).finally(() => {
            this.dialogLoading = false
          })
        })
      },

      /**
       * 编辑器内容改变
       */
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /**
       * 分区分页
       */
      columnPageChange (type) {
        if (type === 'plus') {
          if (this.columnPage >= this.groupList.length / 5 - 1) return false
          this.columnPage++
        } else {
          if (this.columnPage === 0) return false
          this.columnPage--
        }
      },
      /**
       * 选择分区
       */
      changePartition (item) {
        this.formData.goodsGroupId = item.groupId
      }
    }
  }
</script>

<style lang='less' scoped>
  .luckybuy-index-wrap{

    .commodity-details, .relation-public-wrap{
      border-top: 0;
      padding-top: 20px;
    }
    .commodity-details{
      overflow: hidden;

      .el-form-item{

        .tips{
          color: #f5a74a;
          width: 200px;
          height: 60px;
          line-height: 30px;
          margin-top: -30px;
          left: 280px;
          top: 50%;
        }
      }
      .introduce{

        .word-count{
          color: #999;
          left: 570px;
          bottom: -8px;
        }
      }

      .el-form-item{
        .el-select, .el-input, .region-select-wrap, .el-textarea{
          width: 400px;
        }
      }
      .data{
        overflow: hidden;
      }

      /*----------itme图片---------*/
      .picture{
        .el-form-item__content{
          height: 150px;
          border: 1px solid #c8d0da;
        }

        span{
          color: #f5a74a;
          margin-left: 80px;
        }
      }
    }
    /*----------------------------------------------------------------------------------------------------------------*/
    .border-left{
      border-left: 1px solid #d9d9d9;
    }
    .partition-list-wrap{
      position: relative;
      max-width: 760px;
      padding: 0 40px;
      /*margin-bottom: 20px;*/
     /* border: 1px solid #eee;*/
      .partition-list-box{
        max-width: 600px;
        overflow: hidden;
        .item-list{
          display: flex;
          box-sizing: border-box;
          .item:hover .btns-wrap {
            display: block;
            /*visibility: visible;*/
          }
          .item:first-child{
            .btns-wrap{
              display: none;
            }
          }
          .item:hover{
            background: #98D7FF;
          }
          .partition-name{
            width: 120px;
            cursor: pointer;
            border-bottom: 1px solid #d9d9d9;
            border-right: 1px solid #d9d9d9;
            border-top: 1px solid #d9d9d9;
            box-sizing: border-box;
            &.select{
              border: 1px solid #98D7FF;
              border-bottom: 1px solid #d9d9d9;
              /*overflow: hidden;*/
              vertical-align: top;
              background: #98D7FF;
              /*box-shadow: 0 0 15px rgba(0, 160, 233, .3);*/
            }
            &:hover{
              border: 1px solid #98D7FF;
              border-bottom: 1px solid #d9d9d9;
              /*overflow: hidden;*/
              vertical-align: top;
              background: #98D7FF;
              /*box-shadow: 0 0 15px rgba(0, 160, 233, .3);*/
            }
          }
          .btns-wrap{
            border-bottom: 1px solid #d9d9d9!important;
            border-right: 1px solid #d9d9d9!important;
            width: 100%;
            line-height: 30px;
            left: 0;
            bottom: 0;
            background: #98D7FF;
            display: none;
            /*visibility: hidden;*/
            .btn{
            /*  color: #fff;*/
              width: 24px;
              height: 24px;
              line-height: 24px;
              font-size: 18px;
              margin: 0 5px;
            }

            .btn.disabled{
              color: #aaa;
              cursor: not-allowed;
            }
          }
        }
      }

      .add{
        width: 120px;
        border: 1px solid #d9d9d9;
        right: 50px;
        top: 0px;
        cursor: pointer;
      }
      .label-tip{
        color: #56ade8;
        width: 50px;
        font-size: 42px;
        margin-top: -35px;
        top: 35px;
        cursor: pointer;
      }

      .label-tip.disabled{
        color: #c1e0ff;
        cursor: not-allowed;
      }

      .label-tip-left{
        left: 0px;
      }

      .label-tip-right{
        right: 0px !important;
      }
    }
  }
</style>

<style lang="less">
  .luckybuy-index-wrap{

    .upload-wrap.max{
      .el-upload{
        display: none;
      }
    }

    .el-table{
      .cell{
        overflow: inherit;
      }
    }

    .el-form-item__label{
      margin-right: 10px;
    }

    .el-radio__input.is-checked .el-radio__inner{
      border-color: #409EFF;
      background: #409EFF;
    }

    .el-input-group__append{
      font-size: 14px;
      cursor: pointer;

      span:hover{
        color: #409EFF;
      }
    }
    .ml-0{
      .el-form-item__content{
        margin-left: 0 !important;
      }
    }

    .integral-wrap{

      .el-form-item__error{
        left: 295px !important;
      }
    }

    .data-error{
      .el-form-item__error{
        left: 120px !important;
      }
    }

    .el-table{
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
        .el-form-item{
          margin-bottom: 0;

          .el-form-item__error{
            left: 0;
          }
        }
      }
      .el-dropdown-link{

        span{
          line-height: 0px;
        }
      }
    }
    .dialog-data{
      .el-dialog {
        .el-dialog__body {
          text-align: left;
          .el-form{
            padding: 10px 30px;
            .el-form-item__content{
              display: flex;
              .el-radio-group{
                line-height: inherit;
              }
            }
            .el-form-item{
              /*margin-bottom: 10px;*/
            }
          }
        }
      }
    }
    .el-dialog{
      .el-form-item__error{
       /* left: 200px;*/
      }
    }
  }
</style>
