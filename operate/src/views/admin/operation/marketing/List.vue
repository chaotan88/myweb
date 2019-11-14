<!-- 推广拉新列表 -->
<template>
  <common-tpl class="operation-extension-list-wrap">
    <template slot="main">

      <div class="item-wrap">
        <!-- 拉群工具 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/marketing/master')">
          <div class="pos-a icon-wrap lq"></div>
          <div class="main">
            <h2 class="truncate">拉群工具</h2>
            <p>辅助积分会员完成建群拉新工作，配套提供多样化运营工具</p>
          </div>
        </div>

        <!-- 宣传助手 -->
        <div class="cursor-p pos-r item" @click="$router.push('/admin/operation/marketing/propaganda')">
          <div class="pos-a icon-wrap iq"></div>
          <div class="main">
            <h2 class="truncate">宣传助手</h2>
            <p>配置不同的活动主题板式，根据需要在不同的页面中调用,快速实现素材的应用共享</p>
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

      .icon-wrap.lq{
        background-image: url(./assets/img/icon01.png);
      }

      .icon-wrap.iq{
        background-image: url(./assets/img/icon02.png);
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

    .item:hover{
      h2{
        color: #56ade8;
      }
    }
  }
}
</style>
