<!-- 商品配置 -->
<template>
  <common-tpl class="luckybuy-index-wrap" footer>
    <template slot="main" >
      <el-form :model="formData" ref="formData" label-width="120px" v-loading="loading">

        <!--  -->
        <div class="commodity-details pos-r" >
          <el-form-item label=" 分区管理：" prop="themeName" required>
            <div class="partition-list-wrap">
              <div class="partition-list-box">
                <div class="item-list" :style="{width: groupList.length * 120 + 'px', 'margin-left': -columnPage * 120 * 5 + 'px'}">
                  <div class="item" v-for="(item, index) in groupList" >
                    <div class="partition-name ta-c" @click="changePartition(item)"  :class="{'border-left': index % 5 === 0, select: formData.goodsGroupId === item.groupId}" >{{item.groupName}}</div>
                    <div class="btns-wrap ta-c" @click.stop.prevent=""  :class="{select: formData.goodsGroupId === item.groupId && item.groupSort !== 0}">
<!--                    <span class="cursor-p va-m btn" style="min-width: 50px" title="上移" :class="{disabled: index === 0}" @click.stop.prevent="handleSort('prev', index)">
                      <i class="el-icon-caret-left"></i>
                    </span>-->
                      <span class="cursor-p va-m btn" style="min-width: 50px" title="编辑" @click="handlePartitionBefore(item)">
                      <i class="el-icon-edit"></i>
                    </span>
                      <span class="cursor-p va-m btn" title="删除" @click.stop.prevent="handleDeletePartitionBefore(item)">
                      <i class="el-icon-delete"></i>
                    </span>
