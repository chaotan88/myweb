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
    },

    // 会员申请
    {
      path: '/admin/distribution/apply',
      redirect: '/admin/distribution/apply/all',
      meta: {
        nav: '会员申请',
        icon: 'icon-shenqing',
        auth: true,
        authCode: 601022
      },
      component: r => require(['@/views/admin/distribution/ApplyLayout'], r),
      children: [

        // 会员申请 - 全部
        {
          path: '/admin/distribution/apply/all',
          meta: {
            title: '会员申请 - 全部',
            pageBack: true,
            auth: true,
            authCode: 601022,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '会员申请', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/ApplyList'], r)
        },

        // 会员申请 - 待激活
        {
          path: '/admin/distribution/apply/notopen',
          meta: {
            title: '会员申请 - 待激活',
            pageBack: true,
            auth: true,
            authCode: 601022,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '会员申请', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/ApplyList'], r)
        },

        // 会员申请 - 已激活
        {
          path: '/admin/distribution/apply/pass',
          meta: {
            title: '会员申请 - 已激活',
            pageBack: true,
            auth: true,
            authCode: 601022,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '会员申请', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/ApplyList'], r)
        },

        // 会员申请 - 激活失败
        {
          path: '/admin/distribution/apply/reject',
          meta: {
            title: '会员申请 - 已激活',
            pageBack: true,
            auth: true,
            authCode: 601022,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '会员申请', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/ApplyList'], r)
        },

        // 会员申请详情
        {
          path: '/admin/distribution/apply/details',
          meta: {
            title: '会员申请详情',
            auth: true,
            authCode: 601022,
            thirdMenu: false,
            breadcrumb: [
              { title: '首页', path: '/admin' },
              { title: '分销管理', path: '/admin/distribution' },
              { title: '会员申请', path: '/admin/distribution/apply' },
              { title: '详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/distribution/ApplyDetails'], r)
        }
      ]
    }
  ]
}
