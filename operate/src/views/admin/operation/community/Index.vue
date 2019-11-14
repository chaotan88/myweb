<!-- 社群运营 - 兑换专区 -->
<template>
  <common-tpl class="community-Index-wrap" footer back>
    <template slot="main">
      <el-form :model="formData" :rules="rules" ref="formData" label-width="152px">
        <gray-title title="主题设置">
          <template slot="right">
            &nbsp;&nbsp;
            <el-select size="small" v-model="formData.themeType" @change="themeTypeChange" v-if="isOperate">
              <el-option label="芯豆专区" :value="2"></el-option>
              <el-option label="消费积分兑换区" :value="3"></el-option>
              <el-option label="联盟积分兑换区" :value="4"></el-option>
            </el-select>
          </template>
        </gray-title>

        <!-- 主题设置 -->
        <div class="commodity-details pos-r">
          <el-form-item :label="isOperate ? '专区主题：' : '分享主题：'" prop="themeName">
            <el-input v-model="formData.themeName" placeholder="限50个字符以内" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="宣传内容: ">
            <el-radio-group v-model="formData.disseminateType">
              <el-radio :label="1">广告位</el-radio>
              <el-radio :label="2">宣传素材</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="formData.disseminateType === 1">
            <el-form-item prop="themeImgList" class="full-w picture">
              <thumbnail-component :empty="false" :list="formData.themeImgList" del :auto-delete="true" :styles="{width: '100px', height: '100px'}">
                <template slot="other">
                  <upload-component :styles="{width: '100px', height: '100px'}" @success="uploadSuccessHandle" v-if="!formData.themeImgList.length"></upload-component>
                  <div class="pos-a tips">
                    <p>建议尺寸：100 * 100px</p>
                    <p>建议大小：100KB以内</p>
                  </div>
                </template>
              </thumbnail-component>
            </el-form-item>
          </template>

          <template v-else>
            <el-form-item>
              <el-select v-model="formData.materialName" placeholder="选择素材名称" style="margin-left: 162px;" @change="getMaterialId">
                <el-option v-for="item in materialListData" :label="item.sourceName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <el-form-item :label="isOperate ? '专区介绍：' : '分享介绍：'" prop="introduce" class="introduce pos-r">
            <el-input type="textarea" :rows="6" maxlength="500" v-model="formData.introduce"></el-input>
            <span class="d-ib pos-a word-count">({{formData.introduce ? formData.introduce.length : 0}}/500)</span>
          </el-form-item>
          <el-form-item label="主题背景：" class="mb-0 full-w picture">
            <thumbnail-component :empty="false" :list="formData.themeBgList" del :auto-delete="true" :styles="{width: '100px', height: '100px'}">
              <template slot="other">
                <upload-component :styles="{width: '100px', height: '100px'}" @success="uploadThemeHandle" v-if="!formData.themeBgList.length"></upload-component>
                <div class="pos-a tips">
                  <p>建议尺寸：750*1125px</p>
                  <p>只允许上传1张以内图片</p>
                </div>
              </template>
            </thumbnail-component>
          </el-form-item>

          <!-- 只在推广拉新模块展示 -->
          <template v-if="!isOperate">
            <div style="color: #606266; font-size: 14px; margin-bottom: 10px;">一级以上邀请人收益：</div>
            <el-form-item label='分佣比例：' class="nesting-wrap" prop="maidRatio">
              <el-input placeholder="0-100数字，可精确到百分位" maxlength="6" v-model.trim="formData.maidRatio" @blur="inpBlur('maidRatio')" :readonly="pageType === 2"></el-input>
              <span class="tips-text">&nbsp;&nbsp;%</span>
            </el-form-item>
           <!--  <el-form-item label='分佣级数：' class="nesting-wrap" prop="maidLevels">
              <el-input placeholder="0-10的正整数" maxlength="2" v-model.trim="formData.maidLevels" :readonly="pageType === 2"></el-input>
              <span class="tips-text">&nbsp;&nbsp;级</span>
            </el-form-item> -->
          </template>
        </div>

        <!-- 只在推广拉新模块展示 -->
        <template v-if="!isOperate">
          <!-- 参与要求 -->
          <gray-title title="参与要求"></gray-title>
          <br>
          <el-form-item label="允许参与用户：">
            <el-checkbox-group v-model="formData.requirement">
              <el-checkbox label="8">消费会员</el-checkbox>
              <el-checkbox label="7">超级会员</el-checkbox>
              <el-checkbox label="6">铂金会员</el-checkbox>
              <el-checkbox label="5">钻石会员</el-checkbox>
              <el-checkbox label="4">体验中心</el-checkbox>
              <el-checkbox label="3">管理中心</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <br>

        <!-- 商品设置 -->
        <gray-title :title="isOperate ? '设置专区商品' : '商品设置'">
          <el-button slot="right" size="small" type="primary" round style="margin-top: -15px; right: 7px; top: 50%;" class="pos-a" @click="relationVisible = true"><i class="el-icon-plus"></i> {{isOperate ? '添加福利商品' : '添加分享商品'}}</el-button>
        </gray-title>
        <br>
        <el-table border :data="formData.goodsList" class="full-w">
          <el-table-column prop="mainImage" label="商品图片" min-width="100">
            <template slot-scope="scope">
              <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" min-width="120">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.brandName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsNo" label="商品编码" min-width="100">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.goodsNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsName" label="商品名称" min-width="200">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.goodsName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="buyingPrice" label="进货价（元）">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="销售价（元）">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <template v-if="formData.themeType === 2">
            <el-table-column label="芯豆价" min-width="100px">
              <template slot-scope="scope">{{scope.row.goodsGoldBeanPrice | filterMoney | filterEmpty}}</template>
            </el-table-column>
          </template>
          <template v-if="formData.themeType === 3">
            <el-table-column label="消费积分价" min-width="100px">
              <template slot-scope="scope">{{scope.row.goodsBonusPrice | filterMoney | filterEmpty}}</template>
            </el-table-column>
          </template>
          <template v-if="formData.themeType === 4">
            <el-table-column label="联盟积分价" min-width="100px">
              <template slot-scope="scope">{{scope.row.goodsLeaguePrice | filterMoney | filterEmpty}}</template>
            </el-table-column>
          </template>
          <!-- <el-table-column prop="goodsPrice" label="特价（元）">
            <template slot-scope="scope">
              <div class="truncate">{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column> -->
          <el-table-column prop="" label="利润率">
            <template slot-scope="scope">{{filterProfitMargin(scope.row) | filterEmpty('%')}}</template>
          </el-table-column>
          <!-- <el-table-column prop="saleStatus" label="邀请人收益" min-width="250">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib" style="width: 120px">
                  <el-select placeholder="请选择状态" v-model="scope.row.inviteProfitType">
                    <el-option label="消费积分" :value="1"></el-option>
                    <el-option label="余额" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="d-ib" :prop="'goodsList.' + scope.$index + '.inviteProfitNum'" :rules="ruleSort" style="width: 80px">
                  <el-input placeholder="正整数" maxlength="9" v-model="scope.row.inviteProfitNum"></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="upSaleTime" label="被邀请人收益" min-width="250">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib" style="width: 120px">
                  <el-select placeholder="请选择状态" v-model="scope.row.beInviteProfitType">
                    <el-option label="消费积分" :value="1"></el-option>
                    <el-option label="余额" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="d-ib" :prop="'goodsList.' + scope.$index + '.beinviteProfitNum'" :rules="ruleSort" style="width: 80px">
                  <el-input placeholder="正整数" maxlength="9" v-model="scope.row.beinviteProfitNum"></el-input>
                </el-form-item>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column label="排序" min-width="60">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib" :prop="'goodsList.' + scope.$index + '.sort'" :rules="ruleSort">
                  <el-input size="medium" min="0" maxlength="3" v-model="scope.row.sort" @change="contentChange"></el-input>
                </el-form-item>
                <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.goodsList.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.goodsList.length - 1"></i>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="60">
            <template slot-scope="scope">
              <el-dropdown class="d-b">
                <div class="ta-c d-b el-dropdown-link">
                  <span class="d-b va-m">...</span>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row, 'setting')"><i class="icon el-icon-setting"></i>设置</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="handleDeleteBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>取消</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

          <div slot="empty">
            <no-data></no-data>
          </div>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="pageData.currentPage"
          :page-size="pageData.pageSize"
          :total="pageData.total"
          @current-change="pageChange"
          v-if="pageData.total">
        </el-pagination>
      </el-form>
    </template>

    <template slot="other">
      <el-dialog title="取消分享" :visible.sync="deleteVisible" width="480px">
        <br>
        <span>{{isOperate ? '取消商品专区设置？' : '取消商品设置分享？'}}</span>
        <br>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" :loading="deleteLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 关联商品 -->
      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <!-- 关联商品组件 -->
        <relation-goods :relationId="parseInt(formData.themeId)" :relationType="3" relationUrl="shareTheme/getShareThemeGoodsPage" @change="relationDataChange" @add="addRelationData" @remove="removeRelationData"></relation-goods>
      </el-dialog>
    </template>

    <template slot="footer">
      <el-button type="primary" :loading="confirmLoading" @click="submitForm('formData')">保存</el-button>
    </template>

  </common-tpl>
