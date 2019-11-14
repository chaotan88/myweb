<!-- 活动专区 -->
<template>
  <common-tpl class="goods-activity-wrap">
    <template slot="main">
      <el-form ref="main-form" :model="formData" :rules="rules" label-width="115px">
        <div class="pos-r main">
          <div class="fl-l slide-wrap">
            <gray-title title="活动管理">
              <i slot="right" class="fl-r cursor-p el-icon-plus btn-add" @click="addActivityBefore"></i>
            </gray-title>
             <!-- v-loading="activityLoading" -->
            <div class="list-wrap">
              <div class="cursor-p pos-r list" :class="{active: item.id === formData.activityId}" v-for="(item, index) in activityLists" @click.stop="handleListChange(item, true)">
                <span class="truncate d-ib name">{{item.columnName}}</span>
                <!-- <i class="el-icon-circle-check pos-a icon-eye" v-if="item.activityStatus === 0"></i>
                <i class="el-icon-circle-close pos-a icon-eye" v-else></i> -->
                <svg class="icon icon-md-eye-off d-ib va-t pos-a icon-eye" aria-hidden="true" v-if="item.activityStatus === 0">
                  <use xlink:href="#icon-md-eye-off"></use>
                </svg>
                <svg class="icon icon-md-eye d-ib va-t pos-a icon-eye" aria-hidden="true" v-else>
                  <use xlink:href="#icon-md-eye"></use>
                </svg>
                <div class="fl-r btns-wrap">
                  <span class="d-ib va-m btn move pos-r">
                    <i title="上移" class="pos-a el-icon-caret-top" :class="{disabled: index === 0}" :disabled="index === 0" style="height: 8px; line-height: 8px; margin-left: 0; left: 0; top: 0;" @click.stop.prevent="handleSortActivity(index, 'up')"></i>
                    <i title="下移" class="pos-a el-icon-caret-bottom" :class="{disabled: index === activityLists.length - 1}" :disabled="index === 4" style="height: 8px; line-height: 8px; margin-left: 0; left: 0; bottom: 0;" @click.stop.prevent="handleSortActivity(index, 'down')"></i>
                  </span>
                  <!-- <i title="新增" class="btn el-icon-plus"></i> -->
                  <i title="编辑" class="va-m btn el-icon-edit-outline" @click.stop.prevent="handleEditBefore(item)"></i>
                  <i title="删除" class="va-m btn el-icon-delete" @click.stop.prevent="handleDelActivityBefore(item)"></i>
                </div>
                <div class="full-w pos-a line" v-if="index !== 4"></div>
              </div>
              <no-data text="暂无活动" style="padding: 30px 0;" v-if="!activityLists.length"></no-data>
            </div>
          </div>

          <div style="padding-left: 320px;" class="main-wrap" v-loading="mainLoading" v-if="activityLists.length">
            <gray-title>
              <el-select size="small" v-model="formData.activityType" style="width: 100px;" class="input-auto-wrap" @change="activityTypeChangeBefore">
                <el-option :value="1" label="单区活动"></el-option>
                <el-option :value="2" label="多区活动"></el-option>
              </el-select>

              <div class="d-ib va-t activity-title">{{formData.activityName}} {{formData.description ? ('（' + formData.description + '）') : ''}}</div>

              <template slot="right">
                <el-form-item label="活动状态：" class="pos-a" style="top: 5px; right: 15px;">
                  <el-radio-group class="activity-status-radio" v-model="formData.activityStatus" @change="activityStatusChange">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </template>
            </gray-title>

            <div class="top-wrap">
              <div class="shadow-wrap">

                <gray-title class="title">首页展示配置</gray-title>
                <!-- <el-form-item label="活动类型：">
                  <el-radio-group v-model="formData.activityType" @change="activityTypeChangeBefore">
                    <el-radio :label="1">单区活动</el-radio>
                    <el-radio :label="2">多区活动</el-radio>
                  </el-radio-group>
                </el-form-item> -->

                <el-form-item label="列表展示：" style="height: 40px;">
                  <template v-if="formData.activityType === 1">
                    <div class="ta-c d-ib va-t cursor-p box-wrap theme1" :class="{active: formData.listNum === 1}" @click="listNumChange(1)">
                      <span class="box full-w"></span>
                      <div style="margin-top: -10px; margin-right: -1px;">
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                      </div>
                    </div>
                    &nbsp;

                    <div class="ta-c d-ib va-t cursor-p box-wrap theme2" :class="{active: formData.listNum === 2}" @click="listNumChange(2)">
                      <span class="box full-w"></span>
                      <div style="margin-right: -1px;">
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                      </div>
                    </div>
                    &nbsp;

                    <div class="ta-c d-ib va-t cursor-p box-wrap theme3" :class="{active: formData.listNum === 3}" @click="listNumChange(3)">
                      <span class="box full-w"></span>
                      <div style="margin-right: -1px;">
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                      </div>
                    </div>

                    <div class="ta-c d-ib va-t cursor-p box-wrap theme55" :class="{active: formData.listNum === 5}" @click="listNumChange(5)">
                      <span class="box full-w"></span>
                      <div style="margin-right: -1px;">
                        <span class="box rectangle"></span>
                        <span class="box rectangle"></span>
                      </div>
                    </div>

                    <div class="ta-c d-ib va-t cursor-p box-wrap theme6" :class="{active: formData.listNum === 6}" @click="listNumChange(6)">
                      <span class="box full-w"></span>
                      <div style="margin-right: -1px;">
                      </div>
                    </div>
                  </template>

                  <template v-else>
                    <div class="ta-l d-ib va-t cursor-p box-wrap theme5" :class="{active: formData.listNum === 4}" @click="listNumChange(4)">
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                    </div>

                    <!-- <div class="ta-l d-ib va-t cursor-p box-wrap theme4" :class="{active: formData.listNum === 5}" @click="listNumChange(5)">
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                      <span class="box rectangle"></span>
                    </div> -->
                  </template>
                </el-form-item>

                <el-form-item label="列表图：">
                  <!-- <pre>{{formData.activityListData[0]}}</pre> -->
                  <template v-if="formData.activityType === 1">
                    <thumbnail-component :empty="false" :styles="upload100" :link="false" del :auto-delete="true" :list="[formData.activityListData[0]]" :index="0" @change="subactivityChange">
                      <template slot="other">
                        <upload-component class="d-ib" :styles="upload100" :index="0" @success="uploadSuccess" v-if="!formData.activityListData[0] || !formData.activityListData[0].url"></upload-component>
                        <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                          <template v-if="formData.listNum === 1">建议尺寸：750 * 315px<br>建议大小：100KB以内</template>
                          <template v-if="formData.listNum === 2 || formData.listNum === 5 || formData.listNum === 6">建议尺寸：750 * 265px<br>建议大小：100KB以内</template>
                          <template v-if="formData.listNum === 3">建议尺寸：750 * 265px<br>建议大小：100KB以内</template>
                        </div>
                      </template>
                    </thumbnail-component>
                  </template>

                  <!-- 多区活动 布局 -->
                  <template v-else>
                    <div class="pos-r" style="width: 360px;">
                      <div class="pos-a d-ib" style="color: #f5a74a; width: 200px; line-height: 30px; margin-top: -20px; left: 360px; top: 50%;">
                        <template v-if="currentSubactivityIndex === 0">建议尺寸：750 * 415px<br>建议大小：100KB以内</template>
                        <template v-else>建议尺寸：355 * 265px<br>建议大小：100KB以内</template>
                      </div>

                      <thumbnail-component class="d-ib select" :styles="formData.listNum !== 4 ? upload100 : {width: '310px', height: '100px'}" :actived="currentSubactivityIndex === 0" :empty="false" :link="false" del :auto-delete="true" :list="[formData.activityListData[0]]" :index="0" @change="subactivityChange" @click="activityListChange(0)">
                        <template slot="other">
                          <upload-component class="d-ib" :styles="formData.listNum !== 4 ? upload100 : {width: '310px', height: '100px'}" :index="0" :disabled="currentSubactivityIndex !== 0" @success="uploadSuccess" v-if="!formData.activityListData[0] || !formData.activityListData[0].url"></upload-component>
                        </template>
                      </thumbnail-component>
                    
                      <thumbnail-component :empty="false" class="d-ib select" :styles="formData.listNum !== 4 ? upload100 : upload145" :actived="currentSubactivityIndex === 1" :link="false" del :auto-delete="true" :list="[formData.activityListData[1]]" :index="1" @change="subactivityChange" @click="activityListChange(1)">
                        <template slot="other">
                          <upload-component class="d-ib" :styles="formData.listNum !== 4 ? upload100 : upload145" :index="1" :disabled="currentSubactivityIndex !== 1" @success="uploadSuccess" v-if="!formData.activityListData[1] || !formData.activityListData[1].url"></upload-component>
                        </template>
                      </thumbnail-component>
                      
                      <thumbnail-component :empty="false" class="d-ib select" :styles="formData.listNum !== 4 ? upload100 : upload145" :actived="currentSubactivityIndex === 2" :link="false" del :auto-delete="true" :list="[formData.activityListData[2]]" :index="2" @change="subactivityChange" @click="activityListChange(2)">
                        <template slot="other">
                          <upload-component class="d-ib" :styles="formData.listNum !== 4 ? upload100 : upload145" :index="2" :disabled="currentSubactivityIndex !== 2" @success="uploadSuccess" v-if="!formData.activityListData[2] || !formData.activityListData[2].url"></upload-component>
                        </template>
                      </thumbnail-component>

                      <thumbnail-component :empty="false" class="d-ib select" :styles="formData.listNum !== 4 ? upload100 : upload145" :actived="currentSubactivityIndex === 3" :link="false" del :auto-delete="true" :list="[formData.activityListData[3]]" :index="3" @change="subactivityChange" @click="activityListChange(3)">
                        <template slot="other">
                          <upload-component class="d-ib" :styles="formData.listNum !== 4 ? upload100 : upload145" :index="3" :disabled="currentSubactivityIndex !== 3" @success="uploadSuccess" v-if="!formData.activityListData[3] || !formData.activityListData[3].url"></upload-component>
                        </template>
                      </thumbnail-component>

                      <thumbnail-component :empty="false" class="d-ib select" :styles="formData.listNum !== 4 ? {width: '200px', height: '90px'} : upload145" :actived="currentSubactivityIndex === 4" :link="false" del :auto-delete="true" :list="[formData.activityListData[4]]" :index="4" @change="subactivityChange" @click="activityListChange(4)">
                        <template slot="other">
                          <upload-component class="d-ib" :styles="formData.listNum !== 4 ? {width: '220px', height: '90px'} : upload145" :index="4" :disabled="currentSubactivityIndex !== 4" @success="uploadSuccess" v-if="!formData.activityListData[4] || !formData.activityListData[4].url"></upload-component>
                        </template>
                      </thumbnail-component>
                    </div>
                  </template>
                </el-form-item>
              </div>
              
              <!-- 选择活动存在时显示 -->
              <template v-if="formData.activityListData[currentSubactivityIndex]">
                <div class="shadow-wrap">
                  <gray-title class="title">活动内容配置</gray-title>
                  <el-form-item label="活动名称：" prop="subactivityName">
                    <el-input v-model="formData.subactivityName" maxlength="50" placeholder="限50个字符"></el-input>
                  </el-form-item>

                  <el-form-item label="活动主图：">
                    <thumbnail-component :empty="false" :styles="upload100" del :auto-delete="true" :list="formData.activityDetailImgs">
                      <template slot="other">
                        <upload-component :styles="upload100" @success="uploadDetailsImgSuccess" v-if="!formData.activityDetailImgs[0] || !formData.activityDetailImgs[0].url"></upload-component>
                        <div class="va-t d-ib" style="color: #f5a74a; line-height: 30px; padding: 18px 0 0 15px;">
                          建议尺寸：750 * 750px<br>建议大小：100KB以内
                        </div>
                      </template>
                    </thumbnail-component>
                  </el-form-item>

                  <el-form-item label="选择背景色："  prop="backgroundColor" :rules="{required: true, message: '不能为空', trigger: 'change'}">
                    <el-row type="flex">
                      <el-input v-model="formData.backgroundColor" style="width: 100px;" maxLength="7" placeholder="请选择背景色"></el-input>
                      <el-color-picker v-model="formData.backgroundColor"></el-color-picker>
                    </el-row>
                  </el-form-item>

                  <el-form-item label="主题配置：">
                    <dl class="d-ib ta-c cursor-p theme-config-list" :class="{active: formData.themeConfigType === item.type}" @click="changeThemConfigType(item)" v-for="(item, index) in themeConfigData" v-if="index === 0 && formData.activityType === 1 || index !== 0">
                      <dt>
                        <img class="full-wrap" :src="item.url">
                      </dt>
                      <dd>{{item.title}}</dd>
                    </dl>
                  </el-form-item>

                  <el-form-item label="关联类型：">
                    <el-radio-group v-model="formData.relationType" @change="relationTypeChange">
                      <el-radio border size="medium" :label="1">关联商品</el-radio>
                      <el-radio border size="medium" :label="2">关联地址</el-radio>
                      <!-- <el-radio border size="medium" :label="2" v-if="formData.activityType === 2">关联地址</el-radio> -->
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item label="专区管理：" v-if="formData.activityType === 2 && formData.relationType === 1 && formData.subactivityId">
                    <div class="d-ib va-m">
                      <el-select size="small" class="input-auto-wrap" v-model="formData.specialAreaId" @change="specialAreaChange">
                        <template v-for="item in specialAreaList">
                          <el-option :label="item.columnName" :value="item.id"></el-option>
                        </template>
                      </el-select>
                      <span class="pos-a" style="color: #999; top: 30px;">{{formData.specialAreaDescDef}}</span>
                    </div>
                    <span class="special-area-btn">
                      <i title="编辑" class="btn el-icon-edit cursor-p" @click="handleSaveSpecialAreaBefore('edit')"></i>
                      <i title="删除" class="btn el-icon-delete cursor-p" @click="handleDelSpecialAreaBefore"></i>
                    </span>
                    <!-- <span style="color: #999; font-size: 13px; margin-left: 10px;">每个专区最多添加<span style="color: red">18</span>个商品</span> -->

                    <el-button size="small" round class="va-m fl-r" style="margin-right: 20px;" @click="handleSaveSpecialAreaBefore('add')">
                      <i class="el-icon-plus"></i> 添加专区
                    </el-button>
                  </el-form-item>

                  <template v-if="formData.relationType === 2">
                    <el-form-item label="链接类型：">
                      <el-radio-group v-model="formData.linkType">
                        <el-radio :label="1">内部链接</el-radio>
                        <el-radio :label="0">外部链接</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="指定链接：" prop="relationUrl" v-if="formData.linkType === 1">
                      <el-input v-model="formData.relationUrl" class="d-n"></el-input>
                      <internal-link :initData="internalLinkData" @change="internalLinkChange" v-if="formData.linkType === 1"></internal-link>
                    </el-form-item>

                    <el-form-item label="指定链接：" prop="relationLink" v-else>
                      <el-input size="medium" placeholder='输入url地址，500个字符以内，格式"http://"' v-model="formData.relationLink"></el-input>
                    </el-form-item>

                  </template>

                  <el-form-item>
                    <el-button type="primary" :loading="saveLoading" @click="handleCreateSubactivity('main-form')" :disabled="!activityLists.length">保存</el-button>
                  </el-form-item>
                  
                  <!-- 活动id不存在时隐藏关联商品 -->
                  <template v-if="formData.specialAreaId && formData.relationType === 1">
                    <gray-title class="title" title="商品设置">
                      <span class="pos-a" style="top: 5px; right: 4px;" slot="right">
                        <el-button size="small" round @click="handleRelationBefore">关联商品</el-button>
                        <el-button size="small" round :disabled="!tableSelectRes.length" @click="handleCancelGoodsBefore(false)">取消商品</el-button>
                      </span>
                    </gray-title>
                    <br>
                    <el-table :data="formData.goodsList" ref="goods-table" v-loading="columnLoading" element-loading-text="加载中" @row-click="tableRowSelect" @select-all="handleTableSelect" @selection-change="handleTableSelect">
                      <el-table-column label="" width="40" type="selection"></el-table-column>
                      <el-table-column label="商品图片" min-width="90">
                        <template slot-scope="scope">
                          <thumbnail-component :styles="{width: '50px', height: '50px'}" :list="[{url: $Utils.filterImgUrl(scope.row.mainImage)}]"></thumbnail-component>
                        </template>
                      </el-table-column>
                      <el-table-column label="品牌" min-width="160">
                        <template slot-scope="scope">{{scope.row.brandName | filterEmpty}}</template>
                      </el-table-column>
                      <el-table-column label="商品编码" min-width="160">
                        <template slot-scope="scope">{{scope.row.goodsNo | filterEmpty}}</template>
                      </el-table-column>
                      <el-table-column label="商品名称" min-width="210">
                        <template slot-scope="scope">{{scope.row.goodsName | filterEmpty}}</template>
                      </el-table-column>
                      <el-table-column label="销售价（元）" min-width="120">
                        <template slot-scope="scope">{{scope.row.goodsPrice | filterEmpty}}</template>
                      </el-table-column>
                      <el-table-column label="进货价（元）" min-width="120">
                        <template slot-scope="scope">{{scope.row.buyingPrice | filterEmpty}}</template>
                      </el-table-column>
                      <el-table-column label="利润率（利润/销售价）" min-width="180">
                        <template slot-scope="scope">
                          <template v-if="scope.row.goodsPrice && scope.row.buyingPrice">
                            {{((scope.row.goodsPrice - scope.row.buyingPrice) / scope.row.goodsPrice * 100).toFixed(2) | filterEmpty('%')}}
                          </template>
                          <template v-else>{{'' | filterEmpty}}</template>
                        </template>
                      </el-table-column>

                      <el-table-column label="排序" min-width="110">
                        <template slot-scope="scope">
                          <div class="pos-r sort-wrap" style="padding-right: 25px;">
                            <el-form-item class="d-ib mb-0 full-w" :prop="'goodsList.' + scope.$index + '.sort'" :rules="ruleNum" label-width="0">
                              <el-input size="medium" min="0" maxlength="9" v-model="scope.row.sort" @blur="handleBlurSort(scope.row)" @change="contentChange"></el-input>
                            </el-form-item>
                            <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                              <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0, disabled: scope.$index === 0}" @click="handleSortGoods(scope.$index, 'up')" :disabled="scope.$index === 0"></i>
                              <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.goodsList.length - 1, disabled: scope.$index === formData.goodsList.length - 1}" @click="handleSortGoods(scope.$index, 'down')" :disabled="scope.$index === formData.goodsList.length - 1"></i>
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
                              <!-- <el-dropdown-item>
                                <div @click="handleLink(scope.row, 'setting')"><i class="icon el-icon-setting"></i>设置</div>
                              </el-dropdown-item> -->
                              <el-dropdown-item>
                                <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                              </el-dropdown-item>
                              <el-dropdown-item>
                                <div @click="handleCancelGoodsBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>取消</div>
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </template>
                      </el-table-column>

                      <template slot="empty">
                        <no-data></no-data>
                      </template>
                    </el-table>
                    <br>
                  </template>
                </div>
              </template>

            </div>

          </div>

          <div class="clear"></div>

        </div>
      </el-form>
    </template>

    <template slot="other">

      <el-dialog title="关联商品" :visible.sync="relationVisible" width="1100px">
        <relation-goods :key="relationGoodsKey" :relationId="parseInt(formData.specialAreaId)" @add="handleAddGoods" @remove="handleRemoveGoods"></relation-goods>
      </el-dialog>

      <!-- 新增或编辑活动 -->
      <el-dialog :title="operateActivityType === 1 ? '新增活动' : '编辑活动'" :visible.sync="editActivityVisible" width="500px">
        <el-form class="ta-l" style="padding-right: 40px;" :model="formData" :rules="rules" ref="add-activity-form" label-width="120px">
          <el-form-item label="活动名称：" prop="editActivityName">
            <el-input placeholder="16个字符以内" maxlength="16" v-model="formData.editActivityName"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" rows="3" placeholder="50个字符以内" maxlength="50" v-model="formData.editDescription"></el-input>
          </el-form-item>
          <el-form-item label="活动类型：">
            <el-radio-group v-model="formData.editActivityType">
              <el-radio :label="1">单区活动</el-radio>
              <el-radio :label="2">多区活动</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="首页展示：" prop="isRecommendIndex">
            <el-radio-group v-model="formData.isRecommendIndex">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <br>
        <el-button size="medium" @click="editActivityVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="addActivityLoading" @click="handleSaveActivity('add-activity-form')">确定</el-button>
      </el-dialog>

      <el-dialog title="删除活动" :visible.sync="delActivityVisible" width="420px">
        <br><div>确定是否删除活动</div><br>

        <br>
        <el-button size="medium" @click="delActivityVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="delActivityLoading" @click="handleDelActivity">确定</el-button>
      </el-dialog>

      <!-- 新增或编辑专区 -->
      <el-dialog :title="specialAreaTitle" :visible.sync="specialAreaVisible" width="500px">
        <el-form class="ta-l" style="padding-right: 40px;" :model="formData" :rules="rules" ref="special-area-form" label-width="120px">
          <el-form-item label="专区名称：" prop="specialAreaName">
            <el-input placeholder="16个字符以内" maxlength="16" v-model="formData.specialAreaName"></el-input>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input type="textarea" rows="3" placeholder="50个字符以内" maxlength="50" v-model="formData.specialAreaDesc"></el-input>
          </el-form-item>
        </el-form>
        
        <br>
        <el-button size="medium" @click="specialAreaVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="addSpecialAreaLoading" @click="handleSaveSpecialArea('special-area-form')">确定</el-button>
      </el-dialog>

      <!-- 删除专区 -->
      <el-dialog title="删除专区" :visible.sync="delSpecialAreaVisible" width="420px">
        <br><div>确定是否删除专区</div><br>

        <br>
        <el-button size="medium" @click="delSpecialAreaVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="delSpecialAreaLoading" @click="handleDelSpecialArea">确定</el-button>
      </el-dialog>

      <!-- 切换活动类型 -->
      <el-dialog title="切换活动类型" :visible.sync="switchActivityType" width="400px">
        <br>
        <div style="color: red; line-height: 32px; padding: 0 30px;">切换活动类型后将清除原有的配置数据，确定是否切换？</div>
        <br>
        
        <br>
        <el-button size="medium" @click="switchActivityType = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="switchActivityLoading" @click="activityTypeChange">确定</el-button>
      </el-dialog>

      <!-- 取消商品 -->
      <el-dialog title="取消商品" :visible.sync="cancelVisible" width="420px">
        <br><div>确定是否取消商品？</div><br>

        <br>
        <el-button size="medium" @click="cancelVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="cancelLoading" @click="handleCancelGoods">确定</el-button>
      </el-dialog>

    </template>

    <template slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="handleCreateSubactivity('main-form')" :disabled="!activityLists.length">保存</el-button>
    </template>
  </common-tpl>
