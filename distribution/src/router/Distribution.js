export default {
  path: '/admin/distribution',
  redirect: '/admin/distribution/rule',
  meta: {
    nav: '分销管理',
    icon: 'icon-fenxiao2',
    auth: true,
    authCode: 601020
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 分销规则
    {
      path: '/admin/distribution/rule',
      redirect: '/admin/distribution/rule/list',
      meta: {
        nav: '分销规则',
        icon: 'icon-rule',
        auth: true,
        authCode: 601021
      },
      component: r => require(['@/views/admin/distribution/DistributionLayout'], r),
      children: [

        // 分销规则
        {
          path: '/admin/distribution/rule/list',
          meta: {
            title: '分销规则',
            pageBack: true,
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '分销规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/DistributionList'], r)
        },

        // 创建规则
        {
          path: '/admin/distribution/rule/add',
          meta: {
            title: '创建规则',
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '创建规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/DistributionPublic'], r)
        },

        // 编辑规则
        {
          path: '/admin/distribution/rule/edit',
          meta: {
            title: '编辑规则',
            auth: true,
            authCode: 601021,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '编辑规则', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/DistributionPublic'], r)
        }
      ]
    }
  ]
}