</template>

<script>
  import RelationGoods from '@/components/public/RelationGoods'
  import RegionSelect from '@/components/utils/RegionSelect'
  import pagePaper from '@/mixins/ListPublicPage'
  export default {
    components: {RegionSelect, RelationGoods},
    mixins: [pagePaper],
    data () {
      // 校验正整数
      let validateInt = (rule, value, callback) => {
        if (value && (isNaN(value) || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('请输入正数'))
        callback()
      }

      // 校验排序
      let validateSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 0 || value > 255)) return callback(new Error('限制0~255正整数'))
        callback()
      }

      // 校验分佣比例
      let validatMmaidRatio = (rule, value, callback) => {
        if (value) {
          if (isNaN(value) || value > 100) return callback(new Error('0-100数字，可精确到百分位'))
          callback()
        }
        callback()
      }

      // 校验分佣级数
      let validatMmaidLevels = (rule, value, callback) => {
        if (value) {
          if (isNaN(value) || value < 0 || value > 10 || !value.toString().match(/^\d{0,2}$/gi)) return callback(new Error('0-10的正整数'))
        }
        callback()
      }
      return {
        confirmLoading: false,  // 确定loading
        pageType: 1,            // 页面类型 [1、新增 2、编辑]
        moduleType: 1,          // 模块类型 [1、分享商品 2、芯豆专区 3、消费积分兑换区 4、联盟积分兑换区]
        isOperate: false,       // 判断是否是运营模块
        formData: {
          themeId: '',          // 主题id
          themeType: 1,         // 主题类型
          themeName: '',        // 品牌名称
          disseminateType: 1,   // 宣传内容 [0,广告位 1,宣传素材]
          materialName: '',     // 素材名称
          materialId: '',       // 素材id
          themeImgList: [],     // 上传广告位图片列表
          themeImg: '',         // 上传广告位图片地址
          themeBgList: [],      // 上传主题列表
          themeBg: '',          // 上传主题背景地址
          introduce: '',        // 分享介绍
          Inviter: 1,           // 邀请人受益
          invitee: 1,           // 被邀请人受益
          sort: '',
          goodsList: [],        // 商品列表
          maidRatio: '',        // 分佣比例
          maidLevels: '',       // 分佣级别
          requirement: []       // 参与要求
        },
        materialListData: [],   // 素材列表
        buySourceId: '',        // 宣传素材，disseminateType=2时必填
        rules: {
          // 栏目名称
          themeName: [{ required: true, message: '请输入分享主题', trigger: 'blur' }],
          // 广告位图片
          themeImgList: [{ required: true, type: 'array', message: '请上传广告位图片', trigger: 'change' }],
          // 分享介绍
          introduce: [{ required: true, message: '请输入分享介绍', trigger: 'blur' }],
          // 主题背景
          themeBgList: [{ required: true, type: 'array', message: '请上传主题背景', trigger: 'change' }],
          // 邀请人收益
          ticketNum: [{required: true, validator: validateInt, trigger: 'blur'}],
          maidRatio: [{validator: validatMmaidRatio, trigger: 'blur'}],
          maidLevels: [{validator: validatMmaidLevels, trigger: 'blur'}]
        },
        ruleSort: [{validator: validateSort, trigger: 'blur'}],
        copyFormData: {},       // 拷贝表单数据
        relationVisible: false, // 关联商品弹窗
        relationListData: [],   // 关联数据
        tableData: [],          // 列表
        deleteLoading: false,   // 弹窗loading
        deleteVisible: false,   // 取消分享弹窗
        deleteData: {},         // 取消分享数据
        isEdited: false,        // 是否编辑
        userInfo: {}            // 用户信息
      }
    },

    computed: {
      uploadUrl () {
        return this.$dm.ROOT_API + 'upload/uploadimg/shopadmin/source' + this.$global.PARAMS + this.userInfo.token
      }
    },

    mounted () {
      this.formData.themeType = parseInt(this.$route.query.type) || 1
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 互动运营模块
      if (this.$route.path.match(/operation\/interactive/gi)) {
        this.isOperate = true
        if (this.formData.themeType === 1) this.formData.themeType === 2
      }
      this.pageData.currentPage = parseInt(this.$route.query.page) || 1
      this.getMaterialListData()     // 素材列表
      this.getId()
    },

    methods: {
      /**
       * 初始化数据
       */
      init () {
        this.formData.themeImgList = []
        this.formData.themeBgList = []
        this.formData.goodsList = []
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
          let results = resData.data

          let findObj = results.filter((row) => row.themeType === this.formData.themeType)[0]
          if (findObj) {
            this.formData.themeId = findObj.id
            this.getListData()
          }
        })
      },

      /**
       * 获取详情数据
       */
      getListData () {
        this.$http.get('@ROOT_API/shareTheme/getDetail', {
          params: {
            themeId: this.formData.themeId,
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
            return false
          }

          this.init()

          let results = resData.data
          this.formData.themeName = results.themeName
          this.formData.disseminateType = results.disseminateType
          this.formData.materialName = results.buySourceId
          if (results.themeImage) {
            this.formData.themeImgList.push({url: this.$Utils.filterImgUrl(results.themeImage)})
            this.formData.themeImg = results.themeImage
          }
          this.formData.introduce = results.themePresent
          this.formData.maidRatio = results.distributeRate ? results.distributeRate * 100 : ''
          this.inpBlur('maidRatio')
          this.formData.maidLevels = results.distributeLevel
          if (results.themeBackdrop) {
            this.formData.themeBgList.push({url: this.$Utils.filterImgUrl(results.themeBackdrop)})
            this.formData.themeBg = results.themeBackdrop
          }
          this.formData.requirement = results.requireDisRuleIds && results.requireDisRuleIds.indexOf(',') !== -1 ? results.requireDisRuleIds.split(',') : [results.requireDisRuleIds]
          this.addRelationData(results.goodsListPage.list, true)
          this.pageData.total = results.goodsListPage.total
          setTimeout(() => {
            this.isEdited = false
          }, 500)
        })
      },

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

      /**
       * 素材列表改变获取id
       */
      getMaterialId (id) {
        this.buySourceId = id
      },

      /**
       * 主题切换
       */
      themeTypeChange (value) {
        this.formData.themeType = value
        this.$router.push({query: {type: value}})
        this.getId()
      },

      /**
       * 过滤利润率
       */
      filterProfitMargin (item) {
        let goodsPrice = item.goodsPrice && !isNaN(item.goodsPrice) ? parseFloat(item.goodsPrice) : 0
        let buyingPrice = !isNaN(item.buyingPrice) ? parseFloat(item.buyingPrice) : ''
        // let whetherGoldBeanPrice = item.whetherGoldBeanPrice && !isNaN(item.whetherGoldBeanPrice) ? 1 : 0 // 是否芯豆价格
        // let whetherBonusPrice = item.whetherBonusPrice && !isNaN(item.whetherBonusPrice) ? 1 : 0  // 是否消费积分价格
        // let whetherLeaguePrice = item.whetherLeaguePrice && !isNaN(item.whetherLeaguePrice) ? 1 : 0 // 是否联盟积分价格
        switch (this.formData.themeType) {
          case 1:
            if (item.whetherShare) goodsPrice = item.goodsSharePrice     // 分享价
            break
          case 2:
            if (item.whetherGoldBeanPrice) goodsPrice = item.goodsGoldBeanPrice     // 芯豆兑换价
            break
          case 3:
            if (item.whetherBonusPrice) goodsPrice = item.goodsBonusPrice     // 消费积分价
            break
          case 4:
            if (item.whetherLeaguePrice) goodsPrice = item.goodsLeaguePrice     // 联盟积分价
            break
        }
        if (goodsPrice === 0) return ''
        let res = ((goodsPrice - buyingPrice) / goodsPrice * 100).toFixed(2)   // (销售价 - 进货价 )/ 销售价
        return res
      },

      /**
       * 接收关联数据
       */
      relationDataChange (results) {
        this.relationListData = results
        this.pageChange(1)
      },

      /**
       * 添加关联数据
       */
      addRelationData (results, type) {
        results.forEach((row) => {
          row.inviteProfitType = row.inviteProfitType || 1
          row.inviteProfitNum = row.inviteProfitNum || 0
          row.beInviteProfitType = row.beInviteProfitType || 1
          row.beinviteProfitNum = row.beinviteProfitNum || 0
          row.sort = parseInt(row.sort) || 0

          if (type || !this.formData.goodsList.length) {
            this.formData.goodsList.push(row)
          } else {
            this.formData.goodsList.unshift(row)
          }
        })
      },

      /**
       * 移除关联数据
       */
      removeRelationData (results) {
        results.forEach((row) => {
          this.formData.goodsList.forEach((list, index) => {
            if (row.id === list.goodsId || row.id === list.id) this.formData.goodsList.splice(index, 1)
          })
        })
      },

      /**
       * 价格输入框自动补全价格
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.formData, obj)
      },

      /*
       * 广告位图片上传成功
       */
      uploadSuccessHandle (url) {
        this.formData.themeImgList.push({url: this.$Utils.filterImgUrl(url)})
        this.formData.themeImg = url
      },

      /*
       * 主题背景上传成功
       */
      uploadThemeHandle (url) {
        this.formData.themeBgList.push({url: this.$Utils.filterImgUrl(url)})
        this.formData.themeBg = url
      },

      /**
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.formData.goodsList.forEach((row) => {
            row.inviteProfitNum = row.inviteProfitNum || 0
            row.beinviteProfitNum = row.beinviteProfitNum || 0
            row.sort = parseInt(row.sort) || 0
          })
          let requireDisRuleIds = this.formData.requirement.filter(row => row !== '' && row !== null)
          this.confirmLoading = true
          this.$http.post('@ROOT_API/shareTheme/edit', {
            id: this.formData.themeId,                          // 是 int 主题主键
            themeName: this.formData.themeName,                 // 是 string 分享主题
            themeImage: this.formData.themeImg,                 // 是 string 广告位图片
            themePresent: this.formData.introduce,              // 是 string 分享介绍
            distributeRate: this.formData.maidRatio ? (this.formData.maidRatio / 100) : 0,    // double  分佣比例
            distributeLevel: this.formData.maidLevels || 0,     // int 分佣级数
            themeBackdrop: this.formData.themeBg,               // 是 string 主题背景
            requireDisRuleIds: requireDisRuleIds.length ? requireDisRuleIds.join(',') : '',   // 否 string  允许参与用户分享等级ID，逗号隔开
            themeType: this.isOperate ? this.formData.themeType : 1, // 是 int 活动类型 1：分享商品、2：芯豆专区、3：消费积分、4：联盟积分、5：拼团
            status: this.formData.status,                       // 否 int 活动状态（1：开启、2：关闭）
            buySourceId: this.formData.disseminateType === 2 ? this.formData.materialName : '', // 否 int 宣传素材，disseminateType=2时必填
            disseminateType: this.formData.disseminateType,     // 是 int 宣传内容（1：广告位 2：宣传素材）
            themeGoodsList: this.formData.goodsList             // 是 list  关联商品集合对象
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
            this.getListData()
            // this.$router.back()
          }).finally(() => {
            setTimeout(() => {
              this.confirmLoading = false
            }, 500)
          })
        })
      },

      /**
       * 向上移动
       */
      handleSortUp (index) {
        this.isEdited = true
        let temp = this.formData.goodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.goodsList[index - 1].sort
        this.formData.goodsList[index - 1].sort = sort
        this.$set(this.formData.goodsList, index, this.formData.goodsList[index - 1])
        this.$set(this.formData.goodsList, index - 1, temp)
      },

      /**
       * 向下移动
       */
      handleSortDown (index) {
        this.isEdited = true
        let temp = this.formData.goodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.goodsList[index + 1].sort
        this.formData.goodsList[index + 1].sort = sort
        this.$set(this.formData.goodsList, index, this.formData.goodsList[index + 1])
        this.$set(this.formData.goodsList, index + 1, temp)
      },

      /**
       * 内容改变
       */
      contentChange () {
        this.isEdited = true
      },

      /**
       * 跳转链接
       */
      handleLink (item, type) {
        if (this.isEdited) {
          this.$message({
            message: '内容已修改，请先保存',
            duration: 2000,
            type: 'error'
          })
          this.isEdited = false
          return false
        }
        if (type === 'setting') {
          let json = {
            ratio: this.formData.maidRatio,
            levels: this.formData.maidLevels
          }
          localStorage.setItem(this.$global.SYSTEM + 'OperationCommunitySetting', JSON.stringify(json))
          let url = this.isOperate ? '/admin/operation/interactive/exchange/setting' : '/admin/operation/extension/community/setting'
          this.$router.push({path: url, query: {id: item.id, goodsId: item.goodsId, type: this.formData.themeType}})
        } else {
          let url = this.isOperate ? '/admin/operation/interactive/exchange/details' : '/admin/operation/extension/community/details'
          this.$router.push({path: url, query: {id: item.goodsId}})
        }
      },

      /**
       * 取消分享前操作
       */
      handleDeleteBefore (row) {
        this.deleteVisible = true
        this.deleteData = row
      },

      /**
       * 取消分享
       */
      handleDelete () {
        this.deleteLoading = true
        this.$http.get('@ROOT_API/shareTheme/deleteShareThemeGoodsisJoinStatus', {
          params: {
            ids: this.deleteData.id
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
          this.$message({
            message: resData.msg,
            type: 'success',
            duration: 1000
          })
          this.formData.goodsList.forEach((row, index) => {
            if (this.deleteData.goodsId === row.goodsId) this.formData.goodsList.splice(index, 1)
          })
          this.deleteVisible = false
        }).finally(() => {
          setTimeout(() => {
            this.deleteLoading = false
          }, 500)
        })
      },
      /**
       * 分页操作
       */
      pageChange (page) {
        localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
        if (this.pageData.currentPage === page) {
          this.getListData()
        } else {
          this.pageData.currentPage = page
          this.getListData()
          this.$router.push({query: {page: this.pageData.currentPage, type: this.formData.themeType}})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .community-Index-wrap{

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
  }
</style>

<style lang="less">
  .community-Index-wrap{

    .upload-wrap.max{
      .el-upload{
        display: none;
      }
    }

    .el-table{
      .cell{
        overflow: inherit;
      }
      .thumbnail-component-wrap{
        margin-left: 20px;
      }
    }

    .el-form-item__error{
      left: 160px;
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

    .el-form-item__content{
      margin-left: 0 !important;
    }

    .integral-wrap{

      .el-form-item__error{
        left: 295px !important;
      }
    }

    .data-error{
      .el-form-item__error{
        left: 0 !important;
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

    .thumbnail-component-wrap{
      margin-left: 162px;
    }
  }
</style>
