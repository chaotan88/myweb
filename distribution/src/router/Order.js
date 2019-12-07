export default {
  path: '/admin/order',
  redirect: '/admin/order/payment',
  meta: {
    nav: '订单管理',
    icon: 'icon-jiesuan',
    auth: true,
    authCode: 601040
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    // 套餐订单
    {
      path: '/admin/order/payment',
      redirect: '/admin/order/payment/all',
      meta: {
        nav: '套餐订单',
        icon: 'icon-fukuanshenhe',
        auth: true,
        authCode: 601041
      },
      component: r => require(['@/views/admin/order/PaymentLayout'], r),
      children: [

        // 套餐订单 - 全部
        {
          path: '/admin/order/payment/all',
          meta: {
            title: '套餐订单 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/PaymentList'], r)
        },

        {
          path: '/admin/order/payment/examine',
          meta: {
            title: '套餐订单 - 待付款',
            pageBack: true,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '待付款', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/PaymentList'], r)
        },

        {
          path: '/admin/order/payment/pass',
          meta: {
            title: '套餐订单 - 待发货',
            pageBack: true,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '待发货', path: '' }

            ]
          },
          component: r => require(['@/views/admin/order/PaymentList'], r)
        },

        {
          path: '/admin/order/payment/reject',
          meta: {
            title: '套餐订单 - 待收货',
            pageBack: true,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '待收货', path: '' }

            ]
          },
          component: r => require(['@/views/admin/order/PaymentList'], r)
        },
        {
          path: '/admin/order/payment/finished',
          meta: {
            title: '套餐订单 - 已完成',
            pageBack: true,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '已完成', path: '' }

            ]
          },
          component: r => require(['@/views/admin/order/PaymentList'], r)
        },

        {
          path: '/admin/order/payment/details',
          meta: {
            title: '套餐订单 - 详情',
            thirdMenu: false,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/PaymentDetails'], r)
        },
        {
          path: '/admin/order/payment/ship',
          meta: {
            title: '套餐订单 - 发货',
            thirdMenu: false,
            auth: true,
            authCode: 601041,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '订单管理', path: '/admin/order' },
              { title: '套餐订单', path: '/admin/order/payment/all' },
              { title: '发货', path: '' }
            ]
          },
          component: r => require(['@/views/admin/order/PaymentDetails'], r)
        }
      ]
    }
  ]
}
