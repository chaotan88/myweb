export default {
  path: '/admin/warehouse',
  redirect: '/admin/warehouse/setting',
  meta: {
    nav: '买卖仓',
    icon: 'icon-ziyuan',
    auth: true,
    authCode: 501090
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 商品设置
    {
      path: '/admin/warehouse/setting',
      redirect: '/admin/warehouse/setting/index',
      meta: {
        nav: '商品设置',
        icon: 'icon-shangpinpeizhi',
        auth: true,
        authCode: 501091,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/setting/layout'], r),
      children: [
        // 商品配置
        {
          path: '/admin/warehouse/setting/index',
          meta: {
            nav: '商品配置',
            icon: '',
            auth: true,
            authCode: 501092,
            refresh: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '商品配置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/setting/index'], r)
        },

        // 设置
        {
          path: '/admin/warehouse/setting/edit',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501091,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/setting/GoodsSetting'], r)
        },

        // 查看设置
        {
          path: '/admin/warehouse/setting/settingDetail',
          meta: {
            title: '设置',
            auth: true,
            authCode: 501091,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '查看设置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/setting/GoodsSetting'], r)
        },

        // 商品设置-详情
        {
          path: '/admin/warehouse/setting/details',
          meta: {
            nav: '详情',
            icon: '',
            auth: true,
            authCode: 501091,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/goods/goods-list/backup/PublicDetails'], r)
          // component: r => require(['@/views/admin/goods/goods-list/PublicDetails'], r)
        }
      ]
    },

    // 抢购管理
    {
      path: '/admin/warehouse/rush',
      redirect: '/admin/warehouse/rush/index',
      meta: {
        nav: '抢购管理',
        icon: 'icon-qianggouguanli',
        auth: true,
        authCode: 501092,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/rush/layout'], r),
      children: [
        // 抢购管理
        {
          path: '/admin/warehouse/rush/index',
          meta: {
            nav: '抢购管理',
            icon: '',
            auth: true,
            authCode: 501092,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '抢购管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/rush/rushManager'], r)
        },

        // 抢购管理-详情
        {
          path: '/admin/warehouse/rush/rushDetail',
          meta: {
            nav: '抢购详情',
            icon: '',
            auth: true,
            authCode: 501092,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '抢购详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/rush/rushDetail'], r)
        },
        // 抢购管理-详情-抢购记录
        {
          path: '/admin/warehouse/rush/rushDetailRecord',
          meta: {
            nav: '抢购记录',
            icon: '',
            auth: true,
            authCode: 501092,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '抢购记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/rush/rushRecord'], r)
        },
        // 抢购管理-抢购记录
        {
          path: '/admin/warehouse/rush/rushRecord',
          meta: {
            nav: '抢购记录',
            icon: '',
            auth: true,
            authCode: 501092,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '抢购记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/rush/rushRecord'], r)
        }
      ]
    },
    // 批发管理
    {
      path: '/admin/warehouse/wholesale',
      redirect: '/admin/warehouse/wholesale/index',
      meta: {
        nav: '批发管理',
        icon: 'icon-pifaguanli',
        auth: true,
        authCode: 501093,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/wholesale/layout'], r),
      children: [
        // 批发管理
        {
          path: '/admin/warehouse/wholesale/index',
          meta: {
            nav: '批发管理',
            icon: '',
            auth: true,
            authCode: 501093,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '批发管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/wholesale/wholesaleManager'], r)
        },
        // 批发管理-详情
        {
          path: '/admin/warehouse/wholesale/wholesaleDetail',
          meta: {
            nav: '批发详情',
            icon: '',
            auth: true,
            authCode: 501093,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '批发详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/wholesale/wholesaleDetail'], r)
        },
        // 批发管理-详情-批发记录
        {
          path: '/admin/warehouse/wholesale/wholesaleDetailRecord',
          meta: {
            nav: '批发记录',
            icon: '',
            auth: true,
            authCode: 501093,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '批发记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/wholesale/wholesaleRecord'], r)
        },
        // 批发管理-批发记录
        {
          path: '/admin/warehouse/wholesale/wholesaleRecord',
          meta: {
            nav: '批发记录',
            icon: '',
            auth: true,
            authCode: 501093,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '批发记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/wholesale/wholesaleRecord'], r)
        }
      ]
    },
    // 买卖仓 - 批发卷管理
    {
      path: '/admin/warehouse/volume',
      redirect: '/admin/warehouse/volume/index',
      meta: {
        nav: '批发券管理',
        icon: 'icon-pifajuanguanli',
        auth: true,
        authCode: 501094,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/volume/layout'], r),
      children: [
        // 买卖仓 - 批发卷管理
        {
          path: '/admin/warehouse/volume/index',
          meta: {
            nav: '批发卷管理',
            icon: '',
            auth: true,
            authCode: 501094,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '批发券管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/volume/wholesaleVolume'], r)
        }
      ]
    },

    // 挂售管理
    {
      path: '/admin/warehouse/handSale',
      redirect: '/admin/warehouse/handSale/index',
      meta: {
        nav: '挂售管理',
        icon: 'icon-guashouguanli',
        auth: true,
        authCode: 501095,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/handSale/layout'], r),
      children: [

        // 挂售管理
        {
          path: '/admin/warehouse/handSale/index',
          meta: {
            nav: '挂售管理',
            icon: '',
            auth: true,
            authCode: 501095,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '挂售管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/handSale/hangSaleManager'], r)
        },

        // 挂售管理-详情
        {
          path: '/admin/warehouse/handSale/handSaleDetail',
          meta: {
            nav: '批发详情',
            icon: '',
            auth: true,
            authCode: 501095,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '挂售详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/handSale/handSaleDetail'], r)
        },

        // 挂售管理-详情
        {
          path: '/admin/warehouse/handSale/handSaleDetailRecord',
          meta: {
            nav: '批发详情',
            icon: '',
            auth: true,
            authCode: 501095,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },

              { title: '挂售记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/handSale/handSaleRecord'], r)
        }
      ]
    },

    // 买卖仓 - 数据统计
    {
      path: '/admin/warehouse/statistics',
      redirect: '/admin/warehouse/statistics/index',
      meta: {
        nav: '数据统计',
        icon: 'icon-shujutongji',
        auth: true,
        authCode: 501096,
        visible: false
      },
      component: r => require(['@/views/admin/warehouse/statistics/layout'], r),
      children: [
        // 买卖仓 - 数据统计
        {
          path: '/admin/warehouse/statistics/index',
          meta: {
            nav: '数据统计',
            icon: '',
            auth: true,
            authCode: 501096,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '数据统计', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/statistics/dataStatistics'], r)
        }
      ]
    },

    // 买卖仓 - 内容配置
    {
      path: '/admin/warehouse/content',
      redirect: '/admin/warehouse/content/index',
      meta: {
        nav: '内容配置',
        icon: 'icon-neirongshezhi',
        auth: true,
        authCode: 501096,
        visible: true
      },
      component: r => require(['@/views/admin/warehouse/content/layout'], r),
      children: [
        // 买卖仓 - 内容配置
        {
          path: '/admin/warehouse/content/index',
          meta: {
            nav: '内容配置',
            icon: '',
            auth: true,
            authCode: 501096,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '买卖仓', path: '/admin/warehouse' },
              { title: '内容配置', path: '' }
            ]
          },
          component: r => require(['@/views/admin/warehouse/content/index'], r)
        }
      ]
    }
  ]
}
