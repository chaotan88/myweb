<template>
	<div class="activity-wrap">

		<!-- banner -->
		<div class="banner-wrap">
			<!-- <h1 class="ta-c"><span class="d-ib"></span></h1>
			<h2 class="ta-c">PARTNER   PROGRAM</h2>
			<h3 class="ta-c">携手创伟业·真芯聚天下</h3> -->
      <swiper height="5.5rem" dots-position="center" :auto="true" class="banner">
        <swiper-item class="swiper-demo-img" v-for="(item, index) in setmealBannerData.setMealImage" :key="index">
          <a :href="setmealBannerData.setMealUrl[index] || '#'">
            <!-- <img src="../../assets/images/test/bannerNew.jpg" > -->
            <img :src="item | filterImgUrl">
          </a>
        </swiper-item>
      </swiper>
		</div>

		<!-- 套餐区 -->
		<div class="dining-area-wrap">
			<div class="dining-area-cen-box">
				<div class="dining-area-cen pos-r">

					<!-- 标题 -->
					<h2 class="ta-c">
						<svg class="icon icon-zuizong big-dot va-m big-dot-left" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
						<svg class="icon icon-zuizong va-m small-dot small-dot-left" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
            <div v-if="!noData">
              <span>{{setmealBannerData.setMealName}}</span>
            </div>
						<svg class="icon icon-zuizong va-m small-dot" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
						<svg class="icon icon-zuizong big-dot va-m" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
					</h2>
					
					<!-- 合伙人套餐10000 -->
					<div class="dining-area-box pos-r" v-for="(item,index) in setmealList" v-if="!noData">
						<h3></h3>
						<dl class="pos-r">
							<dt class="ta-c">
								<img class="fist" :src="item.columnLogo | filterImgUrl">
								<h3>{{item.columnName}}</h3>
							</dt>
							<dd>
								<div class="list pos-r" v-for="(ite, ind) in item.columnResList">
									<span class="d-ib ta-c">{{ind + 1}}</span>
									<div class="type  d-ib ta-c" @click="goGoodsList(ite)">
                    <a href="javascript:">{{ite.columnName}}</a>
                  </div>
								</div>
							</dd>
						</dl>
					</div>
          <!--无数据-->
          <no-data-component v-if="noData"></no-data-component>
					<!-- 收益计算按钮 -->
					<!-- <div class="profit ta-c">收益计算器</div> -->
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import { Swiper, SwiperItem } from 'vux' // 轮播图
  import noDataComponent from '../../components/noData'    // 暂无数据
  export default {
    components: {
      noDataComponent,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        noData: false,                     // 暂无数据
        setmealBannerData: {},              // 规则banner数据
        setmealList: []
      }
    },
    mounted: function () {
      this.getSetMealSet()
      this.getAllSetMealList()
    },
    methods: {
      /**
       * 获取套餐规则
      */
      getSetMealSet () {
        this.$http.get(`${this.api.getSetMealSet}`).then((res) => {
          let resData = res.data
          if (res.data.status === this.api.ERR_OK) {
            if (resData.data.setMealImage) {
              resData.data.setMealImage = resData.data.setMealImage.split('#')
            }
            if (resData.data.setMealUrl) {
              resData.data.setMealUrl = resData.data.setMealUrl.split('#')
            }
            this.setmealBannerData = resData.data
          }
        })
      },
      /**
       * 获取套餐，列表
      */
      getAllSetMealList () {
        this.$http.get(`${this.api.allSetMealList}`, {
          params: {
            shopId: ''
          }
        }).then((res) => {
          let resData = res.data
          if (res.data.status !== this.api.ERR_OK) {
            this.noData = true
          }
          resData.data = resData.data.filter((row) => row.columnResList && row.columnResList.length > 0)
          this.noData = resData.data.length > 0 ? !!false : !!true
          this.setmealList = resData.data
        })
      },
      /**
       * 跳到商品列表页
      */
      goGoodsList (v) {
        localStorage.setItem('CoumnBanner', v.mainImage) // 存储栏目主图
        localStorage.setItem('navCoumnName', v.columnName) // 存储栏目名称 方便列表页更新页面title
        this.$router.push({path: '/goodList', query: { searchType: 2, columnId: v.id }})
      }
    }
  }
