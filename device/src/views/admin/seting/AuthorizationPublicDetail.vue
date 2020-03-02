<template>
  <div class="AuthorizationPublic-detail">
    <div class="AuthorizationPublic-detail-con">
        <!--推荐人信息-->
        <h2>推荐人信息</h2>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>邀请码</td>
                <td>{{recommendInfo.invitationCode}}</td>
            </tr>
            <tr>
                <td>推荐人姓名</td>
                <td>{{recommendInfo.recommendName}}</td>
            </tr>
            <tr>
                <td>推荐人手机</td>
                <td>{{recommendInfo.recommendPhone}}</td>
            </tr>
        </table>
        <!--代理商信息-->
        <h2>代理商基本信息</h2>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>手机号</td>
                <td>{{channelInfo.channelPhone}}</td>
            </tr>
            <tr>
                <td>合作类型</td>
                <td>
                  {{channelInfo.applyType==1?'个人':channelInfo.applyType==2?'企业':''}}
                </td>
            </tr>
            <tr>
                <td>企业名称</td>
                <td>{{channelInfo.companyName}}</td>
            </tr>
            <tr>
                <td>企业所在地</td>
                <td>{{channelInfo.companyProvince}} {{channelInfo.companyCity}} {{channelInfo.companyZone}} {{channelInfo.companyAddress}}</td>
            </tr>
            <tr>
                <td>营业执照</td>
                <td><img v-bind:src="channelInfo.companyLicense"></td>
            </tr>
        </table>
        <!--代理合作规则-->
        <h2>代理合作规则</h2>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>代理名称</td>
                <td>{{rule.ruleName}}</td>
            </tr>
            <tr>
                <td>股权比例</td>
                <td>{{rule.stockRate}}%</td>
            </tr>
            <tr>
                <td>加盟费</td>
                <td>{{rule.joinFee}}元</td>
            </tr>
            <tr>
                <td>管理费</td>
                <td>{{rule.manageFee}}%</td>
            </tr>
            <tr>
                <td>推荐代理费</td>
                <td>{{rule.recommendFee}}%</td>
            </tr>
        </table>
        <!--代理产品-->
        <h2>代理产品</h2>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>已代理产品</td>
                <td>
                  <template v-for="(item,index) in productInfo">
                    <span v-if="index>0">,</span>{{item.productName}}
                  </template>
                </td>
            </tr>
        </table>
         <!--联系信息-->
        <h2>联系信息</h2>
        <table border="0" cellpadding="0" cellspacing="0">
            <tr>
                <td>联系人</td>
                <td>{{contactInfo.contactsName}}</td>
            </tr>
            <tr>
                <td>联系手机</td>
                <td>{{contactInfo.contactsPhone}}</td>
            </tr>
            <tr>
                <td>QQ</td>
                <td>{{contactInfo.contactsQQ}}</td>
            </tr>
            <tr>
                <td>微信</td>
                <td>{{contactInfo.contactsWechat}}</td>
            </tr>
            <tr>
                <td>联系地址</td>
                <td>{{contactInfo.contactsProvince}} {{contactInfo.contactsCity}} {{contactInfo.contactsZone}} {{contactInfo.contactsAddress}}</td>
            </tr>
            <tr>
                <td>留言</td>
                <td>{{contactInfo.contactsMessage}}</td>
            </tr>
        </table>
    </div>
    <div class="return-box">
      <el-button type="primary" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      channelInfo: [],
      recommendInfo: [],
      contactInfo: [],
      rule: [],
      productInfo: []
    }
  },
  mounted: function () {
    this.channelId = this.$route.query.id
    this.getDetail()
  },
  methods: {
    /**
     * 获取代理商详情
    */
    getDetail () {
      this.$http.post('@ROOT_API/channelAuthorizeController/getChannelDetail', {
        channelId: this.channelId,
        userId: JSON.parse(localStorage.getItem('deviceAdminInfo')).userId
      }).then((res) => {
        // console.log(JSON.stringify(res, null, 4))
        if (res.data.status === '1') {
          this.channelInfo = res.data.data.channelInfo
          this.recommendInfo = res.data.data.recommendInfo
          this.contactInfo = res.data.data.contactInfo
          this.rule = res.data.data.rule
          this.productInfo = res.data.data.productInfo
        }
      })
    }
  }
}
</script>

<style lang='less'>
    .AuthorizationPublic-detail{
        .AuthorizationPublic-detail-con{
            background: #fff;
            padding: 40px;
            border-radius: 4px;
            -moz-border-radius: 4px;
            -ms-border-radius: 4px;
            -o-border-radius: 4px;
            -webkit-border-radius: 4px;
            h2{
                font-size: 18px;
                color: #333333;
                font-weight: normal;
                margin-bottom: 19px;
            }
            table{
                width: 100%;
                height: auto;
                overflow: hidden;
                border: 1px solid #eef1f5;
                margin-bottom: 29px;
                color: #999999;
                font-size: 14px;
                tr{
                    &:last-child{
                        td{
                            border-bottom: none;
                        }
                    }
                    td{
                        padding: 20px 0;
                        border-bottom: 1px solid #eef1f5;
                        img{
                            width: 143px;
                            height: 143px;
                            border: 1px solid #33719b;
                            border-radius: 4px;
                            -webkit-border-radius: 4px;
                            -moz-border-radius: 4px;
                            -ms-border-radius: 4px;
                            -o-border-radius: 4px;
                        }
                    }
                    td:first-child{
                        width: 112px;
                        background: #f8f8f8;
                        vertical-align: top;
                        padding-left: 124px;
                    }
                    td:nth-child(2){
                        padding-left: 57px;
                    }
                }
            }
        }
        .return-box{
            text-align: center;
            margin-top: 30px;
            .el-button--primary{
                padding: 10px 30px;
            }
        }
    }
</style>
