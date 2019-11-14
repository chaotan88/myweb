<!-- 促销转化列表 -->
<template>
  <common-tpl class="operation-conversion-list-wrap">
    <template slot="main">
      <div class="item-wrap">
        <div class="cursor-p pos-r item" @click="$router.push({path: '/admin/operation/conversion/flash/edit', query: {type: 7, id: 599}})">
          <div class="pos-a icon-wrap dzp"></div>
          <div class="main">
            <h2 class="truncate">限时特卖</h2>
            <p>设置商品特卖价格限时特卖抢购促销</p>
          </div>
        </div>
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/conversion/turntable')">
          <div class="pos-a icon-wrap dzp"></div>
          <div class="main">
            <h2 class="truncate">大转盘</h2>
            <p>创建抽奖活动，设置活动奖品，用户通过抽奖活动相应的奖项信息</p>
          </div>
        </div>
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/conversion/ticket/list')">
          <div class="pos-a icon-wrap pw"></div>
          <div class="main">
            <h2 class="truncate">票务管理</h2>
            <p>添加会议主题，生成会议门票，管理票务订单信息</p>
          </div>
        </div>
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/conversion/coupon')">
          <div class="pos-a icon-wrap pw"></div>
          <div class="main">
            <h2 class="truncate">优惠券</h2>
            <p>代金券，折扣券，配套使用</p>
          </div>
        </div>
      </div>
    </template>
  </common-tpl>
</template>

<script></script>

<style lang="less" scoped>
  .operation-conversion-list-wrap{
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

      .item{
        .icon-wrap.dzp{
          background-image: url(./assets/img/conversion-icon.png);
        }

        .icon-wrap.pw{
          background-image: url(./assets/img/ticket-icon.png);
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
