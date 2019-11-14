<template>
  <div class="member-detail-wrap">
    <div class="content-wrap">
      <!-- 标题 -->
      <div class="content-header">
        <span>会员信息</span>
      </div>
      <!-- 内容 -->
      <div class="content-body clear-float">
        <ul>
          <li>
            <span>手机号：</span>
            <span>{{ user.phone }}</span>
          </li>
          <li>
            <span>性别：</span>
            <span>{{ user.sex | sexFilter }}</span>
          </li>
          <li>
            <span>注册时间：</span>
            <span>{{ user.createTime | dateFilter }}</span>
          </li>
          <li>
            <span>所在地区：</span>
            <span>{{user.province}}{{user.city}}{{user.county}}</span>
          </li>
        </ul>
        <ul>
          <li>
            <span>会员姓名：</span>
            <span>{{ user.name }}</span>
          </li>
          <li>
            <span>生日：</span>
            <span>{{ user.birthday | birthdayFilter }}</span>
          </li>
          <li>
            <span>最后登录时间：</span>
            <span>{{ user.updateTime | dateFilter }}</span>
          </li>
        </ul>
      </div>
      <div class="content-footer">
        <el-button @click="returnBack">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    data: function () {
      return {
        user: {},  // 会员
        userId: ''
      }
    },
    filters: {
      birthdayFilter: function (value) {
        return moment(value).format('YYYY-MM-DD')
      }
    },
    methods: {
      getUserById: function () {
        // 获取会员详情
        this.$http.post('/admin/user/getUserById', this.qs.stringify({
          userId: this.userId
        })).then((res) => {
          if (res.data.res === 1) {
            this.user = res.data.obj
          }
        })
      },
      returnBack: function () {
        // 返回
        this.$router.push('/admin/members/members-center/members-list')
      }
    },
    mounted: function () {
      this.userId = this.$route.params.userId  // 获取用户ID
      this.getUserById()
    }
  }
</script>

<style lang="less" scoped>
  .member-detail-wrap {
    .content-wrap {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      padding: 40px;
      .content-header {
        height: 26px;
        line-height: 26px;
        border-bottom: 1px solid rgb(228, 228, 228);
      }
      .content-header:before {
        content: "";
        display: block;
        width: 8px;
        height: 26px;
        background-color: rgb(153, 153, 153);
        float: left;
        margin-right: 10px;
      }
      .content-body {
        margin: 40px 0;
        ul {
          width: 400px;
          float: left;
          li {
            line-height: 60px;
            span:first-child {
              display: inline-block;
              width: 120px;
              text-align: right;
            }
            span {
              font-size: 14px;
              color: rgb(102, 102, 102);
            }
          }
        }
      }
      .clear-float:after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
</style>

<style lang="less">
  .member-detail-wrap {
    .content-wrap {

    }
  }
</style>
