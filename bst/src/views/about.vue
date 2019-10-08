<template>
  <div class="about">
    <carousel></carousel>
    <div class="company-info">
      <div>公司简介</div>
      <div class="company-desc">
        <img :src="`${$config.rootPath}company1.png`"/>
        <div>
          <h1>{{$config.companyName}}</h1>
          <p>深圳市贝斯特国际商务服务有限公司成立于2019年，公司位于最具创新精神城市之一—深圳市。本公司是一家拥有全球顶级商务咨询资质的服务公司，致力于为全球商旅高端客户提供极致服务，特别对国际长途商务、头等舱机票、酒店等出行需求能做到全网价格最低、最具性价比。公司可为公司和个人客户提供全程一对一全球行程咨询和顾问服务。本公司在高端特价机票领域具有丰富的资源，与全球多家航空公司、高端酒店均有合作关系，同时拥有一支专业、高效服务团队。国际特价高端机票及酒店服务，您值得拥有！</p>
        </div>
      </div>
    </div>
    <div class="company-culture">
      <div class="content">
        <div class="title">企业文化</div>
        <div class="cards">
          <div class="card-1">
            <div>
              <p>企业价值观</p>
              <P>创新、专业、务实、诚信</P>
            </div>
            <img :src="`${$config.rootPath}company4.png`"/>
          </div>
          <div class="card-2">
            <img :src="`${$config.rootPath}company1.png`"/>
            <div>
              <p>企业愿景</p>
              <P>最专业的航空服务管家</P>
            </div>
          </div>
          <div class="card-3">
            <div>
              <p>企业使命</p>
              <P>客户出行的第一时间,即享受一站式的顾问服务</P>
            </div>
            <img :src="`${$config.rootPath}company5.png`"/>
          </div>
          <div class="card-4">
            <img :src="`${$config.rootPath}company3.png`"/>
            <div>
              <p>服务理念</p>
              <P>先于客户所想，您有所愿，公司必竭尽所能</P>
            </div>
            
          </div>
        </div>
      </div>
    </div>
    <div class="company-odds">
      <div class="title">我们的优势</div>
      <div class="odds-cards">
        <div class="odds-item">
          <img :src="`${$config.rootPath}company10.png`"/>
          <img :src="`${$config.rootPath}company6.png`"/>
          <div>规模化</div>
        </div>
        <div class="odds-item">
          <img :src="`${$config.rootPath}company11.png`"/>
          <img :src="`${$config.rootPath}company7.png`"/>
          <div>品牌化</div>
        </div>
        <div class="odds-item">
          <img :src="`${$config.rootPath}company12.png`"/>
          <img :src="`${$config.rootPath}company8.png`"/>
          <div>专业化</div>
        </div>
        <div class="odds-item">
          <img :src="`${$config.rootPath}company13.png`"/>
          <img :src="`${$config.rootPath}company9.png`"/>
          <div>国际化</div>
        </div>
      </div>
    </div>
    <!-- <div class="company-odds">
      <div class="title">互动专区</div>
      <div class="gou-tong">
        <img :src="`${$config.rootPath}goutong1.png`"/>
        <img :src="`${$config.rootPath}goutong2.png`"/>
        <img :src="`${$config.rootPath}goutong2.png`"/>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods: {
    
  },
  mounted() {
    console.log('indexxxxx')
  }
}
</script>

<style lang="less" scoped>
  .about {
    .company-info {
      margin-top: 40px;
      div:nth-child(1) {
        font-size: 26px;
        color: #333;
        width: 1200px;
        margin: 0 auto;
        // border-left: 3px solid #39ABFF;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        position: relative;
      }
      div:nth-child(1):before {
        content: '';
        width: 5px;
        height: 30px;
        background: #39ABFF;
        position: absolute;
        top: 5px;
        left: -10px;
      }
      .company-desc {
        padding-top: 40px;
        width: 1200px;
        margin: auto;
        display: flex;
        div {
          margin-left: 20px;
          h1 {
            color: #555555;
            font-size: 18px;
            margin-bottom: 5px;
            font-weight: 400;
          }
          p {
            margin-bottom: 10px;
            font-size: 14px;
            color: #7777777;
            line-height: 24px;
            text-align: left;
            font-weight: 400;
          }
        }
      }
    }
    .company-culture {
      background: #39abff;
      height: 560px;
      margin-top: 40px;
      padding-top: 40px;
      .content {
        width: 1200px;
        margin: 0 auto;
        .title {
          font-size: 26px;
          color: #fff;
          width: 1200px;
          margin: 0 auto;
          // border-left: 3px solid #39ABFF;
          border-bottom: 1px solid #92d1ff;
          padding-bottom: 10px;
          position: relative;
        }
        .title:before {
          content: '';
          width: 5px;
          height: 30px;
          background: #fff;
          position: absolute;
          top: 5px;
          left: -10px;
        }
        .cards {
          display: flex;
          margin-top: 20px;
          .card-1, .card-2, .card-3, .card-4 {
            width: 295px;
            margin-right: 20px;
            img {
              width: 290px;
              height: 195px;
            }
            div {
              height: 115px;
              color: #fff;
              padding: 40px 20px;
              p:nth-child(1) {
                font-size: 18px;
                font-weight: 400;
                margin-bottom: 20px;
              }
              p:nth-child(2) {
                font-size: 14px;
                font-weight: 400;
              }
            }
          }
          .card-1 {
            div {
              background: #1986c7;
            }
          }
          .card-2 {
            div {
              background: #99cc33;
            }
          }
          .card-3 {
            div {
              background: #ff4351;
            }
          }
          .card-4 {
            div {
              background: #ff9900;
            }
          }
        }
      }
    }
    .company-odds {
      width: 1200px;
      margin: auto;
      margin-top: 40px;
      .title {
        font-size: 26px;
        color: #333;
        width: 1200px;
        margin: 0 auto;
        // border-left: 3px solid #39ABFF;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        position: relative;
      }
      .title:before {
        content: '';
        width: 5px;
        height: 30px;
        background: #39ABFF;
        position: absolute;
        top: 5px;
        left: -10px;
      }
      .odds-cards {
        display: flex;
        .odds-item {
          position: relative;
          margin-right: 20px;
          img:nth-child(2) {
            position: absolute;
            top: 30px;
            left: 50%;
            margin-left: -40px;
          }
          div {
            position: absolute;
            font-size: 18px;
            color: #fff;
            font-weight: 400;
            bottom: 20px;
            left: 50%;
            margin-left: -28px;
          }
        }
      }
    }
  }
</style>