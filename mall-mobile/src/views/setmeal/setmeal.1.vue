<template>
	<div class="activity-wrap">

		<!-- banner -->
		<div class="banner-wrap">
			<h1 class="ta-c"><span class="d-ib"></span></h1>
			<h2 class="ta-c">PARTNER   PROGRAM</h2>
			<h3 class="ta-c">携手创伟业·真芯聚天下</h3>
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
						<span>尊贵三重套餐</span>
						<svg class="icon icon-zuizong va-m small-dot" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
						<svg class="icon icon-zuizong big-dot va-m" aria-hidden="true">
              <use xlink:href="#icon-zuizong"></use>
            </svg>
					</h2>
					
					<!-- 合伙人套餐10000 -->
					<div class="dining-area-box pos-r">
						<h3></h3>
						<dl class="pos-r">
							<dt class="pos-a ta-c">
								<img class="fist" src="../../assets/images/setmeal/dining-areaicon1.png">
								<h3>合伙人10000套餐</h3>
							</dt>
							<dd>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">1</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=488&shopId=1">A套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">2</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=488&shopId=1">B套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">3</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=489&shopId=1">C套餐</a></div>
								</div>
							</dd>
						</dl>
					</div>
					
					<!-- 合伙人套餐50000 -->
					<div class="dining-area-box">
						<dl class="pos-r">
							<dt class="pos-a ta-c">
								<img src="../../assets/images/setmeal/dining-areaicon2.png">
								<h3>合伙人500000套餐</h3>
							</dt>
							<dd>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">1</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=484&shopId=1">A套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">2</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=485&shopId=1">B套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">3</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=486&shopId=1">C套餐</a></div>
								</div>
							</dd>
						</dl>
					</div>

					<!-- 合伙人套餐100000 -->
					<div class="dining-area-box">
						<dl class="pos-r">
							<dt class="pos-a ta-c">
								<img src="../../assets/images/setmeal/dining-areaicon3.png">
								<h3>合伙人1000000套餐</h3>
							</dt>
							<dd>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">1</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=490&shopId=1">A套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">2</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=491&shopId=1">B套餐</a></div>
								</div>
								<div class="list pos-r">
									<span class="d-ib ta-c pos-a">3</span>
									<div class="type pos-a d-ib ta-c"><a href="http://120.77.210.28/mshop/goodDetail?goodsId=492&shopId=1">C套餐</a></div>
								</div>
							</dd>
						</dl>
					</div>

					<!-- 收益计算按钮 -->
					<!-- <div class="profit ta-c">收益计算器</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="less">
@import '../../assets/css/css-utils.css';
.activity-wrap{
	/*-------------------banner区域-----------------*/
	.banner-wrap{
		width: 100%;
		height: 5.5rem;
		background: url(../../assets/images/setmeal/activity-banner.jpg) no-repeat;
		background-size: cover;

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

					span{
					  background: linear-gradient(to bottom, #0092f8, #275d9d);
		        -webkit-background-clip: text;
		        color: transparent;
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
						margin-right: -0.2rem;
					}

					.small-dot{
						width: 0.35rem;
						height: 0.35rem;
						margin-right: -0.2rem;
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
						dt{
							width: 2.8rem;

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
							}
						}

						dd{
							padding-left: 2.8rem;

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
									left: 0.2rem;
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

									a{
                    color: #fff;
                    display: block;
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