export default {
  path: '/admin/vipScore',
  redirect: '/admin/vipScore/seting',
  meta: {
    nav: '积分',
    icon: 'icon-jifen',
    auth: true,
    authCode: 501030
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // -------------- 积分设置
    {
      path: '/admin/vipScore/seting',
      redirect: '/admin/vipScore/seting/index',
      meta: {
        nav: '积分设置',
        icon: 'icon-moban',
        auth: true,
        authCode: 501031
      },
      component: r => require(['@/views/admin/vipScore/IndexLayout'], r),
      children: [

      // -------------- 购买商品
        {
          path: '/admin/vipScore/seting/index',
          meta: {
            title: '积分',
            icon: 'icon-shouye',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '积分', path: '/admin/vipScore' },
              { title: '积分设置', path: '/admin/vipScore/seting/index' },
              { title: '购买商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Index'], r)
        },

       // -------------- 销售商品
        {
          path: '/admin/vipScore/seting/sale',
          meta: {
            title: '积分',
            icon: 'icon-shouye',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '积分', path: '/admin/vipScore' },
              { title: '积分设置', path: '/admin/vipScore/seting/index' },
              { title: '销售商品', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Index'], r)
        }
      ]
    },

    // -------------- 积分记录
    {
      path: '/admin/vipScore/record',
      redirect: '/admin/vipScore/record/index',
      meta: {
        nav: '积分记录',
        icon: 'icon-jilu',
        auth: true,
        authCode: 501032
      },
      component: r => require(['@/views/admin/vipScore/RecordLayout'], r),

      // -------------- 积分记录
      children: [
        {
          path: '/admin/vipScore/record/index',
          meta: {
            title: '积分',
            nav: '积分记录',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '积分', path: '/admin/vipScore' },
              { title: '积分记录', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/Record'], r)
        },
        {
          path: '/admin/vipScore/record/details',
          meta: {
            title: '积分',
            nav: '积分记录',
            icon: 'icon-shouye',
            auth: true,
            breadcrumb: [
              { title: '首页', path: '/admin/console' },
              { title: '积分', path: '/admin/vipScore' },
              { title: '积分记录', path: '/admin/vipScore/record/index' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/vipScore/RecordDetail'], r)
        }
      ]
    }
  ]
}