</template>

<script>
import RelationGoods from '@/components/public/RelationGoods'
import InternalLink from '@/components/public/InternalLink'

export default {
  components: {
    RelationGoods,
    InternalLink
  },

  data () {
    // 校验正整数
    let validateInt = (rule, value, callback) => {
      if (value && (isNaN(value) || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('请输入正数'))
      callback()
    }

    return {
      saveLoading: false,       // 保存loading
      columnLoading: false,     // lan
      mainLoading: false,       // 主体loading
      activityLoading: false,   // 获取活动列表loading
      activityLists: [],        // 活动列表
      loading: true,            // 加载中
      relationVisible: false,   // 关联商品弹窗
      editActivityVisible: false,     // 添加或编辑活动弹窗
      activityTitle: '',              // 活动弹窗标题
      operateActivityType: 1,         // 操作活动类型 [1、新增，2、编辑]
      operateActivityData: false,     // 操作活动对象
      addActivityLoading: false,      // 添加活动loading
      delActivityVisible: false,      // 删除活动弹窗
      delActivityLoading: false,      // 删除活动loading
      specialAreaList: [],            // 专区列表
      specialAreaData: {},            // 当前专区数据
      specialAreaTitle: '',           // 添加或编辑专区标题
      specialAreaVisible: false,      // 添加专区弹窗
      addSpecialAreaLoading: false,   // 添加专区loading
      delSpecialAreaVisible: false,    // 删除专区弹窗
      delSpecialAreaLoading: false, // 删除专区loading

      switchActivityType: false,    // 切换活动类型弹窗
      switchActivityLoading: false, // 切换活动类型loading
      cancelVisible: false,         // 取消关联商品
      cancelLoading: false,         // 取消关联商品
      cancelData: [],               // 取消关联数据
      formData: {
        activityId: 0,          // 活动id
        subactivityId: 0,      // 子活动id
        subactivityName: '',    // 子活动名称

        activityName: '',       // 活动名称
        description: '',        // 当前选择活动描述
        activityType: 1,        // 活动类型 [1、单区活动，2、多区活动]
        activityStatus: 1,      // 活动状态 [1、开启，0、关闭]
        isRecommendIndex: 1,    // 首页展示 [1、开启，0、关闭]

        editActivityName: '',   // 编辑活动名称
        editDescription: '',    // 编辑描述
        editActivityId: 0,      // 编辑活动id
        editActivityType: 1,    // 编辑活动类型 [1、单区活动，2、多区活动]
        editActivityStatus: 1,  // 编辑活动状态 [1、开启，0、关闭]

        activityImg: '',        // 活动主图
        activityListData: [],   // 活动主图列表
        activityDetailImgs: [], // 详情主图

        themeConfigType: 0,     // 主题配置
        backgroundColor: '',    // 选择背景色

        specialArea: 1,         // 专区管理
        specialAreaId: '',      // 专区id
        specialAreaDescDef: '', // 专区id
        specialAreaName: '',    // 专区名称
        specialAreaDesc: '',    // 专区描述

        listNum: 1,             // 显示数量 [1、三个，2、四个，3、六个]
        relationType: 1,        // 关联类型 [1、关联商品，2、关联地址]
        linkType: 2,            // 链接类型 [1、内部链接，2、外部链接]
        relationLink: '',       // 指定链接
        relationUrl: '',        // 内部链接
        goodsList: []           // 列表数据
      },
      rules: {
        editActivityName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        subactivityName: [{required: true, message: '请输入活动名称', trigger: 'blur'}],
        specialAreaName: [{required: true, message: '请输入专区名称', trigger: 'blur'}],
        relationUrl: [{required: true, message: '请选择指定链接', trigger: 'change'}],
        relationLink: [{required: true, message: '请输入外部链接', trigger: 'change'}]
      },
      ruleNum: [{validator: validateInt, trigger: 'blur'}],

      themeConfigData: [        // 主题配置
        {
          title: '默认主题',
          type: 0,
          url: require('./assets/img/theme-default.jpg')
        },
        {
          title: '双十一',
          type: 1,
          url: require('./assets/img/theme-shuang11.png')
        }
      ],

      currentSpecialArea: {},   // 当前分区

      currentSubactivityList: {}, // 当前子活动列表
      currentSubactivityIndex: 0, // 当前选择活动索引
      uploadIndex: 1,           // 上传索引
      // 矩形尺寸
      upload100: {width: '98px', height: '98px'},
      upload145: {width: '145px', height: '80px'},

      isEdited: false,          // 是否编辑

      tableSelectRes: [],       // table选择结果

      relationGoodsKey: '',     // 关联商品标识符

      internalLinkData: {
        grandNode: '',          // 一级id
        parentNode: '',         // 二级id
        childNode: ''           // 三级id
      }
    }
  },

  mounted () {
    // 判断是否同一模块，带出搜索记录
    this.$Utils.filterSearchData('/admin/goods/activity/index', (res) => {
      this.formData.activityId = res.activityId
      this.formData.subactivityId = res.subactivityId
    })

    this.getActivityData()
  },

  methods: {
    /**
     * 获取活动列表
     */
    getActivityData () {
      this.activityLoading = true
      this.$http.post('@ROOT_API/column/getColumnParentActivity', {}).then((res) => {
        let resData = res.data
        if (parseInt(resData.status) !== 1) {
          this.$message({
            message: resData.msg,
            type: 'error',
            duration: 1500
          })
          return false
        }
        this.activityLists = []
        let results = resData.data
        if (!results.length) return false
        this.activityLists = results
        let findObj = results.filter((row) => row.id === this.formData.activityId)[0] || results[0]
        if (findObj) this.handleListChange(findObj)
      }).finally(() => {
        setTimeout(() => {
          this.activityLoading = false
        }, 100)
      })
    },

    /**
     * 选择选中
     */
    selectChange () {
      this.currentSubactivityIndex = this.currentSubactivityIndex || 0
      if (this.formData.activityType === 1) {
        this.formData.listNum = this.formData.listNum || 1
      } else {
        this.formData.listNum = this.formData.listNum || 4
      }
    },

    /**
     * table复选
     */
    handleTableSelect (val) {
      this.tableSelectRes = val
    },

    /**
     * 单行选择
     */
    tableRowSelect (row) {
      this.$refs['goods-table'].toggleRowSelection(row)
    },

    /**
     * 关联类型选择
     */
    relationTypeChange (value) {
      this.activityLists.forEach((row) => {
        if (row.id === this.formData.activityId && row.columnManageList) {
          row.columnManageList.forEach((list) => {
            if (list.id === this.formData.subactivityId) {
              list.columnType = value
            }
          })
        }
      })
    },

    /**
     * 获取专区列表
     */
    getSpecialAreaData () {
      this.$http.post('@ROOT_API/column/getSpecialAreaByParentId', {
        parentId: this.formData.subactivityId
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
        this.specialAreaList = results
        if (results.length) {
          this.formData.specialAreaId = results[0].id
          this.formData.specialAreaDescDef = results[0].description
          this.specialAreaChange(this.formData.specialAreaId)
        }
        if (this.formData.specialAreaId) this.getColumnData()
      })
    },

    /**
     * 获取栏目关联商品列表
     */
    getColumnData () {
      if (!this.formData.specialAreaId) return false
      this.columnLoading = true
      this.$http.post('@ROOT_API/column/columnGoodsList', {
        columnId: this.formData.specialAreaId,  // 是 int 栏目ID
        supplierId: '',    // 否 int 供应商Id
        searchText: '',    // 否 String  商品编号/商品名称
        whetherPoints: ''  // 否 int 是否支持积分兑换(0 : 否，1 ：是)
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
        this.formData.goodsList = results
      }).finally(() => {
        this.columnLoading = false
      })
    },

    /**
     * 获取活动详情
     */
    getDetailsData (id) {
      this.mainLoading = true
      this.$http.get('@ROOT_API/column/getActivityInfo', {
        params: {
          id // 是 int 活动ID
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
      }).finally(() => {
        setTimeout(() => {
          this.mainLoading = false
        }, 500)
      })
    },

    /**
     * 创建或保存活动
     */
    handleSaveActivity (formName, type) {
      return new Promise((resolve, reject) => {
        let colShowNum = this.formData.listNum
        if (!type || type !== 'save') {
          colShowNum = this.formData.editActivityType === 1 ? 1 : 4
        }
        // let findObj = this.activityLists.filter((row) => row.id === this.formData.activityId)
        let data = {
          id: type === 'save' || this.operateActivityType !== 1 ? this.formData.activityId : '', // 否 int 活动id 新增时id为空 编辑时才有值
          columnName: type === 'save' ? this.formData.activityName : this.formData.editActivityName,           // 是 String  活动名称
          type: 2,  // 是 int 类型 用于区分是栏目还是套餐、活动 2表示活动
          activityType: type === 'save' ? this.formData.activityType : this.formData.editActivityType, // 是 int 活动类型 1:单区活动 2:多区活动
          colShowNum, // 是 string 列表显示
          // themeConfig: this.formData.themeConfigType || 0, // 是 string  主题配置
          parentId: type === 'save' ? 0 : '',  // 是 int 父级id 一级活动为0 其他为一级活动的id
          activityStatus: type === 'save' ? this.formData.activityStatus : 1, // 是 int 激活状态 0:未激活，1已激活
          description: type === 'save' ? this.formData.description : this.formData.editDescription,   // 否 String  描述
          isRecommendIndex: this.formData.isRecommendIndex       // 是否首页展示
          // sort: findObj && findObj[0] ? findObj[0].sort : ''
          // sort: 233
        }
        if (type === 'save') {
          this.saveLoading = true
          this.switchActivityLoading = true
          this.handleSaveActivityAjax(data, type).then(() => {
            this.saveLoading = false
            this.mainLoading = false
            this.switchActivityLoading = false
            resolve()
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (!valid) return false
            this.addActivityLoading = true
            this.handleSaveActivityAjax(data, type).then(() => {
              this.saveLoading = false
              this.mainLoading = false
              this.addActivityLoading = false
              resolve()
            })
          })
        }
      })
    },

    /**
     * 创建或保存活动接口调用
     */
    handleSaveActivityAjax (data, type) {
      return new Promise((resolve, reject) => {
        this.$http.post('@ROOT_API/column/saveActivity', data).then((res) => {
          let resData = res.data
          if (parseInt(resData.status) !== 1) {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            reject()
            return false
          }
          // 新增活动
          if ((type && type !== 'save') || (!type && this.operateActivityType === 1)) {
            this.activityLists.length ? this.activityLists.unshift(resData.data) : this.activityLists.push(resData.data)
          }
          // 编辑活动
          if (this.operateActivityType === 2) {
            this.activityLists.forEach((row) => {
              if (row.id === this.operateActivityData.id) {
                row.columnName = this.formData.editActivityName
                row.activityType = this.formData.editActivityType
                row.description = this.formData.editDescription
                row.isRecommendIndex = this.formData.isRecommendIndex    // 首页配置
              }
            })
            this.formData.activityName = this.formData.editActivityName
            this.formData.activityType = this.formData.editActivityType
            this.formData.description = this.formData.editDescription
            this.getActivityData()
          } else {
            this.activityLists.forEach((row) => {
              if (row.id === this.formData.activityId) {
                row.activityStatus = this.formData.activityStatus
              }
            })
          }
          this.editActivityVisible = false
          resolve()
        }).finally(() => {
          setTimeout(() => {
            this.saveLoading = false
            this.addActivityLoading = false
            this.switchActivityLoading = false
          }, 500)
        })
      })
    },

    /**
     * 创建子活动
     */
    handleCreateSubactivity (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) return false

        this.handleSaveActivity('', 'save')

        this.saveLoading = true
        this.mainLoading = true
        this.handleCreateSubactivityAjax()
      })
    },

    /**
     * 创建子活动接口调用
     */
    handleCreateSubactivityAjax (url, index) {
      let columnLogo = ''
      let themeConfig = ''
      if (url) {
        columnLogo = url
      } else {
        columnLogo = this.formData.activityListData[this.currentSubactivityIndex] ? this.formData.activityListData[this.currentSubactivityIndex].img : ''
      }
      if (this.formData.activityType === 1) {
        if (!this.formData.subactivityId) {
          themeConfig = 0
        } else {
          themeConfig = this.formData.themeConfigType || 0
        }
      } else {
        themeConfig = this.formData.themeConfigType || 1
      }
      // ......
      // 选择背景色
      if (!this.formData.subactivityId) {
        this.formData.backgroundColor = themeConfig === 0 ? '#008000' : themeConfig === 1 ? '#800080' : ''
      }
      this.$http.post('@ROOT_API/column/saveSubActivity', {
        id: this.formData.subactivityId,              // 否 int 活动id 新增时id为空 编辑时才有值
        type: 2,            // 是 int 类型 用于区分是栏目还是套餐、活动 2表示活动
        activityType: this.formData.activityType,    // 是 int 活动类型 1:单区活动 2:多区活动
        sort: this.formData.activityType === 1 ? 0 : this.currentSubactivityIndex,            // 否 int 活动排序
        parentId: this.formData.activityId,        // 是 int 父级id 一级活动为0 其他为一级活动的id
        columnLogo,       // 是 string  列表主图
        mainImage: this.formData.activityDetailImgs[0] && this.formData.activityDetailImgs[0].img ? this.formData.activityDetailImgs[0].img : '',      // 是 string  活动主图
        themeConfig,  // 是 string  主题配置
        backgroundColor: this.formData.backgroundColor,  //  string  选择背景色
        activityStatus: this.formData.activityStatus,  // 是 int 活动状态 激活状态 0:未激活，1已激活
        colShowNum: this.formData.listNum,      // 是 string  列表显示
        columnType: !this.formData.subactivityId ? 1 : this.formData.relationType, // 是 int 栏目类型（1 关联商品，2 关联地址）
        columnName: this.formData.subactivityName, // 活动名称
        linkType: this.formData.linkType,
        relateUrl: this.formData.linkType === 1 ? this.formData.relationUrl : this.formData.relationLink,
        // 指定链接
        grandNode: this.internalLinkData.grandNode,
        parentNode: this.internalLinkData.parentNode,
        childNode: this.internalLinkData.childNode
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
          duration: 1500
        })
        let results = resData.data
        this.formData.subactivityId = results.id
        if (url) {
          results.url = this.$Utils.filterImgUrl(url)
          results.img = this.$Utils.filterImgUrl(url)
          this.$set(this.formData.activityListData, index, results)
        }
        this.getSpecialAreaData()
        this.getActivityData()
      }).finally(() => {
        setTimeout(() => {
          this.saveLoading = false
          this.mainLoading = false
        }, 500)
      })
    },

    /**
     * 活动状态改变
     */
    activityStatusChange () {
      this.handleSaveActivity('', 'save')
    },

    /**
     * 显示数量改变
     */
    listNumChange (num) {
      if (!num && parseInt(num) !== 0) return false
      this.formData.listNum = num
      this.activityLists.forEach((row) => {
        if (row.id === this.formData.activityId) {
          row.colShowNum = num
        }
      })
    },

    /**
     * 专区选择
     */
    specialAreaChange (id) {
      this.specialAreaList.forEach((row) => {
        if (row.id === id) this.formData.specialAreaDescDef = row.description
      })
      this.getColumnData()
    },

    /**
     * 新增 || 编辑专区前操作
     */
    handleSaveSpecialAreaBefore (type) {
      this.specialAreaTitle = type === 'add' ? '添加专区' : '编辑专区'
      this.specialAreaVisible = true
      this.formData.specialAreaName = ''
      this.formData.specialAreaDesc = ''
      this.formData.specialAreaData = {}
      if (type === 'edit') {
        this.specialAreaList.forEach((row) => {
          if (row.id === this.formData.specialAreaId) {
            this.formData.specialAreaData = row
            this.formData.specialAreaName = row.columnName
            this.formData.specialAreaDesc = row.description
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['special-area-form'].clearValidate()
      })
    },

    /**
     * 新增 || 编辑专区
     */
    handleSaveSpecialArea (formName) {
      this.addSpecialAreaLoading = true
      this.$http.post('@ROOT_API/column/saveSpecialArea', {
        id: this.formData.specialAreaData.id ? this.formData.specialAreaData.id : '', // 否 int 专区id 新增时id为空 编辑时才有值
        columnName: this.formData.specialAreaName, // 是 String  专区名称
        parentId: this.formData.subactivityId,     // 是 int 父级id 活动的id
        sort: this.formData.specialAreaData.sort ? this.formData.specialAreaData.sort : 0,  // 是 int 排序id
        description: this.formData.specialAreaDesc // 否 String  描述
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
        this.specialAreaVisible = false
        if (this.formData.specialAreaData.id) {
          this.specialAreaList.forEach((row) => {
            if (row.id === this.formData.specialAreaData.id) {
              row.columnName = this.formData.specialAreaName
              row.description = this.formData.specialAreaDesc
              this.formData.specialAreaDescDef = this.formData.specialAreaDesc
            }
          })
        } else {
          if (this.specialAreaList.length) {
            this.specialAreaList.push(resData.data)
          } else {
            this.specialAreaList.unshift(resData.data)
          }
        }
      }).finally(() => {
        this.addSpecialAreaLoading = false
      })
    },

    /**
     * 删除专区前操作
     */
    handleDelSpecialAreaBefore () {
      this.delSpecialAreaVisible = true
      this.specialAreaList.forEach((row) => {
        if (row.id === this.formData.specialAreaId) this.formData.specialAreaData = row
      })
    },

    /**
     * 删除专区
     */
    handleDelSpecialArea () {
      this.delSpecialAreaLoading = true
      this.$http.get('@ROOT_API/column/delete', {
        params: {
          id: this.formData.specialAreaId
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
          duration: 1500
        })
        this.specialAreaList.forEach((row, index) => {
          if (row.id === this.formData.specialAreaId) this.specialAreaList.splice(index, 1)
        })
        this.formData.specialAreaId = ''
        if (this.specialAreaList.length) {
          this.formData.specialAreaData = this.specialAreaList[0]
          this.formData.specialAreaId = this.formData.specialAreaData.id
          this.formData.specialAreaDescDef = this.formData.specialAreaData.description
          this.getColumnData()
        }
        this.delSpecialAreaVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.delSpecialAreaLoading = false
        }, 500)
      })
    },

    /**
     * 活动列表排序
     */
    handleSortActivity (index, type) {
      if (!type) return false
      let temp = this.activityLists[index]
      let sort = temp.sort
      let sortIndex = type === 'up' ? index - 1 : index + 1
      let goodsColumnList = []
      if (type === 'down') {
        goodsColumnList.push(
          {
            columnId: this.activityLists[sortIndex].id,
            sort: temp.sort
          },
          {
            columnId: temp.id,
            sort: this.activityLists[sortIndex].sort
          }
        )
      } else {
        goodsColumnList.push(
          {
            columnId: temp.id,
            sort: this.activityLists[sortIndex].sort
          },
          {
            columnId: this.activityLists[sortIndex].id,
            sort: temp.sort
          }
        )
      }
      this.activityLoading = true
      this.$http.post('@ROOT_API/column/updateActivitySorts', {
        goodsColumnList
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
          duration: 1500
        })
        temp.sort = this.activityLists[sortIndex].sort
        this.activityLists[sortIndex].sort = sort
        this.$set(this.activityLists, index, this.activityLists[sortIndex])
        this.$set(this.activityLists, sortIndex, temp)
      }).finally(() => {
        this.activityLoading = false
      })
    },

    /**
     * 活动列表排序接口调用
     */
    handleSortActivityAjax () {
      this.$http.post('@ROOT_API/column/updateActivitySorts', {
      })
    },

    /**
     * 商品排序
     */
    handleSortGoods (index, type) {
      if (!type || type === 'up' && index === 0 || type === 'down' && index === this.formData.goodsList.length - 1) return false
      let temp = this.formData.goodsList[index]
      let sortIndex = type === 'up' ? index - 1 : index + 1
      let goodsColumnList = []
      if (type === 'down') {
        goodsColumnList.push(
          {
            goodsColumnId: this.formData.goodsList[sortIndex].goodsColumnId,
            goodsId: this.formData.goodsList[sortIndex].goodsId,
            sort: temp.sort || 0
          },
          {
            goodsColumnId: temp.goodsColumnId,
            goodsId: temp.goodsId,
            sort: this.formData.goodsList[sortIndex].sort || 0
          }
        )
      } else {
        goodsColumnList.push(
          {
            goodsColumnId: temp.goodsColumnId,
            goodsId: temp.goodsId,
            sort: this.formData.goodsList[sortIndex].sort || 0
          },
          {
            goodsColumnId: this.formData.goodsList[sortIndex].goodsColumnId,
            goodsId: this.formData.goodsList[sortIndex].goodsId,
            sort: temp.sort || 0
          }
        )
      }
      this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
        goodsColumnList
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
        let sort = temp.sort
        temp.sort = this.formData.goodsList[sortIndex].sort
        this.formData.goodsList[sortIndex].sort = sort
        this.$set(this.formData.goodsList, index, this.formData.goodsList[sortIndex])
        this.$set(this.formData.goodsList, sortIndex, temp)
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
     * 添加活动前操作
     */
    addActivityBefore () {
      this.formData.editActivityName = ''
      this.formData.editDescription = ''
      this.formData.editActivityType = 1
      this.editActivityVisible = true
      this.operateActivityType = 1
      this.formData.isRecommendIndex = 1
    },

    /**
     * 编辑前操作
     */
    handleEditBefore (item) {
      this.operateActivityData = item
      this.operateActivityType = 2
      this.editActivityVisible = true
      this.formData.activityId = item.id
      this.formData.editActivityName = item.columnName
      this.formData.editDescription = item.description
      this.formData.editActivityType = item.activityType
      this.formData.isRecommendIndex = item.isRecommendIndex     // 新增 首页配置
    },

    /**
     * 删除前操作
     */
    handleDelActivityBefore (item) {
      this.delActivityVisible = true
      this.operateActivityData = item
    },

    /**
     * 删除
     */
    handleDelActivity () {
      this.delActivityLoading = true
      this.$http.get('@ROOT_API/column/deleteActivityByParentId', {
        params: {
          parentId: this.operateActivityData.id
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
          duration: 1500
        })
        // 移除列表数据
        this.activityLists.forEach((row, index) => {
          if (this.operateActivityData.id === row.id) this.activityLists.splice(index, 1)
          // 如果删除当前选中活动则选中第一个活动
          if (this.operateActivityData.id === this.formData.activityId && this.activityLists.length) this.handleListChange(this.activityLists[0])
        })
        this.delActivityVisible = false
      }).finally(() => {
        this.delActivityLoading = false
      })
    },

    /**
     * 活动选择
     */
    handleListChange (obj, type) {
      this.$refs['main-form'].clearValidate()
      this.formData.activityId = obj.id
      this.formData.subactivityName = ''
      this.internalLinkData.grandNode = ''
      this.internalLinkData.parentNode = ''
      this.internalLinkData.childNode = ''

      this.formData.relationUrl = ''
      this.formData.relationLink = ''

      this.formData.activityStatus = obj.activityStatus
      this.formData.activityType = obj.activityType
      this.formData.activityName = obj.columnName
      this.formData.description = obj.description
      this.formData.listNum = obj.activityType === 2 && obj.colShowNum !== 4 ? 4 : parseInt(obj.colShowNum)
      this.formData.relationType = 1

      this.formData.activityListData = []
      this.formData.activityDetailImgs = []
      this.formData.specialAreaId = ''

      this.currentSubactivityIndex = this.currentSubactivityIndex || 0
      // 重置数据
      if (type) {
        this.currentSubactivityIndex = 0
        this.formData.subactivityId = ''
      }

      // 当前子活动列表
      this.currentSubactivityList = obj.columnManageList || []

      if (obj.columnManageList && obj.columnManageList.length) {
        obj.columnManageList.forEach((row, index) => {
          let copyRow = this.$Utils.deepCopy(row)
          copyRow.img = this.$Utils.filterImgUrl(copyRow.columnLogo) || ''
          copyRow.url = this.$Utils.filterImgUrl(copyRow.columnLogo) || ''
          this.$set(this.formData.activityListData, copyRow.sort, copyRow)
          if (this.formData.subactivityId && row.id === parseInt(this.formData.subactivityId) || !this.formData.subactivityId && row.sort === this.currentSubactivityIndex) this.handleFillData(row)

          // 主题配置
          if (obj.activityType === 2 && parseInt(obj.themeConfig) === 0) {
            this.formData.themeConfigType = 1
          } else {
            if (obj.activityType === 1) {
              this.formData.themeConfigType = parseInt(row.themeConfig) || 0
            } else {
              this.formData.themeConfigType = parseInt(row.themeConfig) || 1
            }
          }
        })
      }

      this.selectChange()

      if (obj.columnManageList && obj.columnManageList.length) {
        let findObj = obj.columnManageList.filter((row) => row.sort === this.currentSubactivityIndex)
        if (findObj && findObj.length) this.formData.subactivityId = findObj[0].id
      }

      // 获取多专区列表
      if (this.formData.subactivityId) this.getSpecialAreaData()

      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 单区 || 多区选择
     */
    activityTypeChangeBefore () {
      this.formData.activityType = this.formData.activityType === 1 ? 2 : 1
      this.switchActivityType = true
    },

    /**
     * 单区 || 多区状态改变
     */
    activityTypeChange () {
      this.formData.activityType = this.formData.activityType === 1 ? 2 : 1
      this.formData.listNum = this.formData.activityType === 1 ? 1 : 4
      this.formData.themeConfigType = this.formData.activityType === 1 ? 1 : 2
      this.handleSaveActivity('', 'save').then(() => {
        this.getActivityData()
        this.formData.activityDetailImgs = []
        // this.mainLoading = false
        this.switchActivityType = false
        this.formData.goodsList = []
        this.formData.editActivityType = 1
        this.activityLists.forEach((row) => {
          if (row.id === this.formData.activityId) row.activityType = this.formData.activityType
        })
        this.resetActivityData()
        this.selectChange()
      }).catch(() => {
        this.formData.listNum = this.formData.activityType === 1 ? 1 : 4
        this.formData.activityType = this.formData.activityType === 1 ? 2 : 1
      })
    },

    /**
     * 重置活动数据
     */
    resetActivityData () {
      this.formData.activityListData = []
      this.formData.activityDetailImgs = []
      this.formData.subactivityId = ''
      this.formData.relationType = 1
      this.formData.themeConfigType = 0
    },

    /**
     * 追加关联商品
     */
    handleAddGoods (data) {
      data.forEach((row) => {
        if (this.formData.goodsList.length) {
          this.formData.goodsList.unshift(row)
        } else {
          this.formData.goodsList.push(row)
        }
      })
    },

    /**
     * 移除关联商品
     */
    handleRemoveGoods (data) {
      data.forEach((row) => {
        this.formData.goodsList.forEach((list, index) => {
          if (row.id === list.id) this.formData.goodsList.splice(index, 1)
        })
      })
    },

    /**
     * 上传主图成功
     */
    uploadSuccess (url, index) {
      // 创建或保存子活动
      this.handleCreateSubactivityAjax(url, index)
    },

    /**
     * 详情主图上传成功
     */
    uploadDetailsImgSuccess (url, index) {
      this.$set(this.formData.activityDetailImgs, 0, {url: this.$Utils.filterImgUrl(url), img: url})
      this.handleCreateSubactivityAjax()
    },

    /**
     * 子列表改变
     */
    subactivityChange (arr, index) {
      if (!arr.length) {
        this.formData.activityListData.forEach((row) => {
          if (row.sort === index) {
            row.url = ''
            row.columnLogo = ''
            row.img = ''
          }
        })
      }
    },

    /**
     * 内部链接改变
     */
    internalLinkChange (results) {
      Object.assign(this.internalLinkData, results)
      this.formData.relationUrl = results.relationUrl
    },

    /**
     * 活动主图切换
     */
    activityListChange (index) {
      this.$refs['main-form'].clearValidate()
      this.currentSubactivityIndex = index
      this.handleResetData()

      this.currentSubactivityList.forEach((row) => {
        if (row.sort === index) this.handleFillData(row)
      })
      localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
    },

    /**
     * 清空主图数据
     */
    handleResetData () {
      this.formData.activityDetailImgs = []
      this.formData.subactivityId = ''
      this.formData.specialAreaId = ''
      this.specialAreaList = []

      this.formData.linkType = ''
      this.formData.relationLink = ''

      this.formData.relationUrl = ''
      this.internalLinkData.grandNode = ''
      this.internalLinkData.parentNode = ''
      this.internalLinkData.childNode = ''
      this.formData.subactivityName = ''
    },

    /**
     * 填充数据
     */
    handleFillData (item) {
      this.formData.relationType = parseInt(item.columnType)
      this.formData.linkType = parseInt(item.linkType)
      this.formData.backgroundColor = item.backgroundColor     // 选择背景色
      this.formData.listNum = item.colShowNum                  // 列表类型取对应子集中的

      if (parseInt(item.linkType) === 1) {
        this.formData.relationUrl = item.relateUrl
      } else {
        this.formData.relationLink = item.relateUrl
      }

      this.formData.subactivityName = item.columnName
      if (item.activityType === 2 && parseInt(item.themeConfigType) === 0) {
        this.formData.themeConfigType = 1
      } else {
        if (item.activityType === 1) {
          this.formData.themeConfigType = item.themeConfigType || 0
        } else {
          this.formData.themeConfigType = item.themeConfigType || 1
        }
      }

      // 内部链接
      this.internalLinkData.grandNode = item.grandNode ? parseInt(item.grandNode) : ''
      this.internalLinkData.parentNode = item.parentNode ? parseInt(item.parentNode) : ''
      this.internalLinkData.childNode = item.childNode ? parseInt(item.childNode) : ''

      this.formData.subactivityId = item.id
      this.getSpecialAreaData()

      if (item.mainImage) {
        let copyData = this.$Utils.deepCopy(item)
        copyData.img = copyData.mainImage
        copyData.url = this.$Utils.filterImgUrl(copyData.mainImage)
        this.formData.activityDetailImgs = [copyData]
      }
    },

    /**
     * 失去焦点排序
     */
    handleBlurSort (item) {
      if (!item.sort || isNaN(item.sort) || item.sort < 0) return false
      this.$http.post('@ROOT_API/column/updateColumnGoodsSort', {
        goodsColumnList: [
          {
            goodsColumnId: item.goodsColumnId,  // 是 int 栏目商品ID
            goodsId: item.goodsId,              // 是 int 商品Id
            sort: item.sort                     // 是 int 排序id
          }
        ]
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
     * 内容改变
     */
    contentChange () {
      this.isEdited = true
    },

    /**
     * 跳转链接
     */
    handleLink (item) {
      // if (this.isEdited) {
      //   this.$message({
      //     message: '内容已修改，请先保存',
      //     duration: 2000,
      //     type: 'error'
      //   })
      //   this.isEdited = false
      //   return false
      // }
      this.$router.push({path: '/admin/goods/activity/details', query: {id: item.goodsId}})
    },

    /**
     * 关联前操作
     */
    handleRelationBefore () {
      this.relationVisible = true
      this.relationGoodsKey = new Date().getTime()
    },

    /**
     * 取消分享前操作
     */
    handleCancelGoodsBefore (row) {
      this.cancelVisible = true
      this.cancelData = row ? [row] : this.tableSelectRes
    },

    /**
     * 取消分享
     */
    handleCancelGoods () {
      let ids = this.cancelData.map(row => row.id)
      this.cancelLoading = true
      this.$http.get('@ROOT_API/column/delColGoods', {
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
        this.cancelData.forEach((row) => {
          this.formData.goodsList.forEach((list, index) => {
            if (row.id === list.id) this.formData.goodsList.splice(index, 1)
          })
        })
        this.cancelVisible = false
      }).finally(() => {
        setTimeout(() => {
          this.cancelLoading = false
        }, 500)
      })
    },

    /**
    * 文件上传前的格式和大小校验
    */
    beforeAvatarUpload (file) {
      const pattern = /(jpg|jpeg|png)$/ig
      const isLegalPhoto = pattern.test(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLegalPhoto) {
        this.$message.error('上传图片的格式不合法，请重新上传')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLegalPhoto && isLt2M
    },

    /**
     * 上传数量超过最大限制数量
     */
    exceedHandle (files, fileList) {
      this.$message({
        message: '最多只能上传1个图标',
        type: 'error'
      })
    },

    /*
     * 图片上传成功
     */
    uploadSuccessHandle (res) {
      if (parseInt(res.status) !== 1) {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
        return false
      }
      this.formData.activeImgList.push({url: this.$Utils.filterImgUrl(res.data)})
      this.formData.activeImg = res.data
    },

    /**
     * 图片预览
     */
    pictureCardPreviewHandle (file) {
      window.open(file.url, '_blank')
    },

    /**
     * 图片被移除
     */
    removeHandle (file, fileList) {
      this.formData.activeImgList = []
      this.formData.activeImg = ''
    },
    /**
     * 主题配置改变
     */
    changeThemConfigType (item) {
      this.formData.themeConfigType = item.type
      this.formData.backgroundColor = this.formData.themeConfigType === 0 ? '#008000' : this.formData.themeConfigType === 1 ? '#800080' : ''
    }
  },

  watch: {
    'formData.themeConfigType': {
      handler (val) {
       // this.formData.backgroundColor = val === 0 ? '#008000' : '#800080'
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.goods-activity-wrap{

  .el-form-item::after, .el-form-item__content::after{
    clear: inherit;
  }

  .main{
    .el-input{
      width: 400px;
    }

    .el-table{
      .el-input{
        width: auto;
      }

      .sort-wrap{
        .el-icon.disabled{
          color: rgba(0, 0, 0, .2);
          cursor:pointer ;
        }
      }
    }

    .input-auto-wrap{
      .el-input{
        width: auto;
      }
    }

    .activity-title{
      color: #666;
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      padding-left: 10px;
    }
  }

  /* -------------------- { 侧边栏 } -------------------- */
  .slide-wrap{
    width: 300px;
    left: 0;
    top: 0;

    .btn-add{
      color: #56ade8;
      font-size: 24px;
    }

    /* -------------------- { 自定义布局 } -------------------- */
    .list-wrap{
      padding: 15px 20px 5px 20px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, .1);
      
      .list{
        color: #999;
        height: 30px;
        line-height: 30px;
        font-size: 17px;
        padding: 0 10px 0 30px;
        margin: 0 0 26px 0;
        background: #eee;
        border-radius: 10px;

        .icon-eye{
          fill: rgba(0, 0, 0, .15);
          width: 18px;
          height: 18px;
          margin-top: -9px;
          left: 150px;
          left: 8px;
          top: 50%;
        }

        .btns-wrap{
          .btn{
            width: 18px;
            height: 18px;
            font-size: 17px;
            margin-left: 5px;
            cursor: pointer;
          }

          .btn.move{
            i{
              color: #999;
            }

            i:hover{
              color: #56ade8;
            }

            i.disabled{
              color: rgba(0, 0, 0, .1) !important;
              cursor: not-allowed;
            }
          }

          .btn:hover{
            color: #56ade8;
          }
        }

        .name{
          width: 130px;
          font-size: 16px;
        }

        .line{
          height: 1px;
          background: #eee;
          bottom: -13px;
          left: 0;
        }
      }

      .list.active{
        color: #56ade8;
        background: #d0e8f9;
        box-shadow: 2px 2px 6px rgba(0, 160, 233, .1);

        .move{
          i{
            color: #56ade8 !important;
          }
        }

        .icon-eye{
          fill: #56ade8;
        }
      }
    }
  }

  .top-wrap{

    .title{
      font-size: 16px;
      margin-bottom: 20px;
    }

    .shadow-wrap{
      padding: 20px 20px 1px 20px;
      margin-bottom: 20px;
      box-shadow: 0 0 5px rgba(0, 0, 0, .1);
    }
  }

  /* -------------------- { 显示数量 } -------------------- */
  .box-wrap{
    width: 48px;
    line-height: 0;
    font-size: 0;
    margin-right: 20px;

    .box{
      border: 1px solid #b9b9b9;
      background: #f9f9f9;
    }
    
    .box{
      display: inline-block;
      vertical-align: top;
    }
  }

  .box-wrap.active{
    .box{
      border-color: #56ade8;
    }
  }

  .box-wrap{
    .full-w{
      height: 12px;
    }

    &.theme1{
      .full-w{
        height: 20px;
      }
    }

    &.theme1, &.theme2{
      .box.rectangle{
        width: 10px;
        height: 10px;
        margin: 5px 2px 0 2px;
        background: #fff;
      }
    }

    &.theme2{
      .box.rectangle{
        margin-top: 4px;
      }
    }

    &.theme3{
      width: 40px;
      .full-w{
        height: 10px;
      }

      .box.rectangle{
        width: 12px;
        height: 12px;
        margin: 3px 3px 0 3px;
      }
    }

    &.theme4{
      width: 72px;

      .full-w{
        height: 10px;
      }

      .box.rectangle{
        width: 14px;
        height: 14px;
        margin: 0 8px 8px 0;
      }

      .box:nth-child(4), .box:nth-child(5){
        margin-bottom: 0;
      }

      .box:last-child{
        width: 36px;
      }
    }

    &.theme5{
      width: 68px;

      .full-w{
        height: 10px;
      }

      .box.rectangle{
        width: 26px;
        height: 8px;
        margin: 0 6px 3px 0;
      }

      .box:first-child{
        width: 60px;
        height: 12px;
      }
    }

    &.theme55 {
      width: 60px;
      .full-w{
        height: 12px;
      }

      .box.rectangle{
        width: 60px;
        height: 10px;
        margin-top: 3px;
        border-radius: 4px;
      }
    }

    &.theme6 {
      width: 60px;
      .full-w{
        width: 53px;
        height: 39px;
        border-radius: 3px;
      }
    }
  }

  .special-area-btn{
    .btn{
      color: #666;
      font-size: 16px;
      margin-left: 10px;
    }

    .btn:hover{
      color: #00a1e9;
    }

    .btn:last-child:hover{
      color: red;
    }
  }

  .activity-status-radio{
    .el-radio{
      margin: 0;
    }
    .el-radio:first-child{
      margin-right: 15px;
    }
  }

  .thumbnail-list{
    border: 1px solid #fff;
    padding: 8px;
    border-radius: 6px;
    box-sizing: border-box;
  }

  .thumbnail-list.active{
    border: 1px solid rgba(0, 160, 233, .8);
    overflow: hidden;
    vertical-align: top;
    box-shadow: 0 0 10px rgba(0, 160, 233, .2);
  }

  /* -------------------- { 主题配置 } -------------------- */
  .theme-config-list{
    max-width: 100px;
    border: 1px solid #fff;
    padding: 10px;
    margin-right: 5px;
    box-sizing: border-box;
    border-radius: 6px;

    dt{
      height: 130px;
    }

    dd{
      color: #666;
      line-height: 16px;
      padding-top: 10px;
    }
  }

  .theme-config-list.active{
    border-color: rgba(0, 160, 233, .8);
    box-shadow: 0 0 10px rgba(0, 160, 233, .2);
    
    dd{
      color: rgba(0, 160, 233, 1);
    }
  }

}
</style>