<!--                      <span class="cursor-p va-m btn" style="min-width: 50px" title="下移" :class="{disabled: index === groupList.length - 1}" @click.stop.prevent="handleSort('next', index)">
                      <i class="el-icon-caret-right"></i>
                    </span>-->
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
<!--          <el-form-item label="主题名称：" prop="themeName" :rules="{required: true, message: '不能为空', trigger: 'change'}">
            <el-input v-model="formData.themeName" placeholder="限50个字符以内" maxlength="50"></el-input>
          </el-form-item>-->
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
          <el-form-item label="抢购限制：" v-if="formData.goodsGroupId !== 1" prop="grabLimit" class="data-error ml-0" :rules="[{required: true, message: '不能为空', trigger: 'blur'}]">
            <el-radio-group v-model="formData.grabLimit" @change="grabLimitChange">
              <el-radio :label="0">不限</el-radio>
              <el-radio :label="1">使用拼团规则限制</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.goodsGroupId !== 1 && formData.grabLimit === 1" label="开仓排期：" prop="" class=" ml-0">
            <el-row :type="openSchedule === 2 ? '' : 'flex'" align="middle">
              <el-radio-group v-model="openSchedule">
                <el-radio :label="2" :disabled="parseInt(formData.grabLimit) === 1">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
              <el-form-item label="" class="ml-10" prop="scheduleDate" >
                <el-date-picker
                  v-if="formData.goodsGroupId !== 1 && openSchedule === 1"
                  v-model="formData.scheduleDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="scheduleDateChange">
                </el-date-picker>
              </el-form-item>
              <el-button type="primary" v-if="formData.goodsGroupId !== 1 && openSchedule === 1" class="ml-10" @click="handleSchedulingbefore">生成排期</el-button>
              <el-button type="primary" v-if="formData.goodsGroupId !== 1 && openSchedule === 1" class="ml-10" @click="handleSchedulingInfo">查看排期</el-button>
            </el-row>
          </el-form-item>
        </div>

        <!-- 商品设置 -->
        <gray-title title="商品设置">
          <el-button v-if="groupRowData.groupSort === 0" slot="right" size="small" type="primary" round style="margin-top: -15px; right: 7px; top: 50%;" class="pos-a" @click="relationVisible = true"><i class="el-icon-plus"></i> 添加抢购商品</el-button>
        </gray-title>
        <br/>

        <el-table border :data="formData.themeGoodsList" class="full-w">
          <el-table-column prop="" label="商品图片" min-width="80" fixed>
            <template slot-scope="scope">
              <thumbnail-component :list="[{url: scope.row.mainImage}]" :size="50"></thumbnail-component>
            </template>
          </el-table-column>
          <el-table-column prop="" label="商品编码" min-width="100" fixed>
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.goodsNo | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="商品名称" min-width="200">
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.goodsName | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="销售价" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.goodsPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="进货价" min-width="120px">
            <template slot-scope="scope">
              <div style="padding-right: 10px">{{scope.row.buyingPrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="抢购价" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.purchasePrice | filterMoney | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="抢购状态" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.grabStatus === 1 ? '开启' : scope.row.grabStatus === 2 ? '待售' :  scope.row.grabStatus === 0 ? '关闭' : '--'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="当天剩余抢购数/当天抢购数" width="220px">
            <template slot-scope="scope">
              <div>
                <span style="padding-right: 10px">{{scope.row.grabNumLast + '/' + scope.row.grabNumNowTotal}}</span>
                <el-tooltip class="item" effect="dark" content="修改当天抢购数" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, dialogType = 1)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
         <!-- <el-table-column prop="goodsPrice" label="系统抢购数"  min-width="120px">
            <template slot-scope="scope">
              <div>
                <span style="margin-right: 10px;">{{scope.row.purchaseNumTotal | filterMoney | filterEmpty}}</span>
                <el-tooltip class="item" effect="dark" content="修改系统抢购数" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, isAll = true)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>-->
          <el-table-column prop="" label="已抢购数量/累计抢购总数" min-width="200px">
            <template slot-scope="scope">
             <!-- <el-row type="flex" justify="" align="middle">-->
                <el-progress :percentage="getPercentGrab(scope.row)" color="rgba(255, 153, 0, 1)" :show-text="false" style="width: 80%;"></el-progress>
                <div style="margin-left: 10px;">{{scope.row.grabNumHas + '/' + scope.row.grabNumTotal}}</div>
            <!--  </el-row>-->
            </template>
          </el-table-column>
          <el-table-column prop="" label="批发状态" min-width="120px">
            <template slot-scope="scope">
              <div>{{scope.row.purchaseStatus === 1 ? '开启' : '关闭'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="当天剩余批发数/当天批发数" width="220px">
            <template slot-scope="scope">
              <div>
                <span style="padding-right: 10px">{{scope.row.purchaseNumLast + '/' + scope.row.purchaseNumNow}}</span>
                <el-tooltip class="item" effect="dark" content="修改当天批发数" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, dialogType = 2)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="批发总数" min-width="120px">
            <template slot-scope="scope">
              <div>
                <span style="padding-right: 10px">{{scope.row.purchaseNumTotal === null ? '--' : scope.row.purchaseNumTotal}}</span>
                <el-tooltip class="item" effect="dark" content="修改批发总数" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, dialogType = 3)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="purchaseNumHas" label="已批发数" min-width="120px">
            <template slot-scope="scope">
              <span style="padding-right: 10px">{{scope.row.purchaseNumHas === null ? '--' : scope.row.purchaseNumHas}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="goodsGroupPrice" label="挂售被抢购数/已挂售数" min-width="200px">
            <template slot-scope="scope">
              <!-- <el-row type="flex" justify="" align="middle">-->
              <el-progress :percentage="getPercentHand(scope.row)" color="rgba(255, 153, 0, 1)" :show-text="false" style="width: 80%;"></el-progress>
              <div style="margin-left: 10px;">{{scope.row.hangGrabNum + '/' + scope.row.hangNumHas}}</div>
              <!--  </el-row>-->
            </template>
          </el-table-column>
<!--          <el-table-column prop="goodsPrice" label="活动状态" width="90px">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.ifEnable"
                @change="disseminateTypeChange(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>-->
<!--          <el-table-column prop="goodsPrice" label="开始时间" width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.startDate | filterDate | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="goodsPrice" label="结束时间" width="160px">
            <template slot-scope="scope">
              <div>{{scope.row.endDate | filterDate | filterEmpty}}</div>
            </template>
          </el-table-column>-->

          <el-table-column prop="" label="当天抢购数Redis" min-width="140px">
            <template slot-scope="scope">
              <div>
                <span style="padding-right: 10px">{{scope.row.grabNumNowRedis === null ? '--' : scope.row.grabNumNowRedis}}</span>
                <el-tooltip class="item" effect="dark" content="当天抢购数Redis" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, dialogType = 4)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="当天批发数Redis" min-width="140px">
            <template slot-scope="scope">
              <div>
                <span style="padding-right: 10px">{{scope.row.purchaseNumNowRedis === null ? '--' : scope.row.purchaseNumNowRedis}}</span>
                <el-tooltip class="item" effect="dark" content="当天批发数Redis" placement="top">
                  <i class="el-icon-plus" @click="updateNum(scope.row, dialogType = 5)" style="cursor: pointer;"></i>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="排序" min-width="120">
            <template slot-scope="scope">
              <div class="pos-r sort-wrap" style="padding-right: 20px;">
                <el-form-item class="d-ib margin-none" :prop="'themeGoodsList.' + scope.$index + '.sort'" :rules="ruleSort" label-width="0">
                  <el-input size="medium" min="0" maxlength="3" v-model="scope.row.sort" @change="contentChange" ></el-input>
                </el-form-item>
                <span style="width: 14px; height: 35px; position: absolute; right: 5px; top: 0px;">
                  <i class="pos-a el-icon el-icon-caret-top" :class="{'cursor-p': scope.$index !== 0}" @click="handleSortUp(scope.$index)" :disabled="scope.$index !== 0"></i>
                  <i class="pos-a el-icon el-icon-caret-bottom" style="bottom: 0;" :class="{'cursor-p': scope.$index !== formData.themeGoodsList.length - 1}" @click="handleSortDown(scope.$index)" :disabled="scope.$index !== formData.themeGoodsList.length - 1"></i>
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
                  <el-dropdown-item >
                    <div @click="handleLink(scope.row, 'setting', false)"><i class="icon el-icon-setting"></i>设置</div>
                  </el-dropdown-item>
                 <!-- <el-dropdown-item >
                    <div @click="handleLink(scope.row, 'settingDetail', true)"><i class="icon el-icon-setting"></i>查看设置</div>
                  </el-dropdown-item>-->