</script>
<style lang="less">
@import '../../assets/css/css-utils.css';
.activity-wrap{
  min-height: calc(100vh);
  background: #4880cb;
	/*-------------------banner区域-----------------*/
	.banner-wrap{
		width: 100%;
		height: 5.5rem;
		// background: url(../../assets/images/setmeal/activity-banner.jpg) no-repeat;
    background-size: cover;
    img{
      width: 100%;
      height: 100%;
    }
    

		h1{
			color: #fff;
			height: 1rem;
			line-height: 1rem;
			font-size: 0.8rem;
			padding-top: 1.12rem;

			span{
				width: 4.2rem;
				height: 1rem;
				background: url(../../assets/images/setmeal/activity-banner01.jpg) no-repeat;
				background-size: cover;
			}
		}
		h2{
			color: #fff;
			height: 0.7rem;
			line-height: 0.7rem;
			font-size: 0.4rem;
		}
		h3{
			color: #fff;
			height: 0.5rem;
			line-height: 0.5rem;
			font-size: 0.35rem;
			margin-top: 0.18rem;
		}
	}

	/*-------------------套餐区---------------------*/
	.dining-area-wrap{
		width: 100%;
		padding-bottom: 0.3rem;
		background: #4880cb;

		.dining-area-cen-box{
			width: 95%;
			margin: 0 auto;

			.dining-area-cen{
				width: 100%;
				top: -0.35rem;
				padding-bottom: 0.1rem;
				background: #c4dffd;
				box-shadow: -1px -1px 10px #74a2de;

				/*-------------------标题-----------*/
				h2{
					height: 1rem;
					line-height: 1rem;
          font-size: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          div{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 4rem;
            vertical-align: middle;
            color: #2076c4;
            padding: 0 .1rem;
            span{
              background: linear-gradient(to bottom, #0092f8, #275d9d);
              -webkit-background-clip: text;
              color: transparent;
            }
          }
					.icon{
						fill: #6cb0f7;
					}

					.big-dot{
						width: 0.25rem;
						height: 0.25rem;
						/*margin-right: -0.2rem;*/
					}

					.big-dot-left{
						margin-right: -0.05rem;
					}

					.small-dot{
						width: 0.35rem;
						height: 0.35rem;
						margin-right: -0.05rem;
					}

					.small-dot-left{
						margin-right: 0rem;
					}
				}

				/*------------------套餐---------------*/
				.dining-area-box{
					width: 88%;
					margin: 0 auto;
					padding: 0.5rem 0.2rem;
          background: #fff;
          display: flex;
					/*border: 1px solid red;*/
					border-radius: 5px;
					margin-bottom: 0.7rem;

					.title-samll{
						color: #999;
						height: .5rem;
						line-height: .5rem;
						font-size: 0.3rem;
						border-bottom: 1px solid #89c0f3;
						margin-bottom: 0.3rem;
					}

					dl{
            display: flex;
            flex:1;
            
						dt{
              // width: 2.8rem;
              flex:1;
              margin-right: .5rem;

							img{
								width: 2.1rem;
								height: 2.1rem;
								margin-top: 0.2rem;
							}

							.fist{
								width: 2.5rem;
								height: 2.1rem;
							}
							h3{
								color: #f8fafc;
								margin: 0.25rem 0;
								padding: 0.02rem 0.05rem;
								font-size: 0.25rem;
								background: #8abff1;
                border-radius: 30px;
                max-width: 2.7rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
							}
						}

						dd{
              // padding-left: 2.8rem;
              flex: 1;

							.list{
								height: 0.7rem;
								margin-bottom: 0.5rem;
								span{
									color: #fff;
									width: 0.8rem;
									height: 0.8rem;
									line-height: 0.8rem;
									font-size: 0.35rem;
									border: 2px solid #95d9f7;
									background: #4499f4;
									border-radius: 50%;
									z-index: 111;
                  position: absolute;
                  left: -.35rem;
                  top: -.1rem;;
								}
								
								.type{
									color: #fff;
									width: 2.8rem;
									height: 0.65rem;
									line-height: 0.65rem;
									font-size: 0.25rem;
									border: 2px solid #95d9f7;
									background: #40b2fb;
									float: left;
									top: 0.08rem;
  								left: 0.58rem;
									text-shadow: 2px 2px 1px #2a79b4;
									border-radius: 6px;
                  background: linear-gradient(-90deg, #309cf6, #47bbfd);
                  text-align: left !important;
                  overflow: hidden;

									a{
                    color: #fff;
                    display: block;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding-left: 0.55rem;
                    padding-right: 0.35rem;
                    text-align: center;
									}
								}
							}
						}
					}
				}


				/*---------------收益计算器按钮---------*/
				/*.profit{
					color: #fff;
					width: 80%;
					height: 0.8rem;
					line-height: 0.8rem;
					margin: 0 auto;
					font-size: 0.3rem;
					margin-bottom: 0.5rem;
					background: linear-gradient(to right, #fcbe35 , #fb970d);
					border-radius: 5px;
				}*/
			}
		}
	}

}
</style>