<template>
  <div class="user-details-info">
    <div class="form-row">
      <div class="form-col">
        <span class="col-label">推广大使手机</span>
        <span class="col-val">{{data.customerPhone | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">证件类型</span>
        <span class="col-val">{{data.customerPhone | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">地区</span>
        <span class="col-val">{{(`${data.userProvince || ''}${data.userCityCode || ''}${data.userZoneCode || ''}`) | filterEmpty}}</span>
      </div>
    </div>
    <div class="form-row">
      <div class="form-col">
        <span class="col-label">推广大使ID</span>
        <span class="col-val">{{data.invitationCode | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">姓名</span>
        <span class="col-val">{{data.cardName | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">首锁推荐人</span>
        <span class="col-val">{{data.invitationName | filterEmpty}}</span>
      </div>
    </div>
    <div class="form-row">
      <div class="form-col">
        <span class="col-label">级别产生方式</span>
        <span class="col-val">{{data.memberType === 1 ? '线上升级' : '手动升级'}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">身份证</span>
        <span class="col-val">{{data.idCard | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">注册时间</span>
        <span class="col-val">{{data.registerTime | filterDate}}</span>
      </div>
    </div>
    <div class="form-row">
      <div class="form-col">
        <span class="col-label">当前身份</span>
        <span class="col-val">{{data.ruleName | filterEmpty}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">性别</span>
        <span class="col-val">{{data.sex | filterSex}}</span>
      </div>
      <div class="form-col">
        <span class="col-label">最后登录时间</span>
        <span class="col-val">{{data.lastLoginTime | filterDate}}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {},

  methods: {}
}
</script>

<style lang="less" scoped>
.user-details-info {
  border: 1px solid #ddd;
  margin-bottom: 20px;
  .form-row {
    display: flex;
    border-bottom: 1px solid #ddd;
    .form-col {
      width: 33%;
      border-right: 1px;
      font-size: 12px;
      .col-label {
        width: 160px;
        background: #C1E0FF;
        display: inline-block;
        padding: 10px 0;
        text-align: right;
        padding-right: 20px;
      }
      .col-val {

      }
    }
  }
}
</style>


