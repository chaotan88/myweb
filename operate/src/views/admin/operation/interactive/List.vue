<!-- 推广拉新列表 -->
<template>
  <common-tpl class="operation-extension-list-wrap">
    <template slot="main">
      <div class="item-wrap">
        <div class="cursor-p pos-r item" @click="$router.push({path: '/admin/operation/interactive/exchange', query: {type: 2}})">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">芯豆管理</h2>
            <p>设置管理用户获得芯豆的途径，及获得芯豆后进行消耗入口管理</p>
          </div>
        </div>
        <div class="cursor-p pos-r item" @click="$router.push({path: '/admin/operation/interactive/barter', query: {}})">
          <div class="pos-a icon-wrap"></div>
          <div class="main">
            <h2 class="truncate">易货区</h2>
            <p>线上发布闲置物品进行线下交易易货</p>
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
        background-image: url(./assets/img/community-icon.png);
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
