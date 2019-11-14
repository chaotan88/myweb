export default {
  path: '/admin/order',
  redirect: '/admin/order/self',
  meta: {
    nav: '订单',
    icon: 'icon-wodedingdan',
    auth: true,
    authCode: 401030
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ----------------- 订单管理
    {
      path: '/admin/order/self',
      redirect: '/admin/order/self/index',
      meta: {
        nav: '订单管理',
        icon: 'icon-dingdanguanli1',
        auth: true,
        authCode: 401031
      },
      component: r => require(['@/views/admin/order/ManageLayout'], r),
      children: [

        // -------------- 订单管理
        {
          path: '/admin/order/self/index',
          meta: {
            title: '订单管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单-待付款管理
        {
          path: '/admin/order/self/payment',
          meta: {
            title: '订单-待付款管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待付款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单-待发货管理
        {
          path: '/admin/order/self/delivery',
          meta: {
            title: '订单-待发货管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待发货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

         // -------------- 订单管理-待发货 - 批量发货
        {
          path: '/admin/order/self/delivery/bulk',
          meta: {
            title: '订单管理-待发货 - 批量发货',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待发货', path: '/admin/order/self/delivery' },
              { title: '批量发货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/BulkShipment'], r)
        },

        // -------------- 订单-待收货管理
        {
          path: '/admin/order/self/receipt',
          meta: {
            title: '订单-待收货管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待收货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单-待评价管理
        {
          path: '/admin/order/self/evaluate',
          meta: {
            title: '订单-待评价管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待评价', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单-已完成
        {
          path: '/admin/order/self/complete',
          meta: {
            title: '订单-已完成',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '已完成', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单-已取消
        {
          path: '/admin/order/self/cancel',
          meta: {
            title: '订单-已完成',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '已取消', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单详情管理
        {
          path: '/admin/order/self/details',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // ----------------- 供应订单
    {
      path: '/admin/order/supply',
      redirect: '/admin/order/supply/index',
      meta: {
        nav: '供应订单',
        icon: 'icon-liuliangyunpingtaitubiao04',
        visible: false,
        auth: true,
        authCode: 401044
      },
      component: r => require(['@/views/admin/order/SupplyLayout'], r),
      children: [

        // -------------- 供应订单
        {
          path: '/admin/order/supply/index',
          meta: {
            title: '供应订单',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 供应订单-待付款
        {
          path: '/admin/order/supply/payment',
          meta: {
            title: '供应订单-待付款',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' },
              { title: '待付款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 供应订单-待发货
        {
          path: '/admin/order/supply/delivery',
          meta: {
            title: '供应订单-待发货',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' },
              { title: '待发货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 供应订单-待收货
        {
          path: '/admin/order/supply/receipt',
          meta: {
            title: '供应订单-待收货',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' },
              { title: '待收货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 供应订单-待评价
        {
          path: '/admin/order/supply/evaluate',
          meta: {
            title: '供应订单-待评价',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' },
              { title: '待评价', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 供应订单详情
        {
          path: '/admin/order/supply/details',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '供应订单', path: '/admin/order/supply' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // ----------------- 退款管理
    {
      path: '/admin/order/refund',
      redirect: '/admin/order/refund/index',
      meta: {
        title: '订单',
        nav: '退款管理',
        icon: 'icon-tuikuanguanli',
        visible: false,
        auth: true,
        authCode: 401042
      },
      component: r => require(['@/views/admin/order/RefundLayout'], r),

      // -------------- 退款管理首页
      children: [
        {
          path: '/admin/order/refund/index',
          meta: {
            title: '退款管理首页',
            visible: false,
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '退款管理', path: '/admin/order/refund' }
            ]
          },
          component: r => require(['@/views/admin/order/Refund'], r)
        },

        // --------------- 待退款
        {
          path: '/admin/order/refund/refunds',
          meta: {
            title: '待退款',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '退款管理', path: '/admin/order/refund' },
              { title: '待退款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Refund'], r)
        },

        // ---------------已退款
        {
          path: '/admin/order/refund/refunded',
          meta: {
            title: '已退款',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '退款管理', path: '/admin/order/refund' },
              { title: '已退款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Refund'], r)
        },

        // ---------------退款详情
        {
          path: '/admin/order/refund/details',
          meta: {
            title: '订单',
            nav: '退款管理',
            icon: 'icon-shouye',
            auth: true,
            breadcrumb: [
              { title: '订单', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/RefundDetails'], r)
        }
      ]
    },

    // -------------- 评价管理
    {
      path: '/admin/order/evaluate',
      redirect: '/admin/order/evaluate/index',
      meta: {
        nav: '评价管理',
        icon: 'icon-pingjiaguanli',
        visible: false,
        auth: true,
        authCode: 401043
      },
      component: r => require(['@/views/admin/order/EvaluateLayout'], r),
      children: [

        // -------------- 评价管理首页
        {
          path: '/admin/order/evaluate/index',
          meta: {
            title: '评价管理首页',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '评价管理', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Evaluate'], r)
        },

        // -------------- 好评
        {
          path: '/admin/order/evaluate/praise',
          meta: {
            title: '订单',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '评价管理', path: '/admin/order/evaluate' },
              { title: '好评', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Evaluate'], r)
        },

        // -------------- 中评
        {
          path: '/admin/order/evaluate/center',
          meta: {
            title: '中评',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '评价管理', path: '/admin/order/evaluate' },
              { title: '中评', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Evaluate'], r)
        },

        // -------------- 差评
        {
          path: '/admin/order/evaluate/difference',
          meta: {
            title: '差评',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '评价管理', path: '/admin/order/evaluate' },
              { title: '差评', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Evaluate'], r)
        },

        // ------------- 评价详情
        {
          path: '/admin/order/evaluate/details',
          meta: {
            title: '评价详情',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单', path: '/admin/order' },
              { title: '评价管理', path: '/admin/order/evaluate' },
              { title: '评价详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/EvaluateDetails'], r)
        }
      ]
    }
  ]
}
