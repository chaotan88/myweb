export default {
  path: '/admin/marketing',
  redirect: '/admin/marketing/tool',
  meta: {
    nav: '营销',
    icon: '',
    auth: true,
    visible: false,
    authCode: 401010
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 营销工具
    {
      path: '/admin/marketing/tool',
      redirect: '/admin/marketing/tool/entry',
      meta: {
        title: '营销工具',
        nav: '营销工具',
        icon: '',
        auth: true,
        authCode: 401011,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '营销', path: '/admin/marketing' },
          { title: '营销工具', path: '' }
        ]
      },
      component: r => require(['@/views/admin/marketing/ToolLayout'], r),
      children: [

        // 营销工具入口
        {
          path: '/admin/marketing/tool/entry',
          meta: {
            title: '营销工具',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '营销', path: '/admin/marketing' },
              { title: '营销工具', path: '' }
            ]
          },
          component: r => require(['@/views/admin/marketing/ToolIndex'], r)
        }
      ]
    },

    // 积分商城
    {
      path: '/admin/marketing/tool/integral',
      redirect: '/admin/marketing/tool/integral/setup',
      meta: {
        title: '积分商城',
        nav: '积分商城',
        icon: '',
        visible: false,
        auth: true,
        authCode: 401011,
        breadcrumb: [
          { title: '首页', path: '/admin' },
          { title: '营销', path: '/admin/marketing' },
          { title: '营销工具', path: '' }
        ]
      },
      component: r => require(['@/views/admin/marketing/ToolLayout'], r),
      children: [

        // 营销工具入口
        {
          path: '/admin/marketing/tool/integral/setup',
          meta: {
            title: '营销工具',
            auth: true,
            authCode: 401011,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '营销', path: '/admin/marketing' },
              { title: '营销工具', path: '' }
            ]
          },
          component: r => require(['@/views/admin/marketing/ToolIndex'], r)
        }
      ]
    }
    // ,

    // {
    //   path: '/admin/marketing/integral',
    //   redirect: '/admin/marketing/integral/setup',
    //   meta: {
    //     title: '积分商城',
    //     visible: false,
    //     auth: true,
    //     authCode: 401011,
    //     breadcrumb: [
    //       { title: '首页', path: '/admin' },
    //       { title: '营销', path: '/admin/marketing' },
    //       { title: '营销工具', path: '/admin/marketing/tool' },
    //       { title: '积分', path: '' }
    //     ],
    //     component: r => require(['@/views/admin/marketing/IntegralLayout'], r),
    //     children: [

    //       // 积分设置
    //       {
    //         path: '/admin/marketing/integral/setup',
    //         meta: {
    //           title: '积分设置',
    //           auth: true,
    //           authCode: 401011,
    //           breadcrumb: [
    //             { title: '首页', path: '/admin' },
    //             { title: '营销工具', path: '/admin/marketing/tool' },
    //             { title: '积分', path: '/admin/marketing/integral/' },
    //             { title: '积分设置', path: '' }
    //           ],
    //           component: r => require(['@/views/admin/marketing/IntegralSetup'], r)
    //         }
    //       },

    //       // 积分记录
    //       {
    //         path: '/admin/marketing/integral/record',
    //         meta: {
    //           title: '积分记录',
    //           auth: true,
    //           authCode: 401011,
    //           breadcrumb: [
    //             { title: '首页', path: '/admin' },
    //             { title: '营销工具', path: '/admin/marketing/tool' },
    //             { title: '积分', path: '/admin/marketing/integral/' },
    //             { title: '积分记录', path: '' }
    //           ],
    //           component: r => require(['@/views/admin/marketing/IntegralRecord'], r)
    //         }
    //       }

    //     ]
    //   }
    // }
  ]
}
