export default {
  path: '/admin/merchant',
  redirect: '/admin/merchant/authentication',
  meta: {
    nav: '商户管理',
    icon: 'icon-merchant',
    auth: true,
    authCode: 501100
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 商户认证审核首页
    {
      path: '/admin/merchant/authentication',
      redirect: '/admin/merchant/authentication/index',
      meta: {
        nav: '商户认证审核',
        icon: 'icon-shanghuduantongji',
        auth: true,
        authCode: 501101
      },
      component: r => require(['@/views/admin/merchant/authentication/layout'], r),
      children: [

        // 商户认证审核全部
        {
          path: '/admin/merchant/authentication/index',
          meta: {
            title: '商户认证审核',
            auth: true,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '商户认证审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/index'], r)
        },
        {
          path: '/admin/merchant/authentication/waitcheck',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '待审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/index'], r)
        },
        {
          path: '/admin/merchant/authentication/checkin',
          meta: {
            title: '待审核',
            auth: true,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '审核通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/index'], r)
        },
        {
          path: '/admin/merchant/authentication/checkout',
          meta: {
            title: '审核不通过',
            auth: true,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '审核不通过', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/index'], r)
        },
        {
          path: '/admin/merchant/authentication/detail',
          meta: {
            title: '详情',
            auth: true,
            thirdMenu: false,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '商户认证', path: '/admin/merchant/authentication/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/publicInfo'], r)
        },
        {
          path: '/admin/merchant/authentication/check',
          meta: {
            title: '审核',
            auth: true,
            thirdMenu: false,
            authCode: 501101,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '商户管理', path: '/admin/merchant/authentication' },
              { title: '商户认证', path: '/admin/merchant/authentication/index' },
              { title: '审核', path: '' }
            ]
          },
          component: r => require(['@/views/admin/merchant/authentication/publicInfo'], r)
        }
      ]
    }
  ]
}