<!--                  <el-dropdown-item >
                    <div @click="handleUpdateTimeBefore(scope.row)"><i class="icon el-icon-setting"></i>修改时间</div>
                  </el-dropdown-item>-->
                  <el-dropdown-item >
                    <div @click="handleLink(scope.row, 'details')"><i class="icon el-icon-view"></i>详情</div>
                  </el-dropdown-item>
                  <el-dropdown-item >
                    <div @click="handleLink(scope.row, 'switch')"><i class="icon el-icon-view"></i>切换分区</div>
                  </el-dropdown-item>
<!--                  <el-dropdown-item >
                    <div @click="handleDeleteBefore(scope.row)" class="orange"><i class="icon el-icon-delete"></i>取消</div>
                  </el-dropdown-item>-->
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
          v-if="pageData.total"
        >
        </el-pagination>
      </el-form>
    </template>
    <template slot="other">
      <el-dialog :title="dialogType === 1 ? '当天抢购数' : dialogType === 2 ? '当天批发数' : dialogType === 3 ? '当前批发总数' : dialogType === 4 ? '当天抢购数Redis' : '当天批发数Redis'" :visible.sync="dialogTableVisible" width="750px" class="dialog-data" @close="resetForm('form')">
        <el-form :model="form"  ref="form" label-width="180px" labelPosition="right">
          <el-form-item label="当前抢购数：" v-if="dialogType === 1">
            <!--<span>系统：{{rowData.grabNumNowSys}}</span>-->
            <span>{{rowData.grabNumNow}}</span>
<!--            <el-row type="flex">
              <el-input placeholder="" v-model="rowData.grabNumNowSys" disabled>
                <template slot="prepend">系统</template>
              </el-input>
              <el-input placeholder="" v-model="rowData.grabNumNow" disabled>
                <template slot="prepend">用户</template>
              </el-input>
            </el-row>-->
          </el-form-item>
          <el-form-item label="当前批发数：" v-if="dialogType === 2">
            {{rowData.purchaseNumNow}}
          </el-form-item>
          <el-form-item label="当前批发总数：" v-if="dialogType === 3">
            {{rowData.purchaseNumTotal}}
          </el-form-item>
          <el-form-item label="当天抢购数Redis：" v-if="dialogType === 4">
            {{rowData.grabNumNowRedis}}
          </el-form-item>
          <el-form-item label="当天批发数Redis：" v-if="dialogType === 5">
            {{rowData.purchaseNumNowRedis}}
          </el-form-item>
