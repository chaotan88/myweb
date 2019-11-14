export default {
  path: '/admin/aftersale',
  redirect: '/admin/aftersale/service',
  meta: {
    nav: '售后',
    icon: 'icon-msnui-call',
    auth: true,
    authCode: 401050
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/aftersale/service',
      redirect: '/admin/aftersale/service/index',
      meta: {
        nav: '售后服务',
        icon: 'icon-kefu',
        auth: true,
        authCode: 401051
      },
      component: r => require(['@/views/admin/aftersale/IndexLayout'], r),
      children: [
        {
          path: '/admin/aftersale/service/index',
          meta: {
            title: '售后服务',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '售后', path: '/admin/aftersale' },
              { title: '售后服务', path: '' }
            ]
          },
          component: r => require(['@/views/admin/aftersale/Index'], r)
        },

        {
          path: '/admin/aftersale/service/add',
          meta: {
            title: '添加售后服务',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '售后', path: '/admin/aftersale' },
              { title: '售后服务', path: '/admin/aftersale/index' },
              { title: '添加售后服务', path: '' }
            ]
          },
          component: r => require(['@/views/admin/aftersale/Public'], r)
        },

        {
          path: '/admin/aftersale/service/edit',
          meta: {
            title: '编辑售后服务',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '售后', path: '/admin/aftersale' },
              { title: '售后服务', path: '/admin/aftersale/index' },
              { title: '编辑售后服务', path: '' }
            ]
          },
          component: r => require(['@/views/admin/aftersale/Public'], r)
        }
      ]
    }
  ]
}
