<!-- 推广拉新列表 -->
<template>
  <common-tpl class="operation-extension-list-wrap">
    <template slot="main">
      <div class="item-wrap">

        <!-- 利润率分佣 -->
        <div class="cursor-p pos-r item" @click="$router.push({path: '/admin/finance/commission/profit/index', query: {type: 1}})">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">利润率分佣</h2>
            <p>根据利润率测算分佣比例，实现多级分佣配置管理</p>
          </div>
        </div>

        <!-- 分享分佣 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/finance/commission/share/index')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">买卖仓分佣</h2>
            <p>买卖仓分佣制度管理设置,不同等级比重及分佣配比</p>
          </div>
        </div>

        <!-- 拼团奖励 -->
<!--        <div class="cursor-p pos-r item" @click="$router.push('/admin/finance/commission/groupAward/index')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">拼团奖励</h2>
            <p>拼团模块奖励制度设置</p>
          </div>
        </div>-->

        <!-- 会员分佣规则 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/finance/commission/vipRules/index')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">会员分佣规则</h2>
            <p>拼团模块奖励制度配置</p>
          </div>
        </div>
      </div>
    </template>
  </common-tpl>
</template>

<script></script>

<style lang="less" scoped>
.operation-extension-list-wrap{
  .item-wrap{
    display: flex;

    .item{
      width: 33.33%;
      height: 120px;
      margin: 0 10px;
      padding-left: 130px;
      box-sizing: border-box;

      .icon-wrap{
        width: 130px;
        height: 100%;
        background-color: #56ade8;
        background-repeat: no-repeat;
        background-position: center;
        left: 0;
      }

      .main{
        height: 100%;
        border: 1px solid #c5c5c5;
        border-left: 0;
        padding: 20px;
        border-radius: 0 5px 5px 0;
        box-sizing: border-box;

        h2{
          font-size: 18px;
          margin-bottom: 10px;
        }

        p{
          color: #666;
          font-size: 13px;
        }
      }
    }

    .item:nth-child(1){
      .icon-wrap{
        background-image: url(./assets/img/community-icon.png);
      }
    }

    .item:nth-child(2){
      .icon-wrap{
        background-image: url(./assets/img/assemble-icon.png);
      }
    }
    .item:nth-child(3){
      .icon-wrap{
        background-image: url(./assets/img/groupAward-icon.png);
      }
    }
    .item:nth-child(4){
      .icon-wrap{
        background-image: url(./assets/img/vipRules-icon.png);
      }
    }

    .item:hover{
      h2{
        color: #56ade8;
      }
    }
  }
}
</style>