<!--          <template v-if="dialogType === 1">
            <el-form-item label="系统抢购数：" prop="grabNumNowSys"  :rules="updateNumber">
              <el-input size="medium" min="0" maxlength="4" v-model="form.grabNumNowSys" placeholder="限0-1000正整数" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="用户抢购数：" prop="grabNumNow"  :rules="updateNumber">
              <el-input size="medium" min="0" maxlength="4" v-model="form.grabNumNow" placeholder="限0-1000正整数" style="width: 200px;"></el-input>
            </el-form-item>
          </template>-->
          <template>
            <el-form-item label="新增数量：" prop="updateNumber"  :rules="updateNumber">
              <el-input size="medium" min="0" :maxlength="dialogType < 4 ? '4' : '5'" v-model="form.updateNumber" :placeholder="dialogType < 4 ? '限0-1000正整数' : '限-1000-1000整数'" style="width: 200px;"></el-input>
            </el-form-item>
          </template>
         <!-- <el-form-item label="新增名额：" prop="purchaseNumTotal"  v-if="isAll"  :rules="purchaseNumTotal">
            <el-input size="medium" min="0" maxlength="7" v-model="form.purchaseNumTotal" placeholder="限0-1000000正整数" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="调整成：" prop="purchaseNumNow"  v-if="!isAll" :rules="purchaseNumNow">
            <el-input size="medium" min="0" maxlength="7" v-model="form.purchaseNumNow" placeholder="限0-1000000正整数" style="width: 200px;"></el-input>
            <span style="margin-left: 10px;color: #999999;">不允许低于当前名额</span>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" :loading="dialogLoading" @click="submitUpdateNum('form')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="删除分区" :visible.sync="deletePartitionVisible" width="540px" @close="">
        <p v-if="groupHasNum === 0">确认是否删除“{{deleteDialogData.groupName}}”？</p>
        <p v-else>该区存在商品不允许删除！请将商品移除后进行操作。</p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deletePartitionVisible = false">{{groupHasNum === 0 ? '取 消' : '返 回'}}</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDeletePartition" v-if="groupHasNum === 0">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="生成排期" :visible.sync="beingSchedulingVisible" width="540px" @close="">
        <p>排期时间： <span class="color-red">{{schedulingInfo}}</span></p><br/>
        <p>确认是否生成排期？排期一旦生成，将无法进行修改！</p>
        <span slot="footer" class="dialog-footer">
        <el-button @click="beingSchedulingVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleBeingScheduling">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="查看排期" :visible.sync="schedulingVisible" max-width="560px" @close="">
        <el-table border :data="scheduleData" class="full-w" max-height="525">
          <el-table-column prop="" label="排期" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.periodNumChinese | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="生成时间" min-width="160">
            <template slot-scope="scope">
              <div>{{scope.row.createTime | filterDate}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="周期（天）" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.periodDayNum | filterEmpty}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="开始时间" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.beginTime | filterDate}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="结束时间" min-width="140">
            <template slot-scope="scope">
              <div>{{scope.row.endTime | filterDate}}</div>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="schedulingVisible = false">关闭</el-button>
        </span>
      </el-dialog>

      <el-dialog title="取消抢购" :visible.sync="deleteVisible" width="480px">
        <br>
        <span>取消商品抢购状态？</span>
        <br>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleDelete">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="切换分区" :visible.sync="switchVisible" width="500px" class="dialog-data">
        <el-form :model="rowData" label-width="120px" ref="" labelPosition="right">
          <el-form-item label="商品名称：" prop="goodsName" >
            {{rowData.goodsName}}
          </el-form-item>
          <el-form-item label="切换至分区：" class="" :rules="[{required: true, message: '不能为空', trigger: 'change'}]">
            <el-select v-model="rowData.goodsGroupId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="switchVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleSwitchDone">确 定</el-button>
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

      <el-dialog title="修改时间" :visible.sync="updateTimeVisible" width="600px">
        <el-form :model="form" ref="form" label-width="120px" labelPosition="center">
          <el-form-item label="活动时间：" prop="date" :rules="[{required: true, type: 'array', message: '不能为空', trigger: 'change'}]">
            <el-date-picker type="datetimerange" start-placeholder="年/月/日" end-placeholder="年/月/日" v-model.trim="form.date" clearable @change="statisticsDateChange"></el-date-picker>
            <!-- <el-row type="flex">
               <el-form-item prop="beginTime">
                 <el-date-picker type="datetime" placeholder="选择开始时间" v-model="formData.beginTime" style="width: 100%;"></el-date-picker>
               </el-form-item>
               <span style="padding: 0 20px;">至</span>
               <el-form-item prop="endTime">
                 <el-date-picker type="datetime" placeholder="选择结束时间" v-model="formData.endTime" style="width: 100%;"></el-date-picker>
               </el-form-item>
             </el-row>-->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="updateTimeVisible = false">取 消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="handleUpdateTime('form')">确 定</el-button>
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
      // 校验 0-1000正整数
      let validateInt = (rule, value, callback) => {
        if (value === '' || value === null) return callback(new Error('不能为空'))
        if (this.dialogType < 4 && value && (isNaN(value) || value < 0 || value > 1000 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限0-1000正整数'))
        if (this.dialogType > 3 && value && (isNaN(value) || value < -1000 || value > 1000)) return callback(new Error('限-1000-1000正整数'))
        callback()
      }
      // 校验排序
      let validateSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 0 || value > 255 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制0~255正整数'))
        callback()
      }

      // 校验分区排序
      let validateGroupSort = (rule, value, callback) => {
        if (value && (isNaN(value) || value < 1 || value > 100 || !value.toString().match(/^\d{0,10}$/gi))) return callback(new Error('限制1~100正整数'))
        callback()
      }
      return {
        schedulingInfo: '',   //           排期信息
        groupList: [],     // 分区数据
        columnPage: 0,     // 分区页码
        groupHasNum: '',   // 分区倗有的商品数量
        deleteDialogData: {},   // 删除分区前保存数据
        addForm: {   // 添加分区数据
          groupName: '',
          groupId: '',
          groupStatus: 2,
          groupSort: '',
          groupType: 8
        },
        loading: true,
        dialogTableVisible: false,
        schedulingVisible: false,       // 查看排期窗口
        beingSchedulingVisible: false,  // 生成排期窗口
        confirmLoading: false,  // 确定loading
        pageType: 1,            // 页面类型 [1、新增 2、编辑]
        moduleType: 1,          // 模块类型 [1、分享商品 2、芯豆专区 3、消费积分兑换区 4、联盟积分兑换区]
        isOperate: false,       // 判断是否是运营模块
        formData: {
          scheduleDate: [],       // 生成排期时间
          disseminateType: null,            // 主题状态
          buySourceId: '',       // 素材
          grabLimit: '',       // 抢购限制
          id: '',               // 主题id
          themeType: 8,         // 主题类型
          goodsGroupId: '',      // 分区ID  默认区： 1
          themeName: '',        // 品牌名称
          purchaseDes: '',      // 收益说明
          themeImage: '',        // ..
          themePresent: '-',      // ..
          themeBackdrop: '',     // ..
          sort: '',
          themeGoodsList: [],         // 商品列表
          imgs: []               // 图片
        },
        openSchedule: 2,                   // 开仓排期
        img100: {width: '100px', height: '100px'}, // 图片大小
        disabled: {color: '#aaa', cursor: 'not-allowed'},
        form: {
          purchaseNumNow: '',
          purchaseNumTotal: '',
          grabNumNowSys: '',  // 系统
          grabNumNow: '',   // 用户
          updateNumber: '',
          date: []
        },
        ruleSort: [{validator: validateSort, trigger: 'blur'}],   // 商品排序
        groupSort: [
          {required: true, message: '不能为空', trigger: 'blur'},
          {validator: validateGroupSort, trigger: 'blur'}
        ],  // 分区排序
      //  purchaseNumNow: [{required: true, validator: validateInt, trigger: 'blur'}],
      //  purchaseNumTotal: [{required: true, validator: validateInt, trigger: 'blur'}],
        updateNumber: [{required: true, validator: validateInt, trigger: 'blur'}],
        groupRowData: {},       // 当前 分区数据
        copyFormData: {},       // 拷贝表单数据
        relationVisible: false, // 关联商品弹窗
        relationListData: [],   // 关联数据
        tableData: [],          // 列表
        scheduleData: [],       // 查看排期列表
        materialListData: [],   // 素材列表
        dialogLoading: false,   // 弹窗loading
        deleteVisible: false,   // 取消分享弹窗
        switchVisible: false,   // 切换分区弹窗
        deletePartitionVisible: false,   // 删除弹窗
        addVisible: false,     // 添加分区弹窗
        updateTimeVisible: false,   // 取消分享弹窗
        rowData: {},         // 取消分享数据
        isEdited: false,        // 是否编辑
        dialogType: 1,           // [1 2 3,4,5]
        pageData: {       // 分页
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        userInfo: {}            // 用户信息
      }
    },

    computed: {

    },

    mounted () {
      this.copyFormData = this.$Utils.deepCopy(this.formData)
      this.userInfo = JSON.parse(localStorage.getItem(this.$global.USER_INFO))
      // 判断是否同一模块，带出搜索记录
    //  this.$Utils.filterSearchData('warehouse/setting/index', (res) => {
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
      grabLimitChange (val) {
        if (val === 1) this.openSchedule = 1
      },
      scheduleDateChange (val) {
        if (!val) {
          this.formData.scheduleDate = null
        } else {
          this.formData.scheduleDate = val
        }
      },
      statisticsDateChange (val) {
        if (val) {
          this.form.startDate = val[0].getTime()
          this.form.endDate = val[1].getTime()
        }
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
       //   let results = resData.data
        // let findObj = results.filter((row) => row.themeType === this.formData.themeType)[0]
        // if (findObj) {
        //   //  this.formData.themeId = findObj.id
        //   this.getListData()
        // }
        })
      },
      updateNum (row) {
       // console.log(row)
        this.rowData = row
        this.dialogTableVisible = true
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
          this.formData.grabLimit = results.grabLimit
          this.openSchedule = results.grabLimit === 1 ? 1 : 2
         // if (results.periodBeginTime && results.periodEndTime) {
         //   this.formData.scheduleDate = [results.periodBeginTime, results.periodEndTime]
         // } else {
         //   this.formData.scheduleDate = []
         // }
          this.formData.scheduleDate = null
          if (results.themeImage) {
            this.formData.imgs = [{url: this.$Utils.filterImgUrl(results.themeImage), imageUrl: results.themeImage}]
          } else {
            this.formData.imgs = []
          }
         // results.goodsList.forEach((row) => {
         //   row.ifEnable = (parseInt(row.ifEnable) === 1) ? !!true : !!false
         // //  row.ifEnable = (parseInt(row.ifEnable) === true) ? !!true : !!false
         // })
          this.addRelationData(results.goodsListPage.list, true)
          this.groupList = results.groupListPage.list
          if (!this.groupRowData.groupSort) {
            this.groupRowData.groupSort = results.groupListPage.list[0].groupSort
          }
          if (!this.formData.goodsGroupId) {
            this.formData.goodsGroupId = results.groupListPage.list[0].groupId
          }
        //  this.formData.goodsGroupId = this.formData.goodsGroupId || results.groupListPage.list.length && results.groupListPage.list[0].groupId
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
        this.pageChange(1)
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
       * 价格输入框自动补全价格
       */
      inpBlur (obj) {
        this.$Utils.blurAutoCompletion(this.formData, obj)
      },
      /**
       * 已抢购数量/累计抢购总数
       */
      getPercentGrab (row) {
      //  console.log(row.grabNumHas)
        if (row.grabNumHas === 0 || row.grabNumHas === null || row.grabNumTotal === 0 || row.grabNumTotal === null) {
          return 0
        } else if (row.grabNumHas !== 0 && row.grabNumHas !== null && row.grabNumHas !== undefined && row.grabNumTotal !== 0 && row.grabNumTotal !== null && row.grabNumTotal !== undefined) {
          if (row.grabNumHas > row.grabNumTotal) {
            return 100
          } else {
            return (row.grabNumHas / row.grabNumTotal) * 100
          }
        }
      },
      /**
       * 挂售被抢购数/已挂售数
       */
      getPercentHand (row) {
        if (row.hangGrabNum === 0 || row.hangGrabNum === null || row.hangNumHas === 0 || row.hangNumHas === null) {
          return 0
        } else if (row.hangGrabNum !== 0 && row.hangGrabNum !== null && row.hangNumHas !== 0 && row.hangNumHas !== null) {
          if (row.hangGrabNum > row.hangNumHas) {
            return 100
          } else {
            return row.hangGrabNum / row.hangNumHas * 100
          }
        }
      },

      /**
       * 提交表单验证
       */
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          this.confirmLoading = true
          this.formData.disseminateType === 1 ? this.formData.buySourceId = '' : this.formData.disseminateType === 2 ? this.formData.themeImage = '' : ''
          if (!this.formData.scheduleDate) {
            this.formData.periodBeginTime = null
            this.formData.periodEndTime = null
          } else {
            this.formData.periodBeginTime = this.formData.scheduleDate[0].getTime()
            this.formData.periodEndTime = this.formData.scheduleDate[1].getTime()
          }
          this.$http.post('@ROOT_API/shareTheme/edit', this.formData).then((res) => {
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
        let temp = this.formData.themeGoodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.themeGoodsList[index - 1].sort
        this.formData.themeGoodsList[index - 1].sort = sort
        this.$set(this.formData.themeGoodsList, index, this.formData.themeGoodsList[index - 1])
        this.$set(this.formData.themeGoodsList, index - 1, temp)
      },

      /**
       * 向下移动
       */
      handleSortDown (index) {
        this.isEdited = true
        let temp = this.formData.themeGoodsList[index]
        let sort = temp.sort
        temp.sort = this.formData.themeGoodsList[index + 1].sort
        this.formData.themeGoodsList[index + 1].sort = sort
        this.$set(this.formData.themeGoodsList, index, this.formData.themeGoodsList[index + 1])
        this.$set(this.formData.themeGoodsList, index + 1, temp)
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
      handleLink (item, type, flag) {
        if (this.isEdited) {
          this.$message({
            message: '内容已修改，请先保存',
            duration: 2000,
            type: 'error'
          })
          this.isEdited = false
          return false
        } else if (type === 'setting') {
          localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
          let url = '/admin/warehouse/setting/edit'
          this.$router.push({path: url, query: {id: item.id, goodsId: item.goodsId, type: this.formData.themeType}})
        } else if (type === 'settingDetail') {
          localStorage.setItem(this.$global.FORM_DATA, JSON.stringify(this.formData))
          let url = '/admin/warehouse/setting/settingDetail'
          this.$router.push({path: url, query: {id: item.id, goodsId: item.goodsId, type: this.formData.themeType}})
        } else if (type === 'switch') {
          this.switchVisible = true
          this.rowData = item
        } else {
          let url = '/admin/warehouse/setting/details'
          this.$router.push({path: url, query: {id: item.goodsId}})
        }
      },

      /**
       * 取消分享前操作
       */
      handleDeleteBefore (row) {
        this.deleteVisible = true
        this.rowData = row
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
       * 切换分区前操作
       */
      handleSwitchBefore (row) {
        this.switchVisible = true
        this.rowData = row
      },

      /**
       * 保存切换分区操作
       */
      handleSwitchDone () {
        this.dialogLoading = true
        this.$http.post('@ROOT_API/shareTheme/updateGoodsGroup', {
          id: this.rowData.id,
          goodsGroupId: this.rowData.goodsGroupId
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
          this.switchVisible = false
          this.getListData()
        }).finally(() => {
          this.dialogLoading = false
        })
      },

      /**
       * 修改时间前操作
       */
      handleUpdateTimeBefore (row) {
        this.updateTimeVisible = true
        this.form.date = [row.startDate, row.endDate]
        this.form.startDate = row.startDate
        this.form.endDate = row.endDate
        this.rowData = row
      },
      /**
       * 生成排期前操作
       */
      handleSchedulingbefore () {
        if (this.formData.scheduleDate) {
          this.schedulingInfo = this.$Utils.filterDate(this.formData.scheduleDate[0]).substring(0, 10) + '-' + this.$Utils.filterDate(this.formData.scheduleDate[1]).substring(0, 10)
          this.beingSchedulingVisible = true
        } else {
          this.$message({
            message: '请选择排期时间！',
            type: 'error',
            duration: 1500
          })
        }
      },
      /**
       * 生成排期
       */
      handleBeingScheduling () {
        this.dialogLoading = true
        this.$http.get('@ROOT_API/shareTheme/generateGrabPeriod', {
          params: {
            groupId: this.formData.goodsGroupId,
            beginTime: this.$Utils.filterDate(this.formData.scheduleDate[0]).substring(0, 10),
            endTime: this.$Utils.filterDate(this.formData.scheduleDate[1]).substring(0, 10)
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
          this.beingSchedulingVisible = false
        }).finally(() => {
          this.dialogLoading = false
        })
      },
      /**
       * 查看排期
       */
      handleSchedulingInfo () {
        this.$http.get('@ROOT_API/shareTheme/getGrabPeriodList', {
          params: {
            groupId: this.formData.goodsGroupId
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
          this.scheduleData = resData.data
          this.schedulingVisible = true
        }).finally(() => {
          this.loading = false
        })
      },

      /**
       * 修改时间
       */
      handleUpdateTime (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          let currentDate = new Date()
          if (currentDate > this.form.startDate || currentDate > this.form.endDate) {
            this.$message({
              message: '活动时间不能小于今天时间',
              type: 'error',
              duration: 1500
            })
          } else {
            this.dialogLoading = true
            this.$http.post('@ROOT_API/shareTheme/editShareThemeGoodsList', {
              id: this.rowData.id,
              startDate: this.form.startDate,
              endDate: this.form.endDate
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
              this.updateTimeVisible = false
              this.getListData()
            }).finally(() => {
              this.dialogLoading = false
            })
          }
        })
      },
      /**
       * 修改人数操作
       */
      submitUpdateNum (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) return false
          let data = {}
          let totalNum = 0
          if (this.dialogType === 1) {
            data = {
              id: this.rowData.id,
              grabNumNow: parseInt(this.form.updateNumber)
            //  grabNumNowSys: parseInt(this.form.grabNumNowSys)
            }
            totalNum = parseInt(this.form.updateNumber) + parseInt(this.rowData.grabNumNow)
          } else if (this.dialogType === 2) {
            data = {
              id: this.rowData.id,
              purchaseNumNow: parseInt(this.form.updateNumber)
            }
            totalNum = parseInt(this.form.updateNumber) + parseInt(this.rowData.purchaseNumNow)
          } else if (this.dialogType === 3) {
            data = {
              id: this.rowData.id,
              purchaseNumTotal: parseInt(this.form.updateNumber)
            }
            totalNum = parseInt(this.form.updateNumber) + parseInt(this.rowData.purchaseNumTotal)
          } else if (this.dialogType === 4) {
            data = {
              id: this.rowData.id,
              grabNumNowRedis: parseInt(this.form.updateNumber)
            }
          } else if (this.dialogType === 5) {
            data = {
              id: this.rowData.id,
              purchaseNumNowRedis: parseInt(this.form.updateNumber)
            }
          }
          if (totalNum > 1000000 && this.dialogType < 4) {
            this.$message({
              message: '总数累计不能超过1000000！',
              type: 'error',
              duration: 1500
            })
          } else {
            this.dialogLoading = true
            this.$http.post('@ROOT_API/shareTheme/editShareThemeGoodsList', data).then((res) => {
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
              this.dialogTableVisible = false
              this.getListData()
            }).finally(() => {
              setTimeout(() => {
                this.dialogLoading = false
              }, 500)
            })
          }
        })
      },
      filterEmpty (val) {
        return val === null ? '--' : val
      },
      /**
       * 取消分享
       */
      handleDelete () {
        this.dialogLoading = true
        this.$http.get('@ROOT_API/shareTheme/deleteShareThemeGoodsisJoinStatus', {
          params: {
            ids: this.rowData.id
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
          this.formData.themeGoodsList.forEach((row, index) => {
            if (this.rowData.goodsId === row.goodsId) this.formData.themeGoodsList.splice(index, 1)
          })
          this.deleteVisible = false
        }).finally(() => {
          setTimeout(() => {
            this.dialogLoading = false
          }, 500)
        })
      },
      /**
       * 状态改变
       */
      disseminateTypeChange (item) {
        let data = {
          id: item.id,
          ifEnable: item.ifEnable === true ? 1 : 0
        }
        if (item.ifEnable === true && (item.startDate === '' || item.startDate === null || item.startDate === undefined)) {
          this.$message({
            message: '该商品还没有进行设置抢购相关数据，暂时不能进行开始抢购活动！',
            type: 'error',
            duration: 1500
          })
          item.ifEnable = false
        } else {
          this.$http.post('@ROOT_API/shareTheme/editShareThemeGoodsList', data).then((res) => {
            let resData = res.data
            if (parseInt(resData.status) !== 1) {
              this.$message({
                message: resData.msg,
                type: 'error',
                duration: 1500
              })
              return false
            }
            this.getListData()
          })
        }
      },
      /**
       * 编辑器内容改变
       */
      editorChange (value) {
        this.formData.purchaseDes = value
      },
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
        this.groupRowData = item
        this.formData.goodsGroupId = item.groupId
        this.openSchedule = 2
        this.formData.scheduleDate = []
        this.pageChange(1)
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
          this.$router.push({query: {page: this.pageData.currentPage}})
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .luckybuy-index-wrap{

    .ml-10{
      margin-left: 10px;
    }
    .color-red{
      color: red;
    }
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

    .el-form-item__error{
     /* left: 160px;*/
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
