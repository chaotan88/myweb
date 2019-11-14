export default {
  path: '/admin/order',
  redirect: '/admin/order/self',
  meta: {
    nav: '订单管理',
    icon: 'icon-wodedingdan',
    auth: true,
    authCode: 501030
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // ----------------- 订单管理
    {
      path: '/admin/order/self',
      redirect: '/admin/order/self/index',
      meta: {
        nav: '订单管理',
        icon: 'icon-dingdan1',
        auth: true,
        authCode: 501031
      },
      component: r => require(['@/views/admin/order/ManageLayout'], r),
      children: [

        // -------------- 订单管理
        {
          path: '/admin/order/self/index',
          meta: {
            title: '订单管理',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单管理-待付款
        {
          path: '/admin/order/self/payment',
          meta: {
            title: '订单管理-待付款',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待付款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单管理-待发货
        {
          path: '/admin/order/self/delivery',
          meta: {
            title: '订单管理-待发货',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
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
            authCode: 501031,
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

        // -------------- 订单管理-待收货
        {
          path: '/admin/order/self/receipt',
          meta: {
            title: '订单管理-待收货',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待收货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单管理-待评价
        {
          path: '/admin/order/self/evaluate',
          meta: {
            title: '订单管理-待评价',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待评价', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单管理-待评价
        {
          path: '/admin/order/self/complete',
          meta: {
            title: '订单管理-待评价',
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '待评价', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageList'], r)
        },

        // -------------- 订单管理详情
        {
          path: '/admin/order/self/details',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '订单详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        },

        // -------------- 订单管理-修改订单
        {
          path: '/admin/order/self/modify',
          meta: {
            title: '订单',
            thirdMenu: false,
            auth: true,
            authCode: 501031,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '订单管理', path: '/admin/order/self' },
              { title: '修改订单', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/ManageDetails'], r)
        }
      ]
    },

    // ------------- 评价管理
    {
      path: '/admin/order/evaluate',
      redirect: '/admin/order/evaluate/index',
      meta: {
        nav: '评价管理',
        icon: 'icon-pingjiaguanli',
        auth: true,
        authCode: 501032
      },
      component: r => require(['@/views/admin/order/EvaluateLayout'], r),
      children: [

        // -------------- 评价管理首页
        {
          path: '/admin/order/evaluate/index',
          meta: {
            title: '评价管理首页',
            auth: true,
            authCode: 501032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
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
            auth: true,
            authCode: 501032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
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
            auth: true,
            authCode: 501032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
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
            auth: true,
            authCode: 501032,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '评价管理', path: '/admin/order/evaluate' },
              { title: '差评', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/Evaluate'], r)
        }
      ]
    },

    // ------------- 评价详情
    {
      path: '/admin/order/evaluate/details',
      meta: {
        title: '评价详情',
        auth: true,
        thirdMenu: false,
        authCode: 501032,
        refresh: false,
        visible: false,
        breadcrumb: [
          { title: '首页', path: '/admin/console' },
          { title: '订单管理', path: '/admin/order' },
          { title: '评价管理', path: '/admin/order/evaluate' },
          { title: '评价详情', path: '' }
        ]
      },
      component: r => require(['@/views/admin/order/EvaluateDetails'], r)
    }
  ]
}
