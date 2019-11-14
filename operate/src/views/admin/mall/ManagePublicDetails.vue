<!-- 共用详情页 -->
<template>
  <common-tpl class="manage-public-detail-wrap">
    <!-- 主体内容 -->
    <template slot="main">
      <div class="goods-common-details">
        <h2 class="title">会员信息</h2>
        <table>
          <tr>
            <td>会员手机：</td>
            <td>{{storeData.account}}</td>
          </tr>
          <!-- <tr>
            <td>会员身份：</td>
            <td>{{storeData.rankName}}</td>
          </tr>
          <tr>
            <td>积分数：</td>
            <td>{{storeData.points || 0}}</td>
          </tr> -->
        </table>
        <h2 class="title">申请信息</h2>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td>店铺类型</td>
            <td>{{storeData.shopType | filterShopType}}</td>
          </tr>
          <tr>
            <td>店铺名称</td>
            <td>{{storeData.shopName}}</td>
          </tr>
          <tr>
            <td>联系人：</td>
            <td>{{storeData.contactName}}</td>
          </tr>
          <tr>
            <td>联系电话：</td>
            <td>{{storeData.contactPhone}}</td>
          </tr>
          <tr>
            <td>主营业务：</td>
            <td>{{storeData.attributeTypeName}}</td>
          </tr>
          <tr>
            <td>拓展员手机号：</td>
            <td>{{storeData.attributeTypeName}}</td>
          </tr>
          <tr>
            <td>申请时间：</td>
            <td>{{storeData.applyTime | filterDate}}</td>
          </tr>
          <tr>
            <td>审核状态：</td>
            <td>{{storeData.shopStatus | filterGoodsStatus}}
              <span v-if="storeData.shopStatus === '3'">（原因：{{storeData.description}}）</span>
            </td>
          </tr>
        </table>
      </div>
    </template>

    <template slot="other">
      <!-- 审核提示 -->
      <el-dialog
        title="审核"
        :visible.sync="passVisible"
        width="480px">
        <el-form ref="passForm" :model="formData" height="130" class="check-form">
          <el-form-item>
            <el-radio-group v-model="formData.checkResult" class="fl-l">
              <el-radio :label="'2'">通过</el-radio>
              <el-radio :label="'3'">不通过</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.checkResult === '3'" prop="description">
            <el-input type="textarea" :rows="5" placeholder="不通过原因" v-model="formData.description" :maxlength="100"></el-input>
            <div class="ta-r gray-tips">{{formData.description.length}}/100</div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('passForm')">确 定</el-button>
        </span>
      </el-dialog>
    </template>

    <!-- 底部 -->
    <template slot="footer">
      <el-button @click="$router.back()">返回</el-button>
      <template v-if="storeData.shopStatus === '1'">
        <el-button type="primary" @click="passVisible = true">审核</el-button>
      </template>
    </template>
  </common-tpl>
</template>

<script>
export default {
  data () {
    let validateDescription = (rule, value, callback) => {
      if (value && value.length > 100) return callback(new Error('不通过原因限制100个字符以内'))
      callback()
    }

    return {
      // 审核结果
      formData: {
        checkResult: '2',       // 审核结果
        description: ''
      },
      rules: {
        description: [{validator: validateDescription, trigger: 'blur'}]
      },
      storeData: {},            // 商品id
      passVisible: false        // 审核弹窗
    }
  },
  mounted () {
    this.storeData = JSON.parse(localStorage.getItem('OPEN_STORE'))
  },
  methods: {
    /**
     * 提交验证表单
     */
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        this.$http.post('@ROOT_API/shopManageController/auditApplyShop', {
          shopId: this.storeData.shopId,
          shopStatus: this.formData.checkResult,
          description: this.formData.description
        }).then(res => {
          let resData = res.data
          if (resData.status !== '1') {
            this.$message({
              message: resData.msg,
              type: 'error',
              duration: 1500
            })
            return false
          }
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1500
          })
          this.passVisible = false
          this.$router.back()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.manage-public-detail-wrap{

  .goods-common-details{

    .title{
      height: 50px;
      line-height:50px;
      font-size: 16px;
      margin: 20px;
    }

    table{
      width: 100%;
      border: 1px solid #f1f4f7;
      border-collapse: collapse;
      margin-bottom: 20px;

      td{
        /*height: 50px;*/
        border: 1px solid #f1f4f7;
        font-size: 15px;
        padding: 20px;
      }

      td:nth-child(odd) {
        color: #666;
        width: 200px;
        text-align: right;
        background: #f8f8f8;
      }

      td:nth-child(even) {
        color: #333;
      }

    }

    .pictrue-wrap{
      font-size: 0;

      .list{
        width: 80px;
        height: 80px;
        border: 1px solid #33719b;
        margin-right: 20px;
        overflow: hidden;
        border-radius: 5px;

        img{
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
<style lang="less">
.manage-public-detail-wrap{
  .el-dialog {
    .el-dialog__body {
      padding-bottom: 0;
    }
  }
}
</style>
