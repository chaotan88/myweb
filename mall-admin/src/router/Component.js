export default {
  path: '/admin/component',
  redirect: '/admin/component/index',
  meta: {
    nav: '基础模板',
    icon: 'icon-msnui-sys-set',
    visible: false,       // 是否显示
    auth: true
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [

    // 聚合
    {
      path: '/admin/component/Index',
      meta: {
        title: '聚合组件',
        nav: '聚合',
        icon: 'icon-shouye',
        auth: true,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/component/Index'], r)
    },

    // table
    {
      path: '/admin/component/table',
      meta: {
        title: '控制台',
        nav: 'Table',
        icon: 'icon-shouye',
        auth: true,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/component/Table'], r)
    },

    // search
    {
      path: '/admin/component/search',
      meta: {
        title: '搜索',
        nav: 'Search',
        icon: 'icon-shouye',
        auth: true,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/component/Search'], r)
    },

    // 三级菜单
    {
      path: '/admin/component/third-menu',
      meta: {
        title: '三级菜单',
        nav: '三级菜单',
        icon: 'icon-shouye',
        auth: true,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/component/ThirdLayout'], r)
    },

    // 多级菜单
    {
      path: '/admin/component/MultipleMenu',
      meta: {
        title: '多级菜单',
        nav: '多级菜单',
        icon: 'icon-shouye',
        auth: true,
        breadcrumb: [
          { title: '首页', path: '' }
        ]
      },
      component: r => require(['@/views/admin/component/MultipleMenuPage'], r)
    }
  ]
}
