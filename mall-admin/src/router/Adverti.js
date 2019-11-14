export default {
  path: '/admin/adverti',
  redirect: '/admin/adverti/manage',
  meta: {
    nav: '广告位',
    icon: 'icon-guanggao',
    auth: true,
    authCode: 401060
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/adverti/manage',
      redirect: '/admin/adverti/manage/mobile',
      meta: {
        nav: '广告位管理',
        icon: 'icon-webicon402',
        auth: true,
        authCode: 401061
      },
      component: r => require(['@/views/admin/adverti/ManageLayout'], r),
      children: [
        {
          path: '/admin/adverti/manage/mobile',
          meta: {
            title: '广告位管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '广告位', path: '/admin/adverti' },
              { title: '广告位设置', path: '/admin/adverti/manage' },
              { title: '移动端', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManageList'], r)
        },

        {
          path: '/admin/adverti/manage/pc',
          meta: {
            title: '广告位管理',
            pageBack: true,
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '广告位', path: '/admin/adverti' },
              { title: '广告位设置', path: '/admin/adverti/manage' },
              { title: 'PC端', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManageList'], r)
        },

        {
          path: '/admin/adverti/manage/edit',
          meta: {
            title: '广告位管理',
            auth: true,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '广告位', path: '/admin/adverti' },
              { title: '广告位设置', path: '/admin/adverti/manage' },
              { title: '编辑', path: '' }
            ]
          },
          component: r => require(['@/views/admin/adverti/ManagePublic'], r)
        }
      ]
    }
  ]
}
