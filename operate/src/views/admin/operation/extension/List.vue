<!-- 推广拉新列表 -->
<template>
  <common-tpl class="operation-extension-list-wrap">
    <template slot="main">
      <div class="item-wrap">

        <!-- 社群运营 -->
        <div class="cursor-p pos-r item" @click="$router.push({path: '/admin/operation/extension/community', query: {type: 1}})">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">社群运营</h2>
            <p>邀请用户购买商品，邀请人与被邀请人可获得积分或者赠送余额，同时可实现二级用户分佣</p>
          </div>
        </div>

        <!-- 拼团 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/extension/assemble/index')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">拼团</h2>
            <p>添加拼团商品，设定拼团人数，管理拼团价格等</p>
          </div>
        </div>

        <!-- 超级拼团 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/extension/supper/assemble/configure')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">超级拼团</h2>
            <p>拼团秀关联买卖仓使用</p>
          </div>
        </div>

        <!-- 升级套餐区 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/extension/upgrade/index')">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">升级套餐区</h2>
            <p>代言人之间竞拍代言商品，代言周期内代言人共享代言商品的利润分成</p>
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
    .item:nth-child(3) {
      .icon-wrap {
        background-image: url(./assets/img/luckBuy-icon.png);
      }
    }
      .item:nth-child(4){
        .icon-wrap{
          background-image: url(./assets/img/upgrade-icon.png);
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
