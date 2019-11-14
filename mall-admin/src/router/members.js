export default {
  path: '/admin/members',
  redirect: '/admin/members/members-center',
  meta: {
    nav: '会员',
    icon: 'icon-huiyuan',
    auth: true
  },
  component: r => require(['@/components/admin/ChildLayout'], r),
  children: [
    {
      path: '/admin/members/members-center',
      redirect: '/admin/members/members-center/members-list',
      meta: {
        title: '会员',
        nav: '会员中心',
        icon: 'icon-huiyuanguanli',
        auth: true,
        breadcrumb: [
          { title: '会员', path: '' },
          { title: '会员中心', path: '' }
        ]
      },
      component: r => require(['@/views/admin/members/MembersLayout'], r),
      children: [
        {
          path: '/admin/members/members-center/members-list',
          meta: {
            title: '会员列表',
            auth: true,
            breadcrumb: [
              { title: '会员', path: '' },
              { title: '会员中心', path: '' },
              { title: '会员列表', path: '' }
            ]
          },
          component: r => require(['@/views/admin/members/MembersList'], r)
        },
        {
          path: '/admin/members/members-center/member-detail/:userId',
          meta: {
            title: '会员列表',
            auth: true,
            breadcrumb: [
              { title: '会员', path: '' },
              { title: '会员中心', path: '' },
              { title: '会员详情', path: '' }
            ]
          },
          component: r => require(['@/views/admin/members/MemberDetail'], r)
        }
      ]
    }
  ]
}
